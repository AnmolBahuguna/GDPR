/**
 * AI ACCELERATOR SUITE: SHARED DUMMY DATA
 * ------------------------------------------------------------
 *
 * Import example:
 *   import { codeScan, documentReview, sandbox, dashboard, auditLog } from "./data/dummyData";
 *
 * Shared references (sab features me same):
 *   - App / repo name : "customer-portal"
 *   - Law labels      : "UK GDPR", "DPDPA 2023"
 *   - Severity values : "High" | "Medium" | "Low" | "Info" | "Critical"
 *   - Finding IDs (F-xxx) -> Action IDs (A-xxx) -> Audit log entries
 */

/* ============================================================
   0. SHARED CONSTANTS
   ============================================================ */
export const meta = {
  company: "Acme Ltd",
  currentUser: { name: "Rahul Sharma", role: "AI Engineering", email: "rahul@acme.com" },
  dpo: { name: "Priya Nair", email: "dpo@acme.com" },
  demoBanner: "Demo mode: all data is simulated. Not legal advice.",
  laws: ["UK GDPR", "DPDPA 2023"],
  applications: ["customer-portal", "billing-service", "hr-app"],
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
    reposScanned: 12,
    documentsFixed: 38,
    threatsBlocked: 7,
    complianceScore: 82,
  },
  scoreTrend: [
    { week: "W1", score: 54 },
    { week: "W2", score: 61 },
    { week: "W3", score: 68 },
    { week: "W4", score: 74 },
    { week: "W5", score: 79 },
    { week: "W6", score: 82 },
  ],
  issuesByCategory: [
    { name: "PII", count: 14 },
    { name: "Article 9", count: 6 },
    { name: "Retention", count: 9 },
    { name: "Consent", count: 7 },
    { name: "Transfers", count: 4 },
  ],
  recentActivity: [
    { time: "10 min ago", feature: "sandbox", text: "Bulk DB dump blocked on customer-portal (52,000 rows)" },
    { time: "1 hr ago", feature: "document", text: "Privacy_Policy_v3.pdf auto-fixed (5 gaps)" },
    { time: "3 hr ago", feature: "code", text: "acme/customer-portal scanned, 10 findings" },
    { time: "Yesterday", feature: "document", text: "Vendor DPA (CloudHost) reviewed, 4 gaps" },
    { time: "Yesterday", feature: "sandbox", text: "billing-service session completed, no threats" },
  ],
};

/* ============================================================
   2. FEATURE 1: CODE-TO-GDPR GENERATOR
   ============================================================ */
