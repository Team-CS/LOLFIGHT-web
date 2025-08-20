import { getMessaging, Messaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
console.log("FIREBASE CONFIG", firebaseConfig);

// let messaging: Messaging | undefined = undefined;
// if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
//   try {
//     messaging = getMessaging(app);
//   } catch (e) {
//     messaging = undefined;
//   }
// }

let messaging: Messaging | undefined;

if (typeof window !== "undefined") {
  import("firebase/messaging").then(() => {
    try {
      messaging = getMessaging(app);
    } catch (e) {
      console.error("FCM init failed", e);
      messaging = undefined;
    }
  });
}

export { messaging };
