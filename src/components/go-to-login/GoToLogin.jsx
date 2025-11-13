import { useTranslation } from "react-i18next";
import * as S from "./GoToLoginStyle";
import { useLocation, useNavigate } from "react-router-dom";
import Error from "./icon/error.svg?react";
import { useEffect } from "react";
import { useHeaderStore } from "../../stores/headerStore";

export default function GoToLogin() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  // 환경설정, 월렛에서만 쓰이므로 nav바 타이틀을 이렇게 지정
  const title = location.pathname === "/settings" ? t("nav.settings") : t("nav.wallet");
  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: title,
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);
  return (
    <S.Container>
      <Error />
      <S.Text>{t("settings.loginToSee")}</S.Text>
      <S.Button onClick={() => navigate("/login")}>{t("settings.goToLogin")}</S.Button>
    </S.Container>
  );
}
