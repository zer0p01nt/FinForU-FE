import { useTranslation } from "react-i18next";
import * as S from "./StepsStyle";
import AllCheck from "./icon/all-check.svg?react";
import AllCheckChecked from "./icon/all-check-checked.svg?react";
import Term from "../Term/Term";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Step3({ formData, updateFormData, isSubmitted }) {
  const { t } = useTranslation();

  // 약관 목록
  const terms = useMemo(
    () => [
      { value: "agreeToFinForU", label: t("join.agreeToFinForU"), required: true },
      { value: "agreeToAge", label: t("join.agreeToAge"), required: true },
      { value: "agreeToPersonalInfo", label: t("join.agreeToPersonalInfo"), required: true },
      { value: "agreeToPromotionNoti", label: t("join.agreeToPromotionNoti"), required: false },
      { value: "agreeToMarketingNoti", label: t("join.agreeToMarketingNoti"), required: false },
    ],
    [t]
  );

  // 개별 체크 상태 관리
  const [checkedTerms, setCheckedTerms] = useState(() =>
    terms.reduce((acc, term) => ({ ...acc, [term.value]: false }), {})
  );
  // 전체 체크 여부
  const allChecked = useMemo(
    () => terms.every((term) => checkedTerms[term.value]),
    [terms, checkedTerms]
  );

  // 필수 항목 체크 여부
  const requiredTermsChecked = useMemo(
    () => terms.filter((term) => term.required).every((term) => checkedTerms[term.value]),
    [terms, checkedTerms]
  );
  // 부모 컴포넌트에 필수 약관 동의 상태 전달
  useEffect(() => {
    // 필수 약관 체크 상태와 부모의 isStep3Valid 값이 다를 때만 업데이트
    if (formData.isStep3Valid !== requiredTermsChecked) {
      updateFormData({ isStep3Valid: requiredTermsChecked });
    }
  }, [requiredTermsChecked, formData.isStep3Valid, updateFormData]);

  // 개별 체크 박스 핸들러
  const handleCheckToggle = useCallback((value) => {
    setCheckedTerms((prev) => ({ ...prev, [value]: !prev[value] }));
  }, []);
  // 전체 동의 버튼 핸들러
  const handleAllCheck = useCallback(() => {
    const nextChecked = !allChecked;
    setCheckedTerms(terms.reduce((acc, term) => ({ ...acc, [term.value]: nextChecked }), {}));
  }, [terms, allChecked]);

  // 모달 표시 상태 관리
  const [activeTermKey, setActiveTermKey] = useState(null);
  // 모달 열기 핸들러
  const handleViewClick = useCallback((key) => {
    setActiveTermKey(key);
  }, []);
  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setActiveTermKey(null);
  }, []);

  return (
    <S.Container>
      <S.Title>{t("join.pleaseAgree")}</S.Title>
      <S.AllCheckWrapper>
        <button onClick={handleAllCheck}>{allChecked ? <AllCheckChecked /> : <AllCheck />}</button>
        <div onClick={handleAllCheck}>{t("join.agreeAll")}</div>
      </S.AllCheckWrapper>
      <S.ListWrapper>
        {terms.map((term) => (
          <S.List key={term.value}>
            <S.ListTitle onClick={() => handleCheckToggle(term.value)}>
              <S.CheckBtn $checked={checkedTerms[term.value]}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="13"
                  viewBox="0 0 17 13"
                  fill="none"
                >
                  <path
                    d="M5.7 12.025L0 6.325L1.425 4.9L5.7 9.175L14.875 0L16.3 1.425L5.7 12.025Z"
                    fill="#B3B3B3"
                  />
                </svg>
              </S.CheckBtn>
              {term.label}
            </S.ListTitle>
            <S.ViewBtn onClick={() => handleViewClick(term.value)}>{t("join.view")}</S.ViewBtn>
          </S.List>
        ))}
        {activeTermKey && <Term termValue={activeTermKey} onClose={handleCloseModal} />}
      </S.ListWrapper>
    </S.Container>
  );
}
