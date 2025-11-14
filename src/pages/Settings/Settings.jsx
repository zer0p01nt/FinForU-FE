import { useEffect } from "react";
import { useHeaderStore } from "../../stores/headerStore";
import { useTranslation } from "react-i18next";
import * as S from "./SettingsStyle";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import GoToLogin from "../../components/go-to-login/GoToLogin";
import { helmetTitle } from "../../constants/title";
import { useAuthStore } from "../../stores/authStore";

export default function Settings() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.settings"),
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  const handleLogout = async () => {
    try {
      await api.post("/api/members/logout");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Failed to logout.");
    }
  };

  // 로그인 상태 확인해서 비로그인 상태면 로그인 필요 컴포넌트 띄우기
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  if (!isLoggedIn) return <GoToLogin />;

  return (
    <>
      <title>{`Settings${helmetTitle}`}</title>
      <S.Container>
        <S.Btn onClick={() => navigate("/settings/edit-information")}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.7225 0.469259L1.59768 16.5941C1.35663 16.8345 1.19857 17.1456 1.14648 17.4821L0.0184809 24.8325C-0.0195826 25.0807 0.00133377 25.3345 0.0795366 25.5731C0.15774 25.8118 0.291032 26.0287 0.468629 26.2063C0.646226 26.3839 0.863139 26.5172 1.10181 26.5954C1.34049 26.6736 1.59422 26.6945 1.84248 26.6565L9.19448 25.5285C9.53075 25.4768 9.84181 25.3193 10.0825 25.0789L26.2073 8.95406C26.5072 8.65401 26.6757 8.24712 26.6757 7.82286C26.6757 7.3986 26.5072 6.9917 26.2073 6.69166L19.9833 0.467659C19.6833 0.168194 19.2768 0 18.8529 0C18.429 0 18.0225 0.168194 17.7225 0.467659M3.51288 23.1637L4.22968 18.4853L18.8537 3.86126L22.8137 7.82286L8.18968 22.4469L3.51288 23.1637Z"
                fill="#0093DD"
              />
            </svg>
            <S.Text>{t("settings.editInfo")}</S.Text>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="13"
            viewBox="0 0 8 13"
            fill="none"
          >
            <path
              d="M8.29697e-05 1.05997L1.06108 -2.86102e-05L6.84008 5.77697C6.93324 5.86954 7.00717 5.97961 7.05761 6.10086C7.10806 6.22211 7.13403 6.35214 7.13403 6.48347C7.13403 6.6148 7.10806 6.74483 7.05761 6.86608C7.00717 6.98733 6.93324 7.0974 6.84008 7.18997L1.06108 12.97L0.0010829 11.91L5.42508 6.48497L8.29697e-05 1.05997Z"
              fill="#7C7C7C"
            />
          </svg>
        </S.Btn>
        <S.LogoutBtn onClick={handleLogout}>{t("settings.logout")}</S.LogoutBtn>
      </S.Container>
    </>
  );
}
