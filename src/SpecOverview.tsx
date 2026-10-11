import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Download, FileCheck2, FolderGit2, RefreshCw, Search, ShieldAlert, X } from 'lucide-react';
import { auditLog, dashboard, featureColors, gdprDataMap, marketplace, meta } from './data/dummyData';
import { useAppStore } from './store/appStore';
const DEMO_AUDIT_DATE = '2026-10-08';
const gdprEvidenceItems = [
  { record: 'Territorial scope', observed: 'The public profile endpoint is hosted on zenauraa.com; establishment, customer locations and targeting/monitoring are not established.', required: 'Confirm whether GDPR Article 3 applies before treating EU GDPR as applicable.' },
  { record: 'Controller and purposes', observed: 'The website footer names Tara Infotech; controller roles and the purpose for each API field are not confirmed.', required: 'Verify the legal controller, any joint-controller roles, purposes and Article 6 basis.' },
  { record: 'Data subjects and categories', observed: 'Practitioner profiles include names, photo URLs, bios, specialties, languages, experience, status, ratings, review counts and rates.', required: 'Record subjects, data categories, source, recipients and each processing operation in the Article 30 record where required.' },
  { record: 'Recipients and transfers', observed: 'The unauthenticated public API returns photo URLs hosted on healconnectstorage.blob.core.windows.net; hosting region and provider role are unknown.', required: 'Identify actual recipients/processors, hosting locations and a Chapter V mechanism if a restricted transfer occurs.' },
  { record: 'Retention and rights', observed: 'The public API does not disclose retention periods or practitioner request-handling workflows.', required: 'Document retention criteria and operational access, correction, objection and deletion request routes.' },
  { record: 'Security and incidents', observed: 'The API response does not evidence access controls, security measures or breach procedures.', required: 'Review proportionate Article 32 measures, processor terms and Article 33–34 incident procedures with the controller.' },
]

const reviewSteps = [
  { id: 'scope', phase: '1 · Scope', articles: 'Article 3', title: 'Confirm GDPR territorial scope', observed: 'Public API only; establishment, EU targeting and monitoring are not verified.', request: 'Document establishment and EU/UK user targeting or monitoring; record the applicability decision and rationale.' },
  { id: 'controller', phase: '1 · Scope', articles: 'Articles 4, 24', title: 'Identify controller and decision owners', observed: 'Tara Infotech is named in the supplied footer; legal controller identity and role allocation are unverified.', request: 'Confirm the legal entity, privacy contact, controller/processor or joint-controller roles, and accountable approver.' },
  { id: 'ropa', phase: '2 · Map', articles: 'Articles 5, 30', title: 'Complete the processing activity record', observed: 'Public practitioner profile fields are visible; internal systems, recipients and lifecycle are not.', request: 'For each operation, record purposes, subject/data categories, recipients, transfers, retention criteria and security measures where Article 30 applies.' },
  { id: 'lawfulness', phase: '2 · Map', articles: 'Articles 5, 6, 12–14', title: 'Validate purpose, lawful basis and notices', observed: 'The API exposes profile fields but does not explain the controller’s purpose or legal basis.', request: 'Map each purpose to a basis and check practitioner/customer privacy information, including indirect collection where relevant.' },
  { id: 'rights', phase: '3 · Assess', articles: 'Articles 12–22', title: 'Test rights-request operations', observed: 'No request intake, identity checks, response tracking or exception handling is evidenced.', request: 'Walk through intake, verification, search, response deadlines, exemptions and closure using a synthetic test request.' },
  { id: 'retention', phase: '3 · Assess', articles: 'Articles 5(1)(e), 16–17', title: 'Set retention and profile correction controls', observed: 'The public API does not state retention periods or correction/deletion processes.', request: 'Confirm retention criteria, review triggers, deletion propagation and how profile accuracy is maintained.' },
  { id: 'vendors', phase: '3 · Assess', articles: 'Articles 28, 44–49', title: 'Verify processors, hosting and transfers', observed: 'Photo URLs use Azure Blob Storage; region, provider role and transfer details are unknown.', request: 'Obtain the vendor/sub-processor list, locations, contract terms and Chapter V safeguard assessment where a restricted transfer occurs.' },
  { id: 'risk', phase: '4 · Risk & controls', articles: 'Articles 9, 25, 35', title: 'Screen consultation data and DPIA threshold', observed: 'Consultation inputs and actual content processing are not included in the public API evidence.', request: 'Inspect real forms and session flows. Assess Article 9 only for actual special-category data, and complete a DPIA before processing if Article 35 requires it.' },
  { id: 'security', phase: '4 · Risk & controls', articles: 'Articles 32–34', title: 'Review security and breach response', observed: 'The API response does not evidence technical controls or incident procedures.', request: 'Review risk-based safeguards, processor incident escalation, breach assessment, and applicable 72-hour/individual notification decision paths.' },
]

