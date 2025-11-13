import CompareIcon from "../icons/CompareIcon.svg";
import FilterBar from "./FilterBar";
import { getBankLogo } from "../Product";
import * as S from "../ProductStyle";

export default function AllProductsSection({
  filterConfig,
  filterOrder,
  filters,
  getFilterLabel,
  onFilterSelect,
  onFilterReset,
  products,
  onProductClick,
  onCompareToggle,
}) {
  const isEmpty = products.length === 0;

  return (
    <>
      <FilterBar
        filterConfig={filterConfig}
        filterOrder={filterOrder}
        filters={filters}
        getFilterLabel={getFilterLabel}
        onFilterSelect={onFilterSelect}
        onFilterReset={onFilterReset}
      />

      {isEmpty ? (
        <S.EmptyState>
          No matching products. Adjust filters or try another keyword.
        </S.EmptyState>
      ) : (
        <S.ProductList>
          {products.map((product) => (
            <S.ProductCard key={product.id} onClick={() => onProductClick(product)}>
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
            </S.ProductCard>
          ))}
        </S.ProductList>
      )}

      {!isEmpty && (
        <S.CompareFab type="button" onClick={onCompareToggle} aria-label="Compare products">
          <img src={CompareIcon} alt="" width={30} height={30} />
        </S.CompareFab>
      )}
    </>
  );
}
