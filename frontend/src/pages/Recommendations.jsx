import { useEffect, useState } from "react";
import ErrorBanner from "../components/ErrorBanner";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import RecommendationCard from "../components/RecommendationCard";
import EmptyState from "../components/EmptyState";
import { api } from "../services/api";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setRecommendations(await api.getRecommendations());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><LoadingState /></main>;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
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
    </main>
  );
};

export default Recommendations;
