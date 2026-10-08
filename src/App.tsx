import { useMemo, useState } from 'react';
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
  Clock3,
  Database,
  Download,
  FileSearch,
  FileText,
  Gauge,
  History,
  LogOut,
  LockKeyhole,
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <img src="/logo.jpeg" alt="AI Accelerator Suite" className="brand-logo-image" />
          <span className="version-badge">v2.0</span>
        </div>

        <nav className="nav">
          {['Overview', 'Features', 'Security', 'Billing', 'Account'].map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-heading">{group}</div>
              {navItems.filter((item) => item.group === group).map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-action" onClick={() => reset()}><RefreshCcw size={16} />Reset demo</button>
          <div className="sidebar-card">
            <div className="account-mark">{profile.name.slice(0, 1).toUpperCase()}</div><div className="account-copy"><strong>Acme Technologies</strong><span>Enterprise · {workspace.user}</span><small>{profile.role}</small></div>
          </div>
        </div>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div className="search-box"><Search size={16} /><input aria-label="Search workspace" placeholder="Search findings, documents, sessions..." /><kbd>⌘ K</kbd></div>

          <div className="topbar-actions">
            <span className="workspace-pill">Demo data</span>
            <button type="button" className="primary-button top-scan" onClick={() => navigate('/scanner')}><RefreshCcw size={14} />Run New Scan</button>
            <button type="button" className="icon-button" aria-label={`View ${notifications.length} notifications`} onClick={() => navigate('/')}><Bell size={16} /><i>{notifications.length}</i></button>
            <button
              type="button"
              className="icon-button"
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

  const chartData = useMemo(
    () => [
      { name: 'GDPR', score: workspace.gdpr },
      { name: 'DPDP', score: workspace.dpdp },
      { name: 'Security', score: workspace.security },
      { name: 'Docs', score: workspace.documentation },
    ],
    [workspace],
  );

  const openFindings = findings.filter((item) => item.status !== 'Resolved').slice(0, 4);

  return (
    <div className="dashboard-grid">
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="hero-panel">
        <div>
          <div className="eyebrow">Workspace status</div>
          <h2>HealthHub risk posture</h2>
          <p>
            Detect → Understand → Fix → Verify. The current workflow is active across the compliance surface and runtime review pipeline.
          </p>
        </div>

        <div className="score-box">
          <div className="score-ring">
            <span>{workspace.overallScore}</span>
          </div>
          <div>
            <div className="small-label">Overall score</div>
            <div className="score-caption">Target: 92+</div>
          </div>
        </div>
      </motion.section>

      <section className="summary-grid">
        <MetricCard icon={ShieldCheck} label="GDPR" value={`${workspace.gdpr}%`} change="+6%" accent="indigo" />
        <MetricCard icon={Database} label="DPDP" value={`${workspace.dpdp}%`} change="+4%" accent="cyan" />
        <MetricCard icon={Radar} label="Security" value={`${workspace.security}%`} change="+8%" accent="amber" />
        <MetricCard icon={BookOpenText} label="Docs" value={`${workspace.documentation}%`} change="+3%" accent="green" />
      </section>

      <section className="chart-panel card-panel">
        <div className="panel-header">
          <h3>Compliance coverage</h3>
          <span className="status-badge success">Stable</span>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillScore" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#dfe4ef" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} fill="url(#fillScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
                <span>{finding.location}</span>
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

      <section className="feature-grid full-row"><article className="card-panel feature-card"><h3>3-stage pipeline · demo status</h3><div className="pipeline-steps"><span>Ingestion <b>12 sources</b></span><span>AI Reasoning <b>8 findings</b></span><span>Remediation <b>5 actions</b></span></div></article><article className="card-panel feature-card"><h3>AI cost estimate</h3><strong className="cost-figure">£84</strong><p>Illustrative estimate this month · approximately £1K annualized.</p></article></section>

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
          <div className="eyebrow">Repository scan</div>
          <h2>HealthHub security posture</h2>
        </div>
        <button type="button" className="primary-button" onClick={runScan} disabled={isRunning}>
          {isRunning ? 'Running scan…' : 'Run scan'}
        </button>
      </section>

      <section className="card-panel scan-progress-panel">
        <div className="panel-header">
          <h3>Scan flow</h3>
          <span className="status-badge success">{phase}</span>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="card-panel table-panel">
        <div className="panel-header">
          <h3>Findings queue</h3>
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
                <span>{finding.location}</span>
              </div>
              <div className="scan-meta">
                <span className={`chip ${finding.severity.toLowerCase()}`}>{finding.severity}</span>
                <span>{finding.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {scanComplete && <><section className="card-panel feature-card"><h3>Detected data map</h3><DataTable headers={['Data field','File · line','Category','Regulatory note']} rows={[
        ['Email','src/api/patient.ts:18','Personal data','UK GDPR / DPDP'],['Phone','src/api/patient.ts:21','Personal data','UK GDPR / DPDP'],['Aadhaar','src/identity/verify.ts:44','Government identifier','India DPDP'],['PAN','src/billing/tax.ts:12','Government identifier','India DPDP'],['NI number','src/identity/uk.ts:31','Government identifier','UK GDPR'],['NHS number','src/health/patient.ts:16','Health data · Article 9','Special category'],['Diagnosis','src/health/record.ts:63','Health data · Article 9','Special category'],['Password hash','src/auth/session.ts:28','Credential','Security control']]} /></section><section className="feature-grid"><div className="card-panel feature-card"><h3>Generated statutory requirements</h3><ul className="feature-list">{['UK GDPR · establish lawful basis for each processing purpose','UK GDPR Article 9 · obtain explicit condition for health data','UK GDPR · document retention and DPO contact','UK GDPR · assess cross-border safeguards and breach notification','India DPDP · record notice, consent and withdrawal process','India DPDP · define retention, grievance contact and breach notice'].map(x=><li key={x}><CheckCircle2 size={15}/>{x}</li>)}</ul></div><div className="card-panel feature-card"><h3>Developer compliance action list</h3>{['Add explicit health-data consent','Document lawful basis and retention','Add DPO and grievance contact','Review cross-border transfer safeguards','Define breach notification workflow'].map(x=><label className="action-check" key={x}><input type="checkbox" onChange={() => auditAction(`Scanner action updated: ${x}`,'Code Scanner')}/>{x}</label>)}<p><button className="secondary-button" onClick={() => downloadText('developer-actions.md','## Developer compliance actions\n- [ ] Add explicit health-data consent\n- [ ] Document lawful basis and retention\n- [ ] Add DPO and grievance contact\n- [ ] Review cross-border safeguards\n- [ ] Define breach notification workflow')}>Export Markdown</button> <button className="secondary-button" onClick={() => downloadCsv('developer-actions.csv',[['Action','Status'],['Add explicit health-data consent','Open'],['Document lawful basis and retention','Open']])}>Export CSV</button></p></div></section></>}
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
  const issueCount = documents.length + 6;

  return (
    <div className="screen-layout document-intelligence-page">
      <section className="page-heading document-command">
        <div><div className="breadcrumb">Governance <span>/</span> Document Intelligence</div><h2>Document Intelligence</h2><p>Upload legal, data processing, and privacy documents. Automated review finds gaps, checks regulatory clauses, and suggests defensible remediation.</p></div>
        <div className="document-upload-actions">
          <button type="button" className="ghost-button" onClick={() => setUploadName('PrivacyPolicy_v3.docx')}><BookOpenText size={15} />Use demo policy</button>
          <label className="primary-button upload-button"><Upload size={15} />{uploadName ? 'Document selected' : 'Upload document'}<input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(event) => setUploadName(event.target.files?.[0]?.name ?? '')} /></label>
        </div>
      </section>

      <section className="document-active-banner">
        <div className="document-file-icon"><FileText size={20} /></div>
        <div className="document-active-copy"><strong>{uploadName || 'PrivacyPolicy_v3.docx'}</strong><span>Active audit · UK GDPR &amp; DPDP · Document ID DOC-2026-8819A</span></div>
        <div className="document-active-meta"><span>Last scanned today, 14:32 BST</span><span>Jurisdiction: EEA / United Kingdom</span></div>
        <button type="button" className="link-button document-controls-link" onClick={() => navigate('/compliance')}>View controls <ArrowUpRight size={13} /></button>
        <span className="status-badge warning">Review in progress</span>
      </section>
      <section className="card-panel feature-card document-type-row"><label>Document type <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}><option>Privacy Policy</option><option>Vendor DPA</option><option>DPIA draft</option></select></label><span className="status-badge warning">Illustrative fine risk · ICO / DPDP</span></section>

      <section className="document-kpi-grid">
        <article className="document-kpi score-kpi"><div className="small-label">Active policy score</div><div className="document-score-line"><strong>68</strong><span>/ 100</span><span className="score-gain">↑ +26 pts available</span></div><div className="progress-track"><div className="progress-bar amber" style={{ width: '68%' }} /></div></article>
        <article className="document-kpi"><div className="small-label">Issues detected</div><strong className="document-kpi-value">{issueCount}</strong><span>3 critical · 4 high · 4 medium</span></article>
        <article className="document-kpi"><div className="small-label">Remediation readiness</div><strong className="document-kpi-value">3 ready</strong><span className="success-copy"><CheckCircle2 size={13} /> Validated against ICO standards</span></article>
        <article className="document-kpi"><div className="small-label">Submission gate</div><strong className="document-kpi-value">Filing blocked</strong><span>Unlock after 3 priority fixes</span></article>
      </section>

      <div className="document-review-grid">
        <section className="card-panel clause-review-panel">
          <div className="panel-header"><div><div className="small-label">Clause 4.2 · Data governance</div><h3>Data Retention &amp; Storage Lifecycle</h3><span className="clause-meta">Section 04 · Lines 142–159</span></div><span className="chip high">High severity</span></div>
          <div className="clause-comparison">
            <article className="clause-column original-clause"><div className="clause-column-title"><span><FileText size={14} />Original document</span><span className="chip critical">Non-compliant</span></div><div className="clause-quote">“{selectedDocument?.original ?? 'Personal data and telemetry will be retained indefinitely or for as long as deemed necessary for business purposes.'}”</div><div className="regulation-citation"><strong>Regulatory finding · UK GDPR Art. 5(1)(e)</strong><span>Personal data must be kept no longer than necessary. The retention period or criteria must be clear and defensible.</span></div></article>
            <article className="clause-column suggested-clause"><div className="clause-column-title"><span><Sparkles size={14} />AI suggested remediation</span><span className="chip success-chip">Verified compliant</span></div><div className="clause-quote">“{selectedDocument?.suggested ?? 'Personal data will be retained only for a strictly capped period, subject to documented statutory retention exceptions.'}”</div><div className="remediation-rationale"><strong>Why this resolves the finding</strong><span>Defines a specific retention limit and preserves a documented exception path for statutory obligations.</span></div></article>
          </div>
          <div className="clause-action-bar"><span><Sparkles size={14} />Suggested fix confidence <strong>96%</strong></span><div><button className="ghost-button small" type="button" onClick={() => setSelectedId(documents[(documents.findIndex((item) => item.id === selectedId) + 1) % documents.length]?.id ?? selectedId)}><ArrowUpRight size={14} />Next finding</button><button className="primary-button" type="button" onClick={() => selectedDocument && updateDocumentStatus(selectedDocument.id, 'Accepted')} disabled={!selectedDocument || selectedDocument.status === 'Accepted'}><CheckCircle2 size={14} />{selectedDocument?.status === 'Accepted' ? 'Suggestion accepted' : 'Accept suggestion'}</button></div></div>
          <button className="primary-button" disabled={documents.some((item) => item.status === 'Open') || generating} onClick={() => {setGenerating(true);setTimeout(() => {downloadText('corrected-policy.txt',`${documentType}\n\nPrivacy and data handling\n\nHealth data is processed only with explicit consent and retained for 6 years after account closure where required by applicable law. Contact dpo@acme-health.com for privacy matters. International transfers use approved safeguards.\n\nThis is a sample corrected document for demonstration.`);setGenerating(false);auditAction('Corrected document generated','Documents')},1000)}}><Download size={15}/>{generating?'Generating corrected file…':'Generate corrected file'}</button>
        </section>
        <aside className="document-side-column">
          <section className="card-panel document-findings"><div className="panel-header"><div><h3>Document findings</h3><span className="clause-meta">{openCount} clauses need review</span></div><span className="status-badge warning">{documents.length} items</span></div><div className="document-finding-list">{documents.map((document, index) => <button className={`document-finding ${selectedId === document.id ? 'selected' : ''}`} key={document.id} type="button" onClick={() => setSelectedId(document.id)}><span className={`severity ${index < 2 ? 'high' : 'medium'}`} /><span className="document-finding-copy"><strong>{document.title}</strong><small>{document.section}</small></span><span className={`chip ${document.status === 'Accepted' ? 'success-chip' : 'neutral'}`}>{document.status}</span></button>)}</div></section>
          <section className="card-panel version-panel"><div className="panel-header"><h3><History size={15} />Version history</h3><button className="icon-button" type="button" aria-label="View version history"><ArrowUpRight size={14} /></button></div><div className="version-timeline"><div className="version-item current"><i /><div><strong>v3 · Current review</strong><span>Today, 14:32 · AI analysis complete</span></div></div><div className="version-item"><i /><div><strong>v2 · Policy updated</strong><span>Oct 06, 2026 · Anmol</span></div></div><div className="version-item"><i /><div><strong>v1 · Original upload</strong><span>Sep 28, 2026 · PDF</span></div></div></div><button className="ghost-button version-export" type="button" onClick={() => downloadCsv('document-review-summary.csv', [['Document', 'Status', 'Section'], ...documents.map((document) => [document.title, document.status, document.section])])}><Download size={14} />Export review summary</button></section>
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
  const [trace, setTrace] = useState<string[]>(['14:32:08 socket connect -> api.healthhub.local:443','14:32:09 openat -> /srv/patient-records/']);
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
    <section className="page-heading runtime-command"><div><div className="eyebrow">Protection active · Enclave Shield v4.2</div><h2>Runtime Security Console</h2><p>Monitor suspicious activity and contain data exfiltration across protected sessions.</p></div><button className="ghost-button" type="button" onClick={() => downloadCsv('runtime-security-snapshot.csv', [['Time', 'Event', 'Severity', 'Source', 'Status'], ...runtimeEvents.map((event) => [event.timestamp, event.title, event.severity, event.source, event.status])])}><Download size={15} />Export snapshot</button></section>
    <section className="runtime-kpi-grid"><article className="runtime-kpi"><span>Active sessions</span><strong>128</strong><small>+12 today · VDI protected</small></article><article className="runtime-kpi"><span>Events today</span><strong>1,842</strong><small><Activity size={13} />Live telemetry stream</small></article><article className="runtime-kpi"><span>Blocked threats</span><strong>17</strong><small>Auto-quarantined</small></article><article className="runtime-kpi urgent"><span>Critical incidents</span><strong>{runtimeEvents.filter((event) => event.severity === 'Critical').length}</strong><small>Immediate triage required</small></article></section>
    <section className="card-panel feature-card runtime-demo-controls"><label className="action-check"><input type="checkbox" checked={killSwitch} onChange={(e) => {setKillSwitch(e.target.checked);auditAction(`Firewall kill-switch ${e.target.checked?'enabled':'disabled'}`,'Runtime Security')}}/>Automated firewall kill-switch</label><button className="primary-button" onClick={simulateTheft}><Siren size={14}/>Simulate bulk data theft</button><h3>eBPF style sandbox trace · illustrative</h3>{trace.map((line,i)=><code key={`${line}-${i}`}>{line}</code>)}</section>
    {feedback && <div className="inline-feedback" role="status">{feedback}<button type="button" onClick={() => setFeedback('')} aria-label="Dismiss message"><X size={14} /></button></div>}
    <div className="runtime-console-grid"><section className="card-panel runtime-feed-panel"><div className="panel-header runtime-feed-header"><div><div className="eyebrow">Live security telemetry · audit v2.8</div><h3>Threat event stream</h3></div><span className="status-badge success"><i className="live-dot" />Streaming</span></div><div className="runtime-filter-list" role="tablist" aria-label="Filter runtime events">{filters.map((item) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} type="button">{item}{item === 'All' && <span>{runtimeEvents.length}</span>}</button>)}</div><div className="runtime-event-list">{filteredEvents.map((event) => <button type="button" key={event.id} onClick={() => setSelectedId(event.id)} className={`runtime-event-card ${selectedId === event.id ? 'selected' : ''}`}><div className="runtime-event-top"><span className={`event-level ${event.severity.toLowerCase()}`}>{event.severity === 'Medium' ? 'Suspicious' : event.severity === 'Low' ? 'Normal' : event.severity}</span><time>{event.timestamp} UTC</time></div><strong>{event.title}</strong><p>{event.description}</p><div className="runtime-event-meta"><span>{event.source}</span><span>{mitigated.includes(event.id) ? 'Isolated' : event.status}</span></div></button>)}</div>{filteredEvents.length === 0 && <div className="empty-state"><Siren size={20} /><strong>No events in this category.</strong></div>}</section>
      <aside className="card-panel incident-panel"><div className="panel-header"><div><div className="eyebrow">Incident investigation</div><h3>{selectedEvent?.title ?? 'Select an event'}</h3></div>{selectedEvent && <span className={`chip ${selectedEvent.severity.toLowerCase()}`}>{selectedEvent.severity}</span>}</div>{selectedEvent ? <><div className="forensic-visual"><div className="forensic-grid"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div><Radar size={30} /><strong>ENCLAVE</strong><small>Protected session snapshot</small></div></div><div className="incident-detail-grid"><div><span>Session / source</span><strong>{selectedEvent.source}</strong></div><div><span>Detected at</span><strong>{selectedEvent.timestamp} UTC</strong></div><div><span>Response state</span><strong>{mitigated.includes(selectedEvent.id) ? 'Isolated' : selectedEvent.status}</strong></div><div><span>Integrity</span><strong className="success-copy">Attested · SHA-256</strong></div></div><div className="risk-evaluation"><div><Sparkles size={15} /><strong>AI risk evaluation</strong><span>High confidence</span></div><p>{selectedEvent.description} The session is isolated from protected data while the security team reviews the evidence.</p></div><div className="incident-actions"><button className="primary-button" type="button" onClick={setMitigation} disabled={mitigated.includes(selectedEvent.id)}><ShieldCheck size={14} />{mitigated.includes(selectedEvent.id) ? 'Isolation applied' : 'Apply isolation'}</button><button className="ghost-button" type="button" onClick={() => setFeedback('Incident details copied to the review queue.')}><FileSearch size={14} />Escalate for review</button></div><div className="ledger-sync"><CheckCircle2 size={14} />Cryptographic ledger synchronized</div></> : <div className="empty-state">Choose a threat event to investigate.</div>}</aside></div>
  </div>;
}

