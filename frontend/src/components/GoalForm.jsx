import { useState } from "react";
import { Target } from "lucide-react";
import { toInputDate } from "../utils/formatters";

const oneMonthFromNow = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return toInputDate(date);
};

const initialGoal = {
  title: "",
  targetReduction: "",
  targetDate: oneMonthFromNow(),
  baselineEmission: "",
  notes: ""
};

const GoalForm = ({ onSubmit, submitting = false }) => {
  const [form, setForm] = useState(initialGoal);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      targetReduction: Number(form.targetReduction),
      baselineEmission: form.baselineEmission === "" ? undefined : Number(form.baselineEmission)
    });
    setForm(initialGoal);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-title">Goal title</label>
          <input
            id="goal-title"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Reduce commuting emissions"
            required
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="goal-reduction">Target reduction</label>
          <input
            id="goal-reduction"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            min="0"
            step="0.01"
            type="number"
            value={form.targetReduction}
            onChange={(event) => updateField("targetReduction", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="goal-date">Target date</label>
          <input
            id="goal-date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            type="date"
            value={form.targetDate}
            onChange={(event) => updateField("targetDate", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-baseline">Baseline emission</label>
          <input
            id="goal-baseline"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            min="0"
            step="0.01"
            type="number"
            value={form.baselineEmission}
            onChange={(event) => updateField("baselineEmission", event.target.value)}
            placeholder="Uses current monthly footprint when empty"
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-notes">Notes</label>
          <textarea
            id="goal-notes"
            className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional focus area"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Target className="h-4 w-4" aria-hidden="true" />
        Set goal
      </button>
    </form>
  );
};

export default GoalForm;
