import WebIcon from "../icons/WebIcon.svg";
import AddIcon from "../icons/AddIcon.svg";
import * as S from "../ProductStyle";

const BENEFIT_CATEGORY_LABEL_MAP = new Map([
  ["Public Transit Discount", "Public Transit Discount"],
  ["公共交通折扣", "Public Transit Discount"],
  ["Giảm giá giao thông công cộng", "Public Transit Discount"],
  ["Shopping Discount", "Shopping Discount"],
  ["购物折扣", "Shopping Discount"],
  ["Giảm giá mua sắm", "Shopping Discount"],
  ["Telecom Cashback", "Telecom Cashback"],
  ["通信费返现", "Telecom Cashback"],
  ["Hoàn tiền viễn thông", "Telecom Cashback"],
  ["Convenience Store Cashback", "Convenience Store Cashback"],
  ["便利店返现", "Convenience Store Cashback"],
  ["Hoàn tiền cửa hàng tiện lợi", "Convenience Store Cashback"],
  ["Restaurant Cashback", "Restaurant Cashback"],
  ["餐厅返现", "Restaurant Cashback"],
  ["Hoàn tiền nhà hàng", "Restaurant Cashback"],
  ["Hospital & Pharmacy Cashback", "Hospital & Pharmacy Cashback"],
  ["医院/药店返现", "Hospital & Pharmacy Cashback"],
  ["Hoàn tiền bệnh viện & nhà thuốc", "Hospital & Pharmacy Cashback"],
  ["Subscription Cashback", "Subscription Cashback"],
  ["订阅服务返现", "Subscription Cashback"],
  ["Hoàn tiền dịch vụ đăng ký", "Subscription Cashback"],
  ["Overseas Spending Benefits", "Overseas Spending Benefits"],
  ["海外消费优惠", "Overseas Spending Benefits"],
  ["Ưu đãi chi tiêu nước ngoài", "Overseas Spending Benefits"],
  ["Foreign Exchange Benefits", "Foreign Exchange Benefits"],
  ["外汇优惠", "Foreign Exchange Benefits"],
  ["Ưu đãi tỷ giá", "Foreign Exchange Benefits"],
  ["Movie Discount", "Movie Discount"],
  ["电影折扣", "Movie Discount"],
  ["Giảm giá phim", "Movie Discount"],
  ["Insurance Cashback", "Insurance Cashback"],
  ["保险返现", "Insurance Cashback"],
  ["Hoàn tiền bảo hiểm", "Insurance Cashback"],
  ["Coffee Cashback", "Coffee Cashback"],
  ["咖啡返现", "Coffee Cashback"],
  ["Hoàn tiền cà phê", "Coffee Cashback"],
  ["Delivery App Cashback", "Delivery App Cashback"],
  ["外卖应用返现", "Delivery App Cashback"],
  ["Hoàn tiền ứng dụng giao hàng", "Delivery App Cashback"],
  ["Daily Spending Rewards", "Daily Spending Rewards"],
  ["日常消费奖励", "Daily Spending Rewards"],
  ["Ưu đãi chi tiêu hàng ngày", "Daily Spending Rewards"],
  ["For Foreign Residents", "For Foreign Residents"],
  ["外籍客户专享", "For Foreign Residents"],
  ["Dành cho người nước ngoài", "For Foreign Residents"],
  ["Promotional Offer", "Promotional Offer"],
  ["促销优惠", "Promotional Offer"],
  ["Ưu đãi khuyến mãi", "Promotional Offer"],
]);

const normalizeBenefitCategory = (category) =>
  category ? BENEFIT_CATEGORY_LABEL_MAP.get(category) ?? category : "";

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    if (value === 0) return "Free";
    return `₩${value.toLocaleString()}`;
  }
  return String(value);
};

const formatRate = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return `${value}%`;
  return String(value);
};

const formatTerm = (months) => {
  if (months === null || months === undefined) return "-";
  if (months === -1) return "36+ months";
  if (months === 0) return "No fixed term";
  return `${months} months`;
};

