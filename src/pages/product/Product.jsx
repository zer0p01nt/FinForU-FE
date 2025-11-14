import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";
import RecommendIcon from "./icons/RecommendIcon.svg";
import { useHeaderStore } from "../../stores/headerStore";
import api from "../../api/api";
import { getOrCreateGuestToken } from "../../utils/guestToken";
import AllProductsSection from "./components/AllProductsSection";
import RecommendationsSection from "./components/RecommendationsSection";
import PreferenceEditorSheet from "./components/PreferenceEditorSheet";
import ComparePage from "./components/ComparePage";
import ProductDetailSheet from "./components/ProductDetailSheet";
import * as S from "./ProductStyle";

import shinhanLogo from "../Rates/icon/shinhan.png";
import hanaLogo from "../Rates/icon/hana.png";
import kookminLogo from "../Rates/icon/kookmin.png";
import wooriLogo from "../Rates/icon/woori.png";
import { helmetTitle } from "../../constants/title";
import { useAuthStore } from "../../stores/authStore";

export const getBankLogo = (bankName) => {
  if (!bankName) return null;

  const bankNameLower = bankName.toLowerCase();

  if (bankNameLower.includes("shinhan") || bankNameLower === "shinhan bank") {
    return shinhanLogo;
  }
  if (bankNameLower.includes("hana") || bankNameLower === "hana bank") {
    return hanaLogo;
  }
  if (
    bankNameLower.includes("kookmin") ||
    bankNameLower.includes("kb") ||
    bankNameLower === "kb bank"
  ) {
    return kookminLogo;
  }
  if (bankNameLower.includes("woori") || bankNameLower === "woori bank") {
    return wooriLogo;
  }

  return null;
};

const fetchAllProducts = async (params = {}) => {
  const response = await api.get("/api/products", { params });
  return response.data?.data ?? {};
};

const fetchProductDetail = async ({ type, id }) => {
  const response = await api.get(`/api/products/${type}/${id}`);
  return response.data?.data ?? null;
};

const fetchProductComparison = async ({ type, productIds }) => {
  const params = {
    type,
    productIds: Array.isArray(productIds) ? productIds.join(",") : productIds,
  };
  const response = await api.get("/api/products/comparison/details", { params });
  return response.data?.data ?? null;
};

