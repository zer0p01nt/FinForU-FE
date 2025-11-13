import FilterBar from "./FilterBar";
import CompareIcon from "../icons/CompareIcon.svg";
import LinkIcon from "../icons/LinkIcon.svg";
import { getBankLogo } from "../Product";
import * as S from "../ProductStyle";

const getComparableNumericValue = (value, strategy) => {
  if (value == null) return null;
  const normalized = String(value).replace(/,/g, "");
  const matches = normalized.match(/-?\d+(\.\d+)?/g);
  if (!matches) return null;
  const numbers = matches.map(Number).filter((num) => !Number.isNaN(num));
  if (numbers.length === 0) return null;
  return strategy === "min" ? Math.min(...numbers) : Math.max(...numbers);
};

const getHighlightProductIds = (row, rowEntries) => {
  if (row.highlight !== "max" && row.highlight !== "min") return new Set();
  const comparableValues = rowEntries.map(({ value }) =>
    Array.isArray(value) || typeof value === "object"
      ? null
      : getComparableNumericValue(value, row.highlight)
  );

  const validValues = comparableValues.filter((value) => value != null);
  if (validValues.length === 0) return new Set();

  const target =
    row.highlight === "min"
      ? Math.min(...validValues)
      : Math.max(...validValues);

  const highlightSet = new Set();
  comparableValues.forEach((value, index) => {
    if (value == null) return;
    if (Math.abs(value - target) < 1e-9) {
      highlightSet.add(rowEntries[index].product.id);
    }
  });

  return highlightSet;
};

const TYPE_LABELS = {
  card: "Card",
  deposit: "Deposit",
  installment: "Installment",
  savings: "Savings",
  saving: "Savings",
};

const TYPE_ORDER = {
  deposit: 0,
  installment: 1,
  saving: 1,
  card: 2,
};

const SECTION_ALIASES = {
  interest: ["Interest Rate"],
  depositDetails: ["Deposit Details", "Saving Details"],
  annualFee: ["Annual Fee"],
  benefits: ["Benefits", "Travel Benefits", "Rewards"],
};

const ROW_LABEL_ALIASES = {
  baseRate: ["Base Rate", "Base Interest Rate"],
  maxRate: ["Preferential Rate", "Maximum Rate", "Bonus Rate", "Maximum Interest Rate"],
  depositTerm: ["Deposit Term", "Saving Term"],
  minimumDeposit: ["Minimum Deposit"],
  monthlyLimit: ["Monthly Limit", "Monthly Deposit"],
  domesticFee: ["Domestic"],
  globalFee: ["International", "Domestic/International"],
};

const getTypeLabel = (type) => TYPE_LABELS[type] || "Product";

const findDetailValue = (product, sectionNames, rowLabels) => {
  const sections = product.detailSections || [];
  const section = sections.find((item) => sectionNames.includes(item.title));
  if (!section) return "";
  if (!rowLabels) {
    return section.rows?.[0]?.value || "";
  }
  const row = section.rows?.find((item) => rowLabels.includes(item.label));
  return row?.value || "";
};

const findDetailValues = (product, sectionNames) => {
  const sections = product.detailSections || [];
  const section = sections.find((item) => sectionNames.includes(item.title));
  if (!section) return [];
  return section.rows?.map((row) => row.value)?.filter(Boolean) ?? [];
};