type ReviewStatus = 'Awaiting evidence' | 'In progress' | 'Ready for sign-off' | 'Closed'
type ReviewDraft = { status: ReviewStatus; owner: string; dueDate: string; evidenceRef: string }
type ReviewDrafts = Record<string, ReviewDraft>
const reviewStorageKey = 'zenauraa-gdpr-review-draft-v1'
const reviewStatuses: ReviewStatus[] = ['Awaiting evidence', 'In progress', 'Ready for sign-off', 'Closed']
const reviewOwners = ['Unassigned', 'Controller', 'Privacy lead', 'Product', 'Engineering', 'Security']

function loadReviewDrafts(): { drafts: ReviewDrafts; error: string | null } {
  const empty = Object.fromEntries(reviewSteps.map(({ id }) => [id, {
    status: 'Awaiting evidence' as ReviewStatus,
    owner: 'Unassigned',
    dueDate: '',
    evidenceRef: '',
  }]))
  try {
    const saved = sessionStorage.getItem(reviewStorageKey)
    if (!saved) return { drafts: empty, error: null }
    const parsed: unknown = JSON.parse(saved)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error('Saved review draft has an invalid format.')
    }
    for (const { id } of reviewSteps) {
      const item = (parsed as Record<string, unknown>)[id]
      if (item === undefined) continue
      if (
        typeof item !== 'object'
        || item === null
        || !('status' in item)
        || !reviewStatuses.includes(item.status as ReviewStatus)
        || !('owner' in item) || typeof item.owner !== 'string' || !reviewOwners.includes(item.owner)
        || !('dueDate' in item) || typeof item.dueDate !== 'string'
        || !('evidenceRef' in item) || typeof item.evidenceRef !== 'string'
      ) {
        throw new Error(`Saved review draft for ${id} has invalid fields.`)
      }
      empty[id] = {
        status: item.status as ReviewStatus,
        owner: item.owner,
        dueDate: item.dueDate,
        evidenceRef: item.evidenceRef,
      }
    }
    return { drafts: empty, error: null }
  } catch (error) {
    console.error('Could not read the GDPR review draft from this browser tab:', error)
    return {
      drafts: empty,
      error: 'The saved browser-tab draft could not be read. Changes in this review may not be retained.',
    }
  }
}

function saveReviewDrafts(drafts: ReviewDrafts): string | null {
  try {
    sessionStorage.setItem(reviewStorageKey, JSON.stringify(drafts))
    return null
  } catch (error) {
    console.error('Could not save the GDPR review draft in this browser tab:', error)
    return 'The browser could not save this draft. Export any work you need to keep.'
  }
}

type MarketplaceProfile = {
  id: string
  name: string
  bio: string
  specialties: string[]
  languages: string[]
  experienceYears: number
  ratePerMinute: number
  photoUrl: string | null
  verified: boolean
  online: boolean
  busy: boolean
  rating: number
  reviewCount: number
}

type MarketplaceData = {
  sourceUrl: string
  fetchedAt: string
  page: number
  pageSize: number
  pages: number
  listedCount: number
  loadedCount: number
  onlineCount: number
  verifiedCount: number
  rating: number | null
  reviewCount: number
  categories: string[]
  profiles: MarketplaceProfile[]
}

async function fetchMarketplaceData(refresh: boolean, page: number, signal: AbortSignal): Promise<MarketplaceData> {
  const response = await fetch(`/api/marketplace?page=${page}${refresh ? '&refresh=1' : ''}`, { signal })
  const responseText = await response.text()
  let result: { data?: MarketplaceData; error?: string }
  try {
    result = JSON.parse(responseText) as { data?: MarketplaceData; error?: string }
  } catch {
    if (response.status === 404) {
      throw new Error('The production marketplace API is missing. Deploy the api/marketplace.js function and redeploy the site.')
    }
    throw new Error(`Marketplace API returned a non-JSON response (HTTP ${response.status}). Check the production API deployment and retry.`)
  }
  if (!response.ok || !result.data) {
    throw new Error(result.error || 'Could not load live ZenAuraa practitioner data.')
  }
  return result.data
}

