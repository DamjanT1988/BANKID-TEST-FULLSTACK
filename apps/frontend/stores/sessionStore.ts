import { create } from 'zustand';
import type { StatusResponse } from '../../packages/dto/session.dto';

interface SessionState {
  orderRef: string | null;
  status: StatusResponse | null;
  setOrderRef: (ref: string) => void;
  setStatus: (status: StatusResponse) => void;
  clear: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  orderRef: null,
  status: null,
  setOrderRef: (orderRef) => set({ orderRef }),
  setStatus: (status) => set({ status }),
  clear: () => set({ orderRef: null, status: null }),
}));

export default useSessionStore;