const getComparisonRows = (type, onVisitWebsite) => {
  if (type === "card") {
    return [
      {
        id: "annualDomestic",
        label: "Annual Fee",
        caption: "Domestic-only",
        highlight: "min",
        get: (product) =>
          findDetailValue(product, SECTION_ALIASES.annualFee, ROW_LABEL_ALIASES.domesticFee),
      },
      {
        id: "annualGlobal",
        label: "Annual Fee",
        caption: "Domestic/International",
        highlight: "min",
        get: (product) =>
          findDetailValue(product, SECTION_ALIASES.annualFee, ROW_LABEL_ALIASES.globalFee),
      },
      {
        id: "benefits",
        label: "Benefits",
        type: "list",
        get: (product) => findDetailValues(product, SECTION_ALIASES.benefits).slice(0, 4),
      },
      {
        id: "website",
        label: "",
        type: "link",
        onClick: (product) => product.website && onVisitWebsite?.(product.website),
      },
    ];
  }

  if (type === "installment" || type === "saving" || type === "savings") {
    return [
      {
        id: "baseRate",
        label: "Base Interest Rate",
        highlight: "max",
        get: (product) =>
          findDetailValue(product, SECTION_ALIASES.interest, ROW_LABEL_ALIASES.baseRate),
      },
      {
        id: "maxRate",
        label: "Maximum Interest Rate",
        highlight: "max",
        get: (product) =>
          findDetailValue(product, SECTION_ALIASES.interest, ROW_LABEL_ALIASES.maxRate),
      },
      {
        id: "term",
        label: "Deposit Term",
        get: (product) =>
          findDetailValue(product, SECTION_ALIASES.depositDetails, ROW_LABEL_ALIASES.depositTerm),
      },
      {
        id: "monthly",
        label: "Monthly Limit",
        highlight: "min",
        get: (product) =>
          findDetailValue(
            product,
            SECTION_ALIASES.depositDetails,
            ROW_LABEL_ALIASES.monthlyLimit
          ),
      },
      {
        id: "website",
        label: "",
        type: "link",
        onClick: (product) => product.website && onVisitWebsite?.(product.website),
      },
    ];
  }

  return [
    {
      id: "baseRate",
      label: "Base Interest Rate",
      highlight: "max",
      get: (product) =>
        findDetailValue(product, SECTION_ALIASES.interest, ROW_LABEL_ALIASES.baseRate),
    },
    {
      id: "maxRate",
      label: "Maximum Interest Rate",
      highlight: "max",
      get: (product) =>
        findDetailValue(product, SECTION_ALIASES.interest, ROW_LABEL_ALIASES.maxRate),
    },
    {
      id: "term",
      label: "Deposit Term",
      get: (product) =>
        findDetailValue(product, SECTION_ALIASES.depositDetails, ROW_LABEL_ALIASES.depositTerm),
    },
    {
      id: "minimum",
      label: "Minimum Deposit",
      highlight: "min",
      get: (product) =>
        findDetailValue(product, SECTION_ALIASES.depositDetails, ROW_LABEL_ALIASES.minimumDeposit),
    },
    {
      id: "website",
      label: "",
      type: "link",
      onClick: (product) => product.website && onVisitWebsite?.(product.website),
    },
  ];
};

function renderSelection({
  products,
  selection,
  baseType,
  filters,
  filterConfig,
  filterOrder,
  getFilterLabel,
  onFilterSelect,
  onFilterReset,
  onToggleSelect,
  onProceed,
}) {
  const isSelected = (productId) => selection.some((item) => item.id === productId);

  return (
    <>
      <S.CompareHeader>
        <S.CompareTitle>Select products to compare</S.CompareTitle>
      </S.CompareHeader>

      <FilterBar
        filterConfig={filterConfig}
        filterOrder={filterOrder}
        filters={filters}
        getFilterLabel={getFilterLabel}
        onFilterSelect={onFilterSelect}
        onFilterReset={onFilterReset}
      />

      {products.length === 0 ? (
        <S.CompareEmptyState>
          Add products to your list from the detail page to compare them here.
        </S.CompareEmptyState>
      ) : (
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
                      strokeWidth="2.2"
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
      )}

      <S.CompareActions>
        <S.PrimaryButton
          type="button"
          onClick={onProceed}
          disabled={selection.length !== 2}
          style={{ flex: "0 0 auto", width: "250px" }}
        >
          <img src={CompareIcon} alt="" width={20} height={20} />
          Compare
        </S.PrimaryButton>
      </S.CompareActions>
    </>
  );
}

