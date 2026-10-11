/**
 * AI ACCELERATOR SUITE: SHARED DUMMY DATA
 * ------------------------------------------------------------
 *
 * Import example:
 *   import { codeScan, documentReview, sandbox, dashboard, auditLog } from "./data/dummyData";
 *
 * Shared references (sab features me same):
 *   - App / repo name : "zenauraa/expert-marketplace"
 *   - Law labels      : EU GDPR, UK GDPR where applicable
 *   - Severity values : "High" | "Medium" | "Low" | "Info" | "Critical"
 *   - Finding IDs (F-xxx) -> Action IDs (A-xxx) -> Audit log entries
 */

/* ============================================================
   0. SHARED CONSTANTS
   ============================================================ */
export const meta = {
  company: "ZenAuraa",
  currentUser: { name: "Anmol", role: "Marketplace Operations", email: "ops@zenauraa.example" },
  privacyContact: "Not disclosed in the supplied page extract",
  demoBanner: "Practitioner profiles are fetched from ZenAuraa's public API. GDPR review items are evidence checks, not a finding that ZenAuraa is compliant or non-compliant.",
  laws: ["EU GDPR (Regulation 2016/679)", "UK GDPR (if applicable)"],
  applications: ["expert-marketplace", "consultation-services", "customer-app"],
};

export const gdprDataMap = {
  controller: "Tara Infotech appears in the supplied site footer. The legal controller identity, address and privacy contact must be confirmed from the full privacy notice.",
  scope: "This is a desk review of the public-page extract and public practitioner API response. ZenAuraa's internal backend, app, contracts, full privacy notice and processing records were not inspected.",
  activities: [
    { activity: "Expert discovery and public profiles", data: "Practitioner ID, name, photo URL, bio, specialties, languages, experience, verification/online/busy flags, rating, review count and consultation rate returned by the public API; homepage also displays featured-expert order counts.", purpose: "Present practitioners and help visitors choose a consultation.", basis: "Controller to confirm an Article 6 basis for each use and publication.", articles: "4(1), 5, 6, 13", evidence: "Public practitioner API response and supplied homepage extract; internal purposes and retention are not disclosed" },
    { activity: "Public customer testimonials", data: "Reviewer name, city and personal account of career, relationship or family matters.", purpose: "Display customer reviews and experiences.", basis: "Controller to confirm publication basis, notice, any consent relied upon, and a withdrawal or removal process.", articles: "5, 6, 13, 17", evidence: "Four named testimonials visible in supplied page extract" },
    { activity: "Astrology and birth-chart services", data: "Birth date, time, place or other inputs may be requested for a reading; actual collection fields are not shown.", purpose: "Provide a requested birth-chart reading or consultation.", basis: "Assess whether Article 6(1)(b) applies to fields objectively necessary for the requested service; do not assume consent is the basis.", articles: "5, 6, 13", evidence: "Service is advertised; input form and data flow were not supplied" },
    { activity: "Consultation chat and calls", data: "Messages, call metadata and potentially conversation content; recording or transcript storage is not established by the supplied extract.", purpose: "Connect customers with practitioners for live one-to-one sessions.", basis: "Controller to map each purpose and Article 6 basis. If content reveals Article 9 data, identify an Article 9 condition as well.", articles: "5, 6, 9 (if applicable), 13, 32", evidence: "Chat and live-session features are advertised; retention and recording are not disclosed in the extract" },
    { activity: "Payments", data: "Payment method and transaction information may be processed; exact fields and providers are not disclosed.", purpose: "Take payment for per-minute consultations.", basis: "Assess Article 6(1)(b) for payment needed to perform the customer transaction and Article 6(1)(c) where a specific legal obligation applies.", articles: "5, 6, 13, 28, 32", evidence: "Page claims secure UPI, card and wallet payments; providers and data flow are not shown" },
    { activity: "Practitioner verification", data: "The listing displays verified badges; underlying identity or qualification documents are not shown.", purpose: "Support the displayed practitioner verification status.", basis: "Confirm what is collected, the Article 6 basis, who can access records, and a proportionate retention period.", articles: "5, 6, 13, 25, 32", evidence: "Verification badge visible; verification workflow and records were not supplied" },
  ],
  articleChecks: [
    { article: "5", title: "Principles: purpose limitation, minimisation, accuracy, storage limitation, security and accountability", status: "Requires evidence" },
    { article: "6", title: "Document an Article 6 lawful basis for each processing purpose", status: "Controller confirmation required" },
    { article: "9", title: "Screen consultation content for special-category data; birth details alone are not automatically Article 9 data", status: "Conditional review" },
    { article: "12–14", title: "Provide clear privacy information, lawful basis, recipients, retention criteria, rights and transfer details", status: "Full notice not supplied" },
    { article: "15–22", title: "Provide applicable access, rectification, erasure, restriction, portability, objection and automated-decision rights handling", status: "Process not evidenced" },
    { article: "25", title: "Apply data protection by design and default to profile, consultation and payment flows", status: "Technical design not inspected" },
    { article: "28", title: "Use compliant processor terms where vendors process data on the controller's behalf", status: "Vendor list and contracts not supplied" },
    { article: "30", title: "Maintain records of processing where Article 30 applies", status: "Processing record not supplied" },
    { article: "32", title: "Choose security measures based on risk; an encryption claim alone does not establish overall compliance", status: "Security evidence not supplied" },
    { article: "33–34", title: "Assess each breach; notify the supervisory authority within 72 hours where Article 33 requires it, and people where Article 34 high-risk threshold is met", status: "Response process not evidenced" },
    { article: "35", title: "Screen processing for likely high risk and complete a DPIA before processing if required", status: "Screening required; outcome unknown" },
    { article: "44–49", title: "Identify international transfers and a valid Chapter V transfer mechanism where applicable", status: "Transfer destinations not supplied" },
  ],
  rights: ["Access", "Rectification", "Erasure (subject to conditions and exceptions)", "Restriction", "Data portability (where Article 20 applies)", "Object (where applicable)", "Rights relating to solely automated decisions (where Article 22 applies)"],
  specialCategoryNote: "Astrology, tarot, spiritual or wellness context does not automatically make every record special-category data. Assess the actual information processed. Health data, religious or philosophical beliefs, sex life or sexual orientation in consultation content may engage Article 9; if so, an Article 9 condition is required in addition to an Article 6 basis.",
};

