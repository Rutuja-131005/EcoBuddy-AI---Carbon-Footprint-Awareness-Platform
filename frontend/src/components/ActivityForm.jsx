import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Save, X } from "lucide-react";
import { categories, categoryActivityTypes } from "../constants/categories";
import { toInputDate } from "../utils/formatters";

import { validateActivityForm } from "../validators/activitySchema";

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
  const [formErrors, setFormErrors] = useState({});

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
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
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
    
    const { isValid, errors } = validateActivityForm(form);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    const qty = parseFloat(form.quantity);
    if (isNaN(qty) || qty <= 0) {
      setFormErrors({ quantity: "Please enter a valid positive number for quantity." });
      return;
    }

    // Sanitize string inputs to prevent basic script injections
    const sanitize = (str) => typeof str === 'string' ? str.replace(/<[^>]*>?/gm, '') : str;

    onSubmit({
      ...form,
      category: sanitize(form.category),
      activityType: sanitize(form.activityType),
      notes: sanitize(form.notes),
      quantity: qty
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-category">Category</label>
          <select
            id="activity-category"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.category ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            required
            aria-invalid={!!formErrors.category}
            aria-describedby={formErrors.category ? "category-error" : undefined}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formErrors.category && <span id="category-error" className="text-xs text-red-500">{formErrors.category}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-type">Activity type</label>
          <select
            id="activity-type"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.activityType ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            value={form.activityType}
            onChange={(event) => updateField("activityType", event.target.value)}
            required
            aria-invalid={!!formErrors.activityType}
            aria-describedby={formErrors.activityType ? "type-error" : undefined}
          >
            {activityOptions.map((activityType) => (
              <option key={activityType} value={activityType}>
                {activityType}
              </option>
            ))}
          </select>
          {formErrors.activityType && <span id="type-error" className="text-xs text-red-500">{formErrors.activityType}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-quantity">Quantity</label>
          <input
            id="activity-quantity"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.quantity ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            min="0"
            step="0.01"
            type="number"
            value={form.quantity}
            onChange={(event) => updateField("quantity", event.target.value)}
            required
            aria-invalid={!!formErrors.quantity}
            aria-describedby={formErrors.quantity ? "quantity-error" : undefined}
          />
          {formErrors.quantity && <span id="quantity-error" className="text-xs text-red-500">{formErrors.quantity}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700">
          <label htmlFor="activity-date">Date</label>
          <input
            id="activity-date"
            className={`rounded-lg border px-3 py-2 text-slate-900 outline-none transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2 ${formErrors.date ? 'border-red-500 ring-red-500' : 'border-slate-300 ring-teal-600'}`}
            type="date"
            value={form.date}
            onChange={(event) => updateField("date", event.target.value)}
            required
            aria-invalid={!!formErrors.date}
            aria-describedby={formErrors.date ? "date-error" : undefined}
          />
          {formErrors.date && <span id="date-error" className="text-xs text-red-500">{formErrors.date}</span>}
        </div>

        <div className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
          <label htmlFor="activity-notes">Notes</label>
          <textarea
            id="activity-notes"
            className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-600 transition motion-reduce:transition-none motion-reduce:transform-none focus:ring-2"
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
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {initialData ? "Update activity" : "Add activity"}
        </button>
        {initialData ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-slate-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

ActivityForm.propTypes = {
  factors: PropTypes.array,
  initialData: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool
};

export default ActivityForm;