const getRecommendations = async () => {
  try {
    const response = await api.get("/api/recommend");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkLoginStatus = async () => {
  try {
    const response = await api.get("/api/members/me");
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return false;
    }
    return false;
  }
};

/**
 * 선호 상품 조회 API
 * @param {string|null} guestToken - 게스트 토큰 (비회원인 경우)
 * @returns {Promise<Object>} API 응답
 */
const getPreferences = async (guestToken = null) => {
  const url = "/api/preference";
  const config = {
    params: {},
  };

  if (guestToken) {
    config.params.guestToken = guestToken;
  }

  const response = await api.get(url, config);
  return response.data;
};

/**
 * 선호 상품 저장/수정 API
 * @param {Object} params - 요청 파라미터
 * @param {Array<string>} params.types - 금융 상품 종류 (CARD, DEPOSIT, SAVING)
 * @param {Array<string>} params.periods - 적금 목표 기간 (SHORT_TERM, MID_TERM, LONG_TERM)
 * @param {string} params.savingPurpose - 적금 목적 (EDUCATION, EMERGENCY_FUND, etc.)
 * @param {string} params.cardPurpose - 카드 사용 목적 (CREDIT_BUILDING, DAILY_SPENDING, etc.)
 * @param {string} params.income - 수입 (LOW, MEDIUM, HIGH)
 * @param {string|null} params.bank - 선호 은행 (KB_BANK, WOORI_BANK, HANA_BANK, SHINHAN_BANK)
 * @param {string|null} params.guestToken - 게스트 토큰 (비회원인 경우)
 * @returns {Promise<Object>} API 응답
 */
const savePreferences = async ({
  types,
  periods,
  savingPurpose,
  cardPurpose,
  income,
  bank = null,
  guestToken = null,
}) => {
  const url = "/api/preference";
  
  if (!Array.isArray(types) || types.length === 0) {
    throw new Error("types must be a non-empty array");
  }
  if (!Array.isArray(periods) || periods.length === 0) {
    throw new Error("periods must be a non-empty array");
  }
  if (!savingPurpose || typeof savingPurpose !== "string") {
    throw new Error("savingPurpose must be a non-empty string");
  }
  if (!cardPurpose || typeof cardPurpose !== "string") {
    throw new Error("cardPurpose must be a non-empty string");
  }
  if (!income || typeof income !== "string") {
    throw new Error("income must be a non-empty string");
  }

  const data = {
    types,
    periods,
    savingPurpose,
    cardPurpose,
    income,
    bank: bank || null,
  };

  const config = {
    params: {},
  };

  if (guestToken) {
    config.params.guestToken = guestToken;
  }

  try {
    const response = await api.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 비교전 상품 바구니에 담기 API
 * @param {Object} params - 요청 파라미터
 * @param {string} params.type - 상품 타입 (CARD, DEPOSIT, SAVING)
 * @param {number} params.productId - 상품 ID
 * @param {string|null} params.guestToken - 게스트 토큰 (비회원인 경우)
 * @returns {Promise<Object>} API 응답
 */
const addToComparison = async ({ type, productId, guestToken = null }) => {
  const url = "/api/products/comparison";
  const data = {
    type,
    productId,
  };

  const config = {
    params: {},
  };

  if (guestToken) {
    config.params.guestToken = guestToken;
  }

  const response = await api.post(url, data, config);
  return response.data;
};

/**
 * 비교 상품 리스트 조회 API
 * @param {Object} params - 요청 파라미터
 * @param {string|null} params.guestToken - 게스트 토큰 (비회원인 경우)
 * @param {string|null} params.bank - 은행 종류 (KB Bank, Woori Bank, Hana Bank, Shinhan Bank)
 * @param {string|null} params.type - 상품 타입 (CARD, DEPOSIT, SAVING)
 * @param {number|null} params.minRate - 최소 금리
 * @param {number|null} params.maxRate - 최대 금리
 * @param {number|null} params.termMonths - 예적금 기간 (12, 36, -1)
 * @returns {Promise<Object>} API 응답
 */
const getComparisonList = async ({
  guestToken = null,
  bank = null,
  type = null,
  minRate = null,
  maxRate = null,
  termMonths = null,
}) => {
  const url = "/api/products/comparison";
  const config = {
    params: {},
  };

  if (guestToken) {
    config.params.guestToken = guestToken;
  }

  if (bank) {
    config.params.bank = bank;
  }
  if (type) {
    config.params.type = type;
  }
  if (minRate !== null) {
    config.params.minRate = minRate;
  }
  if (maxRate !== null) {
    config.params.maxRate = maxRate;
  }
  if (termMonths !== null) {
    config.params.termMonths = termMonths;
  }

  const response = await api.get(url, config);
  return response.data;
};

const BANK_ID_MAP = {
  "KB Bank": "kb_bank",
  "Woori Bank": "woori_bank",
  "Hana Bank": "hana_bank",
  "Shinhan Bank": "shinhan_bank",
};

const BANK_OPTIONS = [
  { id: "kb_bank", label: "KB Bank" },
  { id: "woori_bank", label: "Woori Bank" },
  { id: "hana_bank", label: "Hana Bank" },
  { id: "shinhan_bank", label: "Shinhan Bank" },
  { id: "others", label: "Others" },
];

const PRODUCT_TYPE_OPTIONS = [
  { id: "card", label: "Card" },
  { id: "deposit", label: "Deposit" },
  { id: "saving", label: "Savings" },
];

const API_PRODUCT_TYPE_MAP = {
  card: "CARD",
  deposit: "DEPOSIT",
  saving: "SAVING",
  savings: "SAVING",
};

const PREFERENCE_TYPE_LABELS = {
  CARD: "Card",
  DEPOSIT: "Deposit",
  SAVING: "Installment Savings",
};

const PREFERENCE_PERIOD_LABELS = {
  SHORT_TERM: "Short-term (~1 year)",
  MID_TERM: "Mid-term (~3 year)",
  LONG_TERM: "Long-term (3+ year)",
};

const PREFERENCE_SAVING_PURPOSE_LABELS = {
  EMERGENCY_FUND: "Emergency Fund",
  EDUCATION: "Education",
  HOME_PURCHASE: "Home Purchase",
  MONTHLY_EXPENSES: "Monthly Expenses",
  RETIREMENT: "Retirement",
  TRAVEL: "Travel",
  OTHERS: "Others",
};

const PREFERENCE_CARD_PURPOSE_LABELS = {
  CREDIT_BUILDING: "Credit Building",
  DAILY_SPENDING: "Daily Spending",
  EDUCATION: "Education",
  REWARDS_MAXIMIZATION: "Rewards Maximization",
  TRAVEL: "Travel",
  OTHERS: "Others",
};

const PREFERENCE_INCOME_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const PREFERENCE_BANK_LABELS = {
  KB_BANK: "KB Bank",
  WOORI_BANK: "Woori Bank",
  HANA_BANK: "Hana Bank",
  SHINHAN_BANK: "Shinhan Bank",
};

const FILTER_CONFIG = {
  bank: {
    key: "bank",
    label: "Bank",
    options: BANK_OPTIONS,
  },
  productType: {
    key: "productType",
    label: "Product Type",
    options: PRODUCT_TYPE_OPTIONS,
  },
  interest: {
    key: "interest",
    label: "Interest Rate",
    options: [
      { id: "upTo1", label: "Up to 1%", min: 0, max: 1 },
      { id: "1to3", label: "1% to 3%", min: 1, max: 3 },
      { id: "3to5", label: "3% to 5%", min: 3, max: 5 },
      { id: "5to7", label: "5% to 7%", min: 5, max: 7 },
      { id: "above7", label: "Above 7%", min: 7, max: Infinity },
    ],
  },
  period: {
    key: "period",
    label: "Period",
    options: [
      { id: "short", label: "Short-term (~1 year)" },
      { id: "mid", label: "Mid-term (~3 year)" },
      { id: "long", label: "Long-term (3+ year)" },
    ],
  },
};

const mapBankNameToId = (bankName = "") => BANK_ID_MAP[bankName] ?? "others";

const mapBankIdToApiBank = (bankId) => {
  const bankMap = {
    kb_bank: "KB Bank",
    woori_bank: "Woori Bank",
    hana_bank: "Hana Bank",
    shinhan_bank: "Shinhan Bank",
  };
  return bankMap[bankId] || null;
};

const mapInterestFilterToRateRange = (interestId) => {
  const interestOption = FILTER_CONFIG.interest.options.find((opt) => opt.id === interestId);
  if (!interestOption) return { minRate: null, maxRate: null };

  if (interestId === "upTo1") {
    return { minRate: 1, maxRate: null };
  } else if (interestId === "1to3") {
    return { minRate: 1, maxRate: 3 };
  } else if (interestId === "3to5") {
    return { minRate: 3, maxRate: 5 };
  } else if (interestId === "5to7") {
    return { minRate: 5, maxRate: 7 };
  } else if (interestId === "above7") {
    return { minRate: 8, maxRate: null };
  }

  return {
    minRate: interestOption.min !== undefined ? interestOption.min : null,
    maxRate: interestOption.max !== Infinity ? interestOption.max : null,
  };
};

const mapPeriodFilterToTermMonths = (periodId) => {
  const periodMap = {
    short: 12,
    mid: 36,
    long: -1,
  };
  return periodMap[periodId] || null;
};

const formatRateValue = (value) => {
  if (typeof value !== "number") {
    return "-";
  }
  return `${value}%`;
};

const formatTermLabel = (termMonths) => {
  if (termMonths === -1) return "36+ months";
  if (!termMonths || termMonths <= 0) return "No fixed term";
  return `${termMonths} months`;
};

const formatCurrencyKRW = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    if (value === 0) return "₩0";
    return `₩${value.toLocaleString()}`;
  }
  return String(value);
};

const appendHighlightSuffix = (value, isHighlighted) => {
  return value;
};

const normalizePreferenceValue = (value, labelsMap) => {
  if (!value) return "";
  return labelsMap[value] ?? value;
};

const normalizePreferenceArray = (values, labelsMap) => {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => labelsMap[value] ?? value)
    .filter(
      (value, index, array) =>
        typeof value === "string" && value.trim().length > 0 && array.indexOf(value) === index
    );
};

const derivePeriodKey = (termMonths) => {
  if (termMonths === null || termMonths === undefined) return null;
  if (termMonths === -1 || termMonths > 36) return "long";
  if (termMonths > 12) return "mid";
  return "short";
};

const buildCardProduct = (item) => {
  const benefit = item.feeAndBenefit || "See bank for benefits";
  const bankName = item.bankName || "Unknown Bank";
  return {
    id: `card-${item.id}`,
    sourceId: item.id,
    bankId: mapBankNameToId(item.bankName),
    bankName,
    name: item.name,
    type: "card",
    period: "short",
    interestRange: { min: null, max: null },
    termLabel: "Card product",
    highlight: benefit,
    keyFeatures: benefit,
    description: benefit,
    tags: [],
    heroNote: "",
    website: item.website || item.officialUrl || "",
    detailSections: [
      {
        title: "Card Details",
        rows: [
          { label: "Bank", value: bankName },
          { label: "Benefit", value: benefit },
        ],
      },
      {
        title: "Benefits",
        rows: [{ label: "Summary", value: benefit }],
      },
    ],
    raw: item,
  };
};

