import { useEffect, useMemo, useState } from "react";
import * as S from "../ProductStyle";

const PRODUCT_TYPE_OPTIONS = [
  { id: "Card", label: "Card" },
  { id: "Deposit", label: "Deposit" },
  { id: "Installment Savings", label: "Installment Savings" },
];

const SAVINGS_PERIOD_OPTIONS = [
  { id: "Short-term (~1 year)", label: "Short-term", subtitle: "(~1 year)" },
  { id: "Mid-term (~3 year)", label: "Mid-term", subtitle: "(~3 year)" },
  { id: "Long-term (3+ year)", label: "Long-term", subtitle: "(3+ year)" },
];

const SAVINGS_PURPOSE_OPTIONS = [
  "Education",
  "Emergency Fund",
  "Home Purchase",
  "Monthly Expenses",
  "Retirement",
  "Travel",
  "Others",
];

const CARD_PURPOSE_OPTIONS = [
  "Credit Building",
  "Daily Spending",
  "Education",
  "Rewards Maximization",
  "Travel",
  "Others",
];

const INCOME_LEVEL_OPTIONS = ["Low", "Medium", "High"];

const PREFERRED_BANK_OPTIONS = [
  "Sunny Bank",
  "GreenTree Bank",
  "DeepBlue Bank",
  "SkyBank",
  "Others",
];

