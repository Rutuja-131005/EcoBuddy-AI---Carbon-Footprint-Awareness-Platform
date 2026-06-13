import { useEffect, useMemo, useState } from "react";
import { Save, X } from "lucide-react";
import { categories, categoryActivityTypes, toInputDate } from "../utils/formatters";

const emptyForm = {
  category: "Transport",
  activityType: "Car",
  quantity: "",
  date: toInputDate(new Date()),
  notes: ""
};

const unique = (values) => Array.from(new Set(values.filter(Boolean)));

const ActivityForm = ({ factors = [], initialData, onCancel, onSubmit, submitting = false }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        category: initialData.category || "Transport",
        activityType: initialData.activityType || "Car",
        quantity: initialData.quantity ?? "",
        date: toInputDate(initialData.date),
        notes: initialData.notes || ""
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const activityOptions = useMemo(() => {
    const factorOptions = factors
      .filter((factor) => factor.category === form.category)
      .map((factor) => factor.activityType);

    return unique([...(categoryActivityTypes[form.category] || []), ...factorOptions]);
  }, [factors, form.category]);

  const updateField = (key, value) => {
    setForm((current) => {
      if (key === "category") {
        const firstType = categoryActivityTypes[value]?.[0] || "";
        return { ...current, category: value, activityType: firstType };
      }

      return { ...current, [key]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      quantity: Number(form.quantity)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-category">Category</label>
          <select
            id="activity-category"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            required
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-type">Activity type</label>
          <select
            id="activity-type"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            value={form.activityType}
            onChange={(event) => updateField("activityType", event.target.value)}
            required
          >
            {activityOptions.map((activityType) => (
              <option key={activityType} value={activityType}>
                {activityType}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-quantity">Quantity</label>
          <input
            id="activity-quantity"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            min="0"
            step="0.01"
            type="number"
            value={form.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-date">Date</label>
          <input
            id="activity-date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            type="date"
            value={form.date}
            onChange={(event) => updateField("date", event.target.value)}
            required
          />
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="activity-notes">Notes</label>
          <textarea
            id="activity-notes"
            className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition focus:ring-2"
            value={form.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Optional context"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {initialData ? "Update activity" : "Add activity"}
        </button>
        {initialData ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default ActivityForm;
