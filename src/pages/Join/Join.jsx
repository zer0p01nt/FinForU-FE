import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import * as S from "./JoinStyle";
import ButtonGroup from "../../components/button-group/ButtonGroup";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useNavigate } from "react-router-dom";
import { LANG_MAP } from "../../constants/languageMap";
import api from "../../api/api";
import Loading from "./Loading/Loading";
import Complete from "./Loading/Complete";
import { helmetTitle } from "../../constants/title";
import { useFCMTokenRegistration } from "../../hooks/useFCMTokenRegistration";

const TOTAL_STEPS = 3;

export default function Join() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    nationality: "",
    notify: true,
    isStep1Valid: false,
    isStep2Valid: false,
    isStep3Valid: false, // 약관 동의 상태
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  // 유효성 검사가 Next 클릭으로 인해 실행되었는지 여부
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  // 회원가입 성공한 경우에 토큰 로직 호출
  useFCMTokenRegistration(formData.notify && isSignupSuccess, null);

  // 현재 스텝의 유효성 상태 계산
  const isCurrentStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return formData.isStep1Valid;
      case 2:
        return formData.isStep2Valid;
      case 3:
        return formData.isStep3Valid;
      default:
        return false;
    }
  }, [step, formData.isStep1Valid, formData.isStep2Valid, formData.isStep3Valid]);

  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("join.join"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: false, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  // 뒤로가기
  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    }
    setIsSubmitted(false);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // 다음으로
  const handleNext = () => {
    setIsSubmitted(true);
    if (isCurrentStepValid) {
      setIsSubmitted(false);
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
      // 스크롤 최상단으로
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Step1, Step2에서 유효성 검사 실패 시 경고
      alert("Please enter everything correctly.");
      return;
    }
  };

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // 현재 스텝에 맞는 내용 렌더링
  const renderContent = () => {
    // 모든 스텝 컴포넌트에 공통으로 필요한 props
    const commonProps = {
      formData,
      updateFormData,
      // 유효성 검사 결과를 부모로 전달하는 함수
      isSubmitted,
    };

    switch (step) {
      case 1:
        return <Step1 {...commonProps} />;
      case 2:
        return <Step2 {...commonProps} />;
      case 3:
        return <Step3 {...commonProps} />;
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentStepValid) {
      // Step3에서 유효성 검사 실패 (필수 약관 미동의)
      alert(t("Please agree to all the required terms and conditions."));
      return;
    }

    const visaExpirDateString = formData.visaExpir;
    // YYYY-MM-DD로 변환
    const isoDate = visaExpirDateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
    const finalvisaExpir = `${isoDate}T00:00:00.000Z`;

    // 최종 데이터 형식 맞추기 및 제출
    const signupData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      nationality: formData.nationality,
      language: LANG_MAP[i18n.language] || "ENGLISH", // 언어 선택 없이 접근한 경우 기본값 영어
      visaType: formData.visaType,
      visaExpir: finalvisaExpir,
      notify: formData.notify,
      desiredProductTypes: formData.desiredProducts,
    };

    setIsLoading(true);
    // console.log(signupData);

    try {
      const res = await api.post("/api/members/signup", signupData);

      // 회원가입 성공
      if (res.status === 200) {
        setIsSignupSuccess(true);
        setIsLoading(false);
        setIsCompleted(true);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        // 서버로부터 응답이 온 경우
        if (error.response.status === 404) {
          alert("Member information not found.");
          return;
        } else if (error.response.status === 409) {
          // API 명세서에 명시된 오류
          alert("This email is already in use.");
          return;
        } else {
          // 이외의 경우
          alert(`A ${error.response.status} error occurred during registration.`);
          console.log(error.response.message, error.response.text, error.response.data);
          return;
        }
      } else if (error.request) {
        // 요청이 보내졌으나 응답이 오지 않은 경우
        alert("Could not connect to the server. Please check your network status.");
        return;
      } else {
        // 요청 설정 중 오류 발생
        alert("An unknown error occurred during registration request setup.");
        return;
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isCompleted) {
    return <Complete />;
  }

  return (
    <>
      <title>{`Join${helmetTitle}`}</title>
      <S.Container>
        <S.IndicatorWrapper>
          <S.Indicator>
            <S.ProgressBar $percent={Math.min((step / TOTAL_STEPS) * 100, 100)} />
          </S.Indicator>
        </S.IndicatorWrapper>
        <S.Content $step={step}>{renderContent()}</S.Content>
        <ButtonGroup
          grayText={t("back")}
          onGrayClick={handleBack}
          blueType={step === TOTAL_STEPS ? "submit" : "button"}
          blueText={t("next")}
          onBlueClick={step === TOTAL_STEPS ? handleSubmit : handleNext}
        />
      </S.Container>
    </>
  );
}
