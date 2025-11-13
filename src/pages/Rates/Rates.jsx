import { useTranslation } from "react-i18next";
import { useHeaderStore } from "../../stores/headerStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import * as S from "./RatesStyle";
import RateChart from "./RateChart/RateChart";
import api from "../../api/api";

// 은행 로고 이미지 파일 import
import shinhanLogo from "./icon/shinhan.png";
import hanaLogo from "./icon/hana.png";
import kookminLogo from "./icon/kookmin.png";
import wooriLogo from "./icon/woori.png";
import LoadingSpinner from "../../components/loading-spinner/LoadingSpinner";
import { helmetTitle } from "../../constants/title";
// 매핑 파일
const bankLogos = {
  shinhan: shinhanLogo,
  hana: hanaLogo,
  kookmin: kookminLogo,
  woori: wooriLogo,
};

// 초기 상태 빈 데이터로
const initialRateData = {
  isSuccess: false,
  timeStamp: "",
  data: [],
};

export default function Rates() {
  const [exchangeRateData, setExchangeRateData] = useState(initialRateData);
  const [loading, setLoading] = useState(true);
  const [chartReady, setChartReady] = useState(false);
  // 현재 선택된 통화 (기본값 USD)
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  // 현재 선택된 기간 (기본값 1_WEEK)
  const [selectedPeriod, setSelectedPeriod] = useState("1_WEEK");
  const { t, i18n } = useTranslation();
  // 헤더 설정
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  useEffect(() => {
    setHeaderConfig({
      title: t("nav.rates"),
      showBackBtn: false, // 뒤로가기 버튼 여부
      showSettingBtn: true, // 환경설정 버튼 여부
    });
  }, [setHeaderConfig, i18n.language]);

  // GET 요청으로 데이터 fetch
  const fetchExchangeRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/exrate");
      setExchangeRateData(res.data);
    } catch (error) {
      console.error("환율 데이터 로드 실패", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  // 현재 선택된 통화 데이터 계산
  const currentCurrencyData = useMemo(() => {
    if (exchangeRateData.data.length === 0) return;

    const dataItem = exchangeRateData.data.find(
      (item) => item.ExchangeRateData.currencyType === selectedCurrency
    );

    if (!dataItem) return null;

    const graphData = dataItem.ExchangeRateData.priceGraphData;
    // 전날 대비 상승률 계산
    if (graphData && graphData.length >= 2) {
      const latestRate = graphData[graphData.length - 1].price; // 오늘
      const previousRate = graphData[graphData.length - 2].price; // 전날

      // (오늘 - 전날) / 전날 * 100
      const calculatedRateCompareYesterday = ((latestRate - previousRate) / previousRate) * 100;

      // todayRate를 최신 데이터로 업데이트
      dataItem.ExchangeRateData.todayRate = latestRate;
      dataItem.ExchangeRateData.rateCompareYesterday = calculatedRateCompareYesterday;
    }

    return dataItem;
  }, [exchangeRateData.data, selectedCurrency]);

  // 선택된 기간 -> 그래프 데이터 필터링
  const filteredGraphData = useCallback(
    (graphData, period) => {
      // 데이터가 없으면 빈 배열 반환
      if (!graphData) return [];
      const today = new Date(exchangeRateData.timeStamp || new Date());
      let startDate;

      switch (period) {
        case "1_WEEK":
          startDate = new Date(today);
          // 영업일만 계산 (주말만큼 더해줌)
          startDate.setDate(today.getDate() - 9);
          break;
        case "3_MONTHS":
          startDate = new Date(today);
          startDate.setMonth(today.getMonth() - 3);
          break;
        case "1_YEAR":
        // 7일에 한 번 샘플링
        // 가장 최근 데이터 포함
        // const sampleData = [];
        // for (let i = 0; i < graphData.length; i += 7) {
        //   sampleData.push(graphData[i]);
        // }

        // if (
        //   graphData.length > 0 &&
        //   sampleData[sampleData.length - 1] !== graphData[graphData.length - 1]
        // ) {
        //   sampleData.push(graphData[graphData.length - 1]);
        // }
        // return sampleData;
        default:
          return graphData;
      }
      const startDateString = startDate.toISOString().split("T")[0];
      return graphData.filter((item) => item.date >= startDateString);
    },
    [exchangeRateData.timeStamp]
  );

  // RateChart 컴포넌트에 그래프 데이터 전달
  const finalGraphData = useMemo(() => {
    if (!currentCurrencyData) return [];
    return filteredGraphData(currentCurrencyData.ExchangeRateData.priceGraphData, selectedPeriod);
  }, [currentCurrencyData, selectedPeriod, filteredGraphData]);

  // 통화 선택 핸들러
  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  // 기간 선택 핸들러
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // eachBankFee 포맷팅
  const formatFee = (fee) => {
    if (fee === null) {
      return t("rates.unsupported");
    }
    if (fee > 0 && fee < 1) {
      // 0.175인 경우
      return `${fee.toFixed(3)}%`;
    }
    return `${fee}%`;
  };

  // API 연결 전 임시 데이터
  const dummyData = {
    ExchangeRateData: {
      currencyType: selectedCurrency,
      todayRate: 0,
      rateCompareYesterday: 0,
      eachBankFee: [],
    },
    toastMessage: t("rates.recommendMsg"),
  };
  const dataToUse = currentCurrencyData ?? dummyData;

  // API 응답 데이터에서 구조 분해 할당
  const {
    ExchangeRateData: { currencyType, todayRate, rateCompareYesterday, eachBankFee },
    toastMessage,
  } = dataToUse;

  // 차트 로딩 완료 처리
  const handleChartLoad = useCallback(() => {
    setChartReady(true);
  }, []);

  // 로딩 스피너 관련 상태
  const isDataReady = loading || !chartReady || finalGraphData.length === 0;

  return (
    <>
      <title>Rates{helmetTitle}</title>
      <S.Container>
        {isDataReady && <LoadingSpinner />}
        <S.TopBox>
          <S.Toast>{toastMessage || t("rates.recommendMsg")}</S.Toast>
          <S.Title>{t("rates.currencyExchangeRate")}</S.Title>
          <S.ButtonWrapper onChange={handleCurrencyChange}>
            {exchangeRateData.data.map((item) => {
              const type = item.ExchangeRateData.currencyType;
              return (
                <div key={type}>
                  <input
                    type="radio"
                    id={type}
                    name="currencyType"
                    value={type}
                    checked={selectedCurrency === type}
                    readOnly={true} // 선택 가능
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              );
            })}
          </S.ButtonWrapper>
        </S.TopBox>
        <S.GraphWrapper>
          <S.MiniTitle>KRW to {currencyType}</S.MiniTitle>
          <S.RateBox>
            <S.Rate>{todayRate.toLocaleString()}</S.Rate>
            <S.TodayBox>
              <S.Today>{t("rates.today")}</S.Today>
              <S.TodayRate>+{rateCompareYesterday.toFixed(1)}%</S.TodayRate>
            </S.TodayBox>
          </S.RateBox>
          <S.PeriodBtnWrapper>
            <S.OneWeekBtn
              onClick={() => handlePeriodChange("1_WEEK")}
              $active={selectedPeriod === "1_WEEK"}
            >
              1 WEEK
            </S.OneWeekBtn>
            <S.ThreeMonthsBtn
              onClick={() => handlePeriodChange("3_MONTHS")}
              $active={selectedPeriod === "3_MONTHS"}
            >
              3 MONTHS
            </S.ThreeMonthsBtn>
            <S.OneYearBtn
              onClick={() => handlePeriodChange("1_YEAR")}
              $active={selectedPeriod === "1_YEAR"}
            >
              1 YEAR
            </S.OneYearBtn>
          </S.PeriodBtnWrapper>
          <RateChart graphData={finalGraphData} onLoadComplete={handleChartLoad} />
        </S.GraphWrapper>
        <S.FeeBox>
          <S.Title>{t("rates.feeComparison")}</S.Title>
          {eachBankFee.map((item) => (
            <S.FeeItem key={item.bank}>
              <img src={bankLogos[item.bank]} />
              <S.NameBox>
                <S.Bank>{t(`banks.${item.bank}`)}</S.Bank>
                <S.Fee>{formatFee(item.fee)}</S.Fee>
              </S.NameBox>
            </S.FeeItem>
          ))}
        </S.FeeBox>
      </S.Container>
    </>
  );
}
