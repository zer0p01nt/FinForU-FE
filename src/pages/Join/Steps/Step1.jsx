import { useTranslation } from "react-i18next";
import * as S from "./StepsStyle";
import Dropdown from "../../../components/dropdown/Dropdown";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Step1({ formData, updateFormData, isSubmitted }) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState({});
  // const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복 확인 상태
  const [passwordAgain, setPasswordAgain] = useState(""); // 비밀번호 확인 임시 상태

  // 국적 드롭다운 값
  const nationalityName = { value: "nationality", label: t("join.nationality") };
  const nationalityArray = [
    { value: "CHINA", label: t("join.china") },
    { value: "UNITED STATES", label: t("join.us") },
    { value: "VIETNAM", label: t("join.vietnam") },
    { value: "OTHERS", label: t("others") },
  ];

  // 유효성 검사
  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email.";
      isValid = false;
    }
    // 이메일 중복 확인
    // else if (!emailChecked) {
    //   errors.email = "checkEmailDuplication";
    //   isValid = false;
    // }

    if (formData.password.trim().length < 8 || formData.password.trim().length > 64) {
      // 백엔드에서 비밀번호를 8~64자로 받음
      errors.password = "Please enter a valid password.";
      isValid = false;
    } else if (formData.password !== passwordAgain) {
      errors.passwordAgain = "Please enter your password one more time.";
      isValid = false;
    }

    if (!formData.name) {
      errors.name = "Please enter your name.";
      isValid = false;
    }
    if (!formData.nationality) {
      errors.nationality = "Please select your nationality.";
      isValid = false;
    }

    return { errors, isValid };
  }, [formData, passwordAgain]);

  const currentIsValid = useMemo(() => {
    const { isValid } = validateForm();
    return isValid;
  }, [validateForm]);

  useEffect(() => {
    // 부모의 isStep1Valid 값이 현재 계산된 값과 다를 때만 업데이트 요청
    if (formData.isStep1Valid !== currentIsValid) {
      updateFormData({ isStep1Valid: currentIsValid });
    }
  }, [currentIsValid, formData.isStep1Valid, updateFormData]);

  // 유효성 검사 결과 UI 표시 로직
  useEffect(() => {
    if (isSubmitted) {
      const { errors } = validateForm();
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [isSubmitted, validateForm]);

  // 드롭다운 변경 핸들러
  const handleDropdownChange = useCallback(
    (name, value) => {
      updateFormData({ [name]: value });
    },
    [updateFormData]
  );

  return (
    <S.Container>
      <S.Label>
        {t("join.email")}
        <S.Input
          placeholder={t("join.email")}
          value={formData.email}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
          }}
        />
        {isSubmitted && validationErrors.email && (
          <S.ValidText>{validationErrors.email}</S.ValidText>
        )}
      </S.Label>
      <S.Label>
        {t("join.password")}
        <div>
          <S.PWInput
            type="password"
            placeholder={t("join.8Characters")}
            value={formData.password}
            onChange={(e) => updateFormData({ password: e.target.value })}
          />
          <S.PWAgainInput
            type="password"
            placeholder={t("join.passwordAgain")}
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
        </div>
        {isSubmitted && (validationErrors.password || validationErrors.passwordAgain) && (
          <S.ValidText>{validationErrors.password || validationErrors.passwordAgain}</S.ValidText>
        )}
      </S.Label>
      <S.Label>
        {t("join.name")}
        <S.Input
          placeholder="KimMutsa"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
        />
        {isSubmitted && validationErrors.name && <S.ValidText>{validationErrors.name}</S.ValidText>}
      </S.Label>
      <S.Label>
        {t("join.nationality")}
        <Dropdown
          name={nationalityName}
          placeholder={t("pleaseSelect")}
          itemArray={nationalityArray}
          onSelect={handleDropdownChange}
          selectedValue={formData.nationality}
        />
        {isSubmitted && validationErrors.nationality && (
          <S.ValidText>{validationErrors.nationality}</S.ValidText>
        )}
      </S.Label>
    </S.Container>
  );
}