function renderResult({
  selection,
  comparisonProducts,
  isComparisonLoading,
  comparisonError,
  onBackToSelect,
  onClose,
  onVisitWebsite,
}) {
  if (isComparisonLoading) {
    return (
      <S.CompareEmptyState style={{ padding: "2rem 1rem" }}>
        Comparing selected products...
      </S.CompareEmptyState>
    );
  }

  if (comparisonError) {
    return (
      <S.CompareEmptyState style={{ padding: "2rem 1rem" }}>
        Failed to load comparison data. Please try again later.
      </S.CompareEmptyState>
    );
  }

  const sourceProducts =
    comparisonProducts && comparisonProducts.length > 0 ? comparisonProducts : selection;

  if (!sourceProducts || sourceProducts.length === 0) {
    return (
      <S.CompareEmptyState style={{ padding: "2rem 1rem" }}>
        Comparison data will appear here once products are selected.
      </S.CompareEmptyState>
    );
  }

  const orderedProducts = [...sourceProducts].sort(
    (a, b) => (TYPE_ORDER[a.type] ?? 3) - (TYPE_ORDER[b.type] ?? 3)
  );
  const comparisonRows = getComparisonRows(orderedProducts[0]?.type, onVisitWebsite);
  const columnCount = Math.max(orderedProducts.length, 1);

  return (
    <>
      <div>
        <S.CompareTable>
          <S.CompareTableHeader $columns={columnCount}>
            {orderedProducts.map((product) => (
              <S.CompareTableHeaderCell key={product.id}>
                <S.CompareProductTitle>{product.name}</S.CompareProductTitle>
                <S.CompareProductBank>by {product.bankName}</S.CompareProductBank>
              </S.CompareTableHeaderCell>
            ))}
          </S.CompareTableHeader>

          {comparisonRows.map((row) => {
            const rowEntries = orderedProducts.map((product) => ({
              product,
              value:
                row.type === "link"
                  ? product.website
                  : row.get
                  ? row.get(product)
                  : "",
            }));
            const highlightProductIds = getHighlightProductIds(row, rowEntries);

            return (
              <S.CompareTableRow key={row.id} $columns={columnCount}>
                {rowEntries.map(({ product, value }, index) => {
                  const hasContent =
                    row.type === "list"
                      ? Array.isArray(value) && value.length > 0
                      : Boolean(value);

                  let content;
                  if (row.type === "link") {
                    content = (
                      <S.CompareWebsiteButton
                        type="button"
                        disabled={!value}
                        onClick={() => row.onClick?.(product)}
                      >
                        <img src={LinkIcon} alt="" />
                        View Website
                      </S.CompareWebsiteButton>
                    );
                  } else if (row.type === "list") {
                    content = hasContent ? (
                      <S.CompareCellList>
                        {value.map((item, valueIndex) => (
                          <li key={valueIndex}>{item}</li>
                        ))}
                      </S.CompareCellList>
                    ) : (
                      <S.CompareCellValue>-</S.CompareCellValue>
                    );
                  } else {
                    content = (
                      <S.CompareCellValue>{hasContent ? value : "-"}</S.CompareCellValue>
                    );
                  }

                  return (
                    <S.CompareTableCell
                      key={product.id}
                      $highlight={highlightProductIds.has(product.id)}
                    >
                      {(row.label || row.caption) && (
                        <S.CompareCellLabel>
                          {row.label}
                          {row.caption && (
                            <S.CompareCellCaption>{row.caption}</S.CompareCellCaption>
                          )}
                        </S.CompareCellLabel>
                      )}
                      {content}
                    </S.CompareTableCell>
                  );
                })}
              </S.CompareTableRow>
            );
          })}
        </S.CompareTable>
      </div>
    </>
  );
}

export default function ComparePage(props) {
  return (
    <S.ComparePage>
      {props.stage === "result" ? renderResult(props) : renderSelection(props)}
    </S.ComparePage>
  );
}
