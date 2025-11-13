import { useCallback, useEffect, useState } from "react";
import { useHeaderStore } from "../../../stores/headerStore";
import { useTranslation } from "react-i18next";
import * as S from "./DeleteAccountStyle";
import DeleteModal from "./DeleteModal/DeleteModal";
import { Helmet } from "react-helmet-async";
import { helmetTitle } from "../../../constants/title";

export default function DeleteAccount() {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("settings.deleteAccount"),
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  return (
    <>
      <Helmet>
        <title>Delete Account{helmetTitle}</title>
      </Helmet>
      <S.Container>
        {isModalOpen && <DeleteModal onClose={closeModal} />}
        <S.Title>{t("settings.deleteDesc")}</S.Title>
        <S.TextBoxWrapper>
          <S.TextBox>
            <S.Title>{t("settings.1title")}</S.Title>
            <S.Text>{t("settings.1desc")}</S.Text>
          </S.TextBox>
          <S.TextBox>
            <S.Title>{t("settings.2title")}</S.Title>
            <S.Text>{t("settings.2desc")}</S.Text>
          </S.TextBox>
          <S.TextBox>
            <S.Title>{t("settings.3title")}</S.Title>
            <S.Text>{t("settings.3desc")}</S.Text>
          </S.TextBox>
        </S.TextBoxWrapper>
        <S.ButtonWrapper>
          <button type="button" onClick={openModal}>
            {t("delete")}
          </button>
        </S.ButtonWrapper>
      </S.Container>
    </>
  );
}