const formatBoolean = (value) => {
  if (value === null || value === undefined) return "-";
  return value ? "Yes" : "No";
};

const buildDepositSavingBlocks = (detail, product, type) => {
  if (!detail) {
    return [];
  }

  const blocks = [];
  
  // API 필드명 매핑: baseRate/maxRate -> minInterestRate/maxInterestRate
  // minDepositAmount -> minDeposit
  const minRate = detail.minInterestRate ?? detail.baseRate;
  const maxRate = detail.maxInterestRate ?? detail.maxRate;
  const minDeposit = detail.minDeposit ?? detail.minDepositAmount;
  const maxDeposit = detail.maxDeposit;
  const maxMonthly = detail.maxMonthly;
  
  const baseRows = [
    { label: "Bank", value: detail.bank || product.bankName },
    { label: "Base Rate", value: formatRate(minRate) },
    { label: "Maximum Rate", value: formatRate(maxRate) },
    { label: "Term", value: formatTerm(detail.termMonths) },
    { label: "Flexible", value: formatBoolean(detail.isFlexible) },
  ].filter((row) => row.value !== "-");

  if (baseRows.length) {
    blocks.push({ title: type === "saving" ? "Saving Overview" : "Deposit Overview", rows: baseRows });
  }

  const amountRows = [
    { label: "Minimum Deposit", value: formatCurrency(minDeposit) },
    { label: "Maximum Deposit", value: formatCurrency(maxDeposit) },
    { label: "Monthly Limit", value: formatCurrency(maxMonthly) },
  ].filter((row) => row.value !== "-");

  if (amountRows.length) {
    blocks.push({ title: "Amounts", rows: amountRows });
  }

  if (detail.notes) {
    blocks.push({
      title: "Notes",
      rows: [{ label: "Details", value: detail.notes }],
    });
  }

  return blocks;
};

