import { useEffect, useState } from "react";
import * as S from "./OnBoardingStyle";
// 로고는 바로 보여야 하니까 public에 넣어놓고 씀
import Logo from "/logo.png";

export default function OnBoarding({ children }) {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isMounted) return; // 이미 제거되었다면 실행 방지

    // 1초 후에 사라짐 애니메이션 시작
    const timerToFade = setTimeout(() => {
      setIsFading(true);
    }, 1000);

    // 1초 띄우고 0.5초 애니메이션(일부러 적게 잡음)
    const timerToRemove = setTimeout(() => {
      setIsMounted(false);
    }, 1000 + 400);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timerToFade);
      clearTimeout(timerToRemove);
    };
  }, [isMounted]);

  // isMounted가 false일 때, 자식만 반환
  if (!isMounted) {
    return children;
  }
  return (
    <S.Wrapper $isfading={isFading}>
      <S.ImgBox>
        <img src={Logo} alt="FinForU logo" />
        <S.TextBox>
          <S.Title>FinForU</S.Title>
          <S.Desc>Bridging the World to Korean Finance</S.Desc>
        </S.TextBox>
      </S.ImgBox>
    </S.Wrapper>
  );
}
