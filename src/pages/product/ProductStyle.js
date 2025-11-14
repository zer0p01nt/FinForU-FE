import styled, { css, keyframes } from "styled-components";

const SAFE_TOP = "env(safe-area-inset-top, 0px)";
const SAFE_BOTTOM = "env(safe-area-inset-bottom, 0px)";
const HEADER_HEIGHT = "3.5625rem";
const NAV_HEIGHT = "5rem";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const sheetSlideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const sheetSlideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(110%);
    opacity: 0;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 393px;
  height: 100vh;
  margin: 0 auto;
  padding-top: calc(${HEADER_HEIGHT} + ${SAFE_TOP});
  padding-bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM});
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

export const Content = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 1.25rem calc(${NAV_HEIGHT} + ${SAFE_BOTTOM});
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const DetailPage = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 1.25rem calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 1.5rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ComparePage = styled.div`
  flex: 1;
  min-height: 0;
  padding: 0 1.25rem calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 1.5rem);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const CompareHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: -20px;
`;

export const CompareTitle = styled.h2`
  margin-top: 20px;
  font-size: 25px;
  font-weight: 400;
  color: #000;
`;

export const CompareActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

export const CompareEmptyState = styled.div`
  padding: 2rem 1.5rem;
  border-radius: 1.25rem;
  text-align: center;
  color: #000;
  font-size: 0.9375rem;
`;

export const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 3rem;
  margin-top: 15px;
  padding: 0 1rem 0 2.75rem;
  border-radius: 0.875rem;
  border: 2px solid #009cea;
  background-color: #fff;
  font-size: 0.9375rem;
  color: #0f3a70;
  outline: none;

  &::placeholder {
    color: rgba(15, 58, 112, 0.4);
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  left: 1rem;
  bottom: 15px;
  color: #009cea;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const TabList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  border-bottom: 1.5px solid rgba(15, 58, 112, 0.1);
`;

export const TabButton = styled.button`
  flex: 1;
  position: relative;
  background: none;
  border: none;
  padding: 0.75rem 0.15rem;
  font-size: 1rem;
  font-weight: 500;
  color: rgba(15, 58, 112, 0.55);
  cursor: pointer;
  transition: color 0.2s ease;

  ${({ $active }) =>
    $active &&
    css`
      color: #009cea;
      font-weight: 600;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -1.5px;
        height: 3px;
        border-radius: 3px;
        background: #009cea;
      }
    `}
`;

export const AiPromptButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  border-radius: 1rem;
  border: 1.5px solid #009cea;
  background: #ffffff;
  color: #009cea;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
`;

export const AiPromptIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
`;

export const ActionBar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FilterScroll = styled.div`
  display: flex;
  gap: 0.3rem;
  margin: 0 -0.75rem;
  padding: 0 0.75rem 0.25rem;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    padding: 0 0.25rem;
  }

  & > div:first-child {
    padding-left: 0;
  }

  & > div:last-child {
    padding-right: 0;
  }
`;

export const FilterChip = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "rgba(15, 58, 112, 0.16)")};
  background: ${({ $active }) => ($active ? "#009cea" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  width: fit-content;
  max-width: 100%;
  white-space: nowrap;
  outline: none; // 횡스크롤 시 테두리 검은 선 안 생기도록

  &:active {
    transform: scale(0.98);
  }
`;

export const FilterLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

export const FilterArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;

  svg {
    width: 0.8rem;
    height: 0.8rem;
  }

  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

export const FilterDropdown = styled.div`
  position: absolute;
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  z-index: 12;
  width: max-content;
  min-width: ${({ $minWidth }) => `${$minWidth}px`};
  max-width: calc(100vw - 2.5rem);
`;

export const FilterDropdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #fff;
  border-radius: 1rem;
  border: 1px solid rgba(15, 58, 112, 0.18);
  overflow: hidden;
