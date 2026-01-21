import type { Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let messagingInstance: Messaging | null = null;
let initPromise: Promise<Messaging | null> | null = null;

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;

  if (messagingInstance) return messagingInstance;

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const [{ initializeApp }, { getMessaging }] = await Promise.all([
          import("firebase/app"),
          import("firebase/messaging"),
        ]);
        const app = initializeApp(firebaseConfig);
        messagingInstance = getMessaging(app);
        return messagingInstance;
      } catch (e) {
        console.error("FCM init failed", e);
        return null;
      }
    })();
  }

  return initPromise;
}