export const marketplace = {
  tagline: "Find trusted guidance for every stage of life. Connect with verified experts instantly.",
  navigation: ["Consult", "Consultations", "Tools", "Services", "More", "Shop", "Blog", "Find Expert", "Insights", "Reviews"],
  footerLinks: ["Privacy Policy", "Terms of Service", "Contact"],
  onlineExperts: 1240,
  listedExperts: 3,
  rating: 4.9,
  reviews: "10,000+",
  experts: [
    { name: "Priyanshu Chand", specialties: ["Astrology", "Reiki"], verified: true, rating: "0", reviews: 0, experience: "5 yrs", languages: ["English", "Hindi"], rate: 63.99, availability: "Offline", bio: "Can heal any one" },
    { name: "Piyush Expert", specialties: ["Astrology", "Tarot"], verified: true, rating: "2.3", reviews: 4, experience: "8 yrs", languages: ["English", "Hindi"], rate: 51.2, availability: "Offline", bio: "Expert in Tarot Reading, Palm Reading, and Astrology" },
    { name: "Deepak's Expert", specialties: ["Tarot", "Astrology"], verified: true, rating: "4.6", reviews: 11, experience: "2 yrs", languages: ["English", "Hindi"], rate: 639.95, availability: "Offline", bio: "Hello I am an expert's testing account ." },
  ],
  categories: ["Astrology", "Yoga & Breath", "Energy Healing", "Dream & Spiritual", "Face & Personality", "Meditation & Mindfulness", "Numerology", "Palmistry", "Sound & Energy", "Vastu & Space", "Akashic Guidance", "Tarot & Psychic"],
  featuredExperts: [
    { name: "Maya Sharma", title: "Vedic Astrologer", badge: "Celebrity", rating: 4.9, orders: "128k+", languages: ["English", "Hindi"], experience: "15+ Years", rate: 120, currency: "USD" },
    { name: "Arun Nair", title: "Tarot & Crystals", badge: "Top Choice", rating: 5.0, orders: "342k+", languages: ["English", "Malayalam"], experience: "20+ Years", rate: 150, currency: "USD" },
    { name: "Dr. Elena Rossi", title: "Energy Healer", badge: "Celebrity", rating: 4.8, orders: "89k+", languages: ["English", "Italian"], experience: "8+ Years", rate: 90, currency: "USD" },
    { name: "Chen Wei", title: "Numerologist", badge: "Top Choice", rating: 5.0, orders: "412k+", languages: ["English", "Mandarin"], experience: "30+ Years", rate: 80, currency: "USD" },
    { name: "Luna Vega", title: "Tarot Reader", badge: "Featured", rating: 4.9, orders: "11k+", languages: ["English", "Spanish"], experience: "6+ Years", rate: 100, currency: "USD" },
  ],
  categoryDetails: [
    { name: "Astrology", description: "Gain cosmic insights and life path guidance." },
    { name: "Tarot & Psychic", description: "Unveil hidden truths through symbolic cards." },
    { name: "Face & Personality", description: "Understand personality and health markers." },
    { name: "Palmistry", description: "Discover destiny written in your hands." },
    { name: "Sound & Energy", description: "Harmonize your body with therapeutic frequencies." },
    { name: "Mindful Meditation", description: "Cultivate mindfulness and inner peace." },
    { name: "Akashic Guidance", description: "Connect with higher purpose and wisdom." },
    { name: "Energy Healing", description: "Restore balance and clear energy blockages." },
    { name: "Yoga & Breath", description: "Align mind, body, and spirit through mindful breathing." },
    { name: "Spiritual Guidance", description: "Unlock the power of your subconscious dreams." },
    { name: "Vastu & Space", description: "Harmonize your living and working spaces." },
    { name: "Numerology", description: "Uncover the hidden vibrations of numbers." },
  ],
  discoveryPaths: [
    { title: "Know Yourself", label: "KNOW", description: "Discover your cosmic blueprint through birth chart, numerology, and personality mapping.", items: ["Birth Chart Reading", "Numerology Profile", "Element & Sign Analysis"] },
    { title: "Explore Your World", label: "EXPLORE", description: "Navigate love, career, and life transitions through tarot, zodiac readings, and guided sessions.", items: ["Tarot Card Reading", "Zodiac Compatibility", "Monthly Forecasts"] },
    { title: "Connect With Guides", label: "CONNECT", description: "Meet verified practitioners matched to your exact needs, available 24/7 worldwide.", items: ["AI-Matched Experts", "Live 1-on-1 Sessions", "Ongoing Journey Support"] },
  ],
  tarotCards: [
    { numeral: "0", name: "The Fool", meaning: "New Beginnings & Spontaneity" },
    { numeral: "II", name: "The High Priestess", meaning: "Intuition & Inner Voice" },
    { numeral: "XIX", name: "The Sun", meaning: "Joy & Success" },
    { numeral: "XXI", name: "The World", meaning: "Completion & Wholeness" },
    { numeral: "XVI", name: "The Tower", meaning: "Revelation & Transformation" },
    { numeral: "XVII", name: "The Star", meaning: "Hope & Serenity" },
    { numeral: "I", name: "The Magician", meaning: "Manifestation & Power" },
    { numeral: "III", name: "The Empress", meaning: "Abundance & Nurturing" },
    { numeral: "IV", name: "The Emperor", meaning: "Structure & Authority" },
    { numeral: "V", name: "The Hierophant", meaning: "Tradition & Guidance" },
    { numeral: "VI", name: "The Lovers", meaning: "Harmony & Choices" },
    { numeral: "VII", name: "The Chariot", meaning: "Determination & Victory" },
    { numeral: "VIII", name: "Strength", meaning: "Courage & Compassion" },
    { numeral: "IX", name: "The Hermit", meaning: "Introspection & Inner Guidance" },
  ],
  testimonials: [
    { quote: "This app helped me to get a job in my dream company. I was stressed about not getting a career opportunity after my graduation. One prediction from an astrologer gave me a ray of hope and within a few months, I had a job offer in hand. Thank you so much ZenAuraa for helping me out.", name: "Amar Thakur", location: "Pune · India" },
    { quote: "I was going through a tough phase in my marriage. The tarot reading session gave me clarity and helped me understand my partner better. Highly recommend!", name: "Sneha Patel", location: "Mumbai · India" },
    { quote: "The Kundli matching feature helped me find the perfect match for my son. The astrologers were very detailed and professional in their analysis.", name: "Rahul Verma", location: "Delhi · India" },
    { quote: "My career horoscope reading was spot on. I got the guidance I needed to make a major career transition. The astrologer understood my situation perfectly and gave me actionable advice.", name: "Priya Sharma", location: "Bangalore · India" },
  ],
  appFeatures: ["Instant chats, notifications, and alerts", "Secure payments, UPI, cards & wallet, all encrypted", "Available 24×7"],
  sampleChat: [
    { speaker: "Riya", message: "Hello! How can I help you today?", time: "9:41 AM" },
    { speaker: "Customer", message: "I need guidance about my career", time: "9:42 AM" },
  ],
  faqs: [
    { question: "Why Is Astrology So Accurate?", answer: "Astrology accuracy comes from thousands of years of careful observation linking planetary movements to human experiences. Experienced astrologers study birth charts that map cosmic influences at your exact birth moment, providing personalized insights rather than generic predictions." },
    { question: "Why Should You Choose ZenAuraa For An Astrology Horoscope?", answer: "Answer text was not present in the supplied page extract." },
    { question: "Is Astrology Prediction True?", answer: "The supplied page lists this as a common question; it does not include a displayed answer." },
    { question: "How Can Online Astrology Help Me In Predicting The Future?", answer: "The supplied page lists this as a common question; it does not include a displayed answer." },
    { question: "How reliable is the ZenAuraa app?", answer: "The supplied page lists this as a common question; it does not include a displayed answer." },
    { question: "How much does ZenAuraa cost?", answer: "Consultation pricing varies by practitioner; prices shown in the supplied listings are per minute." },
  ],
};

