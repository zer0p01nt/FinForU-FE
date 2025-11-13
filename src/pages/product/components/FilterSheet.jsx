import * as S from "../ProductStyle";

export default function FilterSheet({ config, filters, onSelect, onReset, onClose }) {
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
            Reset
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={onClose}>
            Done
          </S.PrimaryButton>
        </S.SheetFooter>
      </S.Sheet>
    </S.Overlay>
  );
}
