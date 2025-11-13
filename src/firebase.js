import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  measurementId: import.meta.env.VITE_FB_MEASUREMENT_ID,
};

const VAPID_KEY = import.meta.env.VITE_FB_VAPID_KEY;

const app = initializeApp(firebaseConfig);

export const requestForToken = async () => {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("이 브라우저/환경에서는 FCM Web push 미지원");
      return null;
    }

    // 서비스워커 직접 등록
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("SW registration:", registration);

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.log("❌ getToken 결과가 null");
      return null;
    }
  } catch (err) {
    console.error("토큰 가져오는 중 에러:", err);
    return null;
  }
};
