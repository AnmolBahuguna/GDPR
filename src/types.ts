export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Finding = {
  id: string;
  title: string;
  severity: Severity;
  location: string;
  regulation: string;
  scoreDelta: number;
  status: 'Open' | 'In Review' | 'Resolved';
  suggestion: string;
  before: string;
  after: string;
};

export type DocumentIssue = {
  id: string;
  title: string;
  status: 'Open' | 'Accepted' | 'Rejected';
  scoreImpact: number;
  section: string;
  original: string;
  suggested: string;
};

export type RuntimeEvent = {
  id: string;
  title: string;
  severity: Severity;
  source: string;
  status: 'Open' | 'Reviewed' | 'Blocked';
  description: string;
  timestamp: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  age: string;
};

export type AuditEvent = {
  id: string;
  action: string;
  module: string;
  time: string;
};

export type ReportCard = {
  id: string;
  title: string;
  updated: string;
  status: 'Ready' | 'Draft';
  value: string;
};

export type WorkspaceState = {
  user: string;
  project: string;
  repo: string;
  branch: string;
  files: number;
  apiRoutes: number;
  databaseTables: number;
  users: number;
  overallScore: number;
  gdpr: number;
  dpdp: number;
  security: number;
  documentation: number;
};

export type AppSeedState = {
  isAuthenticated: boolean;
  workspace: WorkspaceState;
  findings: Finding[];
  documents: DocumentIssue[];
  runtimeEvents: RuntimeEvent[];
  notifications: NotificationItem[];
  auditLogs: AuditEvent[];
  reports: ReportCard[];
};
