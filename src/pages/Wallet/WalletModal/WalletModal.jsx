import * as S from "./WalletModalStyle";
import * as J from "../../Join/Steps/StepsStyle";
import Dropdown from "../../../components/dropdown/Dropdown";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import api from "../../../api/api";

/**
 * 월렛 페이지에서 추가/수정 시 뜨는 모달창 컴포넌트
 * @param {object} props
 * @param {{ value: string, label: string }} props.type - 상품의 타입(checking, savings, card)
 * * value는 실제 컴포넌트 구성 및 API 요청에 반영, label은 다국어 처리를 한 텍스트 (헤더에 표시)
 * @param {{ value: string, label: string }} props.modalType - 모달의 타입(add, edit)
 * * value는 실제 컴포넌트 구성 및 API 요청에 반영, label은 다국어 처리를 한 텍스트 (헤더에 표시)
 * @param {number} props.id - 상품의 id (modalType이 edit인 경우에만)
 * @param {function} props.onClose - 모달을 닫는 함수
 */
export default function WalletModal({ type, modalType, id = null, onClose }) {
  const { t } = useTranslation();

  // 초기값 (add일 경우)
  const initialFormData = {
    bank: "",
    productType: "",
    productName: "",
    // card일 때
    cardType: "",
    cardName: "",
    start: "",
    end: "",
    monthlyPayment: "",
    upcomingDate: "",
  };

  // 초기 상태값
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 은행 드롭다운 값
  const bankName = { value: "bank", label: t("product.bank") };
  const bankArray = [
    { value: "SHINHAN", label: t("banks.shinhan") },
    { value: "HANA", label: t("banks.hana") },
    { value: "KOOKMIN", label: t("banks.kookmin") },
    { value: "WOORI", label: t("banks.woori") },
    { value: "OTHERS", label: t("others") },
  ];

  // 상품 타입 값
  const savingsTypes = [
    { value: "DEPOSIT", label: t("deposit") },
    { value: "INSTALLMENT", label: t("installmentSavings") },
  ];
  const cardTypes = [
    { value: "CHECK", label: t("wallet.check") },
    { value: "CREDIT", label: t("wallet.credit") },
  ];

  // 날짜 포맷팅
  const formatDate = useCallback((value) => {
    const cleaned = String(value).replace(/[^0-9]/g, "");
    const month = cleaned.substring(0, 2);
    const year = cleaned.substring(2, 6);

    if (cleaned.length === 0) return "";

    // 2글자 이상 입력되면 자동으로 '/'를 추가하여 보여줌
    if (cleaned.length > 2) {
      return `${month}/${year}`;
    }
    return month;
  }, []);

  // 입력 필드 포맷팅 & 변경 핸들러
  const handleChange = useCallback((field, value) => {
    let cleanValue = value;

    // MM/YYYY로 보이지만 MMYYYY를 저장
    if (field === "start" || field === "end") {
      cleanValue = String(value)
        .replace(/[^0-9]/g, "")
        .substring(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: cleanValue, // 순수 값 저장
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }, []);

  // productType/cardType 버튼 클릭 핸들러
  const handleTypeClick = useCallback(
    (typeValue) => {
      const field = type.value === "card" ? "cardType" : "productType";
      handleChange(field, typeValue);

      // CHECK 카드를 선택하면 납부일자 필드 초기화/비활성화
      if (type.value === "card" && typeValue === "CHECK") {
        handleChange("upcomingDate", "");
      }
    },
    [handleChange, type.value]
  );

  // 유효성 검사
  const validateForm = useCallback(() => {
    const newErrors = {};
    const data = formData;

    // 공통
    if (!data.bank) {
      newErrors.bank = "Please select a bank.";
    }

    // savings일 때
    if (type.value === "savings") {
      if (!data.productType) {
        newErrors.productType = "Please select the product type.";
      }
      if (!data.productName) {
        newErrors.productName = "Please enter the product name.";
      }

      const dateRegex = /^(0[1-9]|1[0-2])\d{4}$/; // MMYYYY 형식

      if (!data.start || !dateRegex.test(data.start))
        newErrors.start = "Please enter the exact start date.";
      if (!data.end || !dateRegex.test(data.end))
        newErrors.end = "Please enter the exact end date.";

      const payAmount = Number(data.monthlyPayment);
      if (!data.monthlyPayment || isNaN(payAmount))
        newErrors.monthlyPayment = "Please enter the exact monthly payment.";

      // Optional이지만 입력 시 형식 검사
      const paymentDay = Number(data.upcomingDate);
      if (data.upcomingDate && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31)) {
        newErrors.upcomingDate = "Please enter the exact payment date.";
      }
    }

    // card일 때 === upcomingDate
    else if (type.value === "card") {
      if (!data.cardType) {
        newErrors.cardType = "Please select the card type.";
      }
      if (!data.cardName) {
        newErrors.cardName = "Please enter the card name.";
      }

      const paymentDay = Number(data.upcomingDate);

      // Credit 카드일 경우 납부일자 필수
      if (data.cardType === "CREDIT" && !data.upcomingDate) {
        newErrors.upcomingDate = "Please enter the exact payment date.";
      }
      // 입력했을 경우 형식 검사
      else if (data.upcomingDate && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31)) {
        newErrors.upcomingDate = "Please enter the exact payment date.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, type]);

  // MMYYYY -> YYYY-MM-01 변환 (LocalDate로 변환)
  const transformDateToApi = useCallback((mmYYYY) => {
    if (!mmYYYY || mmYYYY.length !== 6) return "";

    const month = mmYYYY.substring(0, 2);
    const year = mmYYYY.substring(2, 6);
    return `${year}-${month}-01`;
  }, []);

  // API 요청 로직
  const getApiInfo = (type, modalType, id) => {
    let url = "";
    if (type === "checking") url = "/api/wallet/check-account";
    else if (type === "savings") url = "/api/wallet/save-account";
    else if (type === "card") url = "/api/wallet/card";

    // edit 모드이고 id가 있을 경우 URL에 id를 추가 (api 개발 후 수정 가능성)
    if (modalType === "edit" && id) {
      url += `/${id}`;
    }

    const method = modalType === "add" ? "post" : "put";

    return { url, method };
  };

  // API 요청 시 데이터 매핑 및 불필요 필드 제거 유틸리티 함수
  const prepareDataForApi = useCallback(
    (data, currentType, currentModalType, itemId) => {
      const dataToSend = { ...data };

      if (currentModalType.value === "edit" && itemId) {
        if (currentType === "checking") {
          dataToSend.checkingAccountId = itemId;
        } else if (currentType === "savings") {
          dataToSend.savingAccountId = itemId;
        } else if (currentType === "card") {
          dataToSend.cardId = itemId;
        }
      }

      // 날짜 포맷 변경
      if (currentType === "savings") {
        dataToSend.start = transformDateToApi(data.start);
        dataToSend.end = transformDateToApi(data.end);
      }

      // 필드 이름 매핑 및 정리
      if (currentType === "card") {
        // cardType/cardName을 productType/productName으로 매핑
        dataToSend.productType = dataToSend.cardType;
        dataToSend.productName = dataToSend.cardName;

        // 불필요한 필드 제거
        delete dataToSend.cardType;
        delete dataToSend.cardName;
        delete dataToSend.start;
        delete dataToSend.end;
        delete dataToSend.monthlyPayment;
      } else if (currentType === "savings") {
        // 불필요한 card 필드 제거
        delete dataToSend.cardType;
        delete dataToSend.cardName;
      } else if (currentType === "checking") {
        // checking일 경우 모든 product, card, date 필드 제거
        delete dataToSend.productType;
        delete dataToSend.productName;
        delete dataToSend.cardType;
        delete dataToSend.cardName;
        delete dataToSend.start;
        delete dataToSend.end;
        delete dataToSend.monthlyPayment;
      }

      return dataToSend;
    },
    [transformDateToApi]
  );

  // Add Another Account 버튼 & Confirm 버튼 공통 추가 로직
  const handleSave = useCallback(
    async (isAddAnother = false) => {
      if (isSubmitting || isLoading) return;

      if (!validateForm()) {
        alert("Please enter all values correctly.");
        return;
      }

      setIsSubmitting(true);
      const { url, method } = getApiInfo(type.value, "add", null);

      const dataToSend = prepareDataForApi(formData, type.value, modalAdd, null);

      try {
        const res = await api[method](url, dataToSend);

        if (res.status === 200 || res.status === 201) {
          if (isAddAnother) {
            setFormData(initialFormData); // 폼 리셋
            setErrors({}); // 에러 리셋
          } else {
            onClose(); // 모달 닫기
          }
        } else {
          throw new Error("API response error");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while adding the product.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      type,
      isSubmitting,
      isLoading,
      validateForm,
      onClose,
      getApiInfo,
      initialFormData,
      prepareDataForApi,
    ]
  );

  // Confirm 버튼 로직 (추가 + 수정 둘 다)
  const handleConfirm = useCallback(async () => {
    if (isSubmitting || isLoading) return;

    if (!validateForm()) {
      alert("Please enter all values correctly.");
      return;
    }

    setIsSubmitting(true);
    const { url, method } = getApiInfo(type.value, modalType.value, id);

    const dataToSend = prepareDataForApi(formData, type.value, modalType, id);

    try {
      console.log(dataToSend);
      const res = await api[method](url, dataToSend);

      if (res.status === 200 || res.status === 201) {
        onClose();
      } else {
        console.error("API response error");
        throw new Error("API response error");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while processing the product.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    modalType,
    validateForm,
    type,
    id,
    onClose,
    formData,
    getApiInfo,
    isSubmitting,
    isLoading,
    prepareDataForApi,
  ]);

  // 모달 밖 클릭 시 닫기
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget && onClose && !isSubmitting && !isLoading) {
        onClose();
      }
    },
    [onClose, isSubmitting, isLoading]
  );

  // card && CHECK일 때 비활성화
  const isUpcomingDateDisabled = type.value === "card" && formData.cardType === "CHECK";

  return (
    <S.Overlay onClick={handleOverlayClick}>
      <S.Container>
        <S.Title>
          {modalType.label} {type.label}
        </S.Title>
        <S.Main>
          <S.Content>
            <S.WalletLabel>
              {t("product.bank")}
              <Dropdown
                name={bankName}
                placeholder={t("pleaseSelect")}
                itemArray={bankArray}
                isWallet={true}
                onSelect={(name, value) => handleChange("bank", value)}
                selectedValue={formData.bank}
              />
              {errors.bank && <J.ValidText>{errors.bank}</J.ValidText>}
            </S.WalletLabel>
            {(type.value === "card" || type.value === "savings") && (
              <>
                <S.WalletLabel>
                  {t("wallet.productType")}
                  <S.ButtonWrapper>
                    {type.value === "savings" &&
                      savingsTypes.map((t) => (
                        <S.TypeBtn
                          key={t.value}
                          onClick={() => handleTypeClick(t.value)}
                          $selected={formData.productType === t.value}
                          disabled={isSubmitting}
                        >
                          {t.label}
                        </S.TypeBtn>
                      ))}
                    {type.value === "card" &&
                      cardTypes.map((t) => (
                        <S.TypeBtn
                          key={t.value}
                          onClick={() => handleTypeClick(t.value)}
                          $selected={formData.cardType === t.value}
                          disabled={isSubmitting}
                        >
                          {t.label}
                        </S.TypeBtn>
                      ))}
                  </S.ButtonWrapper>
                  {errors.productType && <J.ValidText>{errors.productType}</J.ValidText>}
                  {errors.cardType && <J.ValidText>{errors.cardType}</J.ValidText>}
                </S.WalletLabel>
                <S.WalletLabel>
                  {t("wallet.productName")}
                  <S.WalletInput
                    name="name"
                    id="name"
                    placeholder={t("wallet.enterName")}
                    value={type.value === "card" ? formData.cardName : formData.productName}
                    onChange={(e) =>
                      handleChange(
                        type.value === "card" ? "cardName" : "productName",
                        e.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />
                  {errors.productName && type.value === "savings" && (
                    <J.ValidText>{errors.productName}</J.ValidText>
                  )}
                  {errors.cardName && type.value === "card" && (
                    <J.ValidText>{errors.cardName}</J.ValidText>
                  )}
                </S.WalletLabel>
              </>
            )}
            {type.value === "savings" && (
              <>
                <S.WalletLabel>
                  {t("wallet.accountPeriod")}
                  <S.PeriodWrapper>
                    <S.PeriodInput
                      name="start"
                      id="start"
                      placeholder="MM/YYYY"
                      value={formatDate(formData.start)}
                      onChange={(e) => handleChange("start", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                    <S.PeriodBar />
                    <S.PeriodInput
                      name="end"
                      id="end"
                      placeholder="MM/YYYY"
                      value={formatDate(formData.end)}
                      onChange={(e) => handleChange("end", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                  </S.PeriodWrapper>
                  {(errors.start || errors.end) && (
                    <J.ValidText>{errors.start || errors.end}</J.ValidText>
                  )}
                </S.WalletLabel>
                <S.WalletLabel>
                  {t("wallet.monthlyPayment")}
                  <S.InputWrapper>
                    <S.MonthlyInput
                      name="monthlyPayment"
                      id="monthlyPayment"
                      value={formData.monthlyPayment}
                      onChange={(e) => handleChange("monthlyPayment", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                    <S.MonthlyMark>&#8361;</S.MonthlyMark>
                  </S.InputWrapper>
                  {errors.monthlyPayment && <J.ValidText>{errors.monthlyPayment}</J.ValidText>}
                </S.WalletLabel>
              </>
            )}
            {(type.value === "card" || type.value === "savings") && (
              <>
                <S.UpcomingLabel>
                  {type.value === "card"
                    ? t("wallet.upcomingPaymentDate")
                    : t("wallet.upcomingPaymentDateO")}
                  <S.UpcomingDesc>{t("wallet.dateDesc")}</S.UpcomingDesc>
                  <S.InputWrapper>
                    <S.UpcomingInput
                      name="upcomingDate"
                      id="upcomingDate"
                      value={formData.upcomingDate}
                      onChange={(e) => handleChange("upcomingDate", e.target.value)}
                      disabled={isUpcomingDateDisabled || isSubmitting}
                      inputMode="numeric"
                    />
                    <S.DDMark>DD</S.DDMark>
                    <S.DayMark>Day</S.DayMark>
                  </S.InputWrapper>
                  {errors.upcomingDate && <J.ValidText>{errors.upcomingDate}</J.ValidText>}
                </S.UpcomingLabel>
              </>
            )}
          </S.Content>
          {modalType === "add" && (
            <S.AddBtnWrapper>
              <S.AddBtn onClick={() => handleSave(true)} disabled={isSubmitting}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M11 7V11M11 11V15M11 11H15M11 11H7"
                    stroke="#0093DD"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                    stroke="#0093DD"
                    strokeWidth="2"
                  />
                </svg>
                {t("wallet.addAnother")}
              </S.AddBtn>
            </S.AddBtnWrapper>
          )}
        </S.Main>
        <S.BtnWrapper>
          <S.GrayBtn onClick={onClose} disabled={isSubmitting}>
            {t("cancel")}
          </S.GrayBtn>
          <S.BlueBtn onClick={handleConfirm} disabled={isSubmitting}>
            {t("confirm")}
          </S.BlueBtn>
        </S.BtnWrapper>
      </S.Container>
    </S.Overlay>
  );
}
