import { useEffect } from "react";
import { messaging } from "@/src/firebase/firebase.client";
import { getToken, Messaging, onMessage } from "firebase/messaging";
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
    if (!member || !messaging) {
      return;
    }

    if (!isServiceWorkerRegistered && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => {
          setServiceWorkerRegistered(true);
        })
        .catch((error) => console.error("등록 실패 : ", error));
    }

    const token = getCookie("lf_rtk");

    if (!fcmToken && token) {
      if ("Notification" in window) {
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              return getToken(messaging as Messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
              });
            }
          })
          .then((currentToken) => {
            if (currentToken) {
              setFcmToken(currentToken);
              updateMemberFCMToken(currentToken);
            }
          })
          .catch((err) => {
            console.error("FCM 토큰 발급 실패:", err);
          });
      } else {
        console.log("이 브라우저는 Notification API를 지원하지 않습니다.");
      }
    }

    onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      if (title && body && document.visibilityState === "visible") {
        toast.info(
          <div
            onClick={() => {
              router.push("/alarm");
            }}
            className="cursor-pointer"
          >
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        );
      }

      // if ("Notification" in window && title && body) {
      //   new Notification(title, { body, icon: "/LOLFIGHT_NONE_TEXT.png" });
      // }
    });
  }, [member, fcmToken, isServiceWorkerRegistered]);
}