const buildDepositProduct = (item) => {
  const bankName = item.bankName || "Unknown Bank";
  const maxRate = typeof item.maxInterestRate === "number" ? item.maxInterestRate : null;
  const minRate = typeof item.minInterestRate === "number" ? item.minInterestRate : maxRate;
  const period = derivePeriodKey(item.termMonths);
  const termLabel = formatTermLabel(item.termMonths);
  const highlight =
    maxRate !== null
      ? `Up to ${formatRateValue(maxRate)}`
      : item.isFlexible
        ? "Flexible deposit"
        : "Fixed deposit";
  const featureLead =
    maxRate !== null
      ? `Earn up to ${formatRateValue(maxRate)}`
      : item.isFlexible
        ? "Enjoy flexible deposits"
        : "Explore this deposit";

  return {
    id: `deposit-${item.id}`,
    sourceId: item.id,
    bankId: mapBankNameToId(item.bankName),
    bankName,
    name: item.name,
    type: "deposit",
    period,
    interestRange: {
      min: typeof minRate === "number" ? minRate : 0,
      max: typeof maxRate === "number" ? maxRate : typeof minRate === "number" ? minRate : 0,
    },
    termLabel,
    highlight,
    keyFeatures: `${featureLead} with a ${termLabel.toLowerCase()}.`,
    description: item.isFlexible ? "Flexible term deposit option." : "Fixed-term deposit.",
    tags: [],
    heroNote: "",
    website: item.website || item.officialUrl || "",
    detailSections: [
      {
        title: "Deposit Details",
        rows: [
          { label: "Bank", value: bankName },
          { label: "Maximum Rate", value: formatRateValue(maxRate) },
          { label: "Deposit Term", value: termLabel },
          { label: "Flexible", value: item.isFlexible ? "Yes" : "No" },
        ],
      },
    ],
    raw: item,
  };
};

const buildSavingProduct = (item) => {
  const bankName = item.bankName || "Unknown Bank";
  const maxRate = typeof item.maxInterestRate === "number" ? item.maxInterestRate : null;
  const minRate = typeof item.minInterestRate === "number" ? item.minInterestRate : maxRate;
  const period = derivePeriodKey(item.termMonths);
  const termLabel = formatTermLabel(item.termMonths);
  const highlightParts = [];
  if (maxRate !== null) {
    highlightParts.push(`Up to ${formatRateValue(maxRate)}`);
  }
  if (typeof item.maxMonthly === "number") {
    highlightParts.push(`₩${item.maxMonthly.toLocaleString()} monthly`);
  }
  const featureLead =
    maxRate !== null
      ? `Save regularly and earn up to ${formatRateValue(maxRate)}`
      : item.isFlexible
        ? "Flexible savings option"
        : "Regular savings plan";

  return {
    id: `saving-${item.id}`,
    sourceId: item.id,
    bankId: mapBankNameToId(item.bankName),
    bankName,
    name: item.name,
    type: "saving",
    period,
    interestRange: {
      min: typeof minRate === "number" ? minRate : 0,
      max: typeof maxRate === "number" ? maxRate : typeof minRate === "number" ? minRate : 0,
    },
    termLabel,
    highlight:
      highlightParts.join(" · ") || (item.isFlexible ? "Flexible savings" : "Installment savings"),
    keyFeatures: `${featureLead} over a ${termLabel.toLowerCase()}.`,
    description: item.isFlexible ? "Flexible savings account." : "Regular savings plan.",
    tags: [],
    heroNote: "",
    website: item.website || item.officialUrl || "",
    detailSections: [
      {
        title: "Saving Details",
        rows: [
          { label: "Bank", value: bankName },
          { label: "Maximum Rate", value: formatRateValue(maxRate) },
          { label: "Saving Term", value: termLabel },
          { label: "Flexible", value: item.isFlexible ? "Yes" : "No" },
          {
            label: "Monthly Limit",
            value:
              typeof item.maxMonthly === "number" ? `₩${item.maxMonthly.toLocaleString()}` : "-",
          },
        ],
      },
    ],
    raw: item,
  };
};

const normalizeProducts = (data) => {
  if (!data || typeof data !== "object") return [];
  const cards = Array.isArray(data.cards) ? data.cards.map(buildCardProduct) : [];
  const deposits = Array.isArray(data.deposits) ? data.deposits.map(buildDepositProduct) : [];
  const savings = Array.isArray(data.savings) ? data.savings.map(buildSavingProduct) : [];
  return [...cards, ...deposits, ...savings];
};

const normalizeComparisonListResponse = (data) => {
  if (!data || typeof data !== "object") return [];
  
  const responseData = data.data || data;
  
  if (Array.isArray(responseData)) {
    return responseData.map((item) => {
      if (item.type === "CARD" || item.type === "card") {
        return buildCardProduct(item);
      } else if (item.type === "DEPOSIT" || item.type === "deposit") {
        return buildDepositProduct(item);
      } else if (item.type === "SAVING" || item.type === "saving" || item.type === "SAVINGS" || item.type === "savings") {
        return buildSavingProduct(item);
      }
      return buildDepositProduct(item);
    });
  }
  
  return normalizeProducts(responseData);
};

const buildCardComparisonProducts = (items = [], highlights = {}) =>
  items.map((item) => {
    const domesticFee = appendHighlightSuffix(
      formatCurrencyKRW(item.domesticAnnualFee),
      highlights?.lowestDomesticId === item.id
    );
    const internationalFee = appendHighlightSuffix(
      formatCurrencyKRW(item.internationalAnnualFee),
      highlights?.lowestInternationalId === item.id
    );

    const benefitRows = Array.isArray(item.benefit)
      ? item.benefit.map((benefit, index) => ({
          label: `Benefit ${index + 1}`,
          value: benefit,
        }))
      : [];

    return {
      id: `compare-card-${item.id}`,
      sourceId: item.id,
      type: "card",
      name: item.name,
      bankName: item.bank,
      website: item.website,
      detailSections: [
        {
          title: "Annual Fee",
          rows: [
            { label: "Domestic", value: domesticFee },
            { label: "International", value: internationalFee },
          ],
        },
        {
          title: "Benefits",
          rows: benefitRows,
        },
      ],
    };
  });

const buildDepositComparisonProducts = (items = [], highlights = {}) =>
  items.map((item) => {
    const baseRate = appendHighlightSuffix(
      formatRateValue(item.baseRate),
      highlights?.bestBaseRateId === item.id
    );
    const maxRate = appendHighlightSuffix(
      formatRateValue(item.maxRate),
      highlights?.bestMaxRateId === item.id
    );
    const minDeposit = appendHighlightSuffix(
      formatCurrencyKRW(item.minDepositAmount),
      highlights?.lowestMinDepositId === item.id
    );

    return {
      id: `compare-deposit-${item.id}`,
      sourceId: item.id,
      type: "deposit",
      name: item.name,
      bankName: item.bank,
      website: item.website,
      detailSections: [
        {
          title: "Interest Rate",
          rows: [
            { label: "Base Rate", value: baseRate },
            { label: "Maximum Rate", value: maxRate },
          ],
        },
        {
          title: "Deposit Details",
          rows: [
            { label: "Deposit Term", value: formatTermLabel(item.termMonths) },
            { label: "Flexible", value: item.isFlexible ? "Yes" : "No" },
            { label: "Minimum Deposit", value: minDeposit },
          ],
        },
      ],
    };
  });

