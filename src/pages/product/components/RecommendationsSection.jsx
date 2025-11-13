import NoticeIcon from "../icons/NoticeIcon.svg";
import EditIcon from "../icons/EditIcon.svg";
import { getBankLogo } from "../Product";
import * as S from "../ProductStyle";

export default function RecommendationsSection({
  isLoggedIn,
  recommendations,
  preferences,
  onEditPreferences,
  onSelectRecommendation,
  onLogin,
}) {
  if (!isLoggedIn) {
    return (
      <S.EmptyState style={{ gap: "1.5rem" }}>
        <img src={NoticeIcon} alt="" width={80} height={80} />
        <div>
          <div style={{ fontSize: "1.05rem", fontWeight: 600, color: "#000" }}>
            Login to see personalized recommendations.
          </div>
          <div style={{ fontSize: "0.8rem", color: "#000", marginTop: "0.75rem" }}>
            Our AI will find the best financial products for you once you log in.
          </div>
        </div>
        <S.PrimaryButton type="button" style={{ width: "100%" }} onClick={onLogin}>
          Login / Join
        </S.PrimaryButton>
      </S.EmptyState>
    );
  }

  const summary = preferences || {};

  return (
    <S.AiSection>
      <S.PreferenceCard>
        <S.PreferenceTitle>Your Preference Summary</S.PreferenceTitle>
        <S.PreferenceEditButton type="button" onClick={onEditPreferences}>
          <img src={EditIcon} alt="Edit preferences" width={20} height={20} />
        </S.PreferenceEditButton>
        <S.PreferenceRow>
          <S.PreferenceLabel>Desired Product Type :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.productTypes?.join(", ") || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>Savings Goal Period :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.savingsPeriods?.length ? summary.savingsPeriods.join(", ") : summary.savingsPeriod || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>Income :</S.PreferenceLabel>
          <S.PreferenceValue>{summary.incomeLevel || "-"}</S.PreferenceValue>
        </S.PreferenceRow>
        <S.PreferenceRow>
          <S.PreferenceLabel>Purpose :</S.PreferenceLabel>
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