export default function ProductDetailSheet({
  product,
  detailData,
  isDetailLoading,
  detailError,
  onVisitWebsite,
  onAddToList,
}) {
  if (!product) return null;

  // API 응답이 배열로 오는 경우 처리: {cardDetail: [{}], depositDetail: [], savingDetail: []}
  let cardDetail = null;
  let depositDetail = null;
  let savingDetail = null;

  if (detailData) {
    // cardDetail 처리
    if (Array.isArray(detailData.cardDetail) && detailData.cardDetail.length > 0) {
      cardDetail = detailData.cardDetail[0];
    } else if (detailData.cardDetail && typeof detailData.cardDetail === 'object' && !Array.isArray(detailData.cardDetail)) {
      cardDetail = detailData.cardDetail;
    }

    // depositDetail 처리
    if (Array.isArray(detailData.depositDetail) && detailData.depositDetail.length > 0) {
      depositDetail = detailData.depositDetail[0];
    } else if (detailData.depositDetail && typeof detailData.depositDetail === 'object' && !Array.isArray(detailData.depositDetail)) {
      depositDetail = detailData.depositDetail;
    }

    // savingDetail 처리
    if (Array.isArray(detailData.savingDetail) && detailData.savingDetail.length > 0) {
      savingDetail = detailData.savingDetail[0];
    } else if (detailData.savingDetail && typeof detailData.savingDetail === 'object' && !Array.isArray(detailData.savingDetail)) {
      savingDetail = detailData.savingDetail;
    }
  }

  // detailData 자체가 상세 정보를 담고 있는 경우도 처리
  const resolvedDetail = cardDetail || depositDetail || savingDetail || detailData || null;

  const heroTitle = resolvedDetail?.name || product.name;
  const description =
    resolvedDetail?.description || product.keyFeatures || product.highlight || product.description || "";
  
  // URL: 상세 API에서 받은 website를 우선 사용, 없으면 product.website 사용
  // 상세 API 응답에서 website 또는 officialUrl 확인
  const officialUrl = 
    resolvedDetail?.website || 
    resolvedDetail?.officialUrl || 
    product.website || 
    "";

  let detailBlocks = [];

  if (cardDetail) {
    const feeRows = [
      { label: "Domestic Annual Fee", value: formatCurrency(cardDetail.domesticAnnualFee) },
      { label: "International Annual Fee", value: formatCurrency(cardDetail.internationalAnnualFee) },
    ].filter((row) => row.value !== "-");

    if (feeRows.length) {
      detailBlocks.push({
        title: "Annual Fees",
        rows: feeRows,
      });
    }

    if (Array.isArray(cardDetail.benefits) && cardDetail.benefits.length > 0) {
      detailBlocks.push({
        title: "Benefits",
        rows: cardDetail.benefits.map((benefit, index) => ({
          label: normalizeBenefitCategory(benefit.category) || `Benefit ${index + 1}`,
          value: benefit.description || "-",
        })),
      });
    }
  } else if (depositDetail) {
    detailBlocks = buildDepositSavingBlocks(depositDetail, product, "deposit");
  } else if (savingDetail) {
    detailBlocks = buildDepositSavingBlocks(savingDetail, product, "saving");
  } else if (Array.isArray(product.detailSections) && product.detailSections.length > 0) {
    detailBlocks = product.detailSections.map((section) => ({
      title: section.title,
      rows: section.rows.map((row) => ({
        label: row.label,
        value: row.value,
      })),
    }));
  }

  return (
    <S.DetailPage>
      <S.DetailHero>
        <S.DetailHeroTitle>{heroTitle}</S.DetailHeroTitle>
      </S.DetailHero>

      {description && (
        <S.DetailSection>
          <S.DetailSectionTitle>Key Features</S.DetailSectionTitle>
          <S.DetailParagraph>{description}</S.DetailParagraph>
        </S.DetailSection>
      )}

      <S.DetailSection>
        {isDetailLoading ? (
          <S.DetailBlock>
            <S.DetailBlockTitle>Loading details</S.DetailBlockTitle>
            <S.DetailRow>
              <S.DetailRowLabel>...</S.DetailRowLabel>
              <S.DetailRowValue>Fetching product information.</S.DetailRowValue>
            </S.DetailRow>
          </S.DetailBlock>
        ) : detailError ? (
          <S.DetailBlock>
            <S.DetailBlockTitle>Details Unavailable</S.DetailBlockTitle>
            <S.DetailRow>
              <S.DetailRowLabel>Reason</S.DetailRowLabel>
              <S.DetailRowValue>Unable to load product information at this time.</S.DetailRowValue>
            </S.DetailRow>
          </S.DetailBlock>
        ) : detailBlocks.length > 0 ? (
          detailBlocks.map((section, sectionIndex) => (
            <S.DetailBlock key={`${section.title}-${sectionIndex}`}>
              <S.DetailBlockTitle>{section.title}</S.DetailBlockTitle>
              {section.rows.map((row, rowIndex) => (
                <S.DetailRow key={`${section.title}-${rowIndex}-${row.label || "row"}`}>
                  <S.DetailRowLabel>{row.label}</S.DetailRowLabel>
                  <S.DetailRowValue>{row.value}</S.DetailRowValue>
                </S.DetailRow>
              ))}
              {sectionIndex !== detailBlocks.length - 1 && <S.DetailDivider />}
            </S.DetailBlock>
          ))
        ) : (
          <S.DetailBlock>
            <S.DetailBlockTitle>Details</S.DetailBlockTitle>
            <S.DetailRow>
              <S.DetailRowLabel>Info</S.DetailRowLabel>
              <S.DetailRowValue>Additional product information will be available soon.</S.DetailRowValue>
            </S.DetailRow>
          </S.DetailBlock>
        )}
      </S.DetailSection>

      <S.DetailActions>
        <S.PrimaryButton type="button" onClick={() => onVisitWebsite?.(officialUrl)} disabled={!officialUrl}>
          <img src={WebIcon} alt="" width={20} height={20} />
          Official Website
        </S.PrimaryButton>
        <S.SecondaryButton type="button" onClick={() => onAddToList?.(product)}>
          <img src={AddIcon} alt="" width={20} height={20} />
          Add to List
        </S.SecondaryButton>
      </S.DetailActions>
    </S.DetailPage>
  );
}
