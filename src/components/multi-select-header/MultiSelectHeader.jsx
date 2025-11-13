import { useTranslation } from "react-i18next";
import * as S from "./MultiSelectHeaderStyle";

/**
 * 다중 선택 가능하다는 멘트를 밑에 자동으로 붙여주는 헤더
 * 특별한 기능 없음.
 * @param {object} props
 * @param {string} props.header - 메인으로 올 헤더 텍스트.
 * * t("string") 형태의 다국어 처리 된 문자열로 넘겨주세요
 */
export default function MultiSelectHeader({ header }) {
  const { t } = useTranslation();
  return (
    <S.Label>
      <S.Header>{header}</S.Header>
      <S.Sub>{t("multiSelect")}</S.Sub>
    </S.Label>
  );
}
