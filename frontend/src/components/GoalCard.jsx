import { memo } from "react";
import { CheckCircle2, Trash2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import { formatDate, formatKg, progressTone } from "../utils/formatters";

const GoalCard = ({ goal, onComplete, onDelete }) => {
  const complete = goal.status === "completed";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{goal.status}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{goal.title}</h3>
        </div>
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {Math.round(goal.progress || 0)}%
        </span>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={goal.progress}
          label={`${goal.title} progress`}
          toneClass={progressTone(goal.progress, goal.status)}
        />
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Target reduction</dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatKg(goal.targetReduction)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Target date</dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatDate(goal.targetDate)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Baseline</dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatKg(goal.baselineEmission)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Current month</dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatKg(goal.currentEmission)}</dd>
        </div>
      </dl>

      {goal.notes ? <p className="mt-4 text-sm text-slate-600">{goal.notes}</p> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {!complete ? (
          <button
            type="button"
            onClick={() => onComplete(goal._id)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-teal-800"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Mark completed
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onDelete(goal._id)}
          className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-rose-50"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  );
};

export default memo(GoalCard);