export const codeScan = {
  sampleRepos: [
    "https://github.com/acme/customer-portal",
    "https://github.com/acme/billing-service",
    "https://github.com/acme/hr-app",
  ],
  branches: ["main", "develop"],

  scanSteps: [
    "Cloning repository",
    "Parsing AST (routes, ORM models, APIs)",
    "Detecting personal data fields",
    "Mapping to UK GDPR / DPDPA rules",
    "Generating action list",
  ],

  result: {
    repo: "acme/customer-portal",
    branch: "main",
    filesScanned: 214,
    linesScanned: 18432,
    riskScore: 68,
    scannedAt: "2026-10-07 18:02",
    summary: { pii: 14, health: 3, credentials: 4, financial: 2 },

    // Data jo app collect kar rahi hai
    findings: [
      {
        id: "F-001", field: "aadhaar_number", file: "src/models/User.js", line: 24,
        category: "PII", country: "India", law: "DPDPA 2023", article9: false, severity: "High",
        snippet: "aadhaar_number: { type: String, required: true },",
        note: "Stored in plain text. Needs encryption and a stated purpose.",
        actionId: "A-001",
      },
      {
        id: "F-002", field: "pan_number", file: "src/models/User.js", line: 25,
        category: "PII", country: "India", law: "DPDPA 2023", article9: false, severity: "High",
        snippet: "pan_number: { type: String },",
        note: "Financial identifier with no masking in API responses.",
        actionId: "A-001",
      },
      {
        id: "F-003", field: "ni_number", file: "src/models/Employee.js", line: 18,
        category: "PII", country: "UK", law: "UK GDPR", article9: false, severity: "High",
        snippet: "ni_number: DataTypes.STRING,",
        note: "National Insurance number needs a documented lawful basis.",
        actionId: "A-004",
      },
      {
        id: "F-004", field: "medical_conditions", file: "src/routes/healthForm.js", line: 56,
        category: "Health", country: "UK", law: "UK GDPR Art. 9", article9: true, severity: "High",
        snippet: "const { medical_conditions } = req.body;",
        note: "Special category data collected without explicit consent.",
        actionId: "A-002",
      },
      {
        id: "F-005", field: "allergies", file: "src/routes/healthForm.js", line: 58,
        category: "Health", country: "UK", law: "UK GDPR Art. 9", article9: true, severity: "High",
        snippet: "const { allergies } = req.body;",
        note: "Special category data. Needs Art. 9(2) condition.",
        actionId: "A-002",
      },
      {
        id: "F-006", field: "password", file: "src/auth/login.js", line: 33,
        category: "Credentials", country: "UK", law: "UK GDPR Art. 32", article9: false, severity: "Medium",
        snippet: "db.save({ password: req.body.password });",
        note: "Password stored without hashing.",
        actionId: "A-003",
      },
      {
        id: "F-007", field: "api_secret", file: "src/config/payments.js", line: 9,
        category: "Credentials", country: "UK", law: "UK GDPR Art. 32", article9: false, severity: "Medium",
        snippet: "const API_SECRET = 'sk_live_51H8...';",
        note: "Hardcoded secret in source code.",
        actionId: "A-005",
      },
      {
        id: "F-008", field: "card_last4", file: "src/models/Payment.js", line: 14,
        category: "Financial", country: "UK", law: "UK GDPR", article9: false, severity: "Low",
        snippet: "card_last4: DataTypes.STRING(4),",
        note: "Low risk, but must be listed in RoPA.",
        actionId: "A-006",
      },
      {
        id: "F-009", field: "date_of_birth", file: "src/models/User.js", line: 27,
        category: "PII", country: "India", law: "DPDPA 2023 Sec. 9", article9: false, severity: "Medium",
        snippet: "date_of_birth: { type: Date },",
        note: "Used to detect minors. Parental consent flow missing.",
        actionId: "A-007",
      },
      {
        id: "F-010", field: "ip_address", file: "src/middleware/logger.js", line: 12,
        category: "PII", country: "UK", law: "UK GDPR", article9: false, severity: "Low",
        snippet: "logger.info({ ip: req.ip, path: req.path });",
        note: "IP is personal data. Define log retention.",
        actionId: "A-004",
      },
    ],

    // Generated statutory requirements
    requirements: {
      ukGdpr: [
        { ref: "Art. 6", title: "Lawful basis for processing", status: "Missing" },
        { ref: "Art. 9", title: "Explicit consent for health data", status: "Missing" },
        { ref: "Art. 13", title: "Privacy notice at collection", status: "Partial" },
        { ref: "Art. 30", title: "Records of Processing (RoPA)", status: "Missing" },
        { ref: "Art. 32", title: "Security of processing (encryption, hashing)", status: "Partial" },
        { ref: "Art. 33", title: "Breach notification within 72 hours", status: "Partial" },
        { ref: "Art. 35", title: "DPIA for high-risk processing", status: "Missing" },
      ],
      dpdpa: [
        { ref: "Sec. 5", title: "Notice before consent", status: "Missing" },
        { ref: "Sec. 6", title: "Free, specific, informed consent", status: "Partial" },
        { ref: "Sec. 8", title: "Data fiduciary obligations and security safeguards", status: "Partial" },
        { ref: "Sec. 9", title: "Children's data: verifiable parental consent", status: "Missing" },
        { ref: "Sec. 12", title: "Right to access and erasure", status: "Missing" },
      ],
    },

    // Developer ke liye to-do list
    actions: [
      { id: "A-001", priority: "High", task: "Encrypt aadhaar_number and pan_number at rest; mask in API output", file: "src/models/User.js", done: false },
      { id: "A-002", priority: "High", task: "Add explicit consent checkbox before health form is submitted", file: "src/routes/healthForm.js", done: false },
      { id: "A-003", priority: "High", task: "Hash passwords using bcrypt (cost 12)", file: "src/auth/login.js", done: false },
      { id: "A-004", priority: "Medium", task: "Document lawful basis and log retention for NI number and IP address", file: "docs/ropa.md", done: false },
      { id: "A-005", priority: "Medium", task: "Move API secrets to environment variables", file: "src/config/payments.js", done: false },
      { id: "A-006", priority: "Low", task: "Add card_last4 to Article 30 RoPA", file: "docs/ropa.md", done: false },
      { id: "A-007", priority: "Medium", task: "Add parental consent flow for users under 18", file: "src/routes/signup.js", done: false },
    ],

    fileTree: [
      { path: "src/models/User.js", findings: 3 },
      { path: "src/models/Employee.js", findings: 1 },
      { path: "src/models/Payment.js", findings: 1 },
      { path: "src/routes/healthForm.js", findings: 2 },
      { path: "src/auth/login.js", findings: 1 },
      { path: "src/config/payments.js", findings: 1 },
      { path: "src/middleware/logger.js", findings: 1 },
    ],
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
    "Estimating fine exposure",
    "Generating corrected version",
  ],

  // Upload ke baad in me se koi bhi dikha sakte ho
  documents: [
    {
      id: "DOC-001",
      fileName: "Privacy_Policy_v3.pdf",
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
        "1. Introduction\nAcme Ltd respects your privacy. This policy explains how we handle your information.",
        "2. Information We Collect\nWe may collect health information to improve our services.",
        "3. How Long We Keep Data\nWe keep your data for as long as necessary.",
        "4. Contact\nContact us for any privacy questions.",
        "5. Data Breaches\nWe will inform you if a breach happens.",
        "6. International Transfers\nYour data may be processed outside the UK.",
      ],
      issues: [
        {
          id: "D-001", severity: "High", title: "Missing Article 9 explicit consent",
          law: "UK GDPR Art. 9", section: "2. Information We Collect",
          original: "We may collect health information to improve our services.",
          fixed: "We collect health information only with your explicit consent, which you can withdraw at any time by contacting our Data Protection Officer.",
          status: "pending",
        },
        {
          id: "D-002", severity: "High", title: "Vague data retention period",
          law: "UK GDPR Art. 5(1)(e)", section: "3. How Long We Keep Data",
          original: "We keep your data for as long as necessary.",
          fixed: "We keep account data for 6 years after account closure and marketing data for 24 months after your last interaction with us.",
          status: "pending",
        },
        {
          id: "D-003", severity: "Medium", title: "Missing DPO contact details",
          law: "UK GDPR Art. 37", section: "4. Contact",
          original: "Contact us for any privacy questions.",
          fixed: "Contact our Data Protection Officer, Priya Nair, at dpo@acme.com or write to Acme Ltd, 10 Example Street, London.",
          status: "pending",
        },
        {
          id: "D-004", severity: "Medium", title: "No breach notification timeline",
          law: "UK GDPR Art. 33", section: "5. Data Breaches",
          original: "We will inform you if a breach happens.",
          fixed: "We will notify the ICO within 72 hours of becoming aware of a reportable breach, and affected individuals without undue delay.",
          status: "pending",
        },
        {
          id: "D-005", severity: "Low", title: "Cross-border transfer safeguards missing",
          law: "UK GDPR Ch. V / DPDPA Sec. 16", section: "6. International Transfers",
          original: "Your data may be processed outside the UK.",
          fixed: "Where data leaves the UK or India, we use approved safeguards such as the UK IDTA or Standard Contractual Clauses.",
          status: "pending",
        },
      ],
    },

    {
      id: "DOC-002",
      fileName: "Vendor_DPA_CloudHost.docx",
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
        "1. Scope\nThe Processor may process personal data on behalf of the Controller.",
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
          fixed: "At the end of the services, the Processor shall delete or return all personal data within 30 days and certify deletion in writing.",
          status: "pending",
        },
      ],
    },

    {
      id: "DOC-003",
      fileName: "DPIA_HealthModule_Draft.docx",
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
        "1. Description of Processing\nWe process patient health data in the new module.",
        "2. Necessity and Proportionality\nThe processing is needed for our business.",
        "3. Risks\nThere may be some risks to individuals.",
        "4. Mitigation\nWe will use good security.",
      ],
      issues: [
        {
          id: "D-201", severity: "High", title: "Necessity and proportionality not justified",
          law: "UK GDPR Art. 35(7)(b)", section: "2. Necessity and Proportionality",
          original: "The processing is needed for our business.",
          fixed: "Processing of health data is necessary to deliver the care-booking service. We collect only the minimum fields required and do not use the data for any secondary purpose.",
          status: "pending",
        },
        {
          id: "D-202", severity: "High", title: "Risks not specifically assessed",
          law: "UK GDPR Art. 35(7)(c)", section: "3. Risks",
          original: "There may be some risks to individuals.",
          fixed: "Identified risks: (1) unauthorised access to health records, (2) accidental disclosure, (3) excessive retention. Each is rated by likelihood and severity in Appendix A.",
          status: "pending",
        },
        {
          id: "D-203", severity: "Medium", title: "Mitigation measures are not specific",
          law: "UK GDPR Art. 35(7)(d)", section: "4. Mitigation",
          original: "We will use good security.",
          fixed: "Mitigations: AES-256 encryption at rest, role-based access control, access logging, and a 12-month retention limit.",
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
    applications: ["customer-portal", "billing-service", "hr-app"],
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
    { id: "E-03", t: 6, type: "db", level: "normal", text: "Query: SELECT * FROM users WHERE id=42", rows: 1 },
    { id: "E-04", t: 9, type: "network", level: "normal", text: "Outbound: api.stripe.com:443", ip: "52.1.10.5", port: 443, process: "node", status: "Allowed" },
    { id: "E-05", t: 14, type: "file", level: "warning", text: "File read: /app/exports/customers.csv" },
    { id: "E-06", t: 17, type: "db", level: "critical", text: "Query: SELECT * FROM customers", rows: 52000, alert: "Bulk database dump detected" },
    { id: "E-07", t: 19, type: "network", level: "critical", text: "Outbound: unknown host", ip: "185.220.101.45", port: 4444, process: "node", status: "Suspicious", alert: "Unknown destination socket" },
    { id: "E-08", t: 20, type: "network", level: "critical", text: "Upload 48 MB to 185.220.101.45", ip: "185.220.101.45", port: 4444, process: "node", status: "Suspicious", alert: "Possible data exfiltration" },
    { id: "E-09", t: 21, type: "killswitch", level: "blocked", text: "Firewall kill-switch triggered. Connection blocked." },
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
    app: "customer-portal",
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
    { id: "S-103", app: "customer-portal", startedAt: "2026-10-07 21:30", duration: "22 sec", result: "Blocked", threats: 3 },
  ],
};