function ComplianceScreen() {
  const workspace = useAppStore((state) => state.workspace);
  const findings = useAppStore((state) => state.findings);
  const toggleFindingStatus = useAppStore((state) => state.toggleFindingStatus);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [feedback, setFeedback] = useState('');
  const frameworks = [
    { name: 'UK GDPR', score: workspace.gdpr, total: 15, passed: 12, color: 'indigo', metrics: [['Lawfulness of processing', 82], ['Data minimization', 74], ['Retention limits', 62], ['Transparency & notices', 78]] },
    { name: 'India DPDP Act 2023', score: workspace.dpdp, total: 11, passed: 9, color: 'cyan', metrics: [['Consent architecture', 74], ['Notice delivery', 68], ['Data principal rights', 80], ['Storage limitation', 62]] },
    { name: 'Internal Security Policy', score: workspace.security, total: 19, passed: 18, color: 'green', metrics: [['Remote work guardrails', 72], ['Access control', 88], ['Clipboard & VDI policy', 74], ['Incident response', 91]] },
  ];
  const visibleFindings = findings.filter((finding) => filter === 'all' || (filter === 'open' ? finding.status !== 'Resolved' : finding.status === 'Resolved'));
  return <div className="screen-layout compliance-page">
    <section className="compliance-command"><div><div className="eyebrow">Continuous governance audit engine · v4.8</div><h2>Compliance Center</h2><p>Continuous regulatory coverage across UK GDPR, India DPDP Act 2023, and internal security policy.</p></div><div className="compliance-command-actions"><span className="status-badge success"><i className="live-dot" />Active monitor</span><button className="ghost-button" type="button" onClick={() => setFeedback('Evidence ledger synchronized just now.')}><RefreshCcw size={14} />Sync evidence</button><button className="primary-button" type="button" onClick={() => downloadCsv('compliance-executive-brief.csv', [['Framework', 'Coverage'], ...frameworks.map((item) => [item.name, `${item.score}%`])])}><FileText size={14} />Executive brief</button></div></section>
    {feedback && <div className="inline-feedback" role="status">{feedback}<button type="button" onClick={() => setFeedback('')} aria-label="Dismiss message"><X size={14} /></button></div>}
    <section className="compliance-framework-grid">{frameworks.map((framework) => <article className="framework-card card-panel" key={framework.name}><div className="framework-top"><div><span className="small-label">{framework.name === 'UK GDPR' ? 'EU · UK' : framework.name === 'India DPDP Act 2023' ? 'India' : 'Enterprise'}</span><h3>{framework.name}</h3></div><span className={`framework-ring ${framework.color}`} style={{ '--score': `${framework.score}%` } as React.CSSProperties}><b>{framework.score}%</b></span></div><div className="framework-overview"><strong>Overall coverage</strong><span>{framework.passed} / {framework.total} controls passed</span></div><div className="mini-metrics">{framework.metrics.map(([label, value]) => <div className="mini-metric" key={label}><div><span>{label}</span><strong>{value}%</strong></div><div className="mini-track"><i style={{ width: `${value}%` }} /></div></div>)}</div><div className="framework-foot"><span>Live continuous monitor</span><strong className="success-copy">+{framework.name === 'UK GDPR' ? '4.2% / 7d' : framework.name === 'India DPDP Act 2023' ? '1.8% / 7d' : '0.0% / 24h'}</strong></div></article>)}</section>
    <section className="card-panel controls-panel"><div className="controls-heading"><div><div className="eyebrow">Control monitoring</div><h3>Interactive controls &amp; safeguards</h3><p>Review findings and apply remediation actions.</p></div><span className="status-badge warning">{findings.filter((finding) => finding.status !== 'Resolved').length} need attention</span></div><div className="control-tabs" role="tablist" aria-label="Filter controls"><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>All controls <span>{findings.length}</span></button><button type="button" role="tab" aria-selected={filter === 'open'} className={filter === 'open' ? 'selected' : ''} onClick={() => setFilter('open')}>Needs remediation <span>{findings.filter((finding) => finding.status !== 'Resolved').length}</span></button><button type="button" role="tab" aria-selected={filter === 'resolved'} className={filter === 'resolved' ? 'selected' : ''} onClick={() => setFilter('resolved')}>Fully compliant <span>{findings.filter((finding) => finding.status === 'Resolved').length}</span></button></div><div className="controls-table-wrap"><table className="controls-table"><thead><tr><th>Control / finding</th><th>Regulation</th><th>Category</th><th>Status</th><th>Linked evidence</th><th>Action</th></tr></thead><tbody>{visibleFindings.slice(0, 8).map((finding) => <tr key={finding.id}><td><strong>{finding.title}</strong><small>{finding.id} · {finding.location}</small></td><td>{finding.regulation}</td><td>{finding.severity === 'Critical' ? 'Data collection' : finding.severity === 'High' ? 'Storage hygiene' : 'Access control'}</td><td><span className={`chip ${finding.status === 'Resolved' ? 'success-chip' : finding.severity.toLowerCase()}`}>{finding.status === 'Resolved' ? 'Compliant' : 'Action required'}</span></td><td><code>{finding.id} · HealthHub</code></td><td><button className="link-button" type="button" onClick={() => { toggleFindingStatus(finding.id); setFeedback(`${finding.id} ${finding.status === 'Resolved' ? 'reopened' : 'marked resolved'}.`); }}>{finding.status === 'Resolved' ? 'Reopen' : 'Resolve'} <ArrowRight size={13} /></button></td></tr>)}</tbody></table></div></section>
  </div>;
}

