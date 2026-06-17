import { useState } from "react";
import { Target } from "lucide-react";
import { toInputDate } from "../utils/formatters";
import { validateGoalForm } from "../validators/goalSchema";

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
  const [formErrors, setFormErrors] = useState({});

  const updateField = (key, value) => {
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { isValid, errors } = validateGoalForm(form);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    onSubmit({
      ...form,
      targetReduction: Number(form.targetReduction),
      baselineEmission: form.baselineEmission === "" ? undefined : Number(form.baselineEmission)
    });
    setForm(initialGoal);
    setFormErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-title">Goal title</label>
          <input
            id="goal-title"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.title ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Reduce commuting emissions"
            required
            aria-invalid={!!formErrors.title}
            aria-describedby={formErrors.title ? "title-error" : undefined}
          />
          {formErrors.title && <span id="title-error" className="text-xs text-red-500">{formErrors.title}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="goal-reduction">Target reduction</label>
          <input
            id="goal-reduction"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.targetReduction ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            min="0"
            step="0.01"
            type="number"
            value={form.targetReduction}
            onChange={(event) => updateField("targetReduction", event.target.value)}
            required
            aria-invalid={!!formErrors.targetReduction}
            aria-describedby={formErrors.targetReduction ? "reduction-error" : undefined}
          />
          {formErrors.targetReduction && <span id="reduction-error" className="text-xs text-red-500">{formErrors.targetReduction}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="goal-date">Target date</label>
          <input
            id="goal-date"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.targetDate ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            type="date"
            value={form.targetDate}
            onChange={(event) => updateField("targetDate", event.target.value)}
            required
            aria-invalid={!!formErrors.targetDate}
            aria-describedby={formErrors.targetDate ? "date-error" : undefined}
          />
          {formErrors.targetDate && <span id="date-error" className="text-xs text-red-500">{formErrors.targetDate}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-baseline">Baseline emission</label>
          <input
            id="goal-baseline"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.baselineEmission ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            min="0"
            step="0.01"
            type="number"
            value={form.baselineEmission}
            onChange={(event) => updateField("baselineEmission", event.target.value)}
            placeholder="Uses current monthly footprint when empty"
            aria-invalid={!!formErrors.baselineEmission}
            aria-describedby={formErrors.baselineEmission ? "baseline-error" : undefined}
          />
          {formErrors.baselineEmission && <span id="baseline-error" className="text-xs text-red-500">{formErrors.baselineEmission}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="goal-notes">Notes</label>
          <textarea
            id="goal-notes"
            className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional focus area"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Target className="h-4 w-4" aria-hidden="true" />
        Set goal
      </button>
    </form>
  );
};

export default GoalForm;