/* ============================================================
   5. AUDIT LOG (teeno features ka combined history)
   ============================================================ */
export const auditLog = [
  { id: "L-001", ts: "2026-10-07 21:30:21", feature: "Sandbox", event: "Kill-switch triggered on customer-portal", severity: "Critical", actor: "system", hash: "a3f9c1...c21b", ref: "INC-2026-1007-01" },
  { id: "L-002", ts: "2026-10-07 21:30:17", feature: "Sandbox", event: "Bulk DB dump detected (52,000 rows)", severity: "Critical", actor: "system", hash: "b81e44...09de", ref: "T-01" },
  { id: "L-003", ts: "2026-10-07 20:15:40", feature: "Document", event: "Privacy_Policy_v3.pdf auto-fixed (5 gaps)", severity: "Info", actor: "rahul.sharma", hash: "7be214...90aa", ref: "DOC-001" },
  { id: "L-004", ts: "2026-10-07 20:10:02", feature: "Document", event: "Privacy_Policy_v3.pdf uploaded", severity: "Info", actor: "rahul.sharma", hash: "c45a10...77f1", ref: "DOC-001" },
  { id: "L-005", ts: "2026-10-07 18:02:05", feature: "Code", event: "Repo acme/customer-portal scanned (10 findings)", severity: "Info", actor: "rahul.sharma", hash: "1d88e0...f3c7", ref: "F-001" },
  { id: "L-006", ts: "2026-10-07 18:02:06", feature: "Code", event: "Article 9 data found in healthForm.js", severity: "High", actor: "system", hash: "9aa2b7...1c40", ref: "F-004" },
  { id: "L-007", ts: "2026-10-06 16:55:30", feature: "Document", event: "Vendor_DPA_CloudHost.docx reviewed (3 gaps)", severity: "Medium", actor: "priya.nair", hash: "e07d93...5b12", ref: "DOC-002" },
  { id: "L-008", ts: "2026-10-06 14:10:00", feature: "Sandbox", event: "billing-service session completed, no threats", severity: "Info", actor: "system", hash: "42cf18...a9e3", ref: "S-101" },
  { id: "L-009", ts: "2026-10-05 11:20:44", feature: "Document", event: "DPIA_HealthModule_Draft.docx reviewed (3 gaps)", severity: "High", actor: "priya.nair", hash: "f6b390...2d77", ref: "DOC-003" },
  { id: "L-010", ts: "2026-10-05 09:38:12", feature: "Sandbox", event: "hr-app session: 1 warning (large file read)", severity: "Medium", actor: "system", hash: "08ad5e...c6b4", ref: "S-102" },
];

/* ============================================================
   DEFAULT EXPORT (agar ek hi object chahiye)
   ============================================================ */
export default { meta, severityColors, featureColors, dashboard, codeScan, documentReview, sandbox, auditLog };

