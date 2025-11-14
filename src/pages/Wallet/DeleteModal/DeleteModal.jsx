import { useTranslation } from "react-i18next";
import * as S from "./DeleteModalStyle";
import { useCallback, useState } from "react";
import api from "../../../api/api";

/**
 * 상품 삭제 확인 모달 컴포넌트
 * @param {object} props
 * @param {{ value: string, label: string }} props.type - 상품 타입 (checking, savings, card)
 * @param {number} props.id - 삭제할 상품의 ID
 * @param {function} props.onClose - 모달을 닫는 함수 (Wallet.jsx의 closeModal)
 */
export default function DeleteModal({ type, id, onClose }) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  // 탈출문자 개행 처리
  const msg = t("wallet.deleteMsg").split("\n");

  // API 엔드포인트 설정
  const getApiUrl = useCallback((type, id) => {
    let endpoint = "";
    if (type === "checking") {
      endpoint = `/api/wallet/check-account/${id}`;
    } else if (type === "savings") {
      endpoint = `/api/wallet/save-account/${id}`;
    } else if (type === "card") {
      endpoint = `/api/wallet/card/${id}`;
    }
    return endpoint;
  }, []);

  // 삭제 처리 로직
  const handleDelete = useCallback(async () => {
    if (isDeleting || !id) return;

    const url = getApiUrl(type.value, id);

    if (!url) {
      alert("Please select a valid product.");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await api.delete(url);

      if (res.status === 200 || res.status === 204) {
        // 204 No Content도 성공으로 처리
        alert("Deleted successfully.");
        onClose(); // 성공 시 모달 닫기 -> Wallet에서 데이터 재조회 처리
      } else {
        throw new Error("API response error");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the product.");
    } finally {
      setIsDeleting(false);
    }
  }, [id, type.value, getApiUrl, isDeleting, onClose]);

  // 닫기 로직
  const handleClose = useCallback(
    (e) => {
      if (e.target === e.currentTarget && !isDeleting) {
        onClose();
      }
    },
    [onClose, isDeleting]
  );

  // 취소 로직
  const handleCancel = useCallback(() => {
    if (!isDeleting) {
      onClose();
    }
  }, [isDeleting, onClose]);

  return (
    <S.Overlay onClick={handleClose}>
      <S.Container>
        <S.Title>{t("delete")}</S.Title>
        <S.Msg>
          {msg.map((m, i) => (
            <div key={i}>{m}</div>
          ))}
        </S.Msg>
        <S.BtnWrapper>
          <S.GrayBtn onClick={handleCancel} disabled={isDeleting}>
            {t("cancel")}
          </S.GrayBtn>
          <S.BlueBtn onClick={handleDelete} disabled={isDeleting}>
            {t("confirm")}
          </S.BlueBtn>
        </S.BtnWrapper>
      </S.Container>
    </S.Overlay>
  );
}
