import axios from "axios";
import i18next from "i18next";
import { LANG_MAP } from "../constants/languageMap";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // 현재 언어를 지정하지 않은 경우 자동으로 영어로
    const currentLang = i18next.language || "en";
    config.headers["Accept-Language"] = currentLang;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