export const severityColors = {
  Critical: "#e11d48",
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e",
  Info: "#64748b",
};

export const featureColors = {
  code: "#06b6d4",
  document: "#7c3aed",
  sandbox: "#e11d48",
};

/* ============================================================
   1. DASHBOARD
   ============================================================ */
export const dashboard = {
  stats: {
    listedExperts: marketplace.listedExperts,
    onlineExperts: marketplace.onlineExperts,
    serviceCategories: marketplace.categories.length,
    platformRating: marketplace.rating,
    reviews: marketplace.reviews,
  },
  recentActivity: [
    { time: "10 min ago", feature: "sandbox", text: "Unusual consultation-record export flagged in the ZenAuraa demo" },
    { time: "1 hr ago", feature: "document", text: "ZenAuraa privacy notice review completed (5 clauses checked)" },
    { time: "3 hr ago", feature: "code", text: "zenauraa/expert-marketplace scanned, 10 findings" },
    { time: "Yesterday", feature: "document", text: "Consultation provider terms reviewed, 4 gaps" },
    { time: "Yesterday", feature: "sandbox", text: "Expert sign-in monitoring session completed" },
  ],
};

/* ============================================================
   2. FEATURE 1: CODE-TO-GDPR GENERATOR
   ============================================================ */
export const codeScan = {
  sampleRepos: ["https://zenauraa.com/ · supplied public-page extract"],
  branches: ["Public-page desk review"],

  scanSteps: [
    "Reviewing the supplied public-page extract",
    "Mapping visible personal data and advertised services",
    "Separating confirmed website facts from unverified processing assumptions",
    "Screening applicable EU GDPR / UK GDPR requirements",
    "Preparing evidence requests for the controller",
  ],

  result: {
    repo: "zenauraa.com · supplied public-page extract",
    branch: "Desk review",
    filesScanned: 1,
    linesScanned: 0,
    riskScore: null,
    scannedAt: "Source extract only · no backend or privacy notice reviewed",
    summary: { publicProfileRecords: 3, publicTestimonials: 4, advertisedProcessingFlows: 6 },

    // Data jo app collect kar rahi hai
    findings: [
      { id: "F-001", field: "Practitioner public profiles", file: "Supplied public-page extract", line: 0, category: "Public profile", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 13", article9: false, severity: "Medium", snippet: "Names, specialties, verification badge, languages, experience, ratings, prices and availability are displayed.", note: "Confirm controller, publication purpose and lawful basis; verify profile accuracy and provide practitioner privacy information.", actionId: "A-001" },
      { id: "F-002", field: "Named customer testimonials", file: "Supplied public-page extract", line: 0, category: "Public profile", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 13, 17", article9: false, severity: "High", snippet: "Testimonials display reviewer names, cities and personal experiences about work, relationships or family.", note: "Confirm publication basis and notice, whether quotes can reveal special-category data, and a clear removal/objection process.", actionId: "A-002" },
      { id: "F-003", field: "Birth-chart input fields", file: "Supplied service description; form not supplied", line: 0, category: "Consultation", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 13", article9: false, severity: "Medium", snippet: "Birth-chart readings are advertised; the page extract does not show whether date, time or place are collected.", note: "Map actual inputs and justify each as necessary for the requested service. Birth details alone are not automatically Article 9 data.", actionId: "A-003" },
      { id: "F-004", field: "Consultation messages or call records", file: "Supplied advertised chat/live-session features", line: 0, category: "Consultation", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 9 (conditional), 13, 32", article9: true, severity: "High", snippet: "Chat and live sessions are advertised; recording, transcripts, metadata, access and retention are not evidenced.", note: "Map actual collection and retention. Screen conversation content for Article 9 data; this is conditional, not confirmed.", actionId: "A-004" },
      { id: "F-005", field: "Practitioner verification records", file: "Supplied public-page extract", line: 0, category: "Verification", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 13, 25, 32", article9: false, severity: "Medium", snippet: "Verified badges appear on listings; source documents and verification workflow are not supplied.", note: "Confirm data collected, access controls, lawful basis, vendor involvement and retention criteria.", actionId: "A-005" },
      { id: "F-006", field: "Consultation payment information", file: "Supplied payment claim; provider details not supplied", line: 0, category: "Payment", country: "Unconfirmed", law: "EU GDPR Arts. 5, 6, 13, 28, 32", article9: false, severity: "Medium", snippet: "The page advertises per-minute rates and secure UPI/card/wallet payments.", note: "Identify payment fields, controller/processor roles, provider, lawful basis and any legal retention duty.", actionId: "A-006" },
      { id: "F-007", field: "Expert matching and recommendations", file: "Supplied service description; logic not supplied", line: 0, category: "Matching", country: "Unconfirmed", law: "EU GDPR Arts. 13–15, 22 (if applicable)", article9: false, severity: "Low", snippet: "AI-matched experts are advertised; inputs, logic and effects are not described.", note: "Document the actual matching logic and meaningful information. Assess Article 22 only if its solely automated decision and significant-effect criteria are met.", actionId: "A-007" },
      { id: "F-008", field: "Privacy notice, vendors and retention", file: "Full notice and operational records not supplied", line: 0, category: "Transparency", country: "Unconfirmed", law: "EU GDPR Arts. 12–14, 28, 30, 44–49", article9: false, severity: "High", snippet: "A Privacy Policy link is listed, but its contents and vendor/data-transfer details are absent from the supplied extract.", note: "Obtain the full notice, processing inventory, processor terms, retention schedule and transfer destinations before assessing these controls.", actionId: "A-008" },
    ],

    // Generated statutory requirements
    requirements: {
      euGdpr: [
        { ref: "Arts. 5–6", title: "Document purpose, minimisation, retention and a lawful basis for each processing purpose", status: "Controller confirmation required" },
        { ref: "Art. 9", title: "Screen consultation content for special-category data; apply an Article 9 condition only if such data is processed", status: "Conditional review" },
        { ref: "Arts. 12–14", title: "Provide complete privacy information at the appropriate collection point", status: "Full notice not supplied" },
        { ref: "Arts. 15–22", title: "Provide applicable rights handling and assess automated decisions against Article 22 criteria", status: "Process not evidenced" },
        { ref: "Arts. 25, 32", title: "Evidence proportionate privacy-by-design and security measures", status: "Technical evidence not supplied" },
        { ref: "Arts. 28, 30", title: "Confirm processor terms and maintain records of processing where required", status: "Vendors and records not supplied" },
        { ref: "Arts. 33–35", title: "Document breach response and screen for likely high risk; notify only where legal thresholds apply", status: "Process and screening outcome unknown" },
        { ref: "Arts. 44–49", title: "Identify international transfers and applicable Chapter V mechanism", status: "Transfer details not supplied" },
      ],
      ukGdpr: [
        { ref: "UK GDPR", title: "Confirm territorial scope and any UK-specific requirements for the actual service", status: "Applicability not established" },
      ],
    },

    // Developer ke liye to-do list
    actions: [
      { id: "A-001", priority: "High", task: "Confirm controller identity, purposes, lawful basis and practitioner privacy information", file: "Full privacy notice and practitioner onboarding flow", done: false },
      { id: "A-002", priority: "High", task: "Review testimonial publication basis, notice, sensitive disclosures and removal workflow", file: "Testimonials and publication consent records", done: false },
      { id: "A-003", priority: "Medium", task: "Inspect birth-chart forms, document purposes and choose an Article 6 basis for each purpose", file: "Customer birth-chart journey and privacy notice", done: false },
      { id: "A-004", priority: "High", task: "Map chat/call data, retention, access and conditional Article 9 handling", file: "Consultation product and storage flows", done: false },
      { id: "A-005", priority: "Medium", task: "Document practitioner verification data, access, retention and vendors", file: "Practitioner verification workflow", done: false },
      { id: "A-006", priority: "Medium", task: "Identify payment provider, data fields, roles, lawful basis and required accounting retention", file: "Payment integration and processor terms", done: false },
      { id: "A-007", priority: "Low", task: "Review expert-matching inputs, transparency and Article 22 applicability", file: "Expert matching product specification", done: false },
      { id: "A-008", priority: "High", task: "Obtain notice, RoPA, retention schedule, processor contracts, transfer map and DPIA screening", file: "Controller evidence pack", done: false },
    ],

    fileTree: [{ path: "Supplied ZenAuraa public-page extract (desk review only)", findings: 8 }],
  },
};

/* ============================================================
   3. FEATURE 2: DOCUMENT REVIEW & FIX
   ============================================================ */
export const documentReview = {
  docTypes: ["Privacy Policy", "Vendor DPA", "DPIA Draft"],

  reviewSteps: [
    "Extracting text",
    "Checking mandatory clauses",
    "Detecting vague language",
    "Preparing evidence requests and suggested placeholders",
    "Flagging text that needs controller or legal review",
  ],

  // Upload ke baad in me se koi bhi dikha sakte ho
  documents: [
    {
      id: "DOC-001",
      fileName: "Illustrative_Privacy_Notice_Review.txt",
      docType: "Privacy Policy",
      pages: 6,
      uploadedAt: "2026-10-07 20:10",
      scoreBefore: 48,
      scoreAfter: 91,
      fineRisk: {
        uk: "Up to £17.5M or 4% of global annual turnover",
        india: "Up to ₹250 crore per breach",
        note: "Estimated, for demo only. Not legal advice.",
      },
      // Poora document text (right panel me dikhane ke liye)
      originalText: [
        "1. Introduction\nZenAuraa explains how customer and practitioner information is used across the expert marketplace.",
        "2. Information We Collect\nCustomers may provide birth details to receive a requested astrology reading.",
        "3. Consultation Records\nChat and call records are kept as long as needed to provide our services.",
        "4. Contact\nContact us for any privacy questions.",
        "5. Data Breaches\nWe will inform you if a breach happens.",
        "6. International Transfers\nYour data may be processed outside the UK.",
      ],
      issues: [
        {
          id: "D-001", severity: "High", title: "Birth details purpose is not explained",
          law: "EU GDPR Arts. 5–6, 13", section: "2. Information We Collect (sample text)",
          original: "Customers may provide birth details to receive a requested astrology reading.",
          fixed: "If collected, [list each birth-chart input] is used for [controller to specify purpose]. Confirm necessity, lawful basis, collection point and whether the fields are optional before publication.",
          status: "pending",
        },
        {
          id: "D-002", severity: "High", title: "Consultation retention period is undefined",
          law: "EU GDPR Arts. 5(1)(e), 13", section: "3. Consultation Records (sample text)",
          original: "Chat and call records are kept as long as needed to provide our services.",
          fixed: "[Controller: specify whether messages, recordings, transcripts or metadata are stored, the purpose for each, and the retention period or criteria. Do not publish until confirmed.]",
          status: "pending",
        },
        {
          id: "D-003", severity: "Medium", title: "Privacy contact and controller identity need confirmation",
          law: "EU GDPR Arts. 13–14", section: "4. Contact",
          original: "Contact us for any privacy questions.",
          fixed: "Controller: [legal entity and address to confirm]. Privacy contact: [working contact channel to confirm]. Name a DPO only if one is appointed or required.",
          status: "pending",
        },
        {
          id: "D-004", severity: "Medium", title: "No breach notification timeline",
          law: "UK GDPR Art. 33", section: "5. Data Breaches",
          original: "We will inform you if a breach happens.",
          fixed: "We will notify the relevant regulator within the applicable legal timeline and inform affected individuals where required.",
          status: "pending",
        },
        {
          id: "D-005", severity: "Low", title: "Cross-border transfer safeguards missing",
          law: "EU GDPR Chapter V", section: "6. International Transfers (sample text)",
          original: "Your data may be processed outside the UK.",
          fixed: "Where information is processed in another region, ZenAuraa uses safeguards required by applicable law and provider agreements.",
          status: "pending",
        },
      ],
    },

    {
      id: "DOC-002",
      fileName: "Consultation_Provider_DPA.docx",
      docType: "Vendor DPA",
      pages: 11,
      uploadedAt: "2026-10-06 16:40",
      scoreBefore: 55,
      scoreAfter: 88,
      fineRisk: {
        uk: "Up to £8.7M or 2% of global annual turnover",
        india: "Up to ₹200 crore",
        note: "Estimated, for demo only. Not legal advice.",
      },
      originalText: [
        "1. Scope\nThe provider may process customer and practitioner information to support ZenAuraa consultations.",
        "2. Sub-processors\nThe Processor may appoint sub-processors at its discretion.",
        "3. Audit\nThe Controller may request information from time to time.",
        "4. Deletion\nData will be deleted when no longer required.",
      ],
      issues: [
        {
          id: "D-101", severity: "High", title: "Sub-processor appointment without consent",
          law: "UK GDPR Art. 28(2)", section: "2. Sub-processors",
          original: "The Processor may appoint sub-processors at its discretion.",
          fixed: "The Processor shall not appoint any sub-processor without the Controller's prior written authorisation.",
          status: "pending",
        },
        {
          id: "D-102", severity: "Medium", title: "Weak audit rights",
          law: "UK GDPR Art. 28(3)(h)", section: "3. Audit",
          original: "The Controller may request information from time to time.",
          fixed: "The Processor shall allow and contribute to audits, including inspections, conducted by the Controller or its auditor.",
          status: "pending",
        },
        {
          id: "D-103", severity: "Medium", title: "Vague deletion timeline",
          law: "UK GDPR Art. 28(3)(g)", section: "4. Deletion",
          original: "Data will be deleted when no longer required.",
          fixed: "At the end of the services, the Processor shall, at the Controller's choice, delete or return personal data, subject to documented legal retention duties, and provide reasonable evidence on request.",
          status: "pending",
        },
      ],
    },

    {
      id: "DOC-003",
      fileName: "Consultation_Data_Impact_Review_Draft.docx",
      docType: "DPIA Draft",
      pages: 8,
      uploadedAt: "2026-10-05 11:15",
      scoreBefore: 40,
      scoreAfter: 86,
      fineRisk: {
        uk: "Up to £8.7M or 2% of global annual turnover",
        india: "Up to ₹150 crore",
        note: "Estimated, for demo only. Not legal advice.",
      },
      originalText: [
        "1. Description of Processing\nZenAuraa processes customer birth details and consultation records to provide requested readings.",
        "2. Necessity and Proportionality\nThe marketplace uses profile details to connect customers with practitioners.",
        "3. Risks\nRisks include access to private consultation records and practitioner verification documents.",
        "4. Mitigation\nWe will use good security.",
      ],
      issues: [
        {
          id: "D-201", severity: "High", title: "Necessity and proportionality not justified",
          law: "UK GDPR Art. 35(7)(b)", section: "2. Necessity and Proportionality",
          original: "The processing is needed for our business.",
          fixed: "[Controller: document the actual purpose, why each data field is necessary for that purpose, and which practitioner roles can access it. Confirm against the live service flow before use.]",
          status: "pending",
        },
        {
          id: "D-202", severity: "High", title: "Risks not specifically assessed",
          law: "UK GDPR Art. 35(7)(c)", section: "3. Risks",
          original: "There may be some risks to individuals.",
          fixed: "[Controller and system owners: identify risks from the actual processing, assess likelihood and severity of harm to individuals, and document the method and evidence for each rating.]",
          status: "pending",
        },
        {
          id: "D-203", severity: "Medium", title: "Mitigation measures are not specific",
          law: "UK GDPR Art. 35(7)(d)", section: "4. Mitigation",
          original: "We will use good security.",
          fixed: "[Security owner: list verified technical and organisational measures, link supporting evidence, assign an owner, and record any remaining risk. Do not insert unverified controls or retention periods.]",
          status: "pending",
        },
      ],
    },
  ],
};

/* ============================================================
   4. FEATURE 3: VM SANDBOX MONITOR
   ============================================================ */
export const sandbox = {
  setup: {
    applications: ["expert-marketplace", "consultation-services", "customer-app"],
    vmEnvironments: ["Ubuntu 22.04 Sandbox", "Windows Server 2022"],
    defaultThreshold: 10000, // rows per query
    thresholdMin: 1000,
    thresholdMax: 100000,
    autoKillSwitchDefault: true,
  },

  // Demo story: har ~1.2 second me ek event push karo (t = seconds in session)
  events: [
    { id: "E-01", t: 1, type: "process", level: "normal", text: "Process started: node server.js (PID 1423)" },
    { id: "E-02", t: 3, type: "file", level: "normal", text: "File read: /app/config/settings.json" },
    { id: "E-03", t: 6, type: "db", level: "normal", text: "Query: SELECT * FROM expert_profiles WHERE id=42", rows: 1 },
    { id: "E-04", t: 9, type: "network", level: "normal", text: "Outbound: api.stripe.com:443", ip: "52.1.10.5", port: 443, process: "node", status: "Allowed" },
    { id: "E-05", t: 14, type: "file", level: "warning", text: "File read: /app/exports/consultation-records.csv" },
    { id: "E-06", t: 17, type: "db", level: "critical", text: "Query: SELECT * FROM consultations", rows: 52000, alert: "Bulk consultation record export detected" },
    { id: "E-07", t: 19, type: "network", level: "critical", text: "Outbound: unknown host", ip: "185.220.101.45", port: 4444, process: "node", status: "Suspicious", alert: "Unknown destination socket" },
    { id: "E-08", t: 20, type: "network", level: "critical", text: "Upload 48 MB to 185.220.101.45", ip: "185.220.101.45", port: 4444, process: "node", status: "Suspicious", alert: "Possible data exfiltration" },
    { id: "E-09", t: 21, type: "killswitch", level: "blocked", text: "Firewall kill-switch triggered. Consultation data transfer blocked." },
  ],

  // DB rows chart (har point = ek event / second)
  dbRowsSeries: [
    { t: 1, rows: 0 }, { t: 3, rows: 0 }, { t: 6, rows: 1 }, { t: 9, rows: 1 },
    { t: 14, rows: 3 }, { t: 17, rows: 52000 }, { t: 19, rows: 0 }, { t: 20, rows: 0 }, { t: 21, rows: 0 },
  ],

  // Network table ka initial state (blocked hone par status update karna)
  networkConnections: [
    { ip: "52.1.10.5", port: 443, host: "api.stripe.com", process: "node", status: "Allowed" },
    { ip: "185.220.101.45", port: 4444, host: "unknown", process: "node", status: "Suspicious" },
  ],

  // Threat panel
  alerts: [
    { id: "T-01", severity: "Critical", title: "Bulk database dump", detail: "52,000 customer rows read in a single query (threshold: 10,000).", eventId: "E-06" },
    { id: "T-02", severity: "Critical", title: "Unknown outbound socket", detail: "Connection to 185.220.101.45:4444, not on allow-list.", eventId: "E-07" },
    { id: "T-03", severity: "Critical", title: "Possible exfiltration", detail: "48 MB uploaded to unknown host.", eventId: "E-08" },
  ],

  // Block hone ke baad modal me dikhane ke liye
  incidentReport: {
    id: "INC-2026-1007-01",
    app: "expert-marketplace",
    vm: "Ubuntu 22.04 Sandbox",
    summary: "A bulk read of the customers table was followed by an upload to an unknown external host. The kill-switch blocked the connection 2 seconds after the exfiltration attempt began.",
    rowsAccessed: 52000,
    dataLeakedMB: 0, // Blocked, isliye 0 confirmed leak
    attemptedUploadMB: 48,
    destination: "185.220.101.45:4444",
    timeToBlockSeconds: 2,
    gdprImpact: "Breach prevented. No notification to ICO required. Internal review recommended.",
    timeline: [
      { t: "00:14", text: "customers.csv opened" },
      { t: "00:17", text: "52,000 rows read from customers table" },
      { t: "00:19", text: "Connection opened to unknown host" },
      { t: "00:20", text: "48 MB upload attempt" },
      { t: "00:21", text: "Kill-switch triggered, connection blocked" },
    ],
  },

  // Session history (list ke liye)
  pastSessions: [
    { id: "S-101", app: "billing-service", startedAt: "2026-10-06 14:00", duration: "10 min", result: "Clean", threats: 0 },
    { id: "S-102", app: "hr-app", startedAt: "2026-10-05 09:30", duration: "8 min", result: "1 warning", threats: 1 },
    { id: "S-103", app: "expert-marketplace", startedAt: "2026-10-07 21:30", duration: "22 sec", result: "Blocked", threats: 3 },
  ],
};

/* ============================================================
   5. AUDIT LOG (teeno features ka combined history)
   ============================================================ */
export const auditLog = [
  { id: "L-001", ts: "2026-10-07 21:30:21", feature: "Sandbox", event: "Kill-switch triggered on expert-marketplace", severity: "Critical", actor: "system", hash: "a3f9c1...c21b", ref: "INC-2026-1007-01" },
  { id: "L-002", ts: "2026-10-07 21:30:17", feature: "Sandbox", event: "Bulk DB dump detected (52,000 rows)", severity: "Critical", actor: "system", hash: "b81e44...09de", ref: "T-01" },
  { id: "L-003", ts: "2026-10-07 20:15:40", feature: "Document", event: "ZenAuraa_Privacy_Notice_v3.pdf reviewed (5 gaps)", severity: "Info", actor: "anmol", hash: "7be214...90aa", ref: "DOC-001" },
  { id: "L-004", ts: "2026-10-07 20:10:02", feature: "Document", event: "ZenAuraa_Privacy_Notice_v3.pdf uploaded", severity: "Info", actor: "anmol", hash: "c45a10...77f1", ref: "DOC-001" },
  { id: "L-005", ts: "2026-10-07 18:02:05", feature: "Code", event: "Repo zenauraa/expert-marketplace scanned (10 findings)", severity: "Info", actor: "anmol", hash: "1d88e0...f3c7", ref: "F-001" },
  { id: "L-006", ts: "2026-10-07 18:02:06", feature: "Code", event: "Consultation profile data found in consultations.js", severity: "High", actor: "system", hash: "9aa2b7...1c40", ref: "F-004" },
  { id: "L-007", ts: "2026-10-06 16:55:30", feature: "Document", event: "Consultation_Provider_DPA.docx reviewed (3 gaps)", severity: "Medium", actor: "priya.nair", hash: "e07d93...5b12", ref: "DOC-002" },
  { id: "L-008", ts: "2026-10-06 14:10:00", feature: "Sandbox", event: "billing-service session completed, no threats", severity: "Info", actor: "system", hash: "42cf18...a9e3", ref: "S-101" },
  { id: "L-009", ts: "2026-10-05 11:20:44", feature: "Document", event: "Consultation_Data_Impact_Review_Draft.docx reviewed (3 gaps)", severity: "High", actor: "priya.nair", hash: "f6b390...2d77", ref: "DOC-003" },
  { id: "L-010", ts: "2026-10-05 09:38:12", feature: "Sandbox", event: "hr-app session: 1 warning (large file read)", severity: "Medium", actor: "system", hash: "08ad5e...c6b4", ref: "S-102" },
];

/* ============================================================
   DEFAULT EXPORT (agar ek hi object chahiye)
   ============================================================ */
export default { meta, severityColors, featureColors, dashboard, codeScan, documentReview, sandbox, auditLog };
