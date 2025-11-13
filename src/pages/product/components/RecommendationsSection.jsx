import NoticeIcon from "../icons/NoticeIcon.svg";
import EditIcon from "../icons/EditIcon.svg";
import { getBankLogo } from "../Product";
import * as S from "../ProductStyle";
import { useTranslation } from "react-i18next";

export default function RecommendationsSection({
  isLoggedIn,
  recommendations,
  preferences,
  onEditPreferences,
  onSelectRecommendation,
  onLogin,
}) {
  const { t } = useTranslation();
  // loginDesc \n 기준 개행 처리
  const loginDesc = t("product.loginDesc").split("\n");

  if (!isLoggedIn) {
    return (
      <S.EmptyState style={{ gap: "1.5rem" }}>
        <img src={NoticeIcon} alt="" width={80} height={80} />
        <div>
          <div
            style={{ fontSize: "1.05rem", fontWeight: 600, color: "#000", marginBottom: "0.75rem" }}
          >
            {t("product.loginToSee")}
          </div>
          {loginDesc.map((text) => (
            <div style={{ fontSize: "0.8rem", color: "#000" }}>{text}</div>
          ))}
        </div>
        <S.PrimaryButton type="button" style={{ width: "100%" }} onClick={onLogin}>
          {t("onBoarding.loginJoin")}
        </S.PrimaryButton>
      </S.EmptyState>
    );
  }

  const summary = preferences || {};

  return (
    <S.AiSection>
      <S.PreferenceCard>
        <S.PreferenceTitle>{t("product.yourSummary")}</S.PreferenceTitle>
        <S.PreferenceEditButton type="button" onClick={onEditPreferences}>
          <img src={EditIcon} alt="Edit preferences" width={20} height={20} />
        </S.PreferenceEditButton>
        <S.PreferenceRow>
          <S.PreferenceLabel>{t("product.desiredProductType")} :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.productTypes?.join(", ") || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>{t("product.savingsGoalPeriod")} :</S.PreferenceLabel>
          <S.PreferenceValue>
            {summary.savingsPeriods?.length
              ? summary.savingsPeriods.join(", ")
              : summary.savingsPeriod || "-"}
          </S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>{t("product.income")} :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.incomeLevel || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>{t("product.purpose")} :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.savingsPurpose || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
      </S.PreferenceCard>

      <S.RecommendationList>
        {recommendations.map((item) => (
          <S.RecommendationCard key={item.id}>
            <S.RecommendationHeader>
              <S.CardBadge>
                {(() => {
                  const bankLogo = item.bankLogo || getBankLogo(item.bankName);
                  return bankLogo ? (
                    <img src={bankLogo} alt={`${item.bankName} logo`} />
                  ) : (
                    item.bankName[0]
                  );
                })()}
              </S.CardBadge>
              <S.RecommendationMeta>
                <S.RecommendationTitle>{item.name}</S.RecommendationTitle>
                <S.RecommendationDescription>{item.description}</S.RecommendationDescription>
              </S.RecommendationMeta>
            </S.RecommendationHeader>
            <S.RecommendationAction type="button" onClick={() => onSelectRecommendation(item)}>
              {item.action || "Learn More"}
            </S.RecommendationAction>
          </S.RecommendationCard>
        ))}
      </S.RecommendationList>
    </S.AiSection>
  );
}
