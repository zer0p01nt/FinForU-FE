import { useTranslation } from "react-i18next";
import * as S from "../ProductStyle";

export default function FilterSheet({ config, filters, onSelect, onReset, onClose }) {
  const { t } = useTranslation();
  if (!config) return null;

  return (
    <S.Overlay>
      <S.Sheet>
        <S.SheetHandle />
        <S.SheetTitle>{config.label}</S.SheetTitle>
        <S.OptionList>
          {config.options.map((option) => (
            <S.OptionItem
              key={option.id}
              $active={filters[config.key] === option.id}
              onClick={() => onSelect(config.key, option.id)}
            >
              {option.label}
            </S.OptionItem>
          ))}
        </S.OptionList>
        <S.SheetFooter>
          <S.SecondaryButton type="button" onClick={() => onReset(config.key)}>
            {t("product.reset")}
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={onClose}>
            {t("product.done")}
          </S.PrimaryButton>
        </S.SheetFooter>
      </S.Sheet>
    </S.Overlay>
  );
}
