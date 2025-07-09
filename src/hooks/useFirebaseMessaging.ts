import { useEffect } from "react";
import { messaging } from "@/src/firebase/firebase.client";
import { getToken, Messaging, onMessage } from "firebase/messaging";
import { useFirebaseStore } from "@/src/common/zustand/firebase.zustand";
import { updateMemberFCMToken } from "../api/member.api";

export default function useFirebaseMessaging() {
  const {
    fcmToken,
    isServiceWorkerRegistered,
    setFcmToken,
    setServiceWorkerRegistered,
  } = useFirebaseStore();

  useEffect(() => {
    if (!messaging) return;

    if (!isServiceWorkerRegistered && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => setServiceWorkerRegistered(true))
        .catch(console.error);
    }

    if (!fcmToken) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging as Messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
          })
            .then((currentToken) => {
              if (currentToken) {
                setFcmToken(currentToken);
                updateMemberFCMToken(currentToken);
              }
            })
            .catch(console.error);
        }
      });
    }

    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title && body && document.visibilityState === "visible") {
        new Notification(title, { body, icon: "/LOLFIGHT_NONE_TEXT.png" });
      }
    });
  }, [
    fcmToken,
    isServiceWorkerRegistered,
    setFcmToken,
    setServiceWorkerRegistered,
  ]);
}
