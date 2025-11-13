import * as S from "./ButtonGroupStyle";
import { useTranslation } from "react-i18next";

/**
 * 하단 버튼 2개 (회색 버튼 / 파란색 버튼) 와 그걸 감싸는 wrapper로 이루어진 컴포넌트
 *
 * @param {object} props
 * @param {'button'|'submit'} props.grayType 회색 버튼 타입 (기본값 "button" : <button> 자체 기능 제거)
 * @param {string} props.grayText - 회색 버튼 내부 텍스트 (기본값 "Cancel" : 제일 많이 쓰임)
 * @param {() => void} props.onGrayClick - 회색 버튼 클릭 시 작동하는 함수
 * @param {'button'|'submit'} props.blueType - 파란색 버튼 타입 (기본값 "submit" : form submit 시 사용하는 버튼)
 * @param {string} props.blueText - 파란색 버튼 내부 텍스트 (기본값 "Confirm" : 제일 많이 쓰임)
 * @param {boolean} props.blueDisabled - 파란색 버튼 비활성화 상태 여부 (폼 필수 작성 요소 빼먹으면 submit 안되게)
 * @param {() => void} props.onBlueClick - 파란색 버튼 클릭 시 작동하는 함수
 * @returns {JSX.Element}
 */
export default function ButtonGroup({
  grayType = "button",
  grayText,
  onGrayClick,
  blueType = "submit",
  blueText,
  blueDisabled,
  onBlueClick,
}) {
  const { t } = useTranslation();
  // 내부 텍스트 기본값 설정
  const realGrayText = grayText ?? t("cancel");
  const realBlueText = blueText ?? t("confirm");
  return (
    <S.Wrapper>
      <S.GrayBtn onClick={onGrayClick} type={grayType}>
        {realGrayText}
      </S.GrayBtn>
      <S.BlueBtn onClick={onBlueClick} type={blueType} disabled={blueDisabled}>
        {realBlueText}
      </S.BlueBtn>
    </S.Wrapper>
  );
}
