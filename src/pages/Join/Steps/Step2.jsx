import { useTranslation } from "react-i18next";
import Dropdown from "../../../components/dropdown/DropDown";
import * as S from "./StepsStyle";
import MultiSelectHeader from "../../../components/multi-select-header/MultiSelectHeader";
import { useCallback, useEffect, useMemo, useState } from "react";
import ToggleSwitch from "../../../components/toggle-switch/ToggleSwitch";

export default function Step2({ formData, updateFormData, isSubmitted }) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState({});

  // 비자 드롭다운 값
  const visaTypeName = { value: "visaType", label: t("join.visaType") };
  // API 수정 요청 필요 -> value 명확히 받아야 환경설정에서도 GET 요청으로 값 가져오기 가능
  const visaTypeArray = [
    { value: "ACADEMIC", main: t("join.academic"), sub: "(D2, D4)" },
    {
      value: "EMPLOYMENT",
      main: t("join.employment"),
      sub: "(E1, E2, E3, E4, E5, E6, E7, E9, H2)",
    },
    { value: "RESIDENCE_FAMILY", main: t("join.residenceFamily"), sub: "(F2, F4, F5, F6)" },
    { value: "INVESTMENT_BUSINESS", main: t("join.investmentBusiness"), sub: "(D7, D8, D9)" },
    { value: "OTHERS", label: t("others") },
  ];

  // 선호 상품 종류 값
  const desireProductsArray = useMemo(
    () => [
      { value: "CARD", label: t("card") },
      { value: "DEPOSIT", label: t("deposit") },
      { value: "INSTALLMENT_SAVINGS", label: t("installmentSavings") },
    ],
    [t]
  );
  const handleProductSelect = useCallback(
    (product) => {
      const prevSelected = formData.desiredProducts || [];
      const newSelected = prevSelected.includes(product.value)
        ? prevSelected.filter((value) => value !== product.value)
        : [...prevSelected, product.value];

      updateFormData({ desiredProducts: newSelected });
    },
    [formData.desiredProducts, updateFormData]
  );

  // 알림 설정
  const initialNotifyState = formData.notify ?? true;
  const [isUpcomingOn, setIsUpcomingOn] = useState(initialNotifyState);
  const [isMaturityOn, setIsMaturityOn] = useState(initialNotifyState);
  const handleUpcomingToggle = useCallback((name, newState) => {
    setIsUpcomingOn(newState);
  }, []);

  const handleMaturityToggle = useCallback((name, newState) => {
    setIsMaturityOn(newState);
  }, []);
  useEffect(() => {
    // 서버에서 구분이 딱히 없으므로 둘 중 하나만 true면 true로
    const newNotifyStatus = isUpcomingOn || isMaturityOn;

    // formData.notify 상태와 다를 때만 업데이트하여 불필요한 렌더링 방지
    if (formData.notify !== newNotifyStatus) {
      updateFormData({ notify: newNotifyStatus });
    }
  }, [isUpcomingOn, isMaturityOn, updateFormData, formData.notify]);

  // 유효성 검사
  const validateForm = useCallback(() => {
    const errors = {};
    let isValid = true;

    if (!formData.visaType) {
      errors.visaType = "Please select your visa type.";
      isValid = false;
    }

    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!formData.visaExpir || !dateRegex.test(formData.visaExpir)) {
      errors.visaExpir = "Please enter a valid visa expiration date.";
      isValid = false;
    } else {
      // 유효한 진짜 날짜인지 검증
      const parts = formData.visaExpir.split("/");
      const month = parseInt(parts[0], 10);
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const dateObject = new Date(year, month - 1, day);
      const dateIsValid =
        !isNaN(dateObject.getTime()) &&
        dateObject.getMonth() === month - 1 &&
        dateObject.getDate() === day;
      if (!dateIsValid) {
        errors.visaExpir = "The entered date is not a real date.";
        isValid = false;
      }
    }

    if (!formData.desiredProducts || formData.desiredProducts.length === 0) {
      errors.desiredProducts = "Please choose your desired product.";
      isValid = false;
    }

    return { errors, isValid };
  }, [formData]);

  const currentIsValid = useMemo(() => {
    const { isValid } = validateForm();
    return isValid;
  }, [validateForm]);

  useEffect(() => {
    if (formData.isStep2Valid !== currentIsValid) {
      updateFormData({ isStep2Valid: currentIsValid });
    }
  }, [currentIsValid, formData.isStep2Valid, updateFormData]);

  useEffect(() => {
    if (isSubmitted) {
      const { errors } = validateForm();
      setValidationErrors(errors);
    } else {
      setValidationErrors({});
    }
  }, [isSubmitted, validateForm]);

  const handleChange = useCallback(
    (name, value) => {
      updateFormData({ [name]: value });
    },
    [updateFormData]
  );

  return (
    <S.Container>
      <S.Label>
        {t("join.visaType")}
        <Dropdown
          name={visaTypeName}
          itemArray={visaTypeArray}
          onSelect={(name, value) => handleChange("visaType", value)}
          selectedValue={formData.visaType}
        />
        {isSubmitted && validationErrors.visaType && (
          <S.ValidText>{validationErrors.visaType}</S.ValidText>
        )}
      </S.Label>
      <S.Label>
        {t("join.visaExpirationDate")}
        <S.Input
          placeholder="MM/DD/YYYY"
          value={formData.visaExpir || ""}
          onChange={(e) => handleChange("visaExpir", e.target.value)}
        />
        {isSubmitted && validationErrors.visaExpir && (
          <S.ValidText>{validationErrors.visaExpir}</S.ValidText>
        )}
      </S.Label>
      <S.Label>
        <MultiSelectHeader header={t("join.desiredProductType")} />
        <S.ButtonWrapper>
          {desireProductsArray.map((product) => (
            <S.Button
              key={product.value}
              onClick={() => handleProductSelect(product)}
              $selected={(formData.desiredProducts || []).includes(product.value)}
            >
              {product.label}
            </S.Button>
          ))}
        </S.ButtonWrapper>
        {isSubmitted && validationErrors.desiredProducts && (
          <J.ValidText>{validationErrors.desiredProducts}</J.ValidText>
        )}
      </S.Label>
      <S.Label>
        {t("join.notificationSettings")}
        <S.ToggleWrapper>
          <div>{t("join.upcomingPaymentReminder")}</div>
          <ToggleSwitch
            name="upcomingPaymentReminder"
            initialValue={isUpcomingOn}
            onChange={handleUpcomingToggle}
          />
        </S.ToggleWrapper>
        <S.ToggleWrapper>
          <div>{t("join.maturityDateReminder")}</div>
          <ToggleSwitch
            name="maturityDateReminder"
            initialValue={isMaturityOn}
            onChange={handleMaturityToggle}
          />
        </S.ToggleWrapper>
      </S.Label>
    </S.Container>
  );
}
