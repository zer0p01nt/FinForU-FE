import { useLocation, useNavigate } from "react-router-dom";
import { GuideIcon, MapIcon, ProductIcon, RatesIcon, WalletIcon } from "./NavigationIcon";
import * as S from "./NavigationStyle";
import { useTranslation } from "react-i18next";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isActive = (path) => location.pathname === path;

  return (
    <S.Container>
      <S.Button $isActive={isActive("/guide")} onClick={() => navigate("/guide")}>
        <GuideIcon />
        <div>{t("nav.guide")}</div>
      </S.Button>
      <S.Button $isActive={isActive("/map")} onClick={() => navigate("/map")}>
        <MapIcon />
        <div>{t("nav.map")}</div>
      </S.Button>
      <S.Button $isActive={isActive("/product")} onClick={() => navigate("/product")}>
        <ProductIcon />
        <div>{t("nav.product")}</div>
      </S.Button>
      <S.Button $isActive={isActive("/rates")} onClick={() => navigate("/rates")}>
        <RatesIcon />
        <div>{t("nav.rates")}</div>
      </S.Button>
      <S.Button $isActive={isActive("/wallet")} onClick={() => navigate("/wallet")}>
        <WalletIcon />
        <div>{t("nav.wallet")}</div>
      </S.Button>
    </S.Container>
  );
}