export function SpecDashboard() {
  const [liveMarketplace, setLiveMarketplace] = useState<MarketplaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [page, setPage] = useState(1)
  const [profileQuery, setProfileQuery] = useState('')
  const [profileFilter, setProfileFilter] = useState('All profiles')
  const [specialtyFilter, setSpecialtyFilter] = useState('All specialties')
  const [selectedProfile, setSelectedProfile] = useState<MarketplaceProfile | null>(null)
  const [dashboardView, setDashboardView] = useState<'overview' | 'dataset' | 'privacy'>('overview')
  const [reviewState, setReviewState] = useState(loadReviewDrafts)
  const [reviewMessage, setReviewMessage] = useState<string | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    void fetchMarketplaceData(refreshKey > 0, page, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setLiveMarketplace(data)
          setLoading(false)
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Could not load marketplace data.')
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [page, refreshKey])
  const refreshMarketplace = () => {
    setLoading(true)
    setError(null)
    setRefreshKey((key) => key + 1)
  }
  const changePage = (nextPage: number) => {
    setLoading(true)
    setError(null)
    setPage(nextPage)
  }
  const closedReviewCount = reviewSteps.filter(({ id }) => reviewState.drafts[id].status === 'Closed').length
  const filteredProfiles = useMemo(() => {
    const query = profileQuery.trim().toLocaleLowerCase()
    return (liveMarketplace?.profiles ?? []).filter((profile) => {
      const matchesQuery = !query || [
        profile.name,
        profile.bio,
        ...profile.specialties,
        ...profile.languages,
      ].join(' ').toLocaleLowerCase().includes(query)
      const matchesFilter = profileFilter === 'All profiles'
        || (profileFilter === 'Verified' && profile.verified)
        || (profileFilter === 'Online' && profile.online && !profile.busy)
        || (profileFilter === 'Busy' && profile.online && profile.busy)
        || (profileFilter === 'Offline' && !profile.online)
      const matchesSpecialty = specialtyFilter === 'All specialties' || profile.specialties.includes(specialtyFilter)
      return matchesQuery && matchesFilter && matchesSpecialty
    })
  }, [liveMarketplace, profileFilter, profileQuery, specialtyFilter])
  const updateReviewDraft = (id: string, field: keyof ReviewDraft, value: string) => {
    setReviewMessage(null)
    const drafts = { ...reviewState.drafts, [id]: { ...reviewState.drafts[id], [field]: value } }
    setReviewState({ drafts, error: saveReviewDrafts(drafts) })
  }
  const changeReviewStatus = (id: string, status: ReviewStatus) => {
    const current = reviewState.drafts[id]
    if (status === 'Ready for sign-off' && !current.evidenceRef.trim()) {
      setReviewMessage('Add an evidence reference or decision rationale before requesting sign-off.')
      return
    }
    if (status === 'Closed' && current.status !== 'Ready for sign-off') {
      setReviewMessage('Move the item to “Ready for sign-off” before closing it.')
      return
    }
    updateReviewDraft(id, 'status', status)
  }
  const exportReviewDraft = () => {
    const rows = [
      ['ID', 'Phase', 'Review item', 'GDPR articles', 'Status', 'Owner role', 'Due date', 'Evidence reference / decision rationale'],
      ...reviewSteps.map((step) => {
        const draft = reviewState.drafts[step.id]
        return [step.id, step.phase, step.title, step.articles, draft.status, draft.owner, draft.dueDate, draft.evidenceRef]
      }),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'zenauraa-gdpr-review-draft.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  const exportProfiles = () => {
    if (!liveMarketplace) return
    const rows = [
      ['ID', 'Name', 'Specialties', 'Experience years', 'Languages', 'Rating', 'Review count', 'Rate per minute (currency not supplied)', 'Verified', 'Availability', 'Bio', 'Photo URL'],
      ...filteredProfiles.map((profile) => [
        profile.id,
        profile.name,
        profile.specialties.join('; '),
        String(profile.experienceYears),
        profile.languages.join('; '),
        String(profile.rating),
        String(profile.reviewCount),
        String(profile.ratePerMinute),
        String(profile.verified),
        profile.online ? profile.busy ? 'Online · Busy' : 'Online' : 'Offline',
        profile.bio,
        profile.photoUrl ?? '',
      ]),
    ]
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `zenauraa-practitioners-page-${liveMarketplace.page}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const cards = liveMarketplace ? [
    { label: 'Profiles on this page', value: liveMarketplace.loadedCount.toLocaleString(), icon: FolderGit2, color: featureColors.code, filter: 'All profiles' },
    { label: 'Verified profiles on this page', value: liveMarketplace.verifiedCount.toLocaleString(), icon: ShieldAlert, color: featureColors.sandbox, filter: 'Verified' },
    { label: 'Online on this page', value: liveMarketplace.onlineCount.toLocaleString(), icon: FileCheck2, color: featureColors.document, filter: 'Online' },
    { label: 'Weighted rating on this page', value: liveMarketplace.rating === null ? 'N/A' : `${liveMarketplace.rating}/5`, icon: Activity, color: '#0f172a', filter: null },
  ] : [];
  const destinations = [
    { to:'/scanner', name:'Code-to-GDPR', detail:'Review supplied source evidence and public-page data fields.', color:featureColors.code },
    { to:'/documents', name:'Document Review & Fix', detail:'Find policy gaps and review suggested clause changes.', color:featureColors.document },
    { to:'/runtime', name:'VM Sandbox Monitor', detail:'Follow a simulated threat and block outbound activity.', color:featureColors.sandbox },
  ];
  return <div className="feature-page spec-demo"><div className="page-heading"><div><span className="eyebrow">ZenAuraa · Marketplace evidence workspace</span><h1>ZenAuraa Expert Marketplace</h1><p>{marketplace.tagline}</p></div></div>
    <div className="sd-banner sd-live-banner"><span>{loading ? 'Fetching live practitioner data…' : error ? 'Live data unavailable' : liveMarketplace ? `ZenAuraa public API · Updated ${new Date(liveMarketplace.fetchedAt).toLocaleString()}` : 'Live data not loaded'}</span><button className="sd-refresh-button" type="button" onClick={refreshMarketplace} disabled={loading}><RefreshCw size={15}/> Refresh data</button></div>
    {error && <p className="sd-live-error" role="alert">{error} Check the API connection and retry; no sample profiles are substituted.</p>}
    {loading && <section className="card-panel sd-live-state" role="status">Loading data from ZenAuraa…</section>}
    <nav className="sd-dashboard-nav" aria-label="Dashboard sections">{([
      { id: 'overview', title: 'Marketplace overview', detail: 'Live public practitioner directory' },
      { id: 'dataset', title: 'Website dataset', detail: 'Supplied public-page snapshot' },
      { id: 'privacy', title: 'Privacy review', detail: 'GDPR evidence and actions' },
    ] as const).map((item, index) => <button key={item.id} type="button" aria-pressed={dashboardView === item.id} className={dashboardView === item.id ? 'is-active' : ''} onClick={() => setDashboardView(item.id)}><span className="sd-dashboard-nav-index">0{index + 1}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><b aria-hidden="true">→</b></button>)}</nav>
    {!loading && !error && liveMarketplace && <>
      <div hidden={dashboardView !== 'overview'} className="sd-dashboard-view">
      <div className="sd-gdpr-boundary"><strong>GDPR assessment boundary</strong><span>This dashboard uses public practitioner profiles only. ZenAuraa’s internal purposes, lawful basis, retention, processors and security controls are not verifiable from this endpoint; the review below identifies evidence to confirm, not compliance findings.</span></div>
      <section className="sd-grid" aria-label="Interactive directory summary">{cards.map(({label,value,icon:Icon,color,filter})=>filter ? <button type="button" className={`card-panel sd-stat sd-stat-action ${profileFilter===filter?'is-selected':''}`} aria-pressed={profileFilter===filter} key={label} onClick={()=>{setProfileFilter(filter);setProfileQuery('');setSpecialtyFilter('All specialties')}}><span>{label}</span><strong>{value}</strong><i className="sd-stat-accent" style={{backgroundColor:color}}/><Icon className="sd-stat-icon" size={19} style={{color}}/><small className="sd-stat-hint">Filter directory</small></button> : <article className="card-panel sd-stat" key={label}><span>{label}</span><strong>{value}</strong><i className="sd-stat-accent" style={{backgroundColor:color}}/><Icon className="sd-stat-icon" size={19} style={{color}}/></article>)}</section>
      <section className="sd-source-catalog" aria-label="Dataset coverage">
        <article><span>LIVE DIRECTORY</span><strong>{liveMarketplace.listedCount.toLocaleString()}</strong><small>profiles reported by API · {liveMarketplace.loadedCount} loaded on this page</small></article>
        <article><span>PUBLIC SITE SNAPSHOT</span><strong>{marketplace.featuredExperts.length + marketplace.categoryDetails.length + marketplace.testimonials.length + marketplace.tarotCards.length + marketplace.faqs.length}</strong><small>items across five supplied profile, category, review, tarot and FAQ groups</small></article>
        <article><span>PRIVACY REVIEW CHECKLIST</span><strong>{gdprDataMap.activities.length + gdprDataMap.articleChecks.length}</strong><small>processing questions and article references · not control results</small></article>
      </section>
      <section className="sd-chart-grid">
        <article className="card-panel feature-card sd-chart-card"><div className="sd-chart-heading"><div><span className="sd-chart-kicker">LIVE SOURCE · PAGE {liveMarketplace.page}</span><h3>Practitioner profile summary</h3><p>Weighted by the ratings and review counts on this page</p></div><span className="sd-chart-highlight"><b>{liveMarketplace.rating === null ? 'N/A' : `${liveMarketplace.rating}/5`}</b><small>{liveMarketplace.reviewCount.toLocaleString()} reviews</small></span></div><p className="sd-marketplace-note">The API provides a consultation rate without a currency code; values below are shown without an assumed currency.</p></article>
        <article className="card-panel feature-card sd-chart-card"><div className="sd-chart-heading"><div><span className="sd-chart-kicker">DISCOVER</span><h3>Observed specialties</h3><p>Derived from profiles on the current page</p></div><span className="sd-chart-total">{liveMarketplace.categories.length}<small> specialties</small></span></div><div className="sd-activity">{liveMarketplace.categories.map(category=><div key={category}><span className="sd-activity-dot" style={{backgroundColor:featureColors.code}}/><span>{category}</span></div>)}</div></article>
      </section>
      <section className="card-panel feature-card sd-directory-card">
        <div className="panel-header"><div><span className="sd-chart-kicker">LIVE SOURCE · {liveMarketplace.pageSize} PER PAGE</span><h3>ZenAuraa practitioner directory</h3><p className="sd-note">Search and filter the public API records. The source currently reports {liveMarketplace.listedCount.toLocaleString()} total profiles.</p></div><button className="sd-export-button" type="button" onClick={exportProfiles} disabled={filteredProfiles.length === 0}><Download size={14}/> Export visible CSV</button></div>
        <div className="sd-directory-tools"><label className="sd-directory-search"><Search size={16}/><input aria-label="Search live practitioners" placeholder="Search names, specialties, languages…" value={profileQuery} onChange={(event) => setProfileQuery(event.target.value)}/></label><label className="sd-directory-filter">Availability / status<select aria-label="Filter practitioners" value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)}>{['All profiles', 'Verified', 'Online', 'Busy', 'Offline'].map((filter) => <option key={filter}>{filter}</option>)}</select></label><label className="sd-directory-filter">Specialty<select aria-label="Filter by specialty" value={specialtyFilter} onChange={(event) => setSpecialtyFilter(event.target.value)}><option>All specialties</option>{liveMarketplace.categories.map((category) => <option key={category}>{category}</option>)}</select></label><span>{filteredProfiles.length} shown · {liveMarketplace.loadedCount} loaded</span></div>
        <div className="data-table-wrap"><table><thead><tr>{['Practitioner','Specialties','Experience','Languages','Rating / reviews','Rate per minute','Availability','Profile intro'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{filteredProfiles.map(profile=><tr key={profile.id}><td><div className="sd-profile-name">{profile.photoUrl ? <img src={profile.photoUrl} alt="" loading="lazy"/> : <span>{profile.name.slice(0, 1).toUpperCase()}</span>}<div><button type="button" className="sd-profile-open" onClick={()=>setSelectedProfile(profile)}>{profile.name}</button><small>{profile.verified?'Verified':'Not verified'} · {profile.reviewCount} reviews</small></div></div></td><td>{profile.specialties.join(', ') || 'Not provided'}</td><td>{profile.experienceYears} yrs</td><td>{profile.languages.join(', ') || 'Not provided'}</td><td>{profile.reviewCount > 0 ? profile.rating.toFixed(1) : 'No rating'} ({profile.reviewCount})</td><td>{profile.ratePerMinute.toLocaleString('en-IN', {maximumFractionDigits: 2})} / min</td><td><span className={`sd-availability ${profile.online ? profile.busy ? 'busy' : 'online' : 'offline'}`}>{profile.online ? profile.busy ? 'Busy' : 'Online' : 'Offline'}</span></td><td className="sd-profile-bio">{profile.bio || 'Not provided'}</td></tr>)}</tbody></table>{filteredProfiles.length===0&&<p className="empty-state">{liveMarketplace.profiles.length===0 ? 'ZenAuraa returned no practitioner profiles.' : 'No profiles match these search and filter settings.'}</p>}</div>
        <div className="sd-pagination"><span>Page {liveMarketplace.page} of {Math.max(liveMarketplace.pages, 1)} · {liveMarketplace.listedCount.toLocaleString()} total from source</span><div><button type="button" onClick={() => changePage(page - 1)} disabled={loading || page <= 1}>Previous</button><button type="button" onClick={() => changePage(page + 1)} disabled={loading || page >= liveMarketplace.pages}>Next</button></div></div>
      </section>
      {selectedProfile && <div className="sd-overlay" role="presentation" onClick={()=>setSelectedProfile(null)}><section className="sd-profile-dialog card-panel" role="dialog" aria-modal="true" aria-labelledby="selected-profile-title" onKeyDown={(event)=>{if(event.key==='Escape')setSelectedProfile(null)}} onClick={(event)=>event.stopPropagation()}><button type="button" className="icon-button sd-profile-close" aria-label="Close practitioner details" autoFocus onClick={()=>setSelectedProfile(null)}><X size={18}/></button><div className="sd-profile-dialog-heading">{selectedProfile.photoUrl ? <img src={selectedProfile.photoUrl} alt=""/> : <span>{selectedProfile.name.slice(0,1).toUpperCase()}</span>}<div><span className="sd-chart-kicker">LIVE ZENAAURAA PROFILE</span><h2 id="selected-profile-title">{selectedProfile.name}</h2><p>{selectedProfile.verified?'Verified practitioner':'Verification status not verified'}</p></div></div><p className="sd-profile-dialog-bio">{selectedProfile.bio || 'No profile introduction provided.'}</p><div className="sd-profile-dialog-grid"><div><small>Specialties</small><strong>{selectedProfile.specialties.join(', ') || 'Not provided'}</strong></div><div><small>Experience</small><strong>{selectedProfile.experienceYears} years</strong></div><div><small>Languages</small><strong>{selectedProfile.languages.join(', ') || 'Not provided'}</strong></div><div><small>Rating</small><strong>{selectedProfile.reviewCount ? `${selectedProfile.rating.toFixed(1)} / 5 · ${selectedProfile.reviewCount} reviews` : 'No ratings yet'}</strong></div><div><small>Consultation rate</small><strong>{selectedProfile.ratePerMinute.toLocaleString('en-IN',{maximumFractionDigits:2})} per minute · currency not supplied</strong></div><div><small>Current availability</small><strong>{selectedProfile.online ? selectedProfile.busy ? 'Online · busy' : 'Online' : 'Offline'}</strong></div></div><p className="sd-profile-dialog-source">Public profile fields only. Currency, processing purpose and retention are not stated by the API.</p></section></div>}
      </div>
      <div hidden={dashboardView !== 'privacy'} className="sd-dashboard-view">
      <section className="card-panel feature-card"><div className="panel-header"><div><h3>Live GDPR data inventory</h3><p className="sd-note">Fields observed in the API response; the controller’s actual purpose and retention remain to be confirmed.</p></div><span className="sd-pill special-category">Personal data</span></div><div className="sd-gdpr-map"><article><div><strong>Practitioner identity</strong><span>Record ID, name, photo URL</span></div><b>GDPR Article 4(1)</b><p>Identifiers and profile images are personal data where they relate to an identifiable practitioner.</p></article><article><div><strong>Professional profile</strong><span>Bio, specialties, languages, experience, verification status</span></div><b>Articles 5(1)(b), 5(1)(c), 5(1)(d)</b><p>Confirm stated purposes, necessity and accuracy; a “verified” flag is visible, but underlying verification documents are not in this response.</p></article><article><div><strong>Marketplace status and metrics</strong><span>Online/busy status, rating, review count, consultation rate</span></div><b>Articles 5(1)(a), 6, 13</b><p>Confirm the lawful basis and privacy information for each use. The API does not specify the rate currency.</p></article></div></section>
      <section className="card-panel feature-card">
        <div className="panel-header">
          <div><h3>GDPR review workflow</h3><p className="sd-note">Work through scope → records → assessment → risk and controls. A review item is not a compliance conclusion.</p></div>
          <div className="sd-review-toolbar"><span className="sd-pill info">{closedReviewCount} / {reviewSteps.length} closed</span><button className="sd-export-button" type="button" onClick={exportReviewDraft}>Export draft CSV</button></div>
        </div>
        <div className="sd-draft-boundary"><strong>Working draft only</strong><span>Progress is held in this browser tab, not submitted to ZenAuraa or stored in a shared compliance system. Statuses show workflow progress only, not verified controls or certification. Do not enter personal data; use document IDs or evidence references only.</span></div>
        {reviewState.error && <p className="sd-live-error" role="alert">{reviewState.error}</p>}
        {reviewMessage && <p className="sd-review-message" role="alert">{reviewMessage}</p>}
        <div className="sd-review-list">{reviewSteps.map((step, index) => {
          const draft = reviewState.drafts[step.id]
          return <article className="sd-review-item" key={step.id}>
            <div className="sd-review-item-heading"><span className="sd-review-number">{String(index + 1).padStart(2, '0')}</span><div><span className="sd-review-phase">{step.phase} · {step.articles}</span><h4>{step.title}</h4></div><span className={`sd-review-status ${draft.status === 'Closed' ? 'is-closed' : draft.status === 'Ready for sign-off' ? 'is-ready' : draft.status === 'In progress' ? 'is-progress' : ''}`}>{draft.status}</span></div>
            <p className="sd-review-evidence"><strong>Known evidence:</strong> {step.observed}</p>
            <p className="sd-review-evidence"><strong>Next verification:</strong> {step.request}</p>
            <div className="sd-review-fields">
              <label>Status<select aria-label={`${step.title} status`} value={draft.status} onChange={(event) => changeReviewStatus(step.id, event.target.value as ReviewStatus)}>{reviewStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
              <label>Owner role<select aria-label={`${step.title} owner role`} value={draft.owner} onChange={(event) => updateReviewDraft(step.id, 'owner', event.target.value)}>{reviewOwners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}</select></label>
              <label>Target date<input aria-label={`${step.title} target date`} type="date" value={draft.dueDate} onChange={(event) => updateReviewDraft(step.id, 'dueDate', event.target.value)} /></label>
              <label className="sd-review-reference">Evidence reference / decision rationale<input aria-label={`${step.title} evidence reference or decision rationale`} placeholder="e.g. PRIV-ROPA-02 §4 (no personal data)" value={draft.evidenceRef} onChange={(event) => updateReviewDraft(step.id, 'evidenceRef', event.target.value)} /></label>
            </div>
          </article>
        })}</div>
      </section>
      <section className="card-panel feature-card"><div className="panel-header"><div><h3>Article 30 / ROPA evidence register</h3><p className="sd-note">Pre-assessment based on public evidence only; this is not ZenAuraa’s internal record of processing.</p></div><span className="sd-pill warning">Controller evidence required</span></div><div className="data-table-wrap"><table><thead><tr>{['Record item','Observed public evidence','Work to complete'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{gdprEvidenceItems.map(item=><tr key={item.record}><td><strong>{item.record}</strong></td><td>{item.observed}</td><td>{item.required}</td></tr>)}</tbody></table></div></section>
      <p className="sd-source-note">Source: <a href={liveMarketplace.sourceUrl} target="_blank" rel="noreferrer">ZenAuraa public practitioner API</a> · {liveMarketplace.loadedCount} records loaded. Legal reference: <a href="https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng" target="_blank" rel="noreferrer">Regulation (EU) 2016/679</a>. This is a preliminary screening aid, not legal advice or a compliance certification.</p>
      </div>
    </>}
    <section hidden={dashboardView !== 'dataset'} className="sd-dashboard-view sd-dataset-view" aria-label="ZenAuraa public website dataset"><header className="sd-dataset-heading"><span className="sd-chart-kicker">REFERENCE DATA · PUBLIC WEBSITE SNAPSHOT</span><h2>ZenAuraa content dataset</h2><p>Captured public-page examples, kept separate from the live practitioner API records.</p></header>
    <details className="card-panel feature-card sd-data-details"><summary>Homepage expert snapshot · {marketplace.featuredExperts.length} profiles (not live API data)</summary><div className="data-table-wrap"><table><thead><tr>{['Practitioner','Specialty','Badge','Rating','Orders','Languages','Experience','Rate'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{marketplace.featuredExperts.map(expert=><tr key={expert.name}><td><strong>{expert.name}</strong></td><td>{expert.title}</td><td>{expert.badge}</td><td>{expert.rating}/5</td><td>{expert.orders}</td><td>{expert.languages.join(', ')}</td><td>{expert.experience}</td><td>{expert.currency} {expert.rate}/min</td></tr>)}</tbody></table></div></details>
    <details className="card-panel feature-card sd-data-details"><summary>Homepage service-category snapshot · {marketplace.categoryDetails.length} categories</summary><div className="sd-grid">{marketplace.categoryDetails.map(category=><article className="card-panel feature-card" key={category.name}><h3>{category.name}</h3><p>{category.description}</p></article>)}</div></details>
    <details className="card-panel feature-card sd-data-details"><summary>Homepage testimonial excerpts · {marketplace.testimonials.length}</summary><div className="sd-grid">{marketplace.testimonials.map(review=><article className="card-panel feature-card" key={review.name}><p>“{review.quote}”</p><strong>{review.name}</strong><small>{review.location}</small></article>)}</div></details>
    <details className="card-panel feature-card sd-data-details"><summary>Tarot spread from supplied page snapshot · {marketplace.tarotCards.length} cards</summary><p>Choose 3 cards to reveal Past, Present, and Future.</p><div className="sd-grid">{marketplace.tarotCards.map(card=><article className="card-panel feature-card" key={card.name}><small>{card.numeral}</small><h3>{card.name}</h3><p>{card.meaning}</p></article>)}</div></details>
    <details className="card-panel feature-card sd-data-details"><summary>GDPR desk review · {gdprDataMap.articleChecks.length} article checks</summary><p><strong>Scope:</strong> {gdprDataMap.scope}</p><p><strong>Controller identity:</strong> {gdprDataMap.controller}</p><p><strong>Special-category screening:</strong> {gdprDataMap.specialCategoryNote}</p><h3>Processing activities and lawful-basis questions</h3><div className="data-table-wrap"><table><thead><tr>{['Activity','Data visible or potentially processed','Purpose','Article 6 / 9 review','Public evidence'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{gdprDataMap.activities.map(activity=><tr key={activity.activity}><td><strong>{activity.activity}</strong></td><td>{activity.data}</td><td>{activity.purpose}</td><td>{activity.basis}<small>{activity.articles}</small></td><td>{activity.evidence}</td></tr>)}</tbody></table></div><h3>GDPR controls to evidence</h3><div className="data-table-wrap"><table><thead><tr>{['GDPR article','Requirement','Evidence status'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{gdprDataMap.articleChecks.map(check=><tr key={check.article}><td>Article {check.article}</td><td>{check.title}</td><td>{check.status}</td></tr>)}</tbody></table></div><h3>Data subject rights to support</h3><p>{gdprDataMap.rights.join(' · ')}</p></details>
    <details className="card-panel feature-card sd-data-details"><summary>Journey paths, app features & FAQs</summary><div className="sd-grid">{marketplace.discoveryPaths.map(path=><article className="card-panel feature-card" key={path.label}><small>{path.label}</small><h3>{path.title}</h3><p>{path.description}</p><ul>{path.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div><h3>ZenAuraa app features</h3><ul>{marketplace.appFeatures.map(feature=><li key={feature}>{feature}</li>)}</ul><h3>Website navigation</h3><p>{marketplace.navigation.join(' · ')}</p><h3>Footer links</h3><p>{marketplace.footerLinks.join(' · ')}</p><h3>Sample in-app chat</h3><div className="sd-data-faq">{marketplace.sampleChat.map((message,index)=><p key={`${message.speaker}-${index}`}><strong>{message.speaker}</strong> · {message.message} <small>{message.time}</small></p>)}</div><div className="sd-data-faq">{marketplace.faqs.map(faq=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></details>
    <section className="card-panel feature-card"><h3>Simulated workspace activity · not ZenAuraa API data</h3><div className="sd-activity">{dashboard.recentActivity.slice(0,5).map((item,i)=><div key={`${item.feature}-${i}`}><span className="sd-activity-dot" style={{backgroundColor:featureColors[item.feature as keyof typeof featureColors]}}/><span>{item.text}</span><time>{item.time}</time></div>)}</div></section>
    </section>
    <section className="sd-feature-cards">{destinations.map(({to,name,detail,color})=><NavLink className="card-panel sd-feature-link" to={to} key={to} style={{'--feature-accent':color} as React.CSSProperties}><span>EXPLORE FEATURE</span><h2>{name}</h2><p>{detail}</p><b>Open demo →</b></NavLink>)}</section>
  </div>;
}

export function SpecAuditLog() {
  const liveLogs=useAppStore(state=>state.auditLogs);
  const [feature,setFeature]=useState('All');
  const [severity,setSeverity]=useState('All');
  const [query,setQuery]=useState('');
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');
  const allRows=useMemo(()=>[...liveLogs.map((row,index)=>({id:row.id,ts:`${DEMO_AUDIT_DATE} ${row.time}`,feature:row.module.includes('Sandbox')||row.module.includes('Runtime')?'Sandbox':row.module.includes('Document')?'Document':'Code',event:row.action,severity:'Info',actor:meta.currentUser.name.toLowerCase().replaceAll(' ','.'),hash:`${row.id.slice(-6)}...${String(index).padStart(4,'0')}`})),...auditLog],[liveLogs]);
  const features=['All',...new Set(allRows.map(row=>row.feature))];
  const severities=['All',...new Set(allRows.map(row=>row.severity))];
  const visible=useMemo(()=>allRows.filter(row=>
    (feature==='All'||row.feature===feature)&&
    (severity==='All'||row.severity===severity)&&
    (!from||row.ts.slice(0,10)>=from)&&(!to||row.ts.slice(0,10)<=to)&&
    `${row.ts} ${row.feature} ${row.event} ${row.actor} ${row.hash}`.toLowerCase().includes(query.toLowerCase())
  ),[feature,severity,query,from,to,allRows]);
  const csvRows=[['Timestamp','Feature','Event','Severity','Actor','Hash'],...visible.map(row=>[row.ts,row.feature,row.event,row.severity,row.actor,row.hash])];
  const csv=csvRows.map(row=>row.map(cell=>`"${cell.replaceAll('"','""')}"`).join(',')).join('\n');
  const exportCsv=()=>{const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='ai-accelerator-audit-log.csv';anchor.click();URL.revokeObjectURL(url);};
  return <div className="feature-page spec-demo"><div className="page-heading"><div><span className="eyebrow">Supporting page · Tamper-evident demo trail</span><h1>Audit Log</h1><p>History of the supplied demo actions across all three features.</p></div><button className="primary-button" onClick={exportCsv}>Export CSV</button></div><div className="sd-banner">Hashes are illustrative demo values, not cryptographic verification.</div>
    <section className="card-panel sd-audit-filters"><input aria-label="Search audit events" placeholder="Search events, actors, hashes…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Filter feature" value={feature} onChange={e=>setFeature(e.target.value)}>{features.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filter severity" value={severity} onChange={e=>setSeverity(e.target.value)}>{severities.map(x=><option key={x}>{x}</option>)}</select><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></section>
    <div className="card-panel data-table-wrap"><table><thead><tr>{['Timestamp','Feature','Event','Severity','Actor','Hash'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{visible.map(row=><tr key={row.id}><td>{row.ts}</td><td>{row.feature}</td><td>{row.event}</td><td><span className={`sd-pill ${row.severity.toLowerCase()}`}>{row.severity}</span></td><td>{row.actor}</td><td><code>{row.hash}</code></td></tr>)}</tbody></table>{visible.length===0&&<p className="empty-state">No audit entries match these filters.</p>}</div><p className="sd-audit-count">Showing {visible.length} of {allRows.length} demo records</p>
  </div>;
}
