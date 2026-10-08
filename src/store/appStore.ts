import { create } from 'zustand';
import { seedState } from '../mock/seed';
import type { AppSeedState, Finding, NotificationItem, RuntimeEvent } from '../types';

type UserProfile = { name: string; role: string };
type InitialAppState = AppSeedState & { profile: UserProfile };

type AppStore = InitialAppState & {
  login: () => void;
  logout: () => void;
  reset: () => void;
  toggleFindingStatus: (id: string) => void;
  updateDocumentStatus: (id: string, status: 'Accepted' | 'Rejected') => void;
  removeNotification: (id: string) => void;
  addRuntimeEvent: (event: RuntimeEvent) => void;
  updateOverallScore: (score: number) => void;
  updateProfile: (profile: UserProfile) => void;
};

const createInitialState = (): InitialAppState => ({
  ...structuredClone(seedState),
  profile: { name: seedState.workspace.user, role: 'Compliance Lead' },
});

export const useAppStore = create<AppStore>((set) => ({
  ...createInitialState(),
  login: () => set((state) => ({ ...state, isAuthenticated: true })),
  logout: () => set((state) => ({ ...state, isAuthenticated: false })),
  reset: () => set(() => ({ ...createInitialState() })),
  toggleFindingStatus: (id: string) =>
    set((state) => ({
      ...state,
      findings: state.findings.map((finding) =>
        finding.id === id
          ? {
              ...finding,
              status: finding.status === 'Resolved' ? 'Open' : 'Resolved',
            }
          : finding,
      ),
    })),
  updateDocumentStatus: (id, status) =>
    set((state) => ({
      ...state,
      documents: state.documents.map((document) => document.id === id ? { ...document, status } : document),
      auditLogs: [{ id: `A-${Date.now()}`, action: `Document ${status.toLowerCase()}`, module: 'Documents', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...state.auditLogs],
    })),
  removeNotification: (id: string) =>
    set((state) => ({
      ...state,
      notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
  addRuntimeEvent: (event: RuntimeEvent) =>
    set((state) => ({
      ...state,
      runtimeEvents: [event, ...state.runtimeEvents],
    })),
  updateOverallScore: (score: number) =>
    set((state) => ({
      ...state,
      workspace: {
        ...state.workspace,
        overallScore: score,
      },
    })),
  updateProfile: (profile) => set((state) => ({
    ...state,
    profile,
    workspace: { ...state.workspace, user: profile.name },
  })),
}));

export type { AppStore };
export const getOpenFindings = (findings: Finding[]) => findings.filter((finding) => finding.status !== 'Resolved');
export const getLatestNotifications = (notifications: NotificationItem[]) => notifications.slice(0, 3);
