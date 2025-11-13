import { useNavigate } from "react-router-dom";
import * as S from "./HomeStyle";
import World from "./icon/world.svg?react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import OnBoarding from "./OnBoarding/OnBoarding";

export default function Home() {
  const {
    t,
    i18n,
    i18n: { language: lang },
  } = useTranslation();
  const navigate = useNavigate();
  // 이미 언어가 선택되어 있는지 여부 -> 바로 하단 버튼 보이도록
  const isLanguageSelected = lang && (lang === "en" || lang === "zh" || lang === "vi");
  const [isVisible, setIsVisible] = useState(isLanguageSelected);

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
    // 처음 눌렸을 때만 BtnBox 보이도록 설정
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  return (
    <OnBoarding>
      <S.Container>
        <S.DescWrapper>
          <World />
          <S.SelectMsg>
            <div>Select Language</div>
            <S.Chinese>选择语言</S.Chinese>
            <div>Chọn ngôn ngữ﻿</div>
          </S.SelectMsg>
        </S.DescWrapper>
        <S.SelectBtnWrapper onChange={handleChange}>
          <input
            type="radio"
            id="lang-en"
            name="language"
            value="en"
            checked={lang === "en"}
            readOnly={true}
          />
          <label htmlFor="lang-en">English</label>
          <input
            type="radio"
            id="lang-zh"
            name="language"
            value="zh"
            checked={lang === "zh"}
            readOnly={true}
          />
          <label htmlFor="lang-zh">中文</label>
          <input
            type="radio"
            id="lang-vi"
            name="language"
            value="vi"
            checked={lang === "vi"}
            readOnly={true}
          />
          <label htmlFor="lang-vi">Tiếng Việt</label>
        </S.SelectBtnWrapper>
        <S.BtnBox $isVisible={isVisible}>
          <S.LoginBtn onClick={() => navigate("/login")}>{t("onBoarding.loginJoin")}</S.LoginBtn>
          <S.GuestBtn onClick={() => navigate("/guide")}>
            {t("onBoarding.continueAsGuest")}
          </S.GuestBtn>
        </S.BtnBox>
      </S.Container>
    </OnBoarding>
  );
}