`;

export const DropdownOption = styled.button`
  position: relative;
  width: 100%;
  text-align: left;
  padding: 0.3rem;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
  transition: color 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.5px;
    height: 1px;
    background: rgba(15, 58, 112, 0.12);
  }

  &:last-child::after {
    display: none;
  }

  span {
    display: block;
    padding: 0.6rem 1.25rem;
    border-radius: 0.65rem;
    background: ${({ $active }) => ($active ? "rgba(0, 156, 234, 0.18)" : "transparent")};
    transition: background 0.2s ease;
  }

  &:hover span {
    background: ${({ $active }) =>
      $active ? "rgba(0, 156, 234, 0.22)" : "rgba(0, 156, 234, 0.08)"};
  }
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ProductCard = styled.div`
  border-radius: 1rem;
  background: #ecf9ff;
  border: 2px solid rgba(15, 58, 112, 0.08);
  padding: 1rem 1.125rem;
  display: flex;
  gap: 0.875rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const CardBadge = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  color: #009cea;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const AiSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const PreferenceCard = styled.div`
  position: relative;
  padding: 1.25rem 1.25rem 1.5rem;
  border-radius: 1.25rem;
  background: #ffffff;
  border: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const PreferenceTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
  color: #000;
`;

export const PreferenceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.95rem;
`;

export const PreferenceLabel = styled.span`
  color: rgba(50, 53, 57, 0.6);
  min-width: 9rem;
`;

export const PreferenceValue = styled.span`
  color: #000;
  font-weight: 400;
`;

export const PreferenceEditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  padding: 0.35rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 156, 234, 0.12);
  }
`;

export const PreferenceEditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PreferenceEditorHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 5px;
  color: #000;
`;

export const PreferenceEditorHint = styled.span`
  font-size: 0.8rem;
  font-weight: 200;
  color: #000;
  margin-bottom: 5px;
  margin-top: -5px;
`;

export const PreferenceChipRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PreferenceChip = styled.button`
  padding: 10px;
  border-radius: 0.9rem;
  border: 1px solid ${({ $active }) => ($active ? "transparent" : "rgba(15, 58, 112, 0.15)")};
  background: ${({ $active }) => ($active ? "#009cea" : "#fff")};
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 6.75rem;
  gap: 0.2rem;
  text-align: center;
  line-height: 1.15;
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  --chip-secondary: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.85)" : "rgba(0, 0, 0, 0.55)"};
`;

export const PreferenceChipPrimary = styled.span`
  font-size: 0.95rem;
  font-weight: 400;
  color: inherit;
`;

export const PreferenceChipSecondary = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--chip-secondary);
`;

export const PreferenceSelect = styled.div`
  position: relative;
`;

export const PreferenceSelectButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(15, 58, 112, 0.15);
  background: #fff;
  font-size: 0.9rem;
  color: #000;
  cursor: pointer;
`;

export const PreferenceSelectLabel = styled.span`
  flex: 1;
  text-align: left;
  color: ${({ $placeholder }) => ($placeholder ? "rgba(15, 58, 112, 0.45)" : "#000")};
`;

export const PreferenceSelectArrow = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }

  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

export const PreferenceSelectDropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.25rem);
  z-index: 12;
`;

export const RecommendationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const RecommendationCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  background: #e6f7ff;
  border: 1px solid #d9d9d9;
`;

export const RecommendationHeader = styled.div`
  display: flex;
  gap: 1rem;
`;

export const RecommendationMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const RecommendationBank = styled.div`
  font-size: 0.85rem;
  color: rgba(15, 58, 112, 0.65);
`;

export const RecommendationTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f3a70;
`;

export const RecommendationDescription = styled.div`
  font-size: 0.95rem;
  color: rgba(15, 58, 112, 0.75);
`;

export const RecommendationAction = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.85rem;
  border-radius: 0.9rem;
  border: none;
  background: #0093dd;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;
export const CardMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const CardBank = styled.div`
  font-size: 0.875rem;
  font-weight: 400;
  color: #000;
