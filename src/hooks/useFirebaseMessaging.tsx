import { useEffect } from "react";
import { getFirebaseMessaging } from "@/src/firebase/firebase.client";
import { useFirebaseStore } from "@/src/common/zustand/firebase.zustand";
import { updateMemberFCMToken } from "../api/member.api";
import { useMemberStore } from "../common/zustand/member.zustand";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getCookie } from "../utils/cookie/cookie";

export default function useFirebaseMessaging() {
  const {
    fcmToken,
    isServiceWorkerRegistered,
    setFcmToken,
    setServiceWorkerRegistered,
  } = useFirebaseStore();
  const { member } = useMemberStore();
  const router = useRouter();

  useEffect(() => {
    if (!member) return;

    const initFirebase = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      if (!isServiceWorkerRegistered && "serviceWorker" in navigator) {
        try {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          setServiceWorkerRegistered(true);
        } catch (error) {
          console.error("등록 실패 : ", error);
        }
      }

      const token = getCookie("lf_rtk");

      if (!fcmToken && token) {
        if ("Notification" in window) {
          try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              const { getToken } = await import("firebase/messaging");
              const currentToken = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
              });
              if (currentToken) {
                setFcmToken(currentToken);
                updateMemberFCMToken(currentToken);
              }
            }
          } catch (err) {
            console.error("FCM 토큰 발급 실패:", err);
          }
        }
      }

      const { onMessage } = await import("firebase/messaging");
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification || {};
        if (title && body && document.visibilityState === "visible") {
          const toastId = toast.info(
            <div
              onClick={() => {
                toast.dismiss(toastId);
                router.push("/alarm");
              }}
              className="cursor-pointer"
            >
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          );
        }
      });
    };

    initFirebase();
  }, [member, fcmToken, isServiceWorkerRegistered]);
}
