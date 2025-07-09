import { create } from "zustand";

interface FirebaseState {
  fcmToken: string | null;
  isServiceWorkerRegistered: boolean;
  setFcmToken: (token: string) => void;
  setServiceWorkerRegistered: (registered: boolean) => void;
}

export const useFirebaseStore = create<FirebaseState>((set) => ({
  fcmToken: null,
  isServiceWorkerRegistered: false,
  setFcmToken: (token) => set({ fcmToken: token }),
  setServiceWorkerRegistered: (registered) =>
    set({ isServiceWorkerRegistered: registered }),
}));
