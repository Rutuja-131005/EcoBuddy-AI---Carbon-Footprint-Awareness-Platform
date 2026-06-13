import { ArrowDownRight, Lightbulb } from "lucide-react";
import { formatKg } from "../utils/formatters";

const RecommendationCard = ({ recommendation }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
        <Lightbulb className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
            {recommendation.category}
          </span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {recommendation.source}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-semibold text-slate-950">{recommendation.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{recommendation.description}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-800">
          <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          Estimated reduction: {formatKg(recommendation.estimatedReduction)}
        </p>
      </div>
    </div>
  </article>
);

export default RecommendationCard;
