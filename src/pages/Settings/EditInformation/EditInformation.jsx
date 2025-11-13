import { useCallback, useEffect, useMemo, useState } from "react";
import { useHeaderStore } from "../../../stores/headerStore";
import { useTranslation } from "react-i18next";

import * as S from "./EditInformationStyle";
import * as J from "../../Join/Steps/StepsStyle";
import Dropdown from "../../../components/dropdown/Dropdown";
import MultiSelectHeader from "../../../components/multi-select-header/MultiSelectHeader";
import ToggleSwitch from "../../../components/toggle-switch/ToggleSwitch";
import ButtonGroup from "../../../components/button-group/ButtonGroup";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import LoadingSpinner from "../../../components/loading-spinner/LoadingSpinner";
import { helmetTitle } from "../../../constants/title";
import { requestForToken } from "../../../firebase";

export default function EditInformation() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // 폼 데이터 상태
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false); // 저장 버튼 클릭 여부
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordAgain, setPasswordAgain] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isNotifyOn, setIsNotifyOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // 초기 API 호출 시작 시 true
  const [initialNotifyStatus, setInitialNotifyStatus] = useState(true); // 초기 알림 상태 저장

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("settings.editInfo"),
      showBackBtn: true, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  // API 호출로 유저 데이터 초기화
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/members/me");
        const userData = response.data;

        let formattedVisaExpir = userData.visaExpir;
        if (userData.visaExpir) {
          // 백엔드 Timestamp 문자열을 Date 객체로 파싱
          const date = new Date(userData.visaExpir);

          // 날짜가 유효한지 확인
          if (!isNaN(date.getTime())) {
            // 월, 일, 년을 추출하여 MM/DD/YYYY 형식으로 포맷팅
            const month = String(date.getUTCMonth() + 1).padStart(2, "0");
            const day = String(date.getUTCDate()).padStart(2, "0");
            const year = date.getUTCFullYear();

            formattedVisaExpir = `${month}/${day}/${year}`;
          }
        }

        setFormData({
          ...userData,
          visaExpir: formattedVisaExpir,
          desiredProducts: userData.desiredProductTypes,
        });
        const currentNotify = userData.notify ?? true;
        setIsNotifyOn(currentNotify);
        setInitialNotifyStatus(currentNotify);
      } catch (error) {
        alert("Failed to get user information.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const updateFormData = useCallback((newValues) => {
    setFormData((prev) => ({ ...prev, ...newValues }));
  }, []);

  // 국적 드롭다운 값
  const nationalityName = { value: "nationality", label: t("join.nationality") };
  const nationalityArray = [
    { value: "CHINA", label: t("join.china") },
    { value: "UNITED STATES", label: t("join.us") },
    { value: "VIETNAM", label: t("join.vietnam") },
    { value: "OTHERS", label: t("others") },
  ];

  // 언어 드롭다운 값
  const languageName = { value: "language", label: t("settings.language") };
  const languageArray = [
    { value: "ENGLISH", label: "English" },
    { value: "CHINESE", label: "中文" },
    { value: "VIETNAMESE", label: "Tiếng Việt" },
  ];

  // 비자 드롭다운 값
  const visaTypeName = { value: "visaType", label: t("join.visaType") };
  const visaTypeArray = useMemo(
    () => [
      { value: "ACCOUNT_OPEN", main: t("join.academic"), sub: "(D2, D4)" },
      {
        value: "ACCOUNT_OPEN",
        main: t("join.employment"),
        sub: "(E1, E2, E3, E4, E5, E6, E7, E9, H2)",
      },
      { value: "CARD_AVAILABLE", main: t("join.residenceFamily"), sub: "(F2, F4, F5, F6)" },
      { value: "ACCOUNT_OPEN", main: t("join.investmentBusiness"), sub: "(D7, D8, D9)" },
      { value: "ACCOUNT_OPEN", label: t("others") },
    ],
    [t]
  );

  // 선호 상품 종류 값
  const desireProductsArray = useMemo(
    () => [
      { value: "CARD", label: t("card") },
      { value: "CHECKING_ACCOUNT", label: t("checkingAccount") },
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

  // 드롭다운 변경 핸들러
  const handleDropdownChange = useCallback(
    (name, value) => {
      updateFormData({ [name]: value });
    },
    [updateFormData]
  );

  // 알림 설정 토글 핸들러
  const handleNotifyToggle = useCallback(
    (name, newState) => {
      setIsNotifyOn(newState);
      updateFormData({ notify: newState });
    },
    [updateFormData]
  );

  // 유효성 검사
  const validateForm = useCallback(() => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email.";
      isValid = false;
    }

    if (newPassword.length > 0) {
      if (newPassword.trim().length < 4) {
        errors.newPassword = "Please enter a valid password.";
        isValid = false;
      } else if (newPassword !== passwordAgain) {
        errors.passwordAgain = "Please enter your password one more time.";
        isValid = false;
      }
    }

    if (!formData.name) {
      errors.name = "Please enter your name.";
      isValid = false;
    }

    if (!formData.nationality) {
      errors.nationality = "Please select your nationality.";
      isValid = false;
    }

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
  }, [formData, newPassword, passwordAgain]);

  // 정보 수정 저장 로직
  const handleSave = async () => {
    setIsSubmitted(true);
    const { errors, isValid } = validateForm();
    setValidationErrors(errors);

    if (isValid) {
      try {
        setIsLoading(true);
        // 비밀번호가 변경되었으면 formData에 반영
        const newData = { ...formData };
        if (newPassword.length >= 4) {
          newData.password = newPassword;
        }

        const visaExpirDateString = newData.visaExpir;

        if (visaExpirDateString) {
          // MM/DD/YYYY -> YYYY-MM-DD로 변환
          const isoDate = visaExpirDateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
          // UTC 자정 Timestamp 형식으로 변환하여 백엔드 전송 데이터에 덮어쓰기
          newData.visaExpir = `${isoDate}T00:00:00.000Z`;
        } else {
          delete newData.visaExpir; // 혹시라도 null/undefined라면 삭제 (PATCH의 경우)
        }

        newData.desiredProductTypes = newData.desiredProducts;
        delete newData.desiredProducts; // 기존 필드는 삭제하여 서버 혼동 방지

        // 실제 API 호출: PATCH 또는 PUT
        await api.patch("/api/members/me", newData);
        const memberId = formData.memberId || formData.id || formData.member_id;

        // 알림 설정 변경 로직
        if (memberId) {
          // true -> false
          if (initialNotifyStatus === true && isNotifyOn === false) {
            console.log("Notification turned OFF. Deactivating FCM token...");
            try {
              const fcmToken = await requestForToken();
              if (fcmToken) {
                const deactivateData = { memberid: memberId, token: fcmToken };
                await api.post("/api/push/deactivate", deactivateData);
                console.log(`FCM Token deactivated successfully for member: ${memberId}`);
              }
            } catch (error) {
              console.error("Failed to deactivate FCM token:", error);
            }
          }

          // false -> true
          else if (initialNotifyStatus === false && isNotifyOn === true) {
            console.log("Notification turned ON. Registering FCM token...");
            try {
              // 알림 권한 요청 (만약 이전에 거부했다면 다시 요청)
              if (Notification.permission === "default") {
                await Notification.requestPermission();
              }

              if (Notification.permission === "granted") {
                const fcmToken = await requestForToken();
                if (fcmToken) {
                  const registerData = { memberid: memberId, token: fcmToken };
                  await api.post("/api/push/register", registerData);
                  console.log(`FCM Token registered successfully for member: ${memberId}`);
                } else {
                  console.warn("FCM Token not available, cannot register push notifications.");
                }
              } else {
                console.warn("Cannot register token: Notification permission is denied by user.");
              }
            } catch (error) {
              console.error("Failed to register FCM token:", error);
            }
          }
        } else {
          console.error("Member ID not found for token activation/deactivation.");
        }

        alert("Your changed information has been saved successfully.");
        setInitialNotifyStatus(isNotifyOn);
        navigate(-1);
      } catch (error) {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            alert("This email is already in use.");
            return;
          } else {
            alert("Failed to change the information.");
          }
        }
      } finally {
        setIsLoading(false);
        setIsSubmitted(false);
      }
    } else {
      // 유효성 검사 실패 시 경고
      alert("Please enter everything correctly.");
    }
  };

  return (
    <>
      <title>{`Edit Information${helmetTitle}`}</title>
      <S.Container>
        {isLoading && <LoadingSpinner />}
        <J.Label>
          {t("join.email")}
          <J.Input
            placeholder={t("join.email")}
            value={formData.email}
            onChange={(e) => {
              updateFormData({ email: e.target.value });
            }}
          />
          {isSubmitted && validationErrors.email && (
            <J.ValidText>{validationErrors.email}</J.ValidText>
          )}
        </J.Label>
        <J.Label>
          {t("join.password")}
          <div>
            <J.PWInput
              type="password"
              placeholder={t("join.8Characters")}
              value={formData.password}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <J.PWAgainInput
              type="password"
              placeholder={t("join.passwordAgain")}
              value={passwordAgain}
              onChange={(e) => setPasswordAgain(e.target.value)}
            />
          </div>
          {isSubmitted && (validationErrors.newPassword || validationErrors.passwordAgain) && (
            <J.ValidText>
              {validationErrors.newPassword || validationErrors.passwordAgain}
            </J.ValidText>
          )}
        </J.Label>
        <J.Label>
          {t("join.name")}
          <J.Input
            placeholder="KimMutsa"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
          {isSubmitted && validationErrors.name && (
            <J.ValidText>{validationErrors.name}</J.ValidText>
          )}
        </J.Label>
        <J.Label>
          {t("join.nationality")}
          <Dropdown
            name={nationalityName}
            placeholder={t("pleaseSelect")}
            itemArray={nationalityArray}
            onSelect={(name, value) => handleDropdownChange("nationality", value)}
            selectedValue={formData.nationality}
          />
          {isSubmitted && validationErrors.nationality && (
            <J.ValidText>{validationErrors.nationality}</J.ValidText>
          )}
        </J.Label>
        <J.Label>
          {t("settings.language")}
          <Dropdown
            name={languageName}
            placeholder={t("pleaseSelect")}
            itemArray={languageArray}
            onSelect={(name, value) => handleDropdownChange("language", value)}
            selectedValue={formData.language}
          />
        </J.Label>
        <J.Label>
          {t("join.visaType")}
          <Dropdown
            name={visaTypeName}
            itemArray={visaTypeArray}
            onSelect={handleDropdownChange}
            selectedValue={formData.visaType}
          />
          {isSubmitted && validationErrors.visaType && (
            <J.ValidText>{validationErrors.visaType}</J.ValidText>
          )}
        </J.Label>
        <J.Label>
          {t("join.visaExpirationDate")}
          <J.Input
            placeholder="MM/DD/YYYY"
            value={formData.visaExpir || ""}
            onChange={(e) => updateFormData({ visaExpir: e.target.value })}
          />
          {isSubmitted && validationErrors.visaExpir && (
            <J.ValidText>{validationErrors.visaExpir}</J.ValidText>
          )}
        </J.Label>
        <J.Label>
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
        </J.Label>
        <J.Label>
          {t("join.notificationSettings")}
          <J.ToggleWrapper>
            <div>{t("settings.pushNoti")}</div>
            <ToggleSwitch name="notify" initialValue={isNotifyOn} onChange={handleNotifyToggle} />
          </J.ToggleWrapper>
        </J.Label>
        <ButtonGroup
          onGrayClick={() => navigate(-1)}
          onBlueClick={handleSave}
          blueDisabled={isLoading}
        />
      </S.Container>
    </>
  );
}
