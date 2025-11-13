import { useTranslation } from "react-i18next";
import * as S from "./DeleteModalStyle";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../../api/api";

export default function DeleteModal({ onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // 컴포넌트 마운트 상태 추적을 위한 Ref -> 삭제 중 모달 닫혀도 삭제 계속 진행되도록
  const mountedRef = useRef(true);

  // 컴포넌트 언마운트 시 Ref 값을 false로 변경
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    if (isComplete) {
      // 완료 모달 닫으면 index 경로로 이동
      navigate("/", { replace: true }); // 뒤로가기 방지
    }
    onClose(); // props로 받은 모달 닫기 로직
  }, [isComplete, onClose, navigate]);

  // 삭제 API 요청 핸들러
  const handleDeleteAccount = async () => {
    if (isLoading) return; // 중복 요청 방지

    setIsLoading(true);
    let currentPassword = null;

    // 현재 계정 비밀번호 가져오는 작업
    try {
      const passwordRes = await api.get("/api/members/me");
      currentPassword = passwordRes.data.password;
      if (!currentPassword) {
        throw new Error("Failed to get password.");
      }
    } catch (error) {
      if (!mountedRef.current) return;
      console.error("비밀번호 가져오기 실패", error);
      setIsLoading(false);
      return;
    }

    // 비밀번호 활용해 계정 삭제하는 작업
    try {
      const response = await api.delete("/api/members/me", {
        data: {
          password: currentPassword,
        },
      });
      if (!mountedRef.current) return;
      if (response.status === 204) {
        setIsComplete(true);
      } else if (response.status === 401) {
        alert("Failed to delete account.\nPlease check login status.");
      } else {
        alert("Failed to delete account.");
      }
      if (!mountedRef.current) return;
      setIsLoading(false);
    } catch {
      alert("Failed to delete account.");
      setIsLoading(false);
    } finally {
      if (!mountedRef.current) return;
      setIsLoading(false);
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <S.Overlay onClick={handleClose}>
      <S.Container onClick={handleModalClick}>
        <S.XBtn onClick={handleClose}>
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
        <S.Box>
          <S.Text>{isComplete ? t("settings.completeDelete") : t("settings.deleteMsg")}</S.Text>
          {!isComplete && (
            <S.ButtonWrapper>
              <S.GrayBtn onClick={handleClose}>{t("cancel")}</S.GrayBtn>
              <S.BlueBtn onClick={handleDeleteAccount} disabled={isLoading}>
                {t("delete")}
              </S.BlueBtn>
            </S.ButtonWrapper>
          )}
        </S.Box>
      </S.Container>
    </S.Overlay>
  );
}