const buildSavingComparisonProducts = (items = [], highlights = {}) =>
  items.map((item) => {
    const baseRate = appendHighlightSuffix(
      formatRateValue(item.baseRate),
      highlights?.bestBaseRateId === item.id
    );
    const maxRate = appendHighlightSuffix(
      formatRateValue(item.maxRate),
      highlights?.bestMaxRateId === item.id
    );
    const monthlyLimit = appendHighlightSuffix(
      formatCurrencyKRW(item.maxMonthly),
      highlights?.lowestMaxMonthlyId === item.id
    );

    return {
      id: `compare-saving-${item.id}`,
      sourceId: item.id,
      type: "saving",
      name: item.name,
      bankName: item.bank,
      website: item.website,
      detailSections: [
        {
          title: "Interest Rate",
          rows: [
            { label: "Base Rate", value: baseRate },
            { label: "Maximum Rate", value: maxRate },
          ],
        },
        {
          title: "Deposit Details",
          rows: [
            { label: "Deposit Term", value: formatTermLabel(item.termMonths) },
            { label: "Flexible", value: item.isFlexible ? "Yes" : "No" },
            { label: "Monthly Limit", value: monthlyLimit },
          ],
        },
      ],
    };
  });

const normalizeComparisonResponse = (type, payload) => {
  if (!payload || typeof payload !== "object") {
    return { products: [], highlights: null };
  }

  const highlights = payload.highlights ?? {};

  switch (type) {
    case "card":
      return {
        products: buildCardComparisonProducts(payload.cards ?? [], highlights),
        highlights,
      };
    case "deposit":
      return {
        products: buildDepositComparisonProducts(payload.deposits ?? [], highlights),
        highlights,
      };
    case "saving":
    case "savings":
      return {
        products: buildSavingComparisonProducts(payload.savings ?? [], highlights),
        highlights,
      };
    default:
      return { products: [], highlights };
  }
};

const INITIAL_FILTERS = {
  bank: null,
  productType: null,
  interest: null,
  period: null,
};

const FILTER_SEQUENCE = ["bank", "productType", "interest", "period"];

const matchesProductFilters = (product, activeFilters) => {
  const matchBank = !activeFilters.bank || product.bankId === activeFilters.bank;
  const matchType = !activeFilters.productType || product.type === activeFilters.productType;
  const matchPeriod = !activeFilters.period || product.period === activeFilters.period;

  let matchInterest = true;
  if (activeFilters.interest) {
    const option = FILTER_CONFIG.interest.options.find((opt) => opt.id === activeFilters.interest);
    if (option) {
      const range = product.interestRange || {};
      const hasNumericRange =
        (typeof range.max === "number" && !Number.isNaN(range.max)) ||
        (typeof range.min === "number" && !Number.isNaN(range.min));
      if (!hasNumericRange) {
        matchInterest = false;
      } else {
        const midValue =
          typeof range.max === "number" && !Number.isNaN(range.max)
            ? range.max
            : typeof range.min === "number" && !Number.isNaN(range.min)
              ? range.min
              : 0;
        matchInterest = midValue >= option.min && midValue <= option.max;
      }
    }
  }

  return matchBank && matchType && matchPeriod && matchInterest;
};

const EMPTY_PREFERENCES = {
  productTypes: [],
  savingsPeriods: [],
  savingsPurpose: "",
  cardPurpose: "",
  incomeLevel: "",
  preferredBank: "",
  savingsPeriod: "",
};

const mapPreferencesResponse = (data) => {
  if (!data || typeof data !== "object") {
    return { ...EMPTY_PREFERENCES };
  }

  const productTypes = normalizePreferenceArray(data.types, PREFERENCE_TYPE_LABELS);
  const savingsPeriods = normalizePreferenceArray(data.periods, PREFERENCE_PERIOD_LABELS);
  const savingsPurpose = normalizePreferenceValue(
    data.savingPurpose,
    PREFERENCE_SAVING_PURPOSE_LABELS
  );
  const cardPurpose = normalizePreferenceValue(data.cardPurpose, PREFERENCE_CARD_PURPOSE_LABELS);
  const incomeLevel = normalizePreferenceValue(data.income, PREFERENCE_INCOME_LABELS);
  const preferredBank = normalizePreferenceValue(data.bank, PREFERENCE_BANK_LABELS);

  return {
    ...EMPTY_PREFERENCES,
    productTypes,
    savingsPeriods,
    savingsPurpose,
    cardPurpose,
    incomeLevel,
    preferredBank,
    savingsPeriod: savingsPeriods[0] ?? "",
  };
};

const UI_TO_API_TYPE_MAP = {
  "Card": "CARD",
  "Deposit": "DEPOSIT",
  "Installment Savings": "SAVING",
};

const UI_TO_API_PERIOD_MAP = {
  "Short-term (~1 year)": "SHORT_TERM",
  "Mid-term (~3 year)": "MID_TERM",
  "Long-term (3+ year)": "LONG_TERM",
};

const UI_TO_API_SAVING_PURPOSE_MAP = {
  "Education": "EDUCATION",
  "Emergency Fund": "EMERGENCY_FUND",
  "Home Purchase": "HOME_PURCHASE",
  "Monthly Expenses": "MONTHLY_EXPENSES",
  "Retirement": "RETIREMENT",
  "Travel": "TRAVEL",
  "Others": "OTHERS",
};

const UI_TO_API_CARD_PURPOSE_MAP = {
  "Credit Building": "CREDIT_BUILDING",
  "Daily Spending": "DAILY_SPENDING",
  "Education": "EDUCATION",
  "Rewards Maximization": "REWARDS_MAXIMIZATION",
  "Travel": "TRAVEL",
  "Others": "OTHERS",
};

const UI_TO_API_INCOME_MAP = {
  "Low": "LOW",
  "Medium": "MEDIUM",
  "High": "HIGH",
};

const UI_TO_API_BANK_MAP = {
  "KB Bank": "KB_BANK",
  "Woori Bank": "WOORI_BANK",
  "Hana Bank": "HANA_BANK",
  "Shinhan Bank": "SHINHAN_BANK",
};

/**
 * UI 선호도 값 -> API 요청 형식 변환
 * @param {Object} preferences - UI 형식의 선호도 객체
 * @returns {Object} API 요청 형식의 선호도 객체
 */
