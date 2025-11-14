import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useEffect, useRef } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function RateChart({ graphData, onLoadComplete }) {
  const chartRef = useRef();
  useEffect(() => {
    if (graphData.length > 0 && chartRef.current && onLoadComplete) {
      setTimeout(() => {
        onLoadComplete();
      }, 0);
    }
  }, [graphData, onLoadComplete]); // graphData나 콜백이 변경될 때마다 재실행

  const prices = graphData.map((item) => item.price);

  // 데이터가 없으면 차트 렌더링하지 않음 (오류 방지 및 깔끔한 처리)
  if (prices.length === 0) {
    return null;
  }

  // Y축 범위 설정 (여백 설정)
  const dataMin = Math.min(...prices);
  const dataMax = Math.max(...prices);
  const dataRange = dataMax - dataMin;
  const yAxisMin = dataMin - dataRange * 0.1;
  const yAxisMax = dataMax + dataRange * 0.1;
  const data = {
    labels: graphData.map((item) => item.date), // X축 : 날짜
    datasets: [
      {
        label: "",
        data: graphData.map((item) => item.price), // y축 : 환율
        borderColor: "#013028",
        backgroundColor: "#fff",
        tension: 0.2,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHitRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 상위 div 크기에 맞추기 위해 중요
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        // X축 전체 숨기기
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: true, // X축 경계선(실선)을 표시
          color: "#282828",
          width: 1,
        },
      },
      y: {
        beginAtZero: false, // 환율은 0부터 시작할 필요 없음
        // Y축 전체 숨기기
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
        min: yAxisMin,
        max: yAxisMax,
      },
    },
  };

  return (
    <div>
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
}
