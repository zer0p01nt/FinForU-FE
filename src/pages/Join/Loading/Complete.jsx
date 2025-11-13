import { useTranslation } from "react-i18next";
import * as S from "./LoadingCompleteStyle";
import CompleteCheck from "./icon/complete.svg?react";
import { useNavigate } from "react-router-dom";

export default function Complete() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <S.Container>
      <CompleteCheck />
      <S.Text>{t("join.complete")}</S.Text>
      <S.Button onClick={() => navigate("/guide")}>{t("confirm")}</S.Button>
    </S.Container>
  );
}