const mapPreferencesToApi = (preferences) => {
  const types = (preferences.productTypes || [])
    .map((type) => UI_TO_API_TYPE_MAP[type])
    .filter(Boolean);

  const periods = (preferences.savingsPeriods || [])
    .map((period) => UI_TO_API_PERIOD_MAP[period])
    .filter(Boolean);

  const savingPurpose = preferences.savingsPurpose && preferences.savingsPurpose.trim()
    ? UI_TO_API_SAVING_PURPOSE_MAP[preferences.savingsPurpose]
    : null;

  const cardPurpose = preferences.cardPurpose && preferences.cardPurpose.trim()
    ? UI_TO_API_CARD_PURPOSE_MAP[preferences.cardPurpose]
    : null;

  const income = preferences.incomeLevel && preferences.incomeLevel.trim()
    ? UI_TO_API_INCOME_MAP[preferences.incomeLevel]
    : null;

  const bank = preferences.preferredBank && preferences.preferredBank.trim()
    ? UI_TO_API_BANK_MAP[preferences.preferredBank]
    : null;

  return {
    types,
    periods,
    savingPurpose,
    cardPurpose,
    income,
    bank,
  };
};

export default function Product() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const setHeaderConfig = useHeaderStore((state) => state.setHeaderConfig);
  const [allProducts, setAllProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [comparisonHighlights, setComparisonHighlights] = useState(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);
  const [comparisonError, setComparisonError] = useState(null);

  const resetComparisonData = useCallback(() => {
    setComparisonProducts([]);
    setComparisonHighlights(null);
    setComparisonError(null);
    setIsComparisonLoading(false);
  }, []);

  const isCompareRoute = productId === "compare";
  const detailProduct = useMemo(() => {
    if (isCompareRoute || !productId) return null;
    return allProducts.find((item) => item.id === productId) || null;
  }, [allProducts, isCompareRoute, productId]);
  const isDetailRoute = Boolean(productId && detailProduct);

  useEffect(() => {
    if (!productsLoaded) return;
    if (productId && !detailProduct && !isCompareRoute) {
      navigate("/product", { replace: true });
    }
  }, [productId, detailProduct, isCompareRoute, navigate, productsLoaded]);

  useEffect(() => {
    if (isCompareRoute) {
      setHeaderConfig({
        title: t("product.compare"),
        showBackBtn: true,
        showSettingBtn: false,
      });
      return;
    }

    setHeaderConfig({
      title: t("nav.product"),
      showBackBtn: Boolean(productId),
      showSettingBtn: true,
    });
  }, [setHeaderConfig, i18n.language, isCompareRoute, productId, t]);

  useEffect(() => {
    if (!isDetailRoute || !detailProduct) {
      setDetailData(null);
      setDetailError(null);
      setIsDetailLoading(false);
      return;
    }

    const typeKey = API_PRODUCT_TYPE_MAP[detailProduct.type];
    let sourceId = detailProduct.sourceId ?? detailProduct.raw?.id;

    // sourceId가 없으면 id에서 숫자 부분 추출 (예: "card-123" -> "123")
    
    if (!sourceId && detailProduct.id) {
      const match = detailProduct.id.match(/\d+$/);
      if (match) {
        sourceId = match[0];
      } else {
        sourceId = detailProduct.id;
      }
    }

    if (!typeKey || sourceId == null) {
      setDetailData(null);
      setDetailError(new Error("Unsupported product type or missing id"));
      return;
    }

    let isMounted = true;

    const loadDetail = async () => {
      setIsDetailLoading(true);
      setDetailError(null);
      setDetailData(null);
      try {
        const data = await fetchProductDetail({ type: typeKey, id: sourceId });
        if (!isMounted) return;
        setDetailData(data);
      } catch (error) {
        if (!isMounted) return;
        setDetailError(error);
        setDetailData(null);
      } finally {
        if (isMounted) {
          setIsDetailLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [detailProduct, isDetailRoute]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsProductsLoading(true);
      setProductsError(null);
      try {
        const data = await fetchAllProducts();
        setAllProducts(normalizeProducts(data));
      } catch (error) {
        setProductsError(error);
        setAllProducts([]);
      } finally {
        setIsProductsLoading(false);
        setProductsLoaded(true);
      }
    };

    loadProducts();
  }, [i18n.language]);

  const loadPreferences = useCallback(async () => {
    try {
      const loggedIn = await checkLoginStatus();
      
      try {
        const guestToken = loggedIn ? null : getOrCreateGuestToken();
        const response = await getPreferences(guestToken);
        
        if (response?.isSuccess && response?.data) {
          const hasData = 
            (response.data.types && response.data.types.length > 0) ||
            (response.data.periods && response.data.periods.length > 0) ||
            response.data.savingPurpose ||
            response.data.cardPurpose ||
            response.data.income ||
            response.data.bank;
          
          if (hasData) {
            const mappedPreferences = mapPreferencesResponse(response.data);
            setAiPreferences(mappedPreferences);
          } else {
            setAiPreferences({ ...EMPTY_PREFERENCES });
          }
        } else if (response?.data) {
          const mappedPreferences = mapPreferencesResponse(response.data);
          setAiPreferences(mappedPreferences);
        } else {
          setAiPreferences({ ...EMPTY_PREFERENCES });
        }
      } catch (prefError) {
        setAiPreferences({ ...EMPTY_PREFERENCES });
      }
    } catch (error) {
      // 로그인 상태는 useAuthStore에서 관리
    }
  }, []);

  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingLogin(true);
      try {
        const loggedIn = await checkLoginStatus();
        if (loggedIn) {
          // 로그인 상태 확인 성공 시 useAuthStore 업데이트
          try {
            const response = await api.get("/api/members/me");
            if (response.status === 200 && response.data?.data) {
              login(response.data.data);
            }
          } catch (error) {
            logout();
          }
        } else {
          logout();
        }
        await loadPreferences();
      } catch (error) {
        logout();
      } finally {
        setIsCheckingLogin(false);
      }
    };

    checkAuth();
  }, [loadPreferences, login, logout]);

  useEffect(() => {
    const handleFocus = () => {
      loadPreferences();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPreferences();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadPreferences]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [compareFilters, setCompareFilters] = useState(INITIAL_FILTERS);
  const [compareStage, setCompareStage] = useState("select");
  const [compareSelection, setCompareSelection] = useState([]);
  const [compareBaseType, setCompareBaseType] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [isSavedProductsLoading, setIsSavedProductsLoading] = useState(false);
  const [savedProductsError, setSavedProductsError] = useState(null);
  const [floatingNotice, setFloatingNotice] = useState(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [aiPreferences, setAiPreferences] = useState(() => ({ ...EMPTY_PREFERENCES }));
  const [isPreferenceSheetOpen, setPreferenceSheetOpen] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [isOpeningWebsite, setIsOpeningWebsite] = useState(false);

  const matchesFilterChips = useCallback(
    (product) => matchesProductFilters(product, filters),
    [filters]
  );
  const matchesCompareFilterChips = useCallback(
    (product) => matchesProductFilters(product, compareFilters),
    [compareFilters]
  );

  useEffect(() => {
    if (!isCompareRoute) {
      setCompareStage("select");
      setCompareSelection([]);
      setCompareBaseType(null);
      resetComparisonData();
      setSavedProducts([]);
      setIsSavedProductsLoading(false);
      setSavedProductsError(null);
      return;
    }

    let isMounted = true;

    const loadComparisonList = async () => {
      setIsSavedProductsLoading(true);
      setSavedProductsError(null);

      try {
        const bank = compareFilters.bank ? mapBankIdToApiBank(compareFilters.bank) : null;
        const type = compareFilters.productType ? API_PRODUCT_TYPE_MAP[compareFilters.productType] : null;
        const { minRate, maxRate } = compareFilters.interest
          ? mapInterestFilterToRateRange(compareFilters.interest)
          : { minRate: null, maxRate: null };
        const termMonths = compareFilters.period ? mapPeriodFilterToTermMonths(compareFilters.period) : null;

        const guestToken = getOrCreateGuestToken();

        const response = await getComparisonList({
          guestToken,
          bank,
          type,
          minRate,
          maxRate,
          termMonths,
        });

        if (!isMounted) return;

        const normalizedProducts = normalizeComparisonListResponse(response);
        setSavedProducts(normalizedProducts);
      } catch (error) {
        if (!isMounted) return;
        setSavedProductsError(error);
        setSavedProducts([]);
      } finally {
        if (isMounted) {
          setIsSavedProductsLoading(false);
        }
      }
    };

    loadComparisonList();

    return () => {
      isMounted = false;
    };
  }, [isCompareRoute, compareFilters]);

  useEffect(() => {
    if (!isCompareRoute) {
      return;
    }

    setCompareSelection((prev) => {
      const next = prev.filter(
        (item) =>
          savedProducts.some((saved) => saved.id === item.id) && matchesCompareFilterChips(item)
      );
      if (next.length === prev.length) {
        return prev;
      }
      if (next.length === 0) {
        setCompareBaseType(null);
        setCompareStage("select");
      }
      return next;
    });
  }, [isCompareRoute, savedProducts, matchesCompareFilterChips]);

  useEffect(() => {
    if (!floatingNotice) return;
    const timer = setTimeout(() => setFloatingNotice(null), 2400);
    return () => clearTimeout(timer);
  }, [floatingNotice]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allProducts.filter((product) => {
      const matchSearch =
        term.length === 0 ||
        product.name.toLowerCase().includes(term) ||
        product.bankName.toLowerCase().includes(term);

      return matchSearch && matchesFilterChips(product);
    });
  }, [allProducts, searchTerm, matchesFilterChips]);

  const compareFilteredSavedProducts = useMemo(
    () => savedProducts.filter((product) => matchesCompareFilterChips(product)),
    [savedProducts, matchesCompareFilterChips]
  );

  const loadRecommendations = useCallback(async () => {
    if (!isLoggedIn || isCheckingLogin || !productsLoaded) return;

      setIsRecommendationsLoading(true);
      setRecommendationsError(null);

      try {
        const response = await getRecommendations();

        if (!response?.isSuccess || !response?.data) {
          setRecommendedProducts([]);
          setIsRecommendationsLoading(false);
          return;
        }

        const results = response.data.results;
        
        if (!results || !Array.isArray(results)) {
          setRecommendedProducts([]);
          setIsRecommendationsLoading(false);
          return;
        }
        
        if (results.length === 0) {
          setRecommendedProducts([]);
          setIsRecommendationsLoading(false);
          return;
        }
        
        const matchedProducts = results
          .map((recommendedItem, index) => {
            const productType = recommendedItem.type?.toLowerCase() || "";
            const normalizedType = productType === "saving" ? "saving" : productType;
            
            const matched = allProducts.find((product) => {
              const sourceId = product.sourceId ?? product.raw?.id;
              const productId = recommendedItem.id;
              
              const productTypeMatch = product.type === normalizedType || 
                (normalizedType === "saving" && product.type === "savings");
              
              const idMatch = sourceId == productId || String(sourceId) === String(productId);
              
              if (productTypeMatch && idMatch) {
                return true;
              }
              
              if (idMatch) {
                return true;
              }
              
              return false;
            });

            if (matched) {
              return {
                id: `recommended-${index}-${matched.id}`,
                productId: matched.id,
                bankName: matched.bankName,
                name: matched.name,
                description: matched.highlight || matched.keyFeatures || "Learn more about this product.",
                action: "Learn More",
                bankLogo: getBankLogo(matched.bankName),
              };
            } else {
              const typeLabel = recommendedItem.type === "CARD" ? "Card" 
                : recommendedItem.type === "DEPOSIT" ? "Deposit" 
                : "Savings";
              
              let description = "";
              if (recommendedItem.type === "CARD") {
                description = recommendedItem.feeAndBenefit || "Card product";
              } else if (recommendedItem.type === "DEPOSIT" || recommendedItem.type === "SAVING") {
                const rate = recommendedItem.maxInterestRate 
                  ? `Up to ${recommendedItem.maxInterestRate}%` 
                  : "";
                const term = recommendedItem.termMonths 
                  ? `${recommendedItem.termMonths} months` 
                  : "";
                description = [rate, term].filter(Boolean).join(" · ") || `${typeLabel} product`;
              }

              return {
                id: `recommended-${index}-${recommendedItem.type}-${recommendedItem.id}`,
                productId: null,
                bankName: recommendedItem.bankName || "Unknown Bank",
                name: recommendedItem.name || "Unknown Product",
                description: description || "Learn more about this product.",
                action: "Learn More",
                bankLogo: getBankLogo(recommendedItem.bankName),
                raw: recommendedItem,
              };
            }
          })
          .filter(Boolean);

        setRecommendedProducts(matchedProducts);
      } catch (error) {
        if (error.response?.status === 404) {
          setRecommendedProducts([]);
          setRecommendationsError(null);
        } else {
          setRecommendationsError(error);
          setRecommendedProducts([]);
        }
      } finally {
        setIsRecommendationsLoading(false);
      }
  }, [isLoggedIn, isCheckingLogin, productsLoaded, allProducts]);

  useEffect(() => {
    if (selectedTab !== "ai") return;
    loadRecommendations();
  }, [selectedTab, loadRecommendations]);

  const aiRecommendations = useMemo(() => {
    if (isLoggedIn && recommendedProducts.length > 0) {
      return recommendedProducts;
    }
    return [];
  }, [isLoggedIn, recommendedProducts]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value !== null),
    [filters]
  );

  const getFilterLabelFor = useCallback((active, key) => {
    const config = FILTER_CONFIG[key];
    if (!config) return "";
    const value = active[key];
    if (!value) return config.label;
    const option = config.options.find((opt) => opt.id === value);
    return option ? option.label : config.label;
  }, []);

  const getFilterLabel = useCallback(
    (key) => getFilterLabelFor(filters, key),
    [filters, getFilterLabelFor]
  );
  const getCompareFilterLabel = useCallback(
    (key) => getFilterLabelFor(compareFilters, key),
    [compareFilters, getFilterLabelFor]
  );

  const handleFilterSelect = (key, optionId) => {
    setFilters((prev) => ({ ...prev, [key]: optionId }));
  };

  const handleFilterReset = (key) => {
    setFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleResetAllFilters = () => {
    setFilters({ ...INITIAL_FILTERS });
  };

  const handleCompareFilterSelect = (key, optionId) => {
    setCompareFilters((prev) => ({ ...prev, [key]: optionId }));
  };

  const handleCompareFilterReset = (key) => {
    setCompareFilters((prev) => ({ ...prev, [key]: null }));
  };

  const handleNavigateToDetail = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAiPrompt = () => {
    setSelectedTab("ai");
  };

  const handleCompareToggle = () => {
    if (savedProducts.length === 0) {
    }
    setCompareStage("select");
    resetComparisonData();
    navigate("/product/compare");
  };

  const handleCompareClose = () => {
    setCompareStage("select");
    setCompareSelection([]);
    setCompareBaseType(null);
    resetComparisonData();
    navigate("/product");
  };

  const handleSelectForCompare = (product) => {
    if (!savedProducts.some((item) => item.id === product.id)) {
      setFloatingNotice("Add the product to your list first.");
      return;
    }

    setCompareSelection((prev) => {
      const exists = prev.some((item) => item.id === product.id);

      if (exists) {
        const next = prev.filter((item) => item.id !== product.id);
        if (next.length === 0) {
          setCompareBaseType(null);
          setCompareStage("select");
        }
        return next;
      }

      if (prev.length >= 2) {
        setFloatingNotice("You can compare 2 products at a time.");
        return prev;
      }

      const effectiveBase = compareBaseType ?? prev[0]?.type ?? null;
      if (effectiveBase && effectiveBase !== product.type) {
        setFloatingNotice(
          "Comparisons are only valid between financial products of the same type."
        );
        return prev;
      }

      if (compareStage === "result") {
        setCompareStage("select");
        resetComparisonData();
      }

      const next = [...prev, product];
      if (!compareBaseType) {
        setCompareBaseType(product.type);
      }
      return next;
    });
  };

  const handleCompareProceed = async () => {
    if (compareSelection.length !== 2) {
      setFloatingNotice("Select two products to compare.");
      return;
    }
    const baseType = compareSelection[0]?.type;
    const isSameType = compareSelection.every((item) => item.type === baseType);
    if (!isSameType) {
      setFloatingNotice("Please select products of the same type.");
      return;
    }

    const apiType = API_PRODUCT_TYPE_MAP[baseType];
    if (!apiType) {
      setFloatingNotice("Comparison is not available for this product type yet.");
      return;
    }

    const productIds = compareSelection.map((item) => item.sourceId ?? item.raw?.id ?? item.id);

    setCompareStage("result");
    setComparisonProducts([]);
    setComparisonHighlights(null);
    setComparisonError(null);
    setIsComparisonLoading(true);

    try {
      const response = await fetchProductComparison({ type: apiType, productIds });
      const { products, highlights } = normalizeComparisonResponse(baseType, response);
      setComparisonProducts(products);
      setComparisonHighlights(highlights);
    } catch (error) {
      setComparisonError(error);
      setFloatingNotice("Failed to load comparison data.");
    } finally {
      setIsComparisonLoading(false);
    }
  };

  const handleCompareBackToSelect = () => {
    setCompareStage("select");
    resetComparisonData();
  };

  const handleAddToList = async (product) => {
    if (!product) return;

    const alreadySaved = savedProducts.some((item) => item.id === product.id);
    if (alreadySaved) {
      setFloatingNotice("Already in your list.");
      return;
    }

    try {
      const apiType = API_PRODUCT_TYPE_MAP[product.type];
      if (!apiType) {
        setFloatingNotice("Unsupported product type.");
        return;
      }

      let sourceId = product.sourceId ?? product.raw?.id;
      if (!sourceId && product.id) {
        const match = product.id.match(/\d+$/);
        if (match) {
          sourceId = match[0];
        } else {
          sourceId = product.id;
        }
      }

      if (!sourceId) {
        setFloatingNotice("Product ID is missing.");
        return;
      }

      const guestToken = getOrCreateGuestToken();

      await addToComparison({
        type: apiType,
        productId: Number(sourceId),
        guestToken: guestToken,
      });

      if (isCompareRoute) {
        const bank = compareFilters.bank ? mapBankIdToApiBank(compareFilters.bank) : null;
        const type = compareFilters.productType ? API_PRODUCT_TYPE_MAP[compareFilters.productType] : null;
        const { minRate, maxRate } = compareFilters.interest
          ? mapInterestFilterToRateRange(compareFilters.interest)
          : { minRate: null, maxRate: null };
        const termMonths = compareFilters.period ? mapPeriodFilterToTermMonths(compareFilters.period) : null;

        const guestToken = getOrCreateGuestToken();

        try {
          const response = await getComparisonList({
            guestToken,
            bank,
            type,
            minRate,
            maxRate,
            termMonths,
          });
          const normalizedProducts = normalizeComparisonListResponse(response);
          setSavedProducts(normalizedProducts);
        } catch (refreshError) {
          setSavedProducts((prev) => [...prev, product]);
        }
      } else {
        setSavedProducts((prev) => [...prev, product]);
      }
      setFloatingNotice("Added to your list.");
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response?.data?.message || "Failed to add product.";
        
        if (status === 401) {
          setFloatingNotice("Please log in to add products.");
        } else if (status === 400) {
          setFloatingNotice(message || "Invalid request.");
        } else {
          setFloatingNotice("Failed to add product. Please try again.");
        }
      } else {
        setFloatingNotice("Network error. Please check your connection.");
      }
    }
  };

  const handleLoginRequest = () => {
    navigate("/login");
  };

  const handleEditPreferences = () => {
    setPreferenceSheetOpen(true);
  };

  const handlePreferenceSave = async (updated) => {
    const merged = {
      ...EMPTY_PREFERENCES,
      ...(updated ?? {}),
    };
    merged.savingsPeriods = Array.isArray(merged.savingsPeriods) ? merged.savingsPeriods : [];
    merged.savingsPeriod = merged.savingsPeriods[0] || merged.savingsPeriod || "";

    const apiData = mapPreferencesToApi(merged);

    if (!apiData.types || apiData.types.length === 0) {
      setFloatingNotice("Please select at least one product type.");
      return;
    }
    if (!apiData.periods || apiData.periods.length === 0) {
      setFloatingNotice("Please select at least one savings period.");
      return;
    }
    if (!apiData.savingPurpose) {
      setFloatingNotice("Please select a savings purpose.");
      return;
    }
    if (!apiData.cardPurpose) {
      setFloatingNotice("Please select a card purpose.");
      return;
    }
    if (!apiData.income) {
      setFloatingNotice("Please select an income level.");
      return;
    }

    try {
      const guestToken = isLoggedIn ? null : getOrCreateGuestToken();

      const response = await savePreferences({
        types: apiData.types,
        periods: apiData.periods,
        savingPurpose: apiData.savingPurpose,
        cardPurpose: apiData.cardPurpose,
        income: apiData.income,
        bank: apiData.bank,
        guestToken: guestToken,
      });

      if (response?.isSuccess) {
        setAiPreferences(merged);
        setPreferenceSheetOpen(false);
        setFloatingNotice("Preferences saved successfully.");
        
        if (selectedTab === "ai") {
          loadRecommendations();
        }
      } else {
        setFloatingNotice(response?.message || "Failed to save preferences.");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        setFloatingNotice("Network error. Please check your connection or try again later.");
        return;
      }
      
      if (error.response?.status === 500) {
        const serverMessage = error.response?.data?.message || "서버 내부 오류가 발생했습니다.";
        setFloatingNotice("Server error. Please try again later or contact support.");
      } else if (error.response?.status === 502) {
        setFloatingNotice("Server is temporarily unavailable. Please try again later.");
      } else if (error.response) {
        const errorMessage = error.response?.data?.message || error.response?.data?.code || "Failed to save preferences.";
        setFloatingNotice(errorMessage);
      } else {
        setFloatingNotice("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSelectRecommendation = (item) => {
    if (!item) return;
    const targetId = item.productId || item.id;
    const target = allProducts.find((product) => product.id === targetId);
    if (target) {
      navigate(`/product/${target.id}`);
    } else {
      setFloatingNotice("Product detail will be available soon.");
    }
  };

  const handleVisitWebsite = (url) => {
    if (isOpeningWebsite) return;
    
    if (!url || typeof url !== "string" || !url.trim()) {
      setFloatingNotice("Website URL is not available.");
      return;
    }

    let normalizedUrl = url.trim();
    
    if (normalizedUrl === "" || normalizedUrl === "null" || normalizedUrl === "undefined") {
      setFloatingNotice("Website URL is not available.");
      return;
    }

    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setIsOpeningWebsite(true);

    try {
      const newWindow = window.open(normalizedUrl, "_blank", "noopener,noreferrer");
      
      if (!newWindow) {
        setFloatingNotice("Please allow pop-ups to open the website in a new window.");
      }
    } catch (error) {
      setFloatingNotice("Failed to open website. Please check the URL.");
    } finally {
      setTimeout(() => {
        setIsOpeningWebsite(false);
      }, 500);
    }
  };

  // title 설정
  const productPageTitle = isCompareRoute
    ? `Compare${helmetTitle}`
    : isDetailRoute
      ? `${detailProduct.name}${helmetTitle}`
      : `Product${helmetTitle}`;

  return (
    <>
      <title>{`${productPageTitle}${helmetTitle}`}</title>
      <S.Container>
        {isCompareRoute ? (
          <ComparePage
            stage={compareStage}
            products={compareFilteredSavedProducts}
            selection={compareSelection}
            baseType={compareBaseType}
            filters={compareFilters}
            filterConfig={FILTER_CONFIG}
            filterOrder={FILTER_SEQUENCE}
            getFilterLabel={getCompareFilterLabel}
            onFilterSelect={handleCompareFilterSelect}
            onFilterReset={handleCompareFilterReset}
            onToggleSelect={handleSelectForCompare}
            onProceed={handleCompareProceed}
            onBackToSelect={handleCompareBackToSelect}
            onClose={handleCompareClose}
            onVisitWebsite={handleVisitWebsite}
            comparisonProducts={comparisonProducts}
            comparisonHighlights={comparisonHighlights}
            isComparisonLoading={isComparisonLoading}
            comparisonError={comparisonError}
          />
        ) : isDetailRoute ? (
          <ProductDetailSheet
            product={detailProduct}
            detailData={detailData}
            isDetailLoading={isDetailLoading}
            detailError={detailError}
            onVisitWebsite={handleVisitWebsite}
            onAddToList={handleAddToList}
          />
        ) : (
          <S.Content>
            <S.SearchBar>
              <S.SearchInput
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("product.search")}
                aria-label="Search products"
              />
              <S.SearchIcon>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                    stroke="url(#gradient)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 17.5L13.875 13.875"
                    stroke="url(#gradient)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="2.5"
                      y1="2.5"
                      x2="18"
                      y2="17.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#009CEA" />
                    </linearGradient>
                  </defs>
                </svg>
              </S.SearchIcon>
            </S.SearchBar>

            <S.TabList>
              <S.TabButton $active={selectedTab === "all"} onClick={() => setSelectedTab("all")}>
                {t("product.allProducts")}
              </S.TabButton>
              <S.TabButton $active={selectedTab === "ai"} onClick={() => setSelectedTab("ai")}>
                {t("product.aiRecommended")}
              </S.TabButton>
            </S.TabList>

            {selectedTab === "all" && (
              <S.AiPromptButton type="button" onClick={handleAiPrompt}>
                <S.AiPromptIcon>
                  <img src={RecommendIcon} alt="" width={24} height={24} />
                </S.AiPromptIcon>
                {t("product.askAI")}
              </S.AiPromptButton>
            )}

            {selectedTab === "all" ? (
              isProductsLoading ? (
                <S.EmptyState>Loading products...</S.EmptyState>
              ) : productsError ? (
                <S.EmptyState>Failed to load products. Please try again later.</S.EmptyState>
              ) : (
                <AllProductsSection
                  filterConfig={FILTER_CONFIG}
                  filterOrder={FILTER_SEQUENCE}
                  filters={filters}
                  getFilterLabel={getFilterLabel}
                  onFilterSelect={handleFilterSelect}
                  onFilterReset={handleFilterReset}
                  hasActiveFilters={hasActiveFilters}
                  onResetAllFilters={handleResetAllFilters}
                  products={filteredProducts}
                  onProductClick={handleNavigateToDetail}
                  onCompareToggle={handleCompareToggle}
                />
              )
            ) : (
              <RecommendationsSection
                isLoggedIn={isLoggedIn}
                preferences={aiPreferences}
                recommendations={aiRecommendations}
                isLoading={isRecommendationsLoading}
                error={recommendationsError}
                onEditPreferences={handleEditPreferences}
                onSelectRecommendation={handleSelectRecommendation}
                onLogin={handleLoginRequest}
              />
            )}
          </S.Content>
        )}
      </S.Container>

      <Navigation />

      <PreferenceEditorSheet
        isOpen={isPreferenceSheetOpen}
        initialValues={aiPreferences}
        onClose={() => setPreferenceSheetOpen(false)}
        onSave={handlePreferenceSave}
      />

      {floatingNotice && <S.FloatingNotice>{floatingNotice}</S.FloatingNotice>}
    </>
  );
}
