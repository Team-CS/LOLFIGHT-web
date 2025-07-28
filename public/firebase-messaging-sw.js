importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDoeLLtBashU2pBC2qth_3f9QEarN0v4RI",
  authDomain: "lolfight-658a5.firebaseapp.com",
  projectId: "lolfight-658a5",
  storageBucket: "lolfight-658a5.appspot.com",
  messagingSenderId: "1090242958572",
  appId: "1:1090242958572:web:1e2b1e2b1e2b1e2b1e2b1e",
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   const { title, body } = payload.notification;
//   const notificationOptions = {
//     body,
//     icon: "/LOLFIGHT_NONE_TEXT.png",
//   };

//   self.registration.showNotification(title, notificationOptions);
// });
