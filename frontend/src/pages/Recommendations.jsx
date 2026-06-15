import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageContainer from "../components/PageContainer";
import PageHeader from "../components/PageHeader";
import RecommendationCard from "../components/RecommendationCard";
import EmptyState from "../components/EmptyState";
import { useApiData } from "../hooks/useApiData";
import { api } from "../services/api";

const Recommendations = () => {
  const { data: recommendations = [], error, loading } = useApiData(() => api.getRecommendations());

  if (loading) {
    return (
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Recommendation Engine"
        title="Dynamic reduction suggestions"
        description="Suggestions are regenerated from recent emissions and ranked by estimated reduction potential."
      />
      <ErrorBanner message={error} />

      <section className="grid gap-5 lg:grid-cols-2">
        {recommendations.length ? (
          recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation._id} recommendation={recommendation} />
          ))
        ) : (
          <EmptyState title="No recommendations available" description="Log activities to generate targeted suggestions." />
        )}
      </section>
    </PageContainer>
  );
};

export default Recommendations;
