import { useTranslation } from "react-i18next";
import { getBankLogo } from "../Product";
import * as S from "../ProductStyle";

export default function CompareSelectSheet({
  isOpen,
  products,
  selection,
  baseType,
  onToggleSelect,
  onClose,
  onProceed,
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const isSelected = (productId) => selection.some((item) => item.id === productId);

  return (
    <S.Overlay>
      <S.Sheet>
        <S.SheetHandle />
        <S.SheetTitle>{t("product.selectAccounts")}</S.SheetTitle>
        <S.SelectorList>
          {products.map((product) => {
            const selected = isSelected(product.id);
            const disabled = baseType && baseType !== product.type && !selected;
            return (
              <S.CompareCardButton
                key={product.id}
                type="button"
                $selected={selected}
                $disabled={disabled}
                onClick={() => onToggleSelect(product)}
              >
                <S.CompareSelectorCheck $checked={selected}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path
                      d="M2 6.5L6 10L14 2"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity={selected ? 1 : 0.4}
                    />
                  </svg>
                </S.CompareSelectorCheck>
                <S.CardBadge>
                  {(() => {
                    const bankLogo = product.bankLogo || getBankLogo(product.bankName);
                    return bankLogo ? (
                      <img src={bankLogo} alt={`${product.bankName} logo`} />
                    ) : (
                      product.bankName[0]
                    );
                  })()}
                </S.CardBadge>
                <S.CardMeta>
                  <S.CardBank>{product.bankName}</S.CardBank>
                  <S.CardTitle>{product.name}</S.CardTitle>
                  <S.CardInfo>
                    <span>{product.highlight}</span> · {product.termLabel}
                  </S.CardInfo>
                </S.CardMeta>
              </S.CompareCardButton>
            );
          })}
        </S.SelectorList>
        <S.SheetFooter>
          <S.SecondaryButton type="button" onClick={onClose}>
            {t("cancel")}
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={onProceed}>
            {t("product.compare")}
          </S.PrimaryButton>
        </S.SheetFooter>
        <S.CompareNotice>
          Comparisons are only valid between financial products of the same type.
        </S.CompareNotice>
      </S.Sheet>
    </S.Overlay>
  );
}
