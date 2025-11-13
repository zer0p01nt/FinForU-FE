import * as S from "../ProductStyle";

export default function CompareResultSheet({ isOpen, selection, onBack, onClose }) {
  if (!isOpen) return null;

  const currentType = selection[0]?.type === "card" ? "Card" : "Savings";

  return (
    <S.Overlay>
      <S.Sheet>
        <S.SheetHandle />
        <S.SheetTitle>Compare</S.SheetTitle>
        <S.CompareTagBar>
          <S.CompareTag>{currentType}</S.CompareTag>
          <S.CompareTag>{selection.length} items selected</S.CompareTag>
        </S.CompareTagBar>
        <S.CompareResultGrid>
          {selection.map((product) => (
            <S.ResultCard key={product.id}>
              <S.ResultTitle>{product.name}</S.ResultTitle>
              <S.ResultRow>
                Base Rate<span>{product.detailSections[0]?.rows[0]?.value || "-"}</span>
              </S.ResultRow>
              <S.ResultRow>
                Maximum Rate<span>{product.detailSections[0]?.rows[1]?.value || "-"}</span>
              </S.ResultRow>
              <S.ResultRow>
                Deposit Term<span>{product.termLabel}</span>
              </S.ResultRow>
              {product.detailSections[1]?.rows[1] && (
                <S.ResultRow>
                  Minimum Deposit<span>{product.detailSections[1]?.rows[1]?.value}</span>
                </S.ResultRow>
              )}
              <S.ResultRow>
                <span style={{ color: "#000", fontWeight: 400 }}>View Website</span>
              </S.ResultRow>
            </S.ResultCard>
          ))}
        </S.CompareResultGrid>
        <S.SheetFooter>
          <S.SecondaryButton type="button" onClick={onBack}>
            Back
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={onClose}>
            Close
          </S.PrimaryButton>
        </S.SheetFooter>
      </S.Sheet>
    </S.Overlay>
  );
}
