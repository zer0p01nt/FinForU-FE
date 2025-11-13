import { useCallback, useEffect, useState } from "react";
import { requestForToken } from "../firebase";
import api from "../api/api";

export const useFCMTokenRegistration = (getNotify, memberId) => {
  const [token, setToken] = useState("");
  const [permission, setPermission] = useState(Notification.permission);

  const fetchAndRegisterToken = useCallback(async () => {
    if (!getNotify || !memberId) return;

    if (Notification.permission === "default") {
      const p = await Notification.requestPermission();
      setPermission(p);
      if (p !== "granted") {
        console.log("Notification permission not granted.");
        return;
      }
    }

    if (Notification.permission !== "granted") {
      console.log("Cannot fetch token: Notification permission is denied.");
      return;
    }

    let fcmToken;
    try {
      fcmToken = await requestForToken();
      if (!fcmToken) {
        console.error("FCM Token is null or undefined.");
        return;
      }
      setToken(fcmToken);
      console.log("FCM Token fetched:", fcmToken);
    } catch (error) {
      console.error("Error fetching FCM token:", error);
      return;
    }

    const registerData = {
      memberId: memberId,
      token: fcmToken,
    };

    try {
      const res = await api.post("/api/push/register", registerData);
      if (res.status === 200) {
        console.log("FCM Token successfully registered/updated for member:", memberId);
      }
    } catch (error) {
      console.error("Error registering FCM token on server:", error);
    }
  }, [getNotify, memberId]);

  // 초기 로딩 시 실행
  useEffect(() => {
    if (memberId && shouldRegister) {
      fetchAndRegisterToken();
    }
  }, [memberId, getNotify, fetchAndRegisterToken]);
};