`;

export const CardTitle = styled.div`
  font-size: 1.0625rem;
  font-weight: 600;
  color: #000;
`;

export const CardInfo = styled.div`
  font-size: 0.875rem;
  color: #000;
  font-weight: 400;

  span {
    color: #009cea;
    font-weight: 700;
  }
`;

export const CardTagRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
`;

export const CardTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  background: rgba(0, 156, 234, 0.12);
  color: #009cea;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const EmptyState = styled.div`
  padding: 2.5rem 1rem;
  border-radius: 1.25rem;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  color: #2e2e2e;
  font-size: 0.9375rem;
`;

export const CompareFab = styled.button`
  position: fixed;
  right: calc(max((100vw - 393px) / 2 + 1.5rem, 1rem));
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 2.5rem);
  width: 3.625rem;
  height: 3.625rem;
  border-radius: 999px;
  background: #0093dd;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  z-index: 4;
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 10;
`;

export const Sheet = styled.div`
  width: 100%;
  max-width: 393px;
  background: #fff;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.25rem 1.5rem 1.5rem;
  box-shadow: 0 -10px 40px rgba(15, 58, 112, 0.18);
  max-height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 120px;
`;

export const SheetHandle = styled.div`
  width: 50px;
  height: 10px;
  border-radius: 3px;
  background: rgba(15, 58, 112, 0.15);
  margin: 0 auto 1rem;
  flex-shrink: 0;
`;

export const SheetTitle = styled.h2`
  font-size: 25px;
  font-weight: 500;
  color: #000;
  margin-bottom: 0.3rem;
`;

export const SheetContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  padding-right: 0.25rem;
  margin-top: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const OptionItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  border: 1px solid ${({ $active }) => ($active ? "#009cea" : "rgba(15, 58, 112, 0.12)")};
  background: ${({ $active }) => ($active ? "rgba(0, 156, 234, 0.12)" : "#fff")};
  font-size: 0.9375rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? "#009cea" : "#0f3a70")};
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const SheetFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 10px;
  flex-shrink: 0;
`;

export const SecondaryButton = styled.button`
  flex: 1;
  height: 3.125rem;
  border-radius: 1rem;
  border: 1px solid rgba(15, 58, 112, 0.2);
  background: var(--color-primary-gray);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
`;

export const PrimaryButton = styled.button`
  flex: 1;
  height: 3.125rem;
  border-radius: 1rem;
  border: none;
  background: #009cea;
  padding: 10px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }
`;

export const DetailHero = styled.div`
  background: #ffdbdb;
  padding: 2.5rem 1.75rem 1rem;
  margin: 0 -20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.75rem;
  min-height: 200px;
`;

export const DetailHeroTitle = styled.h3`
  margin: 0;
  font-size: 2.25rem;
  font-weight: 600;
  color: #000;
`;

export const DetailHeroSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(15, 58, 112, 0.75);
`;

export const DetailSection = styled.section`
  background: #fff;
  border-radius: 1.25rem;
  border: 1.5px solid #c0eaff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DetailParagraph = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.6;
  color: #000;
`;

export const DetailSectionTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`;

export const DetailBlockTitle = styled(DetailSectionTitle)``;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: 15px;
`;

export const DetailRowLabel = styled.span`
  color: #000;
  font-weight: 300;
`;

export const DetailRowValue = styled.span`
  color: ${({ $highlight }) => ($highlight ? "#009CEA" : "#000")};
  font-weight: ${({ $highlight }) => ($highlight ? 600 : 400)};
`;

export const DetailActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

export const FloatingNotice = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(${NAV_HEIGHT} + ${SAFE_BOTTOM} + 2.5rem);
  padding: 0.75rem 1.1rem;
  width: max-content;
  max-width: min(90%, 360px);
  border-radius: 1rem;
  background: #0093dd;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 15;
`;

