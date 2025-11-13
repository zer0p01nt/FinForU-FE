import { useTranslation } from "react-i18next";
import * as S from "./TermStyle";
import ReactMarkdown from "react-markdown";
import { useCallback, useEffect } from "react";

export default function Term({ termValue, onClose }) {
  const { t } = useTranslation();
  const isVisible = !!termValue;

  // 모달 열려있는 동안 스크롤 막기
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isVisible]);

  // 모달 오버레이 클릭 시 닫기
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );
  // X 버튼 클릭 시 닫기
  const handleXBtnClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClose();
    },
    [onClose]
  );

  if (!termValue) return null;

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Container>
        <S.XBtn onClick={handleXBtnClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.274175 0.274175C0.449957 0.0986117 0.688237 0 0.936675 0C1.18511 0 1.42339 0.0986117 1.59918 0.274175L16.5992 15.2742C16.6913 15.36 16.7652 15.4635 16.8164 15.5785C16.8676 15.6935 16.8952 15.8176 16.8974 15.9435C16.8996 16.0694 16.8765 16.1944 16.8293 16.3112C16.7822 16.4279 16.712 16.534 16.623 16.623C16.534 16.712 16.4279 16.7822 16.3112 16.8293C16.1944 16.8765 16.0694 16.8996 15.9435 16.8974C15.8176 16.8952 15.6935 16.8676 15.5785 16.8164C15.4635 16.7652 15.36 16.6913 15.2742 16.5992L0.274175 1.59918C0.0986117 1.42339 0 1.18511 0 0.936675C0 0.688237 0.0986117 0.449957 0.274175 0.274175Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.5991 0.274175C16.7746 0.449957 16.8733 0.688237 16.8733 0.936675C16.8733 1.18511 16.7746 1.42339 16.5991 1.59918L1.59908 16.5992C1.42136 16.7648 1.1863 16.8549 0.943422 16.8506C0.700546 16.8464 0.468814 16.748 0.297048 16.5762C0.125282 16.4044 0.0268923 16.1727 0.022607 15.9298C0.0183217 15.687 0.108475 15.4519 0.274075 15.2742L15.2741 0.274175C15.4499 0.0986117 15.6881 0 15.9366 0C16.185 0 16.4233 0.0986117 16.5991 0.274175Z"
              fill="black"
            />
          </svg>
        </S.XBtn>
        <S.Title>
          <ReactMarkdown>{t(`terms.${termValue}.title`)}</ReactMarkdown>
        </S.Title>
        <S.Content>
          <ReactMarkdown>{t(`terms.${termValue}.content`)}</ReactMarkdown>
        </S.Content>
      </S.Container>
    </S.Overlay>
  );
}