function AuditScreen() {
  const auditLogs = useAppStore((state) => state.auditLogs);
  const user = useAppStore((state) => state.workspace.user);
  const [moduleFilter, setModuleFilter] = useState('All modules');
  const [query, setQuery] = useState('');
  const [verified, setVerified] = useState(false);
  const modules = ['All modules', ...Array.from(new Set(auditLogs.map((log) => log.module)))];
  const visibleLogs = auditLogs.filter((log) => (moduleFilter === 'All modules' || log.module === moduleFilter) && `${log.action} ${log.module} ${user}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="screen-layout audit-page">
    <div className="ledger-status"><span><ShieldCheck size={15} />Merkle root hash <code>#88A-9F42B</code></span><span className="ledger-verified"><CheckCircle2 size={14} />Zero tamper drift</span><span><Clock3 size={14} />RFC 3161 timestamped</span></div>
    <section className="page-heading"><div><div className="eyebrow">Illustrative audit trail</div><h2>Audit Logs &amp; Compliance Lineage</h2><p>Sample history for code fixes, document revisions, and runtime security events.</p></div><div><button className="ghost-button" onClick={() => {setVerified(false);setTimeout(()=>setVerified(true),700)}}><ShieldCheck size={15}/>{verified?'Chain verified':'Verify ledger'}</button> <button className="primary-button" type="button" onClick={() => downloadCsv('ai-accelerator-audit-log.csv', [['Event', 'Module', 'Actor', 'Time', 'Proof'], ...auditLogs.map((log) => [log.action, log.module, user, log.time, `SHA-256 ${log.id}`])])}><Download size={15} />Download audit trail</button></div></section>
    <section className="audit-metrics"><article className="audit-metric"><span>Ledger height</span><strong>14,291</strong><small>Blocks recorded</small></article><article className="audit-metric"><span>Total audit events</span><strong>{auditLogs.length.toLocaleString()}</strong><small>Across all modules</small></article><article className="audit-metric"><span>Integrity assurance</span><strong>100.0%</strong><small>Enforced attestation</small></article><article className="audit-metric"><span>Attestation recency</span><strong>38 sec</strong><small className="success-copy">Consensus verified across 3 HSMs</small></article></section>
    <section className="card-panel audit-records"><div className="audit-filter-bar"><label className="audit-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, action, or artifact" /></label><label className="audit-select-label"><span>Module</span><select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>{modules.map((module) => <option key={module}>{module}</option>)}</select></label><button className="ghost-button small" type="button" onClick={() => { setQuery(''); setModuleFilter('All modules'); }}><X size={14} />Reset</button></div><div className="audit-table-wrap"><table className="lineage-table"><thead><tr><th>Timestamp (local)</th><th>Actor / origin</th><th>Action taken</th><th>Module</th><th>Target / artifact</th><th>Verification proof</th><th>Status</th></tr></thead><tbody>{visibleLogs.map((log, index) => <tr key={log.id}><td><time>{log.time}</time><small>Today · UTC</small></td><td><span className="actor-avatar">{index % 2 === 0 ? 'AL' : 'SG'}</span><span>{index % 2 === 0 ? `${user} · Compliance Lead` : 'System Guardian'}</span></td><td><strong>{log.action}</strong></td><td><span className="module-tag">{log.module}</span></td><td><code>{log.module === 'Documents' ? 'PrivacyPolicy_v3.docx' : 'HealthHub / main'}</code></td><td><code>SHA-256 #{log.id.slice(-5)}…</code></td><td><span className="status-badge success">{index % 2 === 0 ? 'Verified' : 'Enforced'}</span></td></tr>)}</tbody></table>{visibleLogs.length === 0 && <div className="empty-state"><FileSearch size={22} /><strong>No audit events match these filters.</strong><span>Clear the search or choose another module.</span></div>}</div><div className="audit-table-footer"><span>Showing {visibleLogs.length} of {auditLogs.length} audit entries</span><span>Ledger sync <strong>Live</strong> · Last proof 38 sec ago</span></div></section>
  </div>;
}

function ReportsScreen() {
  const reports = useAppStore((state) => state.reports);
  const [updated, setUpdated] = useState('Today · initial demo snapshot');
  const exportReports = () => downloadCsv('ai-accelerator-compliance-reports.csv', [['Report', 'Score', 'Status', 'Updated'], ...reports.map((report) => [report.title, report.value, report.status, report.updated])]);
  return <div className="screen-layout"><section className="page-heading"><div><div className="eyebrow">Insights &amp; exports · sample records</div><h2>Compliance Reports</h2><p>Illustrative RoPA and DPIA views generated from demo workspace data.</p></div><button className="primary-button" type="button" onClick={exportReports}><FileText size={15} />Export reports</button></section><section className="feature-grid"><article className="card-panel feature-card"><div className="panel-header"><h3>Article 30 · RoPA</h3><button className="secondary-button" onClick={() => downloadCsv('ropa-article-30.csv',[['Activity','Purpose','Data categories','Recipients','Transfers','Retention'],['Patient care','Clinical services','Identity, health','Care team','UK / EEA safeguards','6 years after closure'],['Account management','Service delivery','Contact, account','Support provider','UK','Account term + 90 days']])}>Export CSV</button></div><DataTable headers={['Processing activity','Purpose','Categories','Recipients','Transfers','Retention']} rows={ [['Patient care','Clinical services','Identity, health','Care team','UK / EEA','6 years'],['Account management','Service delivery','Contact, account','Support vendor','UK','Account term + 90 days']]} /></article><article className="card-panel feature-card"><div className="panel-header"><h3>DPIA Report</h3><button className="secondary-button" onClick={() => downloadCsv('dpia-report.csv',[['Area','Assessment'],['Necessity','Clinical service delivery'],['Risk','Unauthorized health data disclosure'],['Mitigation','Role controls, encryption, retention review'],['Residual risk','Medium']])}>Export CSV</button></div><DataTable headers={['Assessment area','Summary']} rows={ [['Necessity','Processing supports care delivery'],['Key risks','Unauthorized health data disclosure'],['Mitigations','Role controls, encryption, retention review'],['Residual risk','Medium · review required']]} /></article></section><div className="report-refresh"><span>Last updated: {updated}</span><button className="ghost-button" onClick={() => {setUpdated('Updating…');setTimeout(()=>setUpdated(new Date().toLocaleString()),800)}}><RefreshCcw size={14}/>Regenerate</button></div><div className="report-grid report-page-grid">{reports.map((report) => <article className="report-card" key={report.id}><div className="report-header"><strong>{report.title}</strong><span className={`report-status ${report.status.toLowerCase()}`}>{report.status}</span></div><div className="report-value">{report.value}</div><small>Updated {report.updated}</small><button className="link-button" type="button" onClick={() => downloadCsv(`${report.id.toLowerCase()}-report.csv`, [['Report', 'Score', 'Status', 'Updated'], [report.title, report.value, report.status, report.updated]])}>Download report <ArrowRight size={14} /></button></article>)}</div></div>;
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
    const workspaceContext = JSON.stringify({
      currentScreen: location.pathname,
      workspace: { project: workspace.project, repo: workspace.repo, branch: workspace.branch, overallScore: workspace.overallScore, gdpr: workspace.gdpr, dpdp: workspace.dpdp, security: workspace.security, documentation: workspace.documentation },
      liveWorkspaceState: {
        findings: findings.map(({ id, title, severity, location, regulation, status, suggestion }) => ({ id, title, severity, location, regulation, status, suggestion })),
        documents: documents.map(({ id, title, status, section, scoreImpact }) => ({ id, title, status, section, scoreImpact })),
        runtimeEvents: runtimeEvents.map(({ id, title, severity, source, status, description, timestamp }) => ({ id, title, severity, source, status, description, timestamp })),
      },
      appFeatureData: {
        codeScan: { repo: codeScan.result.repo, branch: codeScan.result.branch, riskScore: codeScan.result.riskScore, filesScanned: codeScan.result.filesScanned, linesScanned: codeScan.result.linesScanned, summary: codeScan.result.summary, findings: codeScan.result.findings.map(({ id, field, file, line, category, law, severity, note }) => ({ id, field, file, line, category, law, severity, note })), developerActions: codeScan.result.actions.map(({ id, priority, task, file }) => ({ id, priority, task, file })) },
        documentReviews: documentReview.documents.map(({ id, fileName, docType, scoreBefore, scoreAfter, issues }) => ({ id, fileName, docType, scoreBefore, scoreAfter, issues: issues.map(({ id: issueId, title, severity, section, law, original, fixed }) => ({ id: issueId, title, severity, section, law, original, fixed })) })),
        sandbox: { setup: sandbox.setup, events: sandbox.events.map(({ id, t, type, level, text, rows }) => ({ id, t, type, level, text, rows })), alerts: sandbox.alerts },
        dashboard: dashboard.stats,
      },
    });
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-10), context: workspaceContext }),
      });
      const result = await response.json() as { reply?: string; error?: string };
      if (!response.ok) throw new Error(result.error || 'The assistant could not answer. Please try again.');
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

  return <div className="assistant-screen"><section className="assistant-card"><div className="assistant-icon"><Sparkles size={22} /></div><div className="eyebrow">AI compliance assistant · OpenRouter</div><h2>Ask your workspace</h2><p>Scan and ask about current workspace state plus code, document, and sandbox demo data.</p><button className="secondary-button" type="button" onClick={() => void sendMessage("Scan all data currently loaded in this app. Summarize the highest-risk findings, document gaps, and runtime threats. Cite relevant record IDs and recommend next steps. Clearly state this is a demo-data scan, not a source-code or production-system scan.")} disabled={isLoading}><Search size={15} />{isLoading ? "Scanning app data..." : "Scan app data"}</button>{messages.length > 0 && <div className="chat-history" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span>{message.role === 'user' ? 'You' : 'AI Assistant'}</span><p>{message.content}</p></div>)}{isLoading && <div className="chat-message assistant"><span>AI Assistant</span><p className="typing-indicator">Thinking…</p></div>}</div>}<div className="assistant-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void sendMessage(); }} disabled={isLoading} placeholder="e.g. What are our highest priority GDPR gaps?" /><button className="primary-button" type="button" onClick={() => void sendMessage()} disabled={isLoading || !question.trim()}><ArrowRight size={16} />{isLoading ? 'Thinking' : 'Ask'}</button></div>{error && <div role="alert" className="chat-error">{error}</div>}<div className="suggested-questions"><span>Try asking</span>{['Summarize critical findings', 'Which documents need review?', 'Show runtime threats'].map((prompt) => <button key={prompt} type="button" disabled={isLoading} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}</div></section></div>;
}

function auditAction(action: string, module: string) {
  useAppStore.setState((state) => ({ auditLogs: [{ id: `A-${Date.now()}`, action, module, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...state.auditLogs] }));
}

function downloadText(filename: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
}

const piiPatterns = [
  { name: 'Aadhaar', regex: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, example: '1234 5678 9012', article9: false },
  { name: 'PAN', regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g, example: 'ABCDE1234F', article9: false },
  { name: 'UK NI', regex: /\b[A-Z]{2}\d{6}[A-D]\b/gi, example: 'QQ123456C', article9: false },
  { name: 'NHS number', regex: /\b\d{3}[ -]?\d{3}[ -]?\d{4}\b/g, example: '943 476 5919', article9: true },
  { name: 'Email', regex: /\b[\w.+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, example: 'person@example.com', article9: false },
  { name: 'Phone', regex: /\b(?:\+?\d[\d ()-]{7,}\d)\b/g, example: '+44 7700 900123', article9: false },
];

function redactPii(text: string) {
  let value = text;
  piiPatterns.forEach(({ name, regex }) => {
    regex.lastIndex = 0;
    value = value.replace(regex, (match) => name === 'Aadhaar' ? `XXXX XXXX ${match.replace(/\D/g, '').slice(-4)}` : name === 'PAN' ? `XXXXX${match.slice(-5)}` : name === 'UK NI' ? `XX******${match.slice(-1)}` : name === 'NHS number' ? `XXX XXX ${match.replace(/\D/g, '').slice(-4)}` : name === 'Email' ? 'redacted@example.com' : '[REDACTED PHONE]');
  });
  return value;
}

function VdiScreen() {
  const [source, setSource] = useState('Citrix');
  const [policy, setPolicy] = useState('Redact');
  const [text, setText] = useState('Aadhaar 1234 5678 9012, PAN ABCDE1234F, NI QQ123456C, NHS 943 476 5919, email alex@example.com');
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
  return <PageShell eyebrow="Privacy · Endpoint controls" title="VDI Protection" description="Demonstrate policy based protection for text copied from virtual desktop sessions.">
    <div className="feature-stats"><MetricCard icon={Clipboard} label="Clipboard events" value={`${counts.clipboard}`} change="This session" accent="indigo"/><MetricCard icon={Fingerprint} label="Redactions" value={`${counts.redactions}`} change="PII masked" accent="green"/><MetricCard icon={ShieldCheck} label="Blocked leaks" value={`${counts.blocked}`} change="Policy enforced" accent="amber"/></div>
    <div className="feature-grid"><section className="card-panel feature-card"><h3>Active sessions</h3><label>Session source <select value={source} onChange={(e) => setSource(e.target.value)}><option>Citrix</option><option>Azure Virtual Desktop</option><option>VMware</option></select></label><div className="data-table-wrap"><table><thead><tr><th>User</th><th>Session</th><th>Source</th><th>Policy</th></tr></thead><tbody>{['Anmol · VDI-07','Priya · VDI-12','Jordan · VDI-18','Maya · VDI-22'].map((x) => <tr key={x}><td>{x.split(' · ')[0]}</td><td>{x.split(' · ')[1]}</td><td><span className="status-badge success">{source}</span></td><td><select value={policy} onChange={(e) => setPolicy(e.target.value)}><option>Allow</option><option>Redact</option><option>Block</option></select></td></tr>)}</tbody></table></div></section>
    <section className="card-panel feature-card"><h3>Clipboard protection demo</h3><p>Paste text to preview the session policy outcome. Processing stays in this browser.</p><textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}/><button className="primary-button" onClick={handleCopy}><Clipboard size={15}/>Copy to local machine</button>{output && <div className="compare-box"><div><b>Original</b><p>{text}</p></div><div><b>Policy output</b><p>{output}</p></div></div>}</section></div>
    <section className="card-panel feature-card"><h3>PII classifier</h3><div className="pii-grid">{piiPatterns.map((p) => <div key={p.name}><b>{p.name}</b><small>{p.example}</small>{p.article9 && <span className="status-badge warning">Article 9</span>}</div>)}</div></section>
    <section className="card-panel feature-card"><h3>Clipboard event log</h3><DataTable headers={['Time','User','Session','PII types found','Action taken']} rows={events}/></section>
  </PageShell>;
}

function FamilyLawScreen() {
  const [tab, setTab] = useState('Form E Ingestion'); const [file, setFile] = useState(''); const [processed, setProcessed] = useState(false); const [signed, setSigned] = useState(false); const [pension, setPension] = useState(240000); const [equity, setEquity] = useState(520000); const [needs, setNeeds] = useState(360000);
  const tabs = ['Form E Ingestion','Bank Audit','Section 25 Modeler','Asset Schedule'];
  const bankRows = [['12 Jan','Salary credit','£4,850','Routine'],['22 Feb','Transfer to overseas account','£18,000','Offshore account'],['04 Mar','Cash withdrawal','£9,500','Large withdrawal'],['11 Apr','Transfer','£25,000','Round sum transfer'],['02 May','Savings transfer','£12,000','Unexplained transfer'],['18 Jun','Declared savings mismatch','£31,000','Mismatch vs Form E']];
  const rows = [['Family home equity','£520,000'],['Pension CETV','£240,000'],['Savings and investments','£86,500'],['Liabilities','-£42,000']];
  const amount = 846500; const low = Math.round((pension + equity + needs) * .4); const high = Math.round((pension + equity + needs) * .55);
  return <PageShell eyebrow="Legal · Phase 2 demo" title="Family Law" description="Financial disclosure review and settlement decision support."><div className="notice-banner">Decision support for lawyers, not legal advice. Illustrative data only.</div><div className="feature-tabs">{tabs.map((t) => <button className={tab===t?'selected':''} key={t} onClick={() => setTab(t)}>{t}</button>)}</div>
    {tab==='Form E Ingestion' && <section className="card-panel feature-card"><h3>Form E ingestion</h3><label className="upload-button"><Upload size={16}/>Upload Form E<input type="file" accept=".pdf,.doc,.docx" onChange={(e) => {setFile(e.target.files?.[0]?.name || '');setProcessed(false)}}/></label>{file && <p>Selected: {file} <button className="primary-button" onClick={() => setTimeout(() => setProcessed(true), 900)}>Process 50 pages</button></p>}{processed && <><div className="status-badge success">Processing complete · 50 pages</div><DataTable headers={['Extracted field','Value','Confidence']} rows={ [['Annual income','£78,400','98%'],['Property','Family home · £720,000','94%'],['Pensions','£240,000 CETV','91%'],['Bank accounts','3 accounts · £46,500','89%'],['Liabilities','Mortgage £200,000','93%']]} /></>}</section>}
    {tab==='Bank Audit' && <section className="card-panel feature-card"><h3>12 month transaction audit</h3><DataTable headers={['Date','Transaction','Amount','Finding']} rows={bankRows.map((r) => [...r.slice(0,3), <span className={r[3]==='Routine'?'status-badge success':'status-badge warning'} key={r[3]}>{r[3]}</span>])}/></section>}
    {tab==='Section 25 Modeler' && <section className="card-panel feature-card"><h3>Matrimonial Causes Act 1973 · Section 25</h3>{[['Pension CETV',pension,setPension],['Property equity',equity,setEquity],['Needs estimate',needs,setNeeds]].map(([label,value,setter]) => <label className="model-input" key={String(label)}>{String(label)}<input type="number" value={Number(value)} onChange={(e) => (setter as (n:number)=>void)(Number(e.target.value))}/></label>)}<div className="settlement-result">Illustrative settlement bracket <strong>£{low.toLocaleString()} – £{high.toLocaleString()}</strong></div><p>Assumptions: equal sharing considered; needs and contributions weighed; tax and liquidity not modeled.</p></section>}
    {tab==='Asset Schedule' && <section className="card-panel feature-card"><h3>Draft asset schedule</h3><DataTable headers={['Asset','Value']} rows={rows}/><b>Net illustrative assets: £{amount.toLocaleString()}</b><p><button className="primary-button" onClick={() => {downloadCsv('asset-schedule.csv',[['Asset','Value'],...rows,['Total',`£${amount.toLocaleString()}`]]);auditAction('Asset schedule exported','Family Law')}}><Download size={15}/>Export court-ready schedule</button> <button className="secondary-button" onClick={() => {setSigned(true);auditAction('Lawyer sign-off recorded','Family Law')}}>{signed?'Signed':'Lawyer sign-off'}</button></p>{signed && <span className="status-badge success">Signed for demo</span>}</section>}
  </PageShell>;
}

function ComparisonScreen() {
  const rows = [['OneTrust','££££','Complex enterprise suite','Unified privacy, security and legal workflows'],['Sprinto / Vanta','£££','Compliance automation focus','Code to policy traceability'],['iubenda / CookieYes','£','Cookie and website notices','Runtime and developer remediation'],['Settify / Amicable','££','Family law workflow focus','Connected privacy and disclosure tools'],['AI Accelerator','££','Demo estimate','Cross-track AI assisted workflow']];
  return <PageShell eyebrow="Market landscape" title="Industry comparison" description="Illustrative positioning from the executive proposal. Costs are directional, not vendor quotes."><section className="card-panel feature-card"><h3>Capability and cost overview</h3><DataTable headers={['Platform','Relative cost','Typical gap','AI Accelerator advantage']} rows={rows}/><div className="cost-bars">{[['OneTrust',90],['Sprinto / Vanta',65],['iubenda / CookieYes',25],['Settify / Amicable',45],['AI Accelerator',48]].map(([name,n])=><div key={String(name)}><span>{String(name)}</span><i><b style={{width:`${n}%`}}/></i></div>)}</div></section></PageShell>;
}

function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState('Monthly');
  const plans = [
    { name: 'Weekly', price: '£9.99', period: '/ week', detail: 'Flexible access for short projects', tag: 'Weekly billing' },
    { name: 'Monthly', price: '£29.99', period: '/ month', detail: 'A balanced plan for ongoing teams', tag: 'Most popular' },
    { name: 'Yearly', price: '£299.99', period: '/ year', detail: 'Best value for long-term use', tag: 'Save about 17%' },
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
        <label className="settings-field">Workspace role<select value={role} onChange={(event) => setRole(event.target.value)}><option>Compliance Lead</option><option>Security Analyst</option><option>Privacy Officer</option><option>Developer</option><option>Workspace Admin</option></select></label>
        <div className="settings-workspace"><span>Workspace</span><strong>{workspace.project}</strong><small>Profile changes update the account label in the sidebar.</small></div>
        <div className="settings-save-row"><span role="status">{saved ? 'Profile saved' : 'Demo profile · local workspace only'}</span><button className="primary-button" type="submit"><CheckCircle2 size={15}/>{saved ? 'Saved' : 'Save profile'}</button></div>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    login();
    navigate('/');
  };

  return (
    <div className="login-screen login-reference-layout">
      <section className="login-brand-panel"><div className="login-brand"><img src="/logo.jpeg" alt="AI Accelerator Suite" className="login-brand-logo" /><span>Enterprise governance · v2.4</span></div><div className="login-brand-copy"><span className="login-kicker"><i className="live-dot" />Enterprise identity gateway</span><h1>Intelligent compliance.<br /><em>Automated protection.</em></h1><p>From compliance detection to automated remediation. AI-powered privacy and runtime security intelligence for modern enterprises.</p><div className="login-feature-list"><article><span><Search size={17} /></span><div><strong>Code-to-GDPR scanner</strong><small>AST analysis with precise remediation suggestions.</small></div></article><article><span><BookOpenText size={17} /></span><div><strong>Document intelligence</strong><small>Review policy clauses against regulatory standards.</small></div></article><article><span><ShieldCheck size={17} /></span><div><strong>Runtime security guard</strong><small>Monitor and contain suspicious activity.</small></div></article></div><div className="login-telemetry"><div><span>Runtime health</span><strong>99.998%</strong></div><div className="telemetry-spark"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><span>In-policy attestation · SOC 2 Type II · ISO 27001</span></div></div><div className="login-brand-footer"><LockKeyhole size={14} /> Zero data retention <span>·</span> AES-256 encryption <span>·</span> Hardware protected</div></section>
      <section className="login-auth-panel"><div className="login-auth-card"><div className="login-auth-heading"><span className="small-label">Enterprise identity gateway</span><h2>Welcome back</h2><p>Sign in to your enterprise workspace or launch the interactive demo.</p></div><button type="button" className="demo-launch-card" onClick={handleLogin}><span className="demo-rocket"><ArrowUpRight size={18} /></span><span><strong>Explore interactive demo</strong><small>Open the workspace with preloaded HealthHub telemetry.</small></span><ArrowRight size={17} /></button><div className="login-divider"><span>or sign in with credentials</span></div><form className="login-form" onSubmit={(event) => { event.preventDefault(); handleLogin(); }}><label htmlFor="login-email">Work email</label><div className="login-field"><input id="login-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.com" required /><CheckCircle2 size={15} /></div><div className="password-label"><label htmlFor="login-password">Password</label><button type="button" onClick={() => setMessage('Ask your workspace administrator to reset your password.')}>Forgot password?</button></div><div className="login-field"><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /><LockKeyhole size={15} /></div><label className="remember-device"><input type="checkbox" checked={rememberDevice} onChange={(event) => setRememberDevice(event.target.checked)} />Remember this device for 30 days</label><button type="submit" className="primary-button login-submit">Sign in <ArrowRight size={16} /></button></form><button type="button" className="sso-button" onClick={handleLogin}><span className="microsoft-mark"><i /><i /><i /><i /></span>Continue with Microsoft Entra ID</button>{message && <p className="login-message" role="status">{message}</p>}<div className="login-security-note"><ShieldCheck size={15} /><span><strong>Acme Technologies workspace</strong><small>Protected by enterprise session controls · TLS 1.3</small></span></div></div></section>
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

