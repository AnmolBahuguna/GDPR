const PAGE_SIZE = 50;
const CACHE_TTL_MS = 30_000;
const cache = new Map();

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sourceUrl(page) {
  return `https://zenauraa.com/api/practitioners?page=${page}&limit=${PAGE_SIZE}`;
}

function readMarketplacePayload(value, requestedPage) {
  if (!isRecord(value) || value.success !== true || !isRecord(value.data)) {
    throw new Error('ZenAuraa returned an unexpected practitioner response.');
  }

  const { practitioners, pagination } = value.data;
  if (
    !Array.isArray(practitioners)
    || !isRecord(pagination)
    || typeof pagination.total !== 'number'
    || typeof pagination.page !== 'number'
    || typeof pagination.limit !== 'number'
    || typeof pagination.pages !== 'number'
    || pagination.page !== requestedPage
  ) {
    throw new Error('ZenAuraa practitioner response is missing profile or pagination data.');
  }

  const profiles = practitioners.map((profile) => {
    if (!isRecord(profile)) throw new Error('ZenAuraa returned an invalid practitioner profile.');
    const requiredString = (field) => {
      if (typeof profile[field] !== 'string') throw new Error(`ZenAuraa profile is missing ${field}.`);
      return profile[field];
    };
    const requiredNumber = (field) => {
      if (typeof profile[field] !== 'number' || !Number.isFinite(profile[field])) {
        throw new Error(`ZenAuraa profile contains an invalid ${field}.`);
      }
      return profile[field];
    };
    const stringList = (field) => {
      if (!Array.isArray(profile[field]) || profile[field].some((entry) => typeof entry !== 'string')) {
        throw new Error(`ZenAuraa profile contains an invalid ${field} list.`);
      }
      return profile[field];
    };
    const requiredBoolean = (field) => {
      if (typeof profile[field] !== 'boolean') throw new Error(`ZenAuraa profile is missing ${field}.`);
      return profile[field];
    };

    if (profile.photoUrl !== null && typeof profile.photoUrl !== 'string') {
      throw new Error('ZenAuraa profile contains an invalid photoUrl.');
    }

    return {
      id: requiredString('id'),
      name: requiredString('name'),
      bio: typeof profile.bio === 'string' ? profile.bio : '',
      specialties: stringList('specialties'),
      languages: stringList('languages'),
      experienceYears: requiredNumber('experienceYrs'),
      ratePerMinute: requiredNumber('perMinuteRate'),
      photoUrl: profile.photoUrl,
      verified: requiredBoolean('isVerified'),
      online: requiredBoolean('isOnline'),
      busy: requiredBoolean('isBusy'),
      rating: requiredNumber('avgRating'),
      reviewCount: requiredNumber('reviewCount'),
    };
  });

  const reviewCount = profiles.reduce((total, profile) => total + profile.reviewCount, 0);
  const ratedReviews = profiles.reduce((total, profile) => total + profile.rating * profile.reviewCount, 0);

  return {
    sourceUrl: sourceUrl(requestedPage),
    fetchedAt: new Date().toISOString(),
    page: pagination.page,
    pageSize: pagination.limit,
    pages: pagination.pages,
    listedCount: pagination.total,
    loadedCount: profiles.length,
    onlineCount: profiles.filter((profile) => profile.online).length,
    verifiedCount: profiles.filter((profile) => profile.verified).length,
    rating: reviewCount > 0 ? Math.round((ratedReviews / reviewCount) * 10) / 10 : null,
    reviewCount,
    categories: [...new Set(profiles.flatMap((profile) => profile.specialties))].sort((a, b) => a.localeCompare(b)),
    profiles,
  };
}

async function fetchMarketplace(page, forceRefresh) {
  const cached = cache.get(page);
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) return cached.payload;

  const response = await fetch(sourceUrl(page), { signal: AbortSignal.timeout(12_000) });
  if (!response.ok) throw new Error(`ZenAuraa returned HTTP ${response.status}.`);

  let upstreamData;
  try {
    upstreamData = await response.json();
  } catch {
    throw new Error('ZenAuraa returned an unreadable response instead of practitioner data.');
  }

  const payload = readMarketplacePayload(upstreamData, page);
  cache.set(page, { expiresAt: Date.now() + CACHE_TTL_MS, payload });
  return payload;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const requestUrl = new URL(req.url || '/', 'https://localhost');
  const rawPage = requestUrl.searchParams.get('page') || '1';
  const page = Number(rawPage);
  if (!/^\d+$/.test(rawPage) || !Number.isSafeInteger(page) || page < 1 || page > 10_000) {
    return res.status(400).json({ error: 'Page must be a positive whole number.' });
  }

  try {
    const payload = await fetchMarketplace(page, requestUrl.searchParams.get('refresh') === '1');
    return res.status(200).json({ data: payload });
  } catch (error) {
    console.error('ZenAuraa marketplace API request failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to retrieve ZenAuraa practitioner data.';
    return res.status(502).json({ error: message });
  }
}