export const SelectorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CompareCardButton = styled(ProductCard).attrs({ as: "button" })`
  width: 100%;
  text-align: left;
  position: relative;
  background: #ecf9ff;
  border: 2px solid
    ${({ $selected }) => ($selected ? "rgba(0, 156, 234, 0.35)" : "rgba(15, 58, 112, 0.08)")};
  cursor: pointer;
  appearance: none;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.45;
      cursor: not-allowed;
      &:hover {
        transform: none;
      }
    `}

  /* CompareCardButton 내부의 CardMeta에 체크박스 공간 확보 */
  ${CardMeta} {
    padding-right: 4.5rem;
    min-width: 0; /* flex item이 축소될 수 있도록 */
  }

  /* CompareCardButton 내부의 CardTitle에 줄바꿈 허용 */
  ${CardTitle} {
    word-wrap: break-word;
    word-break: break-word;
    line-height: 1.4;
  }
`;

export const CompareSelectorCheck = styled.span`
  position: absolute;
  top: 50%;
  right: 1.25rem;
  transform: translateY(-50%);
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  background: ${({ $checked }) => ($checked ? "#009cea" : "#E4E4E4")};
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1rem;
  pointer-events: none;
`;

export const CompareTable = styled.div`
  margin-top: 1.25rem;
  overflow: hidden;
  background: #fff;
`;

export const CompareTableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => Math.max($columns, 1)}, minmax(0, 1fr));
  background: #fff;
`;

export const CompareTableHeaderCell = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  justify-content: center;

  &:last-child {
    border-right: none;
  }
`;

export const CompareProductTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  line-height: 1.25;
  text-align: center;
`;

export const CompareProductBank = styled.div`
  font-size: 0.8rem;
  color: #000;
  font-weight: 300;
  text-align: center;
`;

export const CompareTableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => Math.max($columns, 1)}, minmax(0, 1fr));
  border-top: 1px solid #d9d9d9;
`;

export const CompareTableCell = styled.div`
  padding: 1.25rem 0rem;
  background: ${({ $highlight }) => ($highlight ? "#D9F2FF" : "#fff")};
  border-right: 1px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  text-align: center;
  justify-content: center;

  &:last-child {
    border-right: none;
  }
`;

export const CompareCellLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.84rem;
  font-weight: 400;
  color: #000;
`;

export const CompareCellCaption = styled.span`
  font-size: 0.72rem;
  color: #000;
`;

export const CompareCellValue = styled.div`
  font-size: 1.05rem;
  font-weight: 400;
  color: #000;
  line-height: 1.35;
`;

export const CompareCellList = styled.ul`
  margin: 0;
  /* padding-left: 1rem; */
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  color: #000;

  li {
    /* list-style: disc; */
    list-style: none;
  }
`;

export const CompareWebsiteButton = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0;
  border: none;
  background: none;
  color: #000;
  font-size: 0.95rem;
  font-weight: 400;
  cursor: pointer;

  &:disabled {
    color: rgba(15, 58, 112, 0.35);
    cursor: default;
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export const CompareTagBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const CompareTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(0, 156, 234, 0.12);
  color: #009cea;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const CompareResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
`;

export const ResultCard = styled.div`
  background: linear-gradient(165deg, rgba(0, 156, 234, 0.12), rgba(255, 255, 255, 0.95));
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid rgba(15, 58, 112, 0.08);
`;

export const ResultTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: center;
  font-size: 0.8125rem;
  color: #000;
  font-weight: 400;
  text-align: center;

  span {
    font-weight: 400;
    color: #000;
    text-align: center;
  }
`;

export const CompareNotice = styled.div`
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  background: rgba(15, 58, 112, 0.08);
  font-size: 0.8125rem;
  color: rgba(15, 58, 112, 0.75);
  text-align: center;
`;

export const DetailDivider = styled.hr`
  border: none;
  height: 1px;
  background: rgba(0, 147, 221, 0.25);
  margin: 0;
  margin-top: 10px;
`;

export const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
