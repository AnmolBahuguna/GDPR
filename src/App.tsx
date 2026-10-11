import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpenText,
  CheckCircle2,
  CreditCard,
  Download,
  FileSearch,
  FileText,
  Gauge,
  History,
  LogOut,
  LockKeyhole,
  Menu,
  Radar,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Siren,
  Sparkles,
  Upload,
  X,
  Clipboard,
  Fingerprint,
} from 'lucide-react';
import { useAppStore } from './store/appStore';
import { codeScan, documentReview, sandbox, dashboard } from './data/dummyData';
import { CodeToGdpr, DocumentReviewDemo, SandboxDemo } from './SpecDemo';
import { SpecAuditLog, SpecDashboard } from './SpecOverview';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Gauge, group: 'Overview' },
  { to: '/scanner', label: 'Code-to-GDPR', icon: Search, group: 'Features' },
  { to: '/documents', label: 'Document Review & Fix', icon: FileText, group: 'Features' },
  { to: '/runtime', label: 'VM Sandbox Monitor', icon: Siren, group: 'Features' },
  { to: '/ask-ai', label: 'AI Assistant', icon: Sparkles, group: 'Features' },
  { to: '/audit', label: 'Audit Log', icon: History, group: 'Security' },
  { to: '/subscription', label: 'Plans & Billing', icon: CreditCard, group: 'Billing' },
  { to: '/settings', label: 'Profile & Settings', icon: Settings, group: 'Account' },
];

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function AppShell() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/*"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace state={{ from: location.pathname }} />}
      />
    </Routes>
  );
}

function Layout() {
  const workspace = useAppStore((state) => state.workspace);
  const profile = useAppStore((state) => state.profile);
  const notifications = useAppStore((state) => state.notifications);
  const logout = useAppStore((state) => state.logout);
  const reset = useAppStore((state) => state.reset);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResults = navItems.filter((item) => item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
        window.requestAnimationFrame(() => searchInputRef.current?.focus());
      }
      if (event.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <div className={`app-shell ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
      {/* Mobile Sticky Header */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <img src="/logo.jpeg" alt="AI Accelerator Suite" className="brand-logo-image" />
          <span className="version-badge">v2.0</span>
        </div>
        <div className="mobile-header-actions">
          <button
            type="button"
            className="icon-button mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Backdrop for Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand-wrap">
          <img src="/logo.jpeg" alt="AI Accelerator Suite" className="brand-logo-image" />
          <span className="version-badge">v2.0</span>
        </div>

        <nav className="nav">
          {['Overview', 'Features', 'Security', 'Billing', 'Account'].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-heading">{group}</div>
              {navItems.filter((item) => item.group === group).map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-action" onClick={() => { reset(); setIsMobileMenuOpen(false); }}><RefreshCcw size={16} />Reset demo</button>
          <div className="sidebar-card">
            <div className="account-mark">{profile.name.slice(0, 1).toUpperCase()}</div>
            <div className="account-copy">
              <strong>ZenAuraa Marketplace</strong>
              <span>Enterprise Â· {workspace.user}</span>
              <small>{profile.role}</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div className={`search-box global-search ${isSearchOpen ? 'is-open' : ''}`}>
            <Search size={16} />
            <input ref={searchInputRef} role="combobox" aria-label="Search workspace pages" aria-expanded={isSearchOpen} aria-controls="workspace-search-results" placeholder="Search workspace pages..." value={searchQuery} onFocus={() => setIsSearchOpen(true)} onBlur={() => window.setTimeout(() => setIsSearchOpen(false), 120)} onChange={(event) => { setSearchQuery(event.target.value); setIsSearchOpen(true); }} onKeyDown={(event) => { if (event.key === 'Escape') setIsSearchOpen(false); if (event.key === 'Enter' && searchResults[0]) { navigate(searchResults[0].to); setSearchQuery(''); setIsSearchOpen(false); } }} />
            <kbd>Ctrl K</kbd>
            {isSearchOpen && <div className="global-search-results" id="workspace-search-results" role="listbox" aria-label="Workspace pages">
              {searchResults.length ? searchResults.map(({ to, label, group, icon: Icon }) => <NavLink key={to} to={to} role="option" onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}><Icon size={16} /><span>{label}</span><small>{group}</small></NavLink>) : <p>No matching workspace pages.</p>}
            </div>}
          </div>

          <div className="topbar-actions">
            <span className="workspace-pill">Demo data</span>
            <button type="button" className="primary-button top-scan" onClick={() => navigate('/')}>
              <FileSearch size={14} />Review GDPR data
            </button>
            <button type="button" className="icon-button" aria-label={`View ${notifications.length} notifications`} onClick={() => navigate('/')}>
              <Bell size={16} /><i>{notifications.length}</i>
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Logout"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <div className="content-inner">
          <Routes>
            <Route index element={<SpecDashboard />} />
            <Route path="/" element={<SpecDashboard />} />
            <Route path="/scanner" element={<CodeToGdpr />} />
            <Route path="/documents" element={<DocumentReviewDemo />} />
            <Route path="/runtime" element={<SandboxDemo />} />
            <Route path="/vdi" element={<VdiScreen />} />
            <Route path="/family-law" element={<FamilyLawScreen />} />
            <Route path="/comparison" element={<ComparisonScreen />} />
            <Route path="/subscription" element={<SubscriptionScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/audit" element={<SpecAuditLog />} />
            <Route path="/legacy/dashboard" element={<DashboardScreen />} />
            <Route path="/legacy/scanner" element={<ScannerScreen />} />
            <Route path="/legacy/documents" element={<DocumentsScreen />} />
            <Route path="/legacy/runtime" element={<RuntimeScreen />} />
            <Route path="/legacy/audit" element={<AuditScreen />} />
            <Route path="/compliance" element={<ComplianceScreen />} />
            <Route path="/reports" element={<ReportsScreen />} />
            <Route path="/ask-ai" element={<AssistantScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function DashboardScreen() {
  const navigate = useNavigate();
  const { workspace, findings, documents, auditLogs, reports, notifications } = useAppStore(useShallow((state) => ({
    workspace: state.workspace,
    findings: state.findings,
    documents: state.documents,
    auditLogs: state.auditLogs,
    reports: state.reports,
    notifications: state.notifications,
  })));

  const openFindings = findings.filter((item) => item.status !== 'Resolved').slice(0, 4);
  const reviewedCount = findings.filter((item) => item.status === 'Resolved').length;

  return (
    <div className="dashboard-grid">
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div>
          <div className="eyebrow">DEMO WORKSPACE Â· SEEDED REVIEW DATA</div>
          <h2>ZenAuraa marketplace risk posture</h2>
          <p>
            Preliminary privacy review for {workspace.project}. Findings are sample prompts based on the supplied source extract; they need confirmation against real systems and records.
          </p>
        </div>

        <div className="score-box"><div><div className="small-label">Assessment status</div><strong>Evidence review pending</strong><div className="score-caption">No compliance score calculated</div></div></div>
      </motion.section>

      <section className="summary-grid">
        <MetricCard icon={AlertTriangle} label="Open sample findings" value={String(findings.length - reviewedCount)} change="Needs evidence" accent="amber" />
        <MetricCard icon={CheckCircle2} label="Marked reviewed" value={String(reviewedCount)} change="Not independently verified" accent="indigo" />
        <MetricCard icon={BookOpenText} label="Documents in review" value={String(documents.length)} change="Sample workspace" accent="green" />
        <MetricCard icon={History} label="Seeded activity entries" value={String(auditLogs.length)} change="Illustrative history" accent="cyan" />
      </section>

      <section className="chart-panel card-panel">
        <div className="panel-header">
          <h3>Assessment basis</h3>
          <span className="status-badge warning">Preliminary</span>
        </div>
        <p className="assessment-basis-copy">Current review material: supplied public website extract, public practitioner directory fields, and seeded demo findings. Internal collection points, contracts, retention schedules, security controls, and rights-handling evidence have not been reviewed.</p>
      </section>

      <section className="card-panel findings-panel">
        <div className="panel-header">
          <h3>Priority findings</h3>
          <button type="button" className="link-button" onClick={() => navigate('/scanner')}>View all</button>
        </div>
        <div className="stack-list">
          {openFindings.map((finding) => (
            <div key={finding.id} className="list-row">
              <div className={`severity ${finding.severity.toLowerCase()}`} />
              <div className="list-copy">
                <strong>{finding.title}</strong>
                <span>Supplied source extract · unverified finding</span>
              </div>
              <span className="chip danger">{finding.severity}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card-panel documents-summary-panel">
        <div className="panel-header">
          <h3>Document actions</h3>
          <span className="status-badge warning">{documents.length} items</span>
        </div>
        <div className="stack-list compact">
          {documents.slice(0, 3).map((document) => (
            <div key={document.id} className="list-row">
              <div className="mini-icon"><BookOpenText size={14} /></div>
              <div className="list-copy">
                <strong>{document.title}</strong>
                <span>{document.section}</span>
              </div>
              <span className="chip neutral">{document.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card-panel full-row">
        <div className="panel-header">
          <h3>Recent activity</h3>
        </div>
        <div className="activity-list">
          {auditLogs.map((log) => (
            <div key={log.id} className="activity-item">
              <span className="dot" />
              <div>
                <strong>{log.action}</strong>
                <span>{log.module}</span>
              </div>
              <time>{log.time}</time>
            </div>
          ))}
        </div>
      </section>

      <section className="feature-grid full-row"><article className="card-panel feature-card"><h3>3-stage pipeline Â· demo status</h3><div className="pipeline-steps"><span>Ingestion <b>12 sources</b></span><span>AI Reasoning <b>8 findings</b></span><span>Remediation <b>5 actions</b></span></div></article><article className="card-panel feature-card"><h3>AI cost estimate</h3><strong className="cost-figure">Â£84</strong><p>Illustrative estimate this month Â· approximately Â£1K annualized.</p></article></section>

      <section className="card-panel full-row reports-panel">
        <div className="panel-header">
          <h3>Reports</h3>
        </div>
        <div className="report-grid">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <strong>{report.title}</strong>
                <span className={`report-status ${report.status.toLowerCase()}`}>{report.status}</span>
              </div>
              <div className="report-value">{report.value}</div>
              <small>{report.updated}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="card-panel toast-panel full-row">
        <div className="panel-header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-stack">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <div className="notification-icon"><Bell size={14} /></div>
              <div>
                <strong>{notification.title}</strong>
                <span>{notification.detail}</span>
              </div>
              <small>{notification.age}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScannerScreen() {
  const findings = useAppStore((state) => state.findings);
  const updateScore = useAppStore((state) => state.updateOverallScore);
  const [phase, setPhase] = useState('Detect');
  const [progress, setProgress] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  const runScan = () => {
    setIsRunning(true);
    setScanComplete(false);
    setPhase('Detect');
    setProgress(25);

    const steps = ['Detect', 'Understand', 'Fix', 'Verify'];
    let stepIndex = 0;

    const tick = () => {
      const nextPhase = steps[stepIndex];
      setPhase(nextPhase);
      setProgress((stepIndex + 1) * 25);
      stepIndex += 1;

      if (stepIndex < steps.length) {
        window.setTimeout(tick, 650);
        return;
      }

      setIsRunning(false);
      setScanComplete(true);
      updateScore(92);
      auditAction('Demo scan completed', 'Code Scanner');
    };

    window.setTimeout(tick, 500);
  };

  return (
    <div className="screen-layout">
      <section className="card-panel scanner-hero">
        <div>
          <div className="eyebrow">DEMO · PUBLIC-SOURCE SCREENING</div>
          <h2>ZenAuraa marketplace privacy screening</h2><p>Reviews the supplied public-page extract and seeded prompts only. No repository or production system is scanned.</p>
        </div>
        <button type="button" className="primary-button" onClick={runScan} disabled={isRunning}>
          {isRunning ? 'Preparing sample review…' : 'Run sample review'}
        </button>
      </section>

      <section className="card-panel scan-progress-panel">
        <div className="panel-header">
          <h3>Simulated review progress</h3>
          <span className="status-badge warning">{phase}</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="card-panel table-panel">
        <div className="panel-header">
          <h3>Seeded findings queue</h3>
          <span className="status-badge warning">{findings.length} total</span>
        </div>
        <div className="scan-table">
          {findings.map((finding) => (
            <div key={finding.id} className="scan-row">
              <div className="scan-check">
                {finding.status === 'Resolved' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              </div>
              <div className="scan-copy">
                <strong>{finding.title}</strong>
                <span>Supplied source extract · unverified finding</span>
              </div>
              <div className="scan-meta">
                <span className={`chip ${finding.severity.toLowerCase()}`}>{finding.severity}</span>
                <span>{finding.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {scanComplete && <><section className="card-panel feature-card"><h3>Observed fields and advertised features</h3><DataTable headers={['Public evidence','Source','Data category','Review note']} rows={[
        ['Practitioner name, photo, bio and specialties','Public practitioner listing','Professional profile data','Confirm controller, source, purpose, lawful basis and notice.'],
        ['Languages, experience and verification badge','Public practitioner listing','Professional profile data','Badge is visible; verification documents and process were not supplied.'],
        ['Rating, review count and consultation rate','Public practitioner listing','Marketplace metrics','Rate currency and internal use are not specified by the public response.'],
        ['Birth-chart readings','Service description only','Collection not verified','Actual fields, necessity and lawful basis require product-flow evidence.'],
        ['Chat and live consultations','Advertised feature only','Processing not verified','Recording, transcript, access and retention are unknown.'],
        ['Payments and account operations','Advertised claims only','Processing not verified','Provider, data fields and controller/processor roles are unknown.'],
      ]} /></section><section className="feature-grid"><div className="card-panel feature-card"><h3>Generated statutory requirements</h3><ul className="feature-list">{['UK GDPR Â· establish lawful basis for each processing purpose','UK GDPR provide a clear notice and purpose for birth details','UK GDPR Â· document retention and DPO contact','UK GDPR Â· assess cross-border safeguards and breach notification','India DPDP Â· record notice, consent and withdrawal process','India DPDP Â· define retention, grievance contact and breach notice'].map(x=><li key={x}><CheckCircle2 size={15}/>{x}</li>)}</ul></div><div className="card-panel feature-card"><h3>Developer compliance action list</h3>{['Record consent only where it is the chosen lawful basis','Document lawful basis and retention','Confirm privacy contact and whether a DPO is required','Review cross-border transfer safeguards','Define breach notification workflow'].map(x=><label className="action-check" key={x}><input type="checkbox" onChange={() => auditAction(`Scanner action updated: ${x}`,'Code Scanner')}/>{x}</label>)}<p><button className="secondary-button" onClick={() => downloadText('developer-actions.md','## Developer privacy review actions\n- [ ] Document an Article 6 basis for each purpose\n- [ ] Record consent only where it is the chosen basis\n- [ ] Document retention criteria and review triggers\n- [ ] Confirm privacy contact and DPO requirement\n- [ ] Review international transfer safeguards')}>Export Markdown</button> <button className="secondary-button" onClick={() => downloadCsv('developer-actions.csv',[['Action','Status'],['Document an Article 6 basis for each purpose','Open'],['Record consent only where it is the chosen basis','Open']])}>Export CSV</button></p></div></section></>}
    </div>
  );
}

function DocumentsScreen() {
  const documents = useAppStore((state) => state.documents);
  const updateDocumentStatus = useAppStore((state) => state.updateDocumentStatus);
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(documents[0]?.id ?? '');
  const [uploadName, setUploadName] = useState('');
  const [documentType, setDocumentType] = useState('Privacy Policy');
  const [generating, setGenerating] = useState(false);
  const selectedDocument = documents.find((document) => document.id === selectedId) ?? documents[0];
  const openCount = documents.filter((document) => document.status === 'Open').length;


  return (
    <div className="screen-layout document-intelligence-page">
      <section className="page-heading document-command">
        <div><div className="breadcrumb">Governance <span>/</span> Document Intelligence</div><h2>Document Intelligence</h2><p>Upload legal, data processing, and privacy documents. Demo review of a seeded sample document. Uploading a file only selects its name here; document text is not extracted or sent to a review service.</p></div>
        <div className="document-upload-actions">
          <button type="button" className="ghost-button" onClick={() => setUploadName('ZenAuraa_Privacy_Notice_v3.pdf')}><BookOpenText size={15} />Use demo policy</button>
          <label className="primary-button upload-button"><Upload size={15} />{uploadName ? 'Document selected' : 'Upload document'}<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setUploadName(event.target.files?.[0]?.name ?? '')} /></label>
        </div>
      </section>

      <section className="document-active-banner">
        <div className="document-file-icon"><FileText size={20} /></div>
        <div className="document-active-copy"><strong>{uploadName || 'ZenAuraa_Privacy_Notice_v3.pdf'}</strong><span>Seeded sample review Â· static demo document</span></div>
        <div className="document-active-meta"><span>No scan timestamp · static demo findings</span><span>Jurisdiction: applicability not confirmed</span></div>
        <button type="button" className="link-button document-controls-link" onClick={() => navigate('/compliance')}>View controls <ArrowUpRight size={13} /></button>
        <span className="status-badge warning">Review in progress</span>
      </section>
      <section className="card-panel feature-card document-type-row"><label>Document type <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}><option>Privacy Policy</option><option>Vendor DPA</option><option>DPIA draft</option></select></label><span className="status-badge warning">No fine estimate · applicability not established</span></section>

      <section className="document-kpi-grid">
        <article className="document-kpi"><div className="small-label">Seeded sample findings</div><strong className="document-kpi-value">{documents.length}</strong><span>Not generated from the selected upload</span></article>
        <article className="document-kpi"><div className="small-label">Open review items</div><strong className="document-kpi-value">{openCount}</strong><span>Demo triage state only</span></article>
        <article className="document-kpi"><div className="small-label">Suggested wording</div><strong className="document-kpi-value">Draft</strong><span>Controller and legal review required</span></article>
        <article className="document-kpi"><div className="small-label">Document extraction</div><strong className="document-kpi-value">Not connected</strong><span>File selection stays in this browser UI</span></article>
      </section>

      <div className="document-review-grid">
        <section className="card-panel clause-review-panel">
          <div className="panel-header"><div><div className="small-label">Clause 4.2 Â· Data governance</div><h3>Data Retention &amp; Storage Lifecycle</h3><span className="clause-meta">Section 04 Â· Lines 142â€“159</span></div><span className="chip high">High severity</span></div>
          <div className="clause-comparison">
            <article className="clause-column original-clause"><div className="clause-column-title"><span><FileText size={14} />Original document</span><span className="chip critical">Potential issue · review needed</span></div><div className="clause-quote">â€œ{selectedDocument?.original ?? 'Personal data and telemetry will be retained indefinitely or for as long as deemed necessary for business purposes.'}â€</div><div className="regulation-citation"><strong>Regulatory finding Â· UK GDPR Art. 5(1)(e)</strong><span>Personal data must be kept no longer than necessary. The retention period or criteria must be clear and defensible.</span></div></article>
            <article className="clause-column suggested-clause"><div className="clause-column-title"><span><Sparkles size={14} />Suggested review wording</span><span className="chip warning-chip">Needs legal review</span></div><div className="clause-quote">â€œ{selectedDocument?.suggested ?? 'Retention period or criteria: [controller to confirm from actual legal, service and operational needs].'}â€</div><div className="remediation-rationale"><strong>Review note</strong><span>Template wording only. Confirm facts and controller identity before publication.</span></div></article>
          </div>
          <div className="clause-action-bar"><span><Sparkles size={14} />Template suggestion · reviewer validation required</span><div><button className="ghost-button small" type="button" onClick={() => setSelectedId(documents[(documents.findIndex((item) => item.id === selectedId) + 1) % documents.length]?.id ?? selectedId)}><ArrowUpRight size={14} />Next finding</button><button className="primary-button" type="button" onClick={() => selectedDocument && updateDocumentStatus(selectedDocument.id, 'Accepted')} disabled={!selectedDocument || selectedDocument.status === 'Accepted'}><CheckCircle2 size={14} />{selectedDocument?.status === 'Accepted' ? 'Marked reviewed in demo' : 'Mark reviewed'}</button></div></div>
          <button className="primary-button" disabled={documents.some((item) => item.status === 'Open') || generating} onClick={() => {setGenerating(true);setTimeout(() => {downloadText('zenauraa-privacy-notice-review-template.txt',`${documentType}\n\nDRAFT REVIEW TEMPLATE â€” NOT AN APPROVED PRIVACY NOTICE\n\nController identity and address: [confirm]\nPurposes and Article 6 lawful basis for each purpose: [controller to confirm]\nData categories and collection points: [confirm from live product flows]\nRecipients and processor categories: [confirm]\nRetention periods or criteria: [confirm; do not invent]\nInternational transfers and applicable safeguards: [confirm if any]\nPrivacy contact and rights request route: [working contact to confirm]\nSpecial-category data: assess actual consultation content; if processed, document an Article 9 condition as well as an Article 6 basis.\n\nDo not publish until the controller validates every placeholder and obtains appropriate legal review.`);setGenerating(false);auditAction('Privacy notice review template generated','Documents')},1000)}}><Download size={15}/>{generating?'Generating review templateâ€¦':'Generate review template'}</button>
        </section>
        <aside className="document-side-column">
          <section className="card-panel document-findings"><div className="panel-header"><div><h3>Document findings</h3><span className="clause-meta">{openCount} clauses need review</span></div><span className="status-badge warning">{documents.length} items</span></div><div className="document-finding-list">{documents.map((document, index) => <button className={`document-finding ${selectedId === document.id ? 'selected' : ''}`} key={document.id} type="button" onClick={() => setSelectedId(document.id)}><span className={`severity ${index < 2 ? 'high' : 'medium'}`} /><span className="document-finding-copy"><strong>{document.title}</strong><small>{document.section}</small></span><span className={`chip ${document.status === 'Accepted' ? 'success-chip' : 'neutral'}`}>{document.status}</span></button>)}</div></section>
          <section className="card-panel version-panel"><div className="panel-header"><h3><History size={15} />Version history</h3><button className="icon-button" type="button" aria-label="View version history"><ArrowUpRight size={14} /></button></div><div className="version-timeline"><div className="version-item current"><i /><div><strong>v3 Â· Current review</strong><span>Today, 14:32 Â· AI analysis complete</span></div></div><div className="version-item"><i /><div><strong>v2 Â· Policy updated</strong><span>Oct 06, 2026 Â· Anmol</span></div></div><div className="version-item"><i /><div><strong>v1 Â· Original upload</strong><span>Sep 28, 2026 Â· PDF</span></div></div></div><button className="ghost-button version-export" type="button" onClick={() => downloadCsv('document-review-summary.csv', [['Document', 'Status', 'Section'], ...documents.map((document) => [document.title, document.status, document.section])])}><Download size={14} />Export review summary</button></section>
        </aside>
      </div>
    </div>
  );
}

function RuntimeScreen() {
  const runtimeEvents = useAppStore((state) => state.runtimeEvents);
  const addRuntimeEvent = useAppStore((state) => state.addRuntimeEvent);
  const [filter, setFilter] = useState('All');
  const [killSwitch, setKillSwitch] = useState(false);
  const [trace, setTrace] = useState<string[]>(['14:32:08 socket connect -> api.zenauraa.local:443','14:32:09 openat -> /srv/consultation-records/']);
  const [selectedId, setSelectedId] = useState(runtimeEvents[0]?.id ?? '');
  const [mitigated, setMitigated] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const filters = ['All', 'Critical', 'High', 'Suspicious', 'Normal'];
  const filteredEvents = runtimeEvents.filter((event) => filter === 'All' || (filter === 'Suspicious' ? event.severity === 'Medium' : filter === 'Normal' ? event.severity === 'Low' : event.severity === filter));
  const selectedEvent = runtimeEvents.find((event) => event.id === selectedId) ?? filteredEvents[0] ?? runtimeEvents[0];
  const setMitigation = () => {
    if (!selectedEvent) return;
    setMitigated((current) => current.includes(selectedEvent.id) ? current : [...current, selectedEvent.id]);
    setFeedback(`Isolation policy applied to ${selectedEvent.source}.`);
    auditAction('Runtime isolation applied', 'Runtime Security');
  };
  const simulateTheft = () => {
    const isolated = killSwitch;
    const event = { id: `RT-${Date.now()}`, title: 'Simulated bulk data theft', severity: 'Critical' as const, source: 'demo-vm-sandbox', status: isolated ? 'Blocked' as const : 'Open' as const, description: 'Scripted demo event: bulk database dump followed by outbound transfer to an unknown host.', timestamp: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    addRuntimeEvent(event); setSelectedId(event.id); setFilter('All'); setTrace((t) => [`${event.timestamp}: openat -> /srv/db/export.sql`,`${event.timestamp}: socket connect -> unknown.example:443`,...t].slice(0,8));
    setFeedback(isolated ? 'Firewall kill-switch isolated the simulated exfiltration event.' : 'Simulated theft event added to the feed.'); auditAction(isolated ? 'Exfiltration event auto-isolated' : 'Bulk data theft simulated', 'Runtime Security');
  };

  return <div className="screen-layout runtime-console-page">
    <section className="page-heading runtime-command"><div><div className="eyebrow">Protection active Â· Enclave Shield v4.2</div><h2>Runtime Security Console</h2><p>Monitor suspicious activity and contain data exfiltration across protected sessions.</p></div><button className="ghost-button" type="button" onClick={() => downloadCsv('runtime-security-snapshot.csv', [['Time', 'Event', 'Severity', 'Source', 'Status'], ...runtimeEvents.map((event) => [event.timestamp, event.title, event.severity, event.source, event.status])])}><Download size={15} />Export snapshot</button></section>
    <section className="runtime-kpi-grid"><article className="runtime-kpi"><span>Active sessions</span><strong>128</strong><small>+12 today Â· VDI protected</small></article><article className="runtime-kpi"><span>Events today</span><strong>1,842</strong><small><Activity size={13} />Live telemetry stream</small></article><article className="runtime-kpi"><span>Blocked threats</span><strong>17</strong><small>Auto-quarantined</small></article><article className="runtime-kpi urgent"><span>Critical incidents</span><strong>{runtimeEvents.filter((event) => event.severity === 'Critical').length}</strong><small>Immediate triage required</small></article></section>
    <section className="card-panel feature-card runtime-demo-controls"><label className="action-check"><input type="checkbox" checked={killSwitch} onChange={(e) => {setKillSwitch(e.target.checked);auditAction(`Firewall kill-switch ${e.target.checked?'enabled':'disabled'}`,'Runtime Security')}}/>Automated firewall kill-switch</label><button className="primary-button" onClick={simulateTheft}><Siren size={14}/>Simulate bulk data theft</button><h3>eBPF style sandbox trace Â· illustrative</h3>{trace.map((line,i)=><code key={`${line}-${i}`}>{line}</code>)}</section>
    {feedback && <div className="inline-feedback" role="status">{feedback}<button type="button" onClick={() => setFeedback('')} aria-label="Dismiss message"><X size={14} /></button></div>}
    <div className="runtime-console-grid"><section className="card-panel runtime-feed-panel"><div className="panel-header runtime-feed-header"><div><div className="eyebrow">Live security telemetry Â· audit v2.8</div><h3>Threat event stream</h3></div><span className="status-badge success"><i className="live-dot" />Streaming</span></div><div className="runtime-filter-list" role="tablist" aria-label="Filter runtime events">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} type="button">{item}{item === 'All' && <span>{runtimeEvents.length}</span>}</button>)}</div><div className="runtime-event-list">{filteredEvents.map((event) => <button type="button" key={event.id} onClick={() => setSelectedId(event.id)} className={`runtime-event-card ${selectedId === event.id ? 'selected' : ''}`}><div className="runtime-event-top"><span className={`event-level ${event.severity.toLowerCase()}`}>{event.severity === 'Medium' ? 'Suspicious' : event.severity === 'Low' ? 'Normal' : event.severity}</span><time>{event.timestamp} UTC</time></div><strong>{event.title}</strong><p>{event.description}</p><div className="runtime-event-meta"><span>{event.source}</span><span>{mitigated.includes(event.id) ? 'Isolated' : event.status}</span></div></button>)}</div>{filteredEvents.length === 0 && <div className="empty-state"><Siren size={20} /><strong>No events in this category.</strong></div>}</section>
      <aside className="card-panel incident-panel"><div className="panel-header"><div><div className="eyebrow">Incident investigation</div><h3>{selectedEvent?.title ?? 'Select an event'}</h3></div>{selectedEvent && <span className={`chip ${selectedEvent.severity.toLowerCase()}`}>{selectedEvent.severity}</span>}</div>{selectedEvent ? <><div className="forensic-visual"><div className="forensic-grid"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div><Radar size={30} /><strong>ENCLAVE</strong><small>Protected session snapshot</small></div></div><div className="incident-detail-grid"><div><span>Session / source</span><strong>{selectedEvent.source}</strong></div><div><span>Detected at</span><strong>{selectedEvent.timestamp} UTC</strong></div><div><span>Response state</span><strong>{mitigated.includes(selectedEvent.id) ? 'Isolated' : selectedEvent.status}</strong></div><div><span>Integrity</span><strong className="success-copy">Attested Â· SHA-256</strong></div></div><div className="risk-evaluation"><div><Sparkles size={15} /><strong>AI risk evaluation</strong><span>High confidence</span></div><p>{selectedEvent.description} The session is isolated from protected data while the security team reviews the evidence.</p></div><div className="incident-actions"><button className="primary-button" type="button" onClick={setMitigation} disabled={mitigated.includes(selectedEvent.id)}><ShieldCheck size={14} />{mitigated.includes(selectedEvent.id) ? 'Isolation applied' : 'Apply isolation'}</button><button className="ghost-button" type="button" onClick={() => setFeedback('Incident details copied to the review queue.')}><FileSearch size={14} />Escalate for review</button></div><div className="ledger-sync"><CheckCircle2 size={14} />Cryptographic ledger synchronized</div></> : <div className="empty-state">Choose a threat event to investigate.</div>}</aside></div>
  </div>;
}

function ComplianceScreen() {
  const findings = useAppStore((state) => state.findings);
  const toggleFindingStatus = useAppStore((state) => state.toggleFindingStatus);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [feedback, setFeedback] = useState('');
  const openCount = findings.filter((finding) => finding.status !== 'Resolved').length;
  const visibleFindings = findings.filter((finding) => filter === 'all' || (filter === 'open' ? finding.status !== 'Resolved' : finding.status === 'Resolved'));
  return <div className="screen-layout compliance-page">
    <section className="compliance-command"><div><div className="eyebrow">DEMO WORKSPACE Â· PRELIMINARY REVIEW</div><h2>Compliance Review</h2><p>Sample findings from a public source extract. Applicability and operational controls require confirmation from the controller and system owners.</p></div><div className="compliance-command-actions"><span className="status-badge warning">{openCount} findings need review</span><button className="primary-button" type="button" onClick={() => downloadCsv('sample-compliance-review.csv', [['Finding', 'Framework', 'Status', 'Severity', 'Source'], ...findings.map((finding) => [finding.title, finding.regulation, finding.status === 'Resolved' ? 'Marked reviewed in demo' : 'Open', finding.severity, finding.location])])}><FileText size={14} />Export review list</button></div></section>
    {feedback && <div className="inline-feedback" role="status">{feedback}<button type="button" onClick={() => setFeedback('')} aria-label="Dismiss message"><X size={14} /></button></div>}
    <section className="review-scope-grid"><article className="card-panel feature-card"><span className="small-label">EU / UK GDPR</span><h3>Applicability to confirm</h3><p>Establishment, location of individuals, and offering or monitoring criteria have not been assessed in this demo.</p></article><article className="card-panel feature-card"><span className="small-label">INDIA DPDP</span><h3>Not assessed</h3><p>No India-specific notice, consent, grievance, or operational evidence has been supplied for this sample review.</p></article><article className="card-panel feature-card"><span className="small-label">SECURITY CONTROLS</span><h3>Evidence not connected</h3><p>No production system integrations or verified technical-control evidence are connected.</p></article></section>
    <section className="card-panel controls-panel"><div className="controls-heading"><div><div className="eyebrow">Sample issue triage</div><h3>Findings and review notes</h3><p>Changing a status records a demo triage choice only. It does not verify a control or establish compliance.</p></div><span className="status-badge warning">{openCount} open</span></div><div className="control-tabs" role="tablist" aria-label="Filter findings"><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All findings <span>{findings.length}</span></button><button type="button" role="tab" aria-selected={filter === 'open'} className={filter === 'open' ? 'selected' : ''} onClick={() => setFilter('open')}>Open <span>{openCount}</span></button><button type="button" role="tab" aria-selected={filter === 'resolved'} className={filter === 'resolved' ? 'selected' : ''} onClick={() => setFilter('resolved')}>Marked reviewed <span>{findings.length - openCount}</span></button></div><div className="controls-table-wrap"><table className="controls-table"><thead><tr><th>Finding</th><th>Framework</th><th>Severity</th><th>Triage status</th><th>Sample source</th><th>Action</th></tr></thead><tbody>{visibleFindings.map((finding) => <tr key={finding.id}><td><strong>{finding.title}</strong><small>{finding.id}</small></td><td>{finding.regulation}</td><td><span className={`chip ${finding.severity.toLowerCase()}`}>{finding.severity}</span></td><td><span className={`chip ${finding.status === 'Resolved' ? 'neutral' : 'warning'}`}>{finding.status === 'Resolved' ? 'Marked reviewed' : 'Open'}</span></td><td><code>{finding.location}</code></td><td><button className="link-button" type="button" onClick={() => { toggleFindingStatus(finding.id); setFeedback(`${finding.id} demo triage status updated. Independently verify any real remediation.`); }}>{finding.status === 'Resolved' ? 'Reopen' : 'Mark reviewed'} <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div></section>
  </div>;
}

function AuditScreen() {
  const auditLogs = useAppStore((state) => state.auditLogs);
  const user = useAppStore((state) => state.workspace.user);
  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [query, setQuery] = useState('');
  const modules = ['All modules', ...Array.from(new Set(auditLogs.map((log) => log.module)))];
  const visibleLogs = auditLogs.filter((log) => (moduleFilter === 'All modules' || log.module === moduleFilter) && `${log.action} ${log.module} ${user}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="screen-layout audit-page">
    <section className="page-heading"><div><div className="eyebrow">DEMO WORKSPACE · SEEDED EVENTS</div><h2>Activity log</h2><p>Illustrative workspace history for code, document and runtime demos. This screen is not a tamper-proof audit ledger.</p></div><button className="primary-button" type="button" onClick={() => downloadCsv('sample-activity-log.csv', [['Time shown', 'Module', 'Actor', 'Event', 'Record type'], ...visibleLogs.map((log) => [log.time, log.module, user, log.action, 'Seeded demo event'])])}><Download size={15} />Export visible events</button></section>
    <div className="sd-draft-boundary"><strong>Sample activity only</strong><span>Events, actors and times are preloaded demo records. No cryptographic integrity verification, trusted timestamping or production event source is connected.</span></div>
    <section className="card-panel audit-records"><div className="audit-filter-bar"><label className="audit-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, action, or module" /></label><label className="audit-select-label"><span>Module</span><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>{modules.map((module) => <option key={module}>{module}</option>)}</select></label><button className="ghost-button small" type="button" onClick={() => { setQuery(''); setModuleFilter('All modules'); }}><X size={14} />Reset</button></div><div className="audit-table-wrap"><table className="lineage-table"><thead><tr><th>Time shown</th><th>Actor</th><th>Event</th><th>Module</th><th>Sample reference</th><th>Record status</th></tr></thead><tbody>{visibleLogs.map((log) => <tr key={log.id}><td><time>{log.time}</time><small>Seeded demo time</small></td><td><span className="actor-avatar">{user.slice(0, 2).toUpperCase()}</span><span>{user} · demo user</span></td><td><strong>{log.action}</strong></td><td><span className="module-tag">{log.module}</span></td><td><code>{log.id}</code></td><td><span className="status-badge warning">Illustrative</span></td></tr>)}</tbody></table>{visibleLogs.length === 0 && <div className="empty-state"><FileSearch size={22} /><strong>No sample events match these filters.</strong><span>Clear the search or choose another module.</span></div>}</div><div className="audit-table-footer"><span>Showing {visibleLogs.length} of {auditLogs.length} seeded events</span><span>Source <strong>Demo workspace data</strong></span></div></section>
  </div>;
}
function ReportsScreen() {
  const reports = useAppStore((state) => state.reports);
  const exportInventoryTemplate = () => downloadCsv('preliminary-processing-inventory-template.csv', [
    ['Activity', 'Data subjects', 'Data categories', 'Purpose', 'Article 6 basis', 'Article 9 condition if applicable', 'Recipients/processors', 'International transfers', 'Retention criteria', 'Security measures', 'Owner', 'Status'],
    ['To confirm with controller', 'Not provided', 'Public listing fields observed; internal data not verified', 'Not confirmed', 'Not assessed', 'Not assessed; only if special-category data is processed', 'Not provided', 'Not provided', 'Not provided', 'Not provided', 'Assign owner', 'Draft - evidence required'],
  ]);
  const exportDpiaScreen = () => downloadCsv('dpia-threshold-screening-template.csv', [
    ['Processing description', 'Nature/scope/context/purpose', 'High-risk criteria', 'Likelihood of harm', 'Severity of harm', 'Measures', 'DPIA decision', 'Approver', 'Date'],
    ['To be completed', 'Not provided', 'Not assessed', 'Not assessed', 'Not assessed', 'Not provided', 'Screening not completed', 'Assign controller owner', 'Not set'],
  ]);
  return <div className="screen-layout">
    <section className="page-heading"><div><div className="eyebrow">DEMO WORKSPACE - DRAFT OUTPUTS</div><h2>Privacy review documents</h2><p>Templates do not establish compliance. Complete them from verified data flows, controller evidence, contracts and system-owner input.</p></div><button className="primary-button" type="button" onClick={exportInventoryTemplate}><FileText size={15} />Export inventory template</button></section>
    <div className="sd-draft-boundary"><strong>Evidence required before use</strong><span>Public website data can identify visible fields and advertised services. It cannot confirm internal purposes, lawful bases, recipients, retention, security controls or actual consultation processing.</span></div>
    <section className="feature-grid"><article className="card-panel feature-card"><div className="panel-header"><div><h3>Processing inventory - draft</h3><p>Working notes to develop into the controller or processor's Article 30 record where required.</p></div><button className="secondary-button" onClick={exportInventoryTemplate}>Export CSV</button></div><DataTable headers={['Activity to map','Current public evidence','Required confirmation']} rows={[
      ['Practitioner marketplace profiles','Public listings include profile identifiers, professional details and marketplace status.','Controller and practitioner roles, purposes, Article 6 basis, notices, recipients, retention and security.'],
      ['Consultation and communications','Chat/live consultations are advertised; actual collection and storage were not inspected.','Inputs, recordings/transcripts, access, special-category data handling, lawful basis and retention.'],
      ['Payments and account operations','Payment methods are advertised; provider integration was not supplied.','Data fields, controller/processor roles, provider, legal/accounting retention and transfer locations.'],
    ]} /></article><article className="card-panel feature-card"><div className="panel-header"><div><h3>DPIA threshold screening - not completed</h3><p>The responsible controller must assess the planned processing context and risks to individuals.</p></div><button className="secondary-button" onClick={exportDpiaScreen}>Export screening template</button></div><DataTable headers={['Screening area','Current state']} rows={[
      ['Nature, scope, context and purpose','Not provided for internal processing.'],
      ['High-risk indicators','Not assessed against actual processing or applicable authority criteria.'],
      ['Likelihood and severity of harm','Not assessed.'],
      ['Mitigations and residual risk','Not assessed; no security or operational evidence connected.'],
      ['Decision and approval','Pending controller review; no DPIA conclusion recorded.'],
    ]} /></article></section>
    <section className="card-panel feature-card"><div className="panel-header"><div><h3>Demo workspace report list</h3><p>Seeded examples only. Draft means no validated report has been prepared.</p></div></div><div className="report-grid report-page-grid">{reports.map((report) => <article className="report-card" key={report.id}><div className="report-header"><strong>{report.title}</strong><span className={`report-status ${report.status.toLowerCase()}`}>{report.status}</span></div><div className="report-value">{report.value}</div><small>{report.updated}</small><button className="link-button" type="button" onClick={() => downloadCsv(`${report.id.toLowerCase()}-draft.csv`, [['Report', 'Status', 'Evidence status'], [report.title, report.status, report.value]])}>Export draft row <ArrowRight size={14} /></button></article>)}</div></section>
  </div>;
}
function AssistantScreen() {
  const location = useLocation();
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const findings = useAppStore((state) => state.findings);
  const documents = useAppStore((state) => state.documents);
  const runtimeEvents = useAppStore((state) => state.runtimeEvents);
  const workspace = useAppStore((state) => state.workspace);

  const sendMessage = async (message = question) => {
    const content = message.trim();
    if (!content || isLoading) return;
    const nextMessages = [...messages, { role: 'user' as const, content }];
    setQuestion('');
    setMessages(nextMessages);
    setIsLoading(true);
    setError('');
    const contextData = {
      currentScreen: location.pathname,
      workspace: { project: workspace.project, repo: workspace.repo, branch: workspace.branch },
      liveWorkspaceState: {
        findings: findings.slice(0, 8).map(({ id, title, severity, regulation, status }) => ({ id, title, severity, regulation, status })),
        documents: documents.slice(0, 6).map(({ id, title, status, section }) => ({ id, title, status, section })),
        runtimeEvents: runtimeEvents.slice(0, 6).map(({ id, title, severity, source, status }) => ({ id, title, severity, source, status })),
      },
      appFeatureData: {
        codeReview: {
          source: codeScan.result.repo,
          scope: 'Supplied ZenAuraa public-page evidence; no repository source code was scanned.',
          summary: codeScan.result.summary,
          findings: codeScan.result.findings.slice(0, 8).map(({ id, field, category, law, severity, note }) => ({ id, field, category, law, severity, note: note.slice(0, 180) })),
        },
        documentReviewSamples: documentReview.documents.map(({ id, fileName, issues }) => ({ id, fileName, issueTitles: issues.slice(0, 5).map(({ id: issueId, title, law }) => ({ id: issueId, title, law })) })),
        sandboxSimulation: { simulated: true, alerts: sandbox.alerts.slice(0, 5).map(({ id, title, severity }) => ({ id, title, severity })) },
        dashboard: dashboard.stats,
      },
    };
    const fullContext = JSON.stringify(contextData);
    const workspaceContext = fullContext.length <= 6000 ? fullContext : JSON.stringify({
      currentScreen: location.pathname,
      workspace: contextData.workspace,
      summary: {
        findingCount: findings.length,
        openFindingIds: findings.filter((item) => item.status !== 'Resolved').slice(0, 8).map((item) => item.id),
        documentCount: documents.length,
        runtimeEventCount: runtimeEvents.length,
        reviewFindingIds: codeScan.result.findings.map((item) => item.id),
        reviewSource: codeScan.result.repo,
      },
    });
    const compactContext = JSON.stringify({
      currentScreen: location.pathname,
      workspace: contextData.workspace,
      findingIds: findings.filter((item) => item.status !== 'Resolved').slice(0, 6).map((item) => ({ id: item.id, title: item.title, severity: item.severity })),
      reviewFindingIds: codeScan.result.findings.slice(0, 6).map((item) => ({ id: item.id, field: item.field, severity: item.severity, note: item.note.slice(0, 100) })),
      documentCount: documents.length,
      runtimeEventCount: runtimeEvents.length,
    });
    const recentMessages = nextMessages.slice(-4).map((item) => ({ ...item, content: item.content.slice(-3500) }));
    let chatPayload = { messages: recentMessages, context: workspaceContext };
    if (new TextEncoder().encode(JSON.stringify(chatPayload)).byteLength > 28_000) {
      chatPayload = { messages: nextMessages.slice(-2).map((item) => ({ ...item, content: item.content.slice(-3500) })), context: compactContext };
    }
    if (new TextEncoder().encode(JSON.stringify(chatPayload)).byteLength > 28_000) {
      chatPayload = { messages: [{ role: 'user' as const, content: content.slice(0, 1500) }], context: compactContext };
    }
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatPayload),
      });
      const responseText = await response.text();
      let result: { reply?: string; error?: string };
      try {
        result = JSON.parse(responseText) as { reply?: string; error?: string };
      } catch {
        if (response.status === 404) {
          throw new Error('The deployed chat API is missing. Redeploy with the Vercel api/chat function included.');
        }
        throw new Error(`Chat API returned a non-JSON response (HTTP ${response.status}). Confirm the Vercel function is deployed and try again.`);
      }
      if (!response.ok) throw new Error(response.status === 400 || response.status === 413 ? 'This chat request was too large. Shorten the question or start a fresh chat, then try again.' : result.error || 'The assistant could not answer. Please try again.');
      if (!result.reply) throw new Error('OpenRouter returned an empty response. Please try again.');
      setMessages([...nextMessages, { role: 'assistant', content: result.reply }]);
    } catch (requestError) {
      setMessages(messages);
      setQuestion(content);
      setError(requestError instanceof Error ? requestError.message : 'Chat request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="assistant-screen"><section className="assistant-card"><div className="assistant-icon"><Sparkles size={22} /></div><div className="eyebrow">AI compliance assistant Â· OpenRouter</div><h2>Ask your workspace</h2><p>Scan and ask about current workspace state plus code, document, and sandbox demo data.</p><button className="secondary-button" type="button" onClick={() => void sendMessage("Scan all data currently loaded in this app. Summarize the highest-risk findings, document gaps, and runtime threats. Cite relevant record IDs and recommend next steps. Clearly state this is a demo-data scan, not a source-code or production-system scan.")} disabled={isLoading}><Search size={15} />{isLoading ? "Scanning app data..." : "Scan app data"}</button>{messages.length > 0 && <div className="chat-history" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'user' ? 'You' : 'AI Assistant'}</span><p>{message.content}</p></div>)}{isLoading && <div className="chat-message assistant"><span>AI Assistant</span><p className="typing-indicator">Thinkingâ€¦</p></div>}</div>}<div className="assistant-input"><input maxLength={1500} aria-label="Ask the AI assistant" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void sendMessage(); }} disabled={isLoading} placeholder="e.g. What are our highest priority GDPR gaps?" /><button className="primary-button" type="button" onClick={() => void sendMessage()} disabled={isLoading || !question.trim()}><ArrowRight size={16} />{isLoading ? 'Thinking' : 'Ask'}</button></div>{error && <div role="alert" className="chat-error">{error}</div>}<div className="suggested-questions"><span>Try asking</span>{['Summarize critical findings', 'Which documents need review?', 'Show runtime threats'].map((prompt) => <button key={prompt} type="button" disabled={isLoading} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}</div></section></div>;
}

function auditAction(action: string, module: string) {
  useAppStore.setState((state) => ({ auditLogs: [{ id: `A-${Date.now()}`, action, module, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...state.auditLogs] }));
}

function downloadText(filename: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}

const piiPatterns = [
  { name: 'Birth location', regex: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, example: '1234 5678 9012', article9: false },
  { name: 'Consultation payment reference', regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g, example: 'ABCDE1234F', article9: false },
  { name: 'UK NI', regex: /\b[A-Z]{2}\d{6}[A-D]\b/gi, example: 'QQ123456C', article9: false },
  { name: 'Birth date and time', regex: /\b\d{3}[ -]?\d{3}[ -]?\d{4}\b/g, example: '943 476 5919', article9: true },
  { name: 'Email', regex: /\b[\w.+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, example: 'person@example.com', article9: false },
  { name: 'Phone', regex: /\b(?:\+?\d[\d ()-]{7,}\d)\b/g, example: '+44 7700 900123', article9: false },
];

function redactPii(text: string) {
  let value = text;
  piiPatterns.forEach(({ name, regex }) => {
    regex.lastIndex = 0;
    value = value.replace(regex, (match) => name === 'Birth location' ? `XXXX XXXX ${match.replace(/\D/g, '').slice(-4)}` : name === 'Consultation payment reference' ? `XXXXX${match.slice(-5)}` : name === 'UK NI' ? `XX******${match.slice(-1)}` : name === 'Birth date and time' ? `XXX XXX ${match.replace(/\D/g, '').slice(-4)}` : name === 'Email' ? 'redacted@example.com' : '[REDACTED PHONE]');
  });
  return value;
}

function VdiScreen() {
  const [source, setSource] = useState('Citrix');
  const [policy, setPolicy] = useState('Redact');
  const [text, setText] = useState('Birth location 1234 5678 9012, Consultation payment reference ABCDE1234F, NI QQ123456C, NHS 943 476 5919, email alex@example.com');
  const [output, setOutput] = useState('');
  const [counts, setCounts] = useState({ clipboard: 0, redactions: 0, blocked: 0 });
  const [events, setEvents] = useState<string[][]>([]);
  const handleCopy = () => {
    const result = policy === 'Block' && piiPatterns.some(({ regex }) => { regex.lastIndex = 0; return regex.test(text); }) ? '[Copy blocked by policy]' : policy === 'Redact' ? redactPii(text) : text;
    const types = piiPatterns.filter(({ regex }) => { regex.lastIndex = 0; return regex.test(text); }).map(({ name }) => name).join(', ') || 'None';
    setOutput(result); setCounts((c) => ({ clipboard: c.clipboard + 1, redactions: c.redactions + (result !== text && !result.startsWith('[Copy blocked') ? 1 : 0), blocked: c.blocked + (result.startsWith('[Copy blocked') ? 1 : 0) }));
    setEvents((rows) => [[new Date().toLocaleTimeString(), 'Anmol', 'VDI-07', types, result.startsWith('[Copy blocked') ? 'Blocked' : result === text ? 'Allowed' : 'Redacted'], ...rows]);
    auditAction(result.startsWith('[Copy blocked') ? 'Clipboard copy blocked' : result === text ? 'Clipboard copy allowed' : 'Clipboard redacted', 'VDI Protection');
  };
  return <PageShell eyebrow="Privacy Â· Endpoint controls" title="VDI Protection" description="Demonstrate policy based protection for text copied from virtual desktop sessions.">
    <div className="feature-stats"><MetricCard icon={Clipboard} label="Clipboard events" value={`${counts.clipboard}`} change="This session" accent="indigo"/><MetricCard icon={Fingerprint} label="Redactions" value={`${counts.redactions}`} change="PII masked" accent="green"/><MetricCard icon={ShieldCheck} label="Blocked leaks" value={`${counts.blocked}`} change="Policy enforced" accent="amber"/></div>
    <div className="feature-grid"><section className="card-panel feature-card"><h3>Active sessions</h3><label>Session source <select value={source} onChange={(e) => setSource(e.target.value)}><option>Citrix</option><option>Azure Virtual Desktop</option><option>VMware</option></select></label><div className="data-table-wrap"><table><thead><tr><th>User</th><th>Session</th><th>Source</th><th>Policy</th></tr></thead><tbody>{['Anmol Â· VDI-07','Priya Â· VDI-12','Jordan Â· VDI-18','Maya Â· VDI-22'].map((x) => <tr key={x}><td>{x.split(' Â· ')[0]}</td><td>{x.split(' Â· ')[1]}</td><td><span className="status-badge success">{source}</span></td><td><select value={policy} onChange={(e) => setPolicy(e.target.value)}><option>Allow</option><option>Redact</option><option>Block</option></select></td></tr>)}</tbody></table></div></section>
    <section className="card-panel feature-card"><h3>Clipboard protection demo</h3><p>Paste text to preview the session policy outcome. Processing stays in this browser.</p><textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}/><button className="primary-button" onClick={handleCopy}><Clipboard size={15}/>Copy to local machine</button>{output && <div className="compare-box"><div><b>Original</b><p>{text}</p></div><div><b>Policy output</b><p>{output}</p></div></div>}</section></div>
    <section className="card-panel feature-card"><h3>PII classifier</h3><div className="pii-grid">{piiPatterns.map((p) => <div key={p.name}><b>{p.name}</b><small>{p.example}</small>{p.article9 && <span className="status-badge warning">Article 9</span>}</div>)}</div></section>
    <section className="card-panel feature-card"><h3>Clipboard event log</h3><DataTable headers={['Time','User','Session','PII types found','Action taken']} rows={events}/></section>
  </PageShell>;
}

function FamilyLawScreen() {
  const [tab, setTab] = useState('Form E Ingestion'); const [file, setFile] = useState(''); const [processed, setProcessed] = useState(false); const [signed, setSigned] = useState(false); const [pension, setPension] = useState(240000); const [equity, setEquity] = useState(520000); const [needs, setNeeds] = useState(360000);
  const tabs = ['Form E Ingestion','Bank Audit','Section 25 Modeler','Asset Schedule'];
  const bankRows = [['12 Jan','Salary credit','Â£4,850','Routine'],['22 Feb','Transfer to overseas account','Â£18,000','Offshore account'],['04 Mar','Cash withdrawal','Â£9,500','Large withdrawal'],['11 Apr','Transfer','Â£25,000','Round sum transfer'],['02 May','Savings transfer','Â£12,000','Unexplained transfer'],['18 Jun','Declared savings mismatch','Â£31,000','Mismatch vs Form E']];
  const rows = [['Family home equity','Â£520,000'],['Pension CETV','Â£240,000'],['Savings and investments','Â£86,500'],['Liabilities','-Â£42,000']];
  const amount = 846500; const low = Math.round((pension + equity + needs) * .4); const high = Math.round((pension + equity + needs) * .55);
  return <PageShell eyebrow="Legal Â· Phase 2 demo" title="Family Law" description="Financial disclosure review and settlement decision support."><div className="notice-banner">Decision support for lawyers, not legal advice. Illustrative data only.</div><div className="feature-tabs">{tabs.map((t) => <button className={tab===t?'selected':''} key={t} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab==='Form E Ingestion' && <section className="card-panel feature-card"><h3>Form E ingestion</h3><label className="upload-button"><Upload size={16}/>Upload Form E<input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {setFile(e.target.files?.[0]?.name || '');setProcessed(false)}}/></label>{file && <p>Selected: {file} <button className="primary-button" onClick={() => setTimeout(() => setProcessed(true), 900)}>Process 50 pages</button></p>}{processed && <><div className="status-badge success">Processing complete Â· 50 pages</div><DataTable headers={['Extracted field','Value','Confidence']} rows={ [['Annual income','Â£78,400','98%'],['Property','Family home Â· Â£720,000','94%'],['Pensions','Â£240,000 CETV','91%'],['Bank accounts','3 accounts Â· Â£46,500','89%'],['Liabilities','Mortgage Â£200,000','93%']]} /></>}</section>}
    {tab==='Bank Audit' && <section className="card-panel feature-card"><h3>12 month transaction audit</h3><DataTable headers={['Date','Transaction','Amount','Finding']} rows={bankRows.map((r) => [...r.slice(0,3), <span className={r[3]==='Routine'?'status-badge success':'status-badge warning'} key={r[3]}>{r[3]}</span>])}/></section>}
    {tab==='Section 25 Modeler' && <section className="card-panel feature-card"><h3>Matrimonial Causes Act 1973 Â· Section 25</h3>{[['Pension CETV',pension,setPension],['Property equity',equity,setEquity],['Needs estimate',needs,setNeeds]].map(([label,value,setter]) => <label className="model-input" key={String(label)}>{String(label)}<input type="number" value={Number(value)} onChange={(e) => (setter as (n:number)=>void)(Number(e.target.value))}/></label>)}<div className="settlement-result">Illustrative settlement bracket <strong>Â£{low.toLocaleString()} â€“ Â£{high.toLocaleString()}</strong></div><p>Assumptions: equal sharing considered; needs and contributions weighed; tax and liquidity not modeled.</p></section>}
    {tab==='Asset Schedule' && <section className="card-panel feature-card"><h3>Draft asset schedule</h3><DataTable headers={['Asset','Value']} rows={rows}/><b>Net illustrative assets: Â£{amount.toLocaleString()}</b><p><button className="primary-button" onClick={() => {downloadCsv('asset-schedule.csv',[['Asset','Value'],...rows,['Total',`Â£${amount.toLocaleString()}`]]);auditAction('Asset schedule exported','Family Law')}}><Download size={15}/>Export court-ready schedule</button> <button className="secondary-button" onClick={() => {setSigned(true);auditAction('Lawyer sign-off recorded','Family Law')}}>{signed?'Signed':'Lawyer sign-off'}</button></p>{signed && <span className="status-badge success">Signed for demo</span>}</section>}
  </PageShell>;
}

function ComparisonScreen() {
  const rows = [['OneTrust','Â£Â£Â£Â£','Complex enterprise suite','Unified privacy, security and legal workflows'],['Sprinto / Vanta','Â£Â£Â£','Compliance automation focus','Code to policy traceability'],['iubenda / CookieYes','Â£','Cookie and website notices','Runtime and developer remediation'],['Settify / Amicable','Â£Â£','Family law workflow focus','Connected privacy and disclosure tools'],['AI Accelerator','Â£Â£','Demo estimate','Cross-track AI assisted workflow']];
  return <PageShell eyebrow="Market landscape" title="Industry comparison" description="Illustrative positioning from the executive proposal. Costs are directional, not vendor quotes."><section className="card-panel feature-card"><h3>Capability and cost overview</h3><DataTable headers={['Platform','Relative cost','Typical gap','AI Accelerator advantage']} rows={rows}/><div className="cost-bars">{[['OneTrust',90],['Sprinto / Vanta',65],['iubenda / CookieYes',25],['Settify / Amicable',45],['AI Accelerator',48]].map(([name,n])=><div key={String(name)}><span>{String(name)}</span><i><b style={{width:`${n}%`}}/></i></div>)}</div></section></PageShell>;
}

function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const plans = [
    { name: 'Weekly', price: 'Â£9.99', period: '/ week', detail: 'Flexible access for short projects', tag: 'Weekly billing' },
    { name: 'Monthly', price: 'Â£29.99', period: '/ month', detail: 'A balanced plan for ongoing teams', tag: 'Most popular' },
    { name: 'Yearly', price: 'Â£299.99', period: '/ year', detail: 'Best value for long-term use', tag: 'Save about 17%' },
  ];
  const included = ['Code-to-GDPR scans', 'Document review and fixes', 'Runtime sandbox monitoring', 'AI Assistant workspace access', 'Audit history and CSV exports'];

  return <PageShell eyebrow="Workspace billing" title="Plans & Billing" description="Choose a subscription cadence that fits your team. Prices shown are illustrative demo values.">
    <div className="subscription-notice"><CreditCard size={17}/><span><strong>Demo subscription page</strong><small>Plan selection is a preview only. No payment method is collected and no charge is made.</small></span><span className="subscription-current">Current: Free demo</span></div>
    <section className="subscription-grid" aria-label="Subscription billing options">
      {plans.map((plan) => <article className={`card-panel subscription-card ${plan.name === 'Monthly' ? 'recommended' : ''}`} key={plan.name}>
        <div className="subscription-card-top"><span className="subscription-cadence">{plan.name}</span><span className={`subscription-tag ${plan.name === 'Monthly' ? 'popular' : ''}`}>{plan.tag}</span></div>
        <p className="subscription-detail">{plan.detail}</p>
        <div className="subscription-price"><strong>{plan.price}</strong><span>{plan.period}</span></div>
        <div className="subscription-divider" />
        <p className="subscription-includes">Everything included</p>
        <ul>{included.map((feature) => <li key={feature}><CheckCircle2 size={15}/>{feature}</li>)}</ul>
        <button className={selectedPlan === plan.name ? 'secondary-button subscription-selected' : 'primary-button subscription-choose'} type="button" onClick={() => setSelectedPlan(plan.name)}>
          {selectedPlan === plan.name ? <><CheckCircle2 size={15}/>Selected for demo</> : `Choose ${plan.name.toLowerCase()}`}
        </button>
      </article>)}
    </section>
    <section className="card-panel subscription-faq"><div><span className="eyebrow">Plan details</span><h2>One workspace, every core feature</h2><p>Weekly, monthly, and yearly options include the same demo feature set. Only the billing period and illustrative price differ.</p></div><div className="subscription-feature-pills">{included.map((feature) => <span key={feature}><CheckCircle2 size={14}/>{feature}</span>)}</div></section>
  </PageShell>;
}

function SettingsScreen() {
  const profile = useAppStore((state) => state.profile);
  const workspace = useAppStore((state) => state.workspace);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [saved, setSaved] = useState(false);

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    updateProfile({ name: cleanName, role });
    setName(cleanName);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return <PageShell eyebrow="Account" title="Profile & Settings" description="Manage the basic profile shown in your AI Accelerator workspace.">
    <div className="settings-layout">
      <form className="card-panel settings-profile-card" onSubmit={saveProfile}>
        <div className="settings-section-heading"><div className="settings-avatar">{name.trim().slice(0, 1).toUpperCase() || 'U'}</div><div><h2>Your profile</h2><p>These details are stored in this demo workspace.</p></div></div>
        <label className="settings-field">Display name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} required placeholder="Your name" /></label>
        <label className="settings-field">Workspace role<select value={role} onChange={(event) => setRole(event.target.value)}><option>Marketplace Operations</option><option>Security Analyst</option><option>Privacy Officer</option><option>Developer</option><option>Workspace Admin</option></select></label>
        <div className="settings-workspace"><span>Workspace</span><strong>{workspace.project}</strong><small>Profile changes update the account label in the sidebar.</small></div>
        <div className="settings-save-row"><span role="status">{saved ? 'Profile saved' : 'Demo profile Â· local workspace only'}</span><button className="primary-button" type="submit"><CheckCircle2 size={15}/>{saved ? 'Saved' : 'Save profile'}</button></div>
      </form>
      <aside className="card-panel settings-info-card"><div className="settings-info-icon"><Settings size={18}/></div><h2>Workspace settings</h2><p>Authentication, billing, and integrations are demo-only in this frontend.</p><div className="settings-info-row"><span>Account access</span><strong>Demo session</strong></div><div className="settings-info-row"><span>Subscription</span><strong>Free demo</strong></div><div className="settings-info-row"><span>AI provider</span><strong>OpenRouter</strong></div><small>Changes on this page do not modify your sign-in credentials or subscription.</small></aside>
    </div>
  </PageShell>;
}

function PageShell({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children:React.ReactNode}) { return <div className="feature-page"><div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><span className="status-badge warning">Demo data</span></div>{children}</div>; }
function DataTable({headers,rows}:{headers:string[];rows:(string|React.ReactNode)[][]}) { return <div className="data-table-wrap"><table><thead><tr>{headers.map((h)=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table>{rows.length===0&&<p className="empty-state">No events recorded yet.</p>}</div>; }

function LoginScreen() {
  const login = useAppStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="login-screen login-reference-layout">
      <section className="login-brand-panel"><div className="login-brand"><img src="/logo.jpeg" alt="AI Accelerator Suite" className="login-brand-logo" /><span>Privacy review demo</span></div><div className="login-brand-copy"><span className="login-kicker"><i className="live-dot" />Demo workspace access</span><h1>Intelligent compliance.<br /><em>Automated protection.</em></h1><p>Review public evidence, track open questions and prepare draft remediation notes for controller review.</p><div className="login-feature-list"><article><span><Search size={17} /></span><div><strong>Code-to-GDPR scanner</strong><small>Screen supplied source snippets for personal-data indicators.</small></div></article><article><span><BookOpenText size={17} /></span><div><strong>Document intelligence</strong><small>Compare sample policy clauses with review prompts.</small></div></article><article><span><ShieldCheck size={17} /></span><div><strong>Runtime security guard</strong><small>Explore a simulated security incident workflow.</small></div></article></div><div className="login-telemetry"><div><span>Workspace mode</span><strong>Demo</strong></div><div className="telemetry-spark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><span>Sample workspace · no production telemetry connected</span></div><div className="login-brand-footer"><LockKeyhole size={14} /> Demo interface only · no production identity or security controls connected</div></div></section>
      <section className="login-auth-panel"><div className="login-auth-card"><div className="login-auth-heading"><span className="small-label">Demo workspace access</span><h2>Demo workspace</h2><p>Open a seeded demo workspace. This screen does not authenticate credentials.</p></div><button type="button" className="demo-launch-card" onClick={handleLogin}><span className="demo-rocket"><ArrowUpRight size={18} /></span><span><strong>Explore interactive demo</strong><small>Open the workspace with preloaded ZenAuraa marketplace data.</small></span><ArrowRight size={17} /></button><div className="login-security-note"><ShieldCheck size={15} /><span><strong>ZenAuraa sample workspace</strong><small>Demo session · no production identity provider connected</small></span></div></div></section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  change,
  accent,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  change: string;
  accent: 'indigo' | 'cyan' | 'amber' | 'green';
}) {
  return (
    <div className={`metric-card ${accent}`}>
      <div className="metric-icon">
        <Icon size={18} />
      </div>
      <div>
        <div className="small-label">{label}</div>
        <div className="metric-value">{value}</div>
      </div>
      <span className="metric-change">{change}</span>
    </div>
  );
}

export default App;