export default function PreferenceEditorSheet({ isOpen, initialValues, onClose, onSave }) {
  const [productTypes, setProductTypes] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [savingsPurpose, setSavingsPurpose] = useState("");
  const [cardPurpose, setCardPurpose] = useState("");
  const [incomeLevel, setIncomeLevel] = useState("");
  const [preferredBank, setPreferredBank] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [renderSheet, setRenderSheet] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const values = initialValues || {};
    setProductTypes(values.productTypes ?? []);
    setPeriods(values.savingsPeriods ?? (values.savingsPeriod ? [values.savingsPeriod] : []));
    setSavingsPurpose(values.savingsPurpose ?? "");
    setCardPurpose(values.cardPurpose ?? "");
    setIncomeLevel(values.incomeLevel ?? "");
    setPreferredBank(values.preferredBank ?? "");
    setOpenDropdown(null);
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (isOpen) {
      setRenderSheet(true);
      setClosing(false);
    } else if (renderSheet) {
      setClosing(true);
      const timeout = setTimeout(() => {
        setRenderSheet(false);
        setClosing(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, renderSheet]);

  const toggleMulti = (value, listSetter, list) => {
    if (list.includes(value)) {
      listSetter(list.filter((item) => item !== value));
    } else {
      listSetter([...list, value]);
    }
  };

  const handleSave = () => {
    onSave?.({
      productTypes,
      savingsPeriods: periods,
      savingsPeriod: periods[0] ?? "",
      savingsPurpose,
      cardPurpose,
      incomeLevel,
      preferredBank,
    });
  };

  const dropdownOptions = useMemo(
    () => ({
      savingsPurpose: SAVINGS_PURPOSE_OPTIONS,
      cardPurpose: CARD_PURPOSE_OPTIONS,
      preferredBank: PREFERRED_BANK_OPTIONS,
    }),
    []
  );

  if (!renderSheet) return null;

  return (
    <S.Overlay $closing={closing}>
      <S.Sheet $closing={closing}>
        <S.SheetHandle onClick={onClose} role="button" aria-label="Close" />
        <S.SheetContent>
          <S.SheetTitle>Edit Preferences</S.SheetTitle>
          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Desired Product Type</S.PreferenceEditorHeading>
            <S.PreferenceEditorHint>Multiple selections possible</S.PreferenceEditorHint>
            <S.PreferenceChipRow>
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <S.PreferenceChip
                  key={option.id}
                  type="button"
                  $active={productTypes.includes(option.id)}
                  onClick={() => toggleMulti(option.id, setProductTypes, productTypes)}
                >
                  <S.PreferenceChipPrimary>{option.label}</S.PreferenceChipPrimary>
                </S.PreferenceChip>
              ))}
            </S.PreferenceChipRow>
          </S.PreferenceEditorSection>

          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Savings Goal Period</S.PreferenceEditorHeading>
            <S.PreferenceEditorHint>Multiple selections possible</S.PreferenceEditorHint>
            <S.PreferenceChipRow>
              {SAVINGS_PERIOD_OPTIONS.map((option) => (
                <S.PreferenceChip
                  key={option.id}
                  type="button"
                  $active={periods.includes(option.id)}
                  onClick={() => toggleMulti(option.id, setPeriods, periods)}
                >
                  <S.PreferenceChipPrimary>{option.label}</S.PreferenceChipPrimary>
                  <S.PreferenceChipSecondary>{option.subtitle}</S.PreferenceChipSecondary>
                </S.PreferenceChip>
              ))}
            </S.PreferenceChipRow>
          </S.PreferenceEditorSection>

          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Savings Purpose</S.PreferenceEditorHeading>
            <S.PreferenceSelect>
              <S.PreferenceSelectButton
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "savings" ? null : "savings")}
              >
                <S.PreferenceSelectLabel $placeholder={!savingsPurpose}>
                  {savingsPurpose || "Please select"}
                </S.PreferenceSelectLabel>
                <S.PreferenceSelectArrow $open={openDropdown === "savings"}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#d9d9d9"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.PreferenceSelectArrow>
              </S.PreferenceSelectButton>
              {openDropdown === "savings" && (
                <S.PreferenceSelectDropdown>
                  <S.FilterDropdownList style={{ maxHeight: "220px", overflowY: "auto" }}>
                    {dropdownOptions.savingsPurpose.map((option) => (
                      <S.DropdownOption
                        key={option}
                        $active={savingsPurpose === option}
                        onClick={() => {
                          setSavingsPurpose(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{option}</span>
                      </S.DropdownOption>
                    ))}
                  </S.FilterDropdownList>
                </S.PreferenceSelectDropdown>
              )}
            </S.PreferenceSelect>
          </S.PreferenceEditorSection>

          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Card Usage Purpose</S.PreferenceEditorHeading>
            <S.PreferenceSelect>
              <S.PreferenceSelectButton
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "card" ? null : "card")}
              >
                <S.PreferenceSelectLabel $placeholder={!cardPurpose}>
                  {cardPurpose || "Please select"}
                </S.PreferenceSelectLabel>
                <S.PreferenceSelectArrow $open={openDropdown === "card"}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#d9d9d9"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.PreferenceSelectArrow>
              </S.PreferenceSelectButton>
              {openDropdown === "card" && (
                <S.PreferenceSelectDropdown>
                  <S.FilterDropdownList style={{ maxHeight: "220px", overflowY: "auto" }}>
                    {dropdownOptions.cardPurpose.map((option) => (
                      <S.DropdownOption
                        key={option}
                        $active={cardPurpose === option}
                        onClick={() => {
                          setCardPurpose(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{option}</span>
                      </S.DropdownOption>
                    ))}
                  </S.FilterDropdownList>
                </S.PreferenceSelectDropdown>
              )}
            </S.PreferenceSelect>
          </S.PreferenceEditorSection>

          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Income</S.PreferenceEditorHeading>
            <S.PreferenceChipRow>
              {INCOME_LEVEL_OPTIONS.map((option) => {
                const active = incomeLevel === option;
                return (
                  <S.PreferenceChip
                    key={option}
                    type="button"
                    $active={active}
                    onClick={() => setIncomeLevel(active ? "" : option)}
                  >
                    <S.PreferenceChipPrimary>{option}</S.PreferenceChipPrimary>
                  </S.PreferenceChip>
                );
              })}
            </S.PreferenceChipRow>
          </S.PreferenceEditorSection>

          <S.PreferenceEditorSection>
            <S.PreferenceEditorHeading>Preferred Bank (optional)</S.PreferenceEditorHeading>
            <S.PreferenceSelect>
              <S.PreferenceSelectButton
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "bank" ? null : "bank")}
              >
                <S.PreferenceSelectLabel $placeholder={!preferredBank}>
                  {preferredBank || "Please select"}
                </S.PreferenceSelectLabel>
                <S.PreferenceSelectArrow $open={openDropdown === "bank"}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#d9d9d9"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.PreferenceSelectArrow>
              </S.PreferenceSelectButton>
              {openDropdown === "bank" && (
                <S.PreferenceSelectDropdown>
                  <S.FilterDropdownList style={{ maxHeight: "220px", overflowY: "auto" }}>
                    {dropdownOptions.preferredBank.map((option) => (
                      <S.DropdownOption
                        key={option}
                        $active={preferredBank === option}
                        onClick={() => {
                          setPreferredBank(option);
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{option}</span>
                      </S.DropdownOption>
                    ))}
                  </S.FilterDropdownList>
                </S.PreferenceSelectDropdown>
              )}
            </S.PreferenceSelect>
          </S.PreferenceEditorSection>
        </S.SheetContent>
        <S.SheetFooter>
          <S.SecondaryButton type="button" onClick={onClose}>
            Cancel
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={handleSave} disabled={productTypes.length === 0}>
            Confirm
          </S.PrimaryButton>
        </S.SheetFooter>
      </S.Sheet>
    </S.Overlay>
  );
}
