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
    startDate: "",
    endDate: "",
    monthlyPay: "",
    paymentDate: "",
  };

  // 초기 상태값
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(modalType.value === "edit");

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
    if (field === "startDate" || field === "endDate") {
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

  // productType 버튼 클릭 핸들러
  const handleTypeClick = useCallback(
    (typeValue) => {
      handleChange("productType", typeValue);
      // CHECK 카드를 선택하면 납부일자 필드 초기화/비활성화
      if (type.value === "card" && typeValue === "CHECK") {
        handleChange("paymentDate", "");
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

    // savings이거나 card일 때 === type, name
    if (type.value === "savings" || type.value === "card") {
      if (!data.productType) {
        newErrors.productType = "Please select the product type.";
      }
      if (!data.productName) {
        newErrors.productName = "Please enter the product name.";
      }
    }

    // savings일 때 === date, monthly, paymentDate
    if (type.value === "savings") {
      const dateRegex = /^(0[1-9]|1[0-2])\d{4}$/; // MMYYYY 형식

      if (!data.startDate || !dateRegex.test(data.startDate))
        newErrors.startDate = "Please enter the exact start date.";
      if (!data.endDate || !dateRegex.test(data.endDate))
        newErrors.endDate = "Please enter the exact end date.";

      const payAmount = Number(data.monthlyPay);
      if (!data.monthlyPay || isNaN(payAmount))
        newErrors.monthlyPay = "Please enter the exact monthly payment.";

      // Optional이지만 입력 시 형식 검사
      const paymentDay = Number(data.paymentDate);
      if (data.paymentDate && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31)) {
        newErrors.paymentDate = "Please enter the exact payment date.";
      }
    }

    // card일 때 === paymentDate
    else if (type.value === "card") {
      const paymentDay = Number(data.paymentDate);

      // Credit 카드일 경우 납부일자 필수
      if (data.productType === "CREDIT" && !data.paymentDate) {
        newErrors.paymentDate = "Please enter the exact payment date.";
      }
      // 입력했을 경우 형식 검사
      else if (data.paymentDate && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31)) {
        newErrors.paymentDate = "Please enter the exact payment date.";
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

  // YYYY-MM-01 -> MMYYYY 변환 (LocalDate에서 변환)
  const transformDateFromApi = useCallback((yyyyMMDD) => {
    if (yyyyMMDD || yyyyMMDD.length < 7) return ""; // 최소 7자

    const parts = yyyyMMDD.split("-");
    if (parts.length < 2) return "";

    const year = parts[0];
    const month = parts[1].padStart(2, "0"); // MM 포맷 보장
    return `${month}${year}`; // MMYYYY
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

  // edit일 때 기존 데이터 로딩
  useEffect(() => {
    const fetchInitData = async () => {
      if (modalType.value === "edit") {
        const { url } = getApiInfo(type.value, "edit", id);

        try {
          const res = await api.get(url);
          if (res.data) {
            const loadedData = res.data;
            setFormData({
              bank: loadedData.bank || "",
              productType: loadedData.productType || "",
              productName: loadedData.productName || "",
              startDate: transformDateFromApi(loadedData.startDate),
              endDate: transformDateFromApi(loadedData.endDate),
              monthlyPay: loadedData.monthlyPay || "",
              paymentDate: loadedData.paymentDate || "",
            });
          }
        } catch (error) {
          alert("Failed to load product details for editing.");
          onClose();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchInitData();
  }, [modalType.value, id, type.value, getApiInfo, onClose, transformDateFromApi]);

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

      // 서버에 LocalDate 형태로 보냄
      const dataToSend = { ...formData };
      if (type.value === "savings") {
        dataToSend.startDate = transformDateToApi(formData.startDate);
        dataToSend.endDate = transformDateToApi(formData.endDate);
      }

      try {
        const res = await api[method](url, dataToSend);

        if (res.status === 200 || response.status === 201) {
          if (isAddAnother) {
            // Add Another Account를 누른 경우
            setFormData(initialFormData); // 폼 리셋
          } else {
            // Confirm을 누른 경우 (마지막 계좌 저장)
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
      transformDateToApi,
    ]
  );

  // Confirm 버튼 로직 (추가 + 수정 둘 다)
  const handleConfirm = useCallback(async () => {
    if (isSubmitting || isLoading) return;

    if (modalType.value === "add") {
      // Add일 때는 handleSave (POST)
      await handleSave(false);
    } else {
      // Edit일 때는 PUT
      if (!validateForm()) {
        alert("Please enter all values correctly.");
        return;
      }

      setIsSubmitting(true);
      const { url, method } = getApiInfo(type.value, "edit", id);

      // 서버에 LocalDate 형태로 보냄
      const dataToSend = { ...formData };
      if (type.value === "savings") {
        dataToSend.startDate = transformDateToApi(formData.startDate);
        dataToSend.endDate = transformDateToApi(formData.endDate);
      }

      try {
        const res = await api[method](url, dataToSend);

        if (res.status === 200) {
          onClose(); // 모달 닫기
        } else {
          throw new Error("API response error");
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while adding the product.");
      } finally {
        setIsSubmitting(false);
      }
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
    transformDateToApi,
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
  const isPaymentDateDisabled = type.value === "card" && formData.productType === "CHECK";

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
                          $selected={formData.productType === t.value}
                          disabled={isSubmitting}
                        >
                          {t.label}
                        </S.TypeBtn>
                      ))}
                  </S.ButtonWrapper>
                  {errors.productType && <J.ValidText>{errors.productType}</J.ValidText>}
                </S.WalletLabel>
                <S.WalletLabel>
                  {t("wallet.productName")}
                  <S.WalletInput
                    name="name"
                    id="name"
                    placeholder={t("wallet.enterName")}
                    value={formData.productName}
                    onChange={(e) => handleChange("productName", e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.productName && <J.ValidText>{errors.productName}</J.ValidText>}
                </S.WalletLabel>
              </>
            )}
            {type.value === "savings" && (
              <>
                <S.WalletLabel>
                  {t("wallet.accountPeriod")}
                  <S.PeriodWrapper>
                    <S.PeriodInput
                      name="startDate"
                      id="startDate"
                      placeholder="MM/YYYY"
                      value={formatDate(formData.startDate)}
                      onChange={(e) => handleChange("startDate", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                    <S.PeriodBar />
                    <S.PeriodInput
                      name="endDate"
                      id="endDate"
                      placeholder="MM/YYYY"
                      value={formatDate(formData.endDate)}
                      onChange={(e) => handleChange("endDate", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                  </S.PeriodWrapper>
                  {(errors.startDate || errors.endDate) && (
                    <J.ValidText>{errors.startDate || errors.endDate}</J.ValidText>
                  )}
                </S.WalletLabel>
                <S.WalletLabel>
                  {t("wallet.monthlyPayment")}
                  <S.InputWrapper>
                    <S.MonthlyInput
                      name="monthlyPay"
                      id="monthlyPay"
                      value={formData.monthlyPay}
                      onChange={(e) => handleChange("monthlyPay", e.target.value)}
                      disabled={isSubmitting}
                      inputMode="numeric"
                    />
                    <S.MonthlyMark>&#8361;</S.MonthlyMark>
                  </S.InputWrapper>
                  {errors.monthlyPay && <J.ValidText>{errors.monthlyPay}</J.ValidText>}
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
                      name="paymentDate"
                      id="paymentDate"
                      value={formData.paymentDate}
                      onChange={(e) => handleChange("paymentDate", e.target.value)}
                      disabled={isPaymentDateDisabled || isSubmitting}
                      inputMode="numeric"
                    />
                    <S.DDMark>DD</S.DDMark>
                    <S.DayMark>Day</S.DayMark>
                  </S.InputWrapper>
                  {errors.paymentDate && <J.ValidText>{errors.paymentDate}</J.ValidText>}
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
