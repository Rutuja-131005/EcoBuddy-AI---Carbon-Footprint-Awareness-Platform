import { memo } from "react";
import { Edit3, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";
import { formatDate, formatKg, formatNumber } from "../utils/formatters";

const ActivityTable = ({ activities = [], onDelete, onEdit }) => {
  if (activities.length === 0) {
    return (
      <EmptyState
        title="No activities yet"
        description="Add your first transport, electricity, food, water, shopping, or waste activity."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <caption className="sr-only">Logged carbon activities</caption>
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Activity
              </th>
              <th scope="col" className="px-4 py-3">
                Quantity
              </th>
              <th scope="col" className="px-4 py-3">
                Emission
              </th>
              <th scope="col" className="px-4 py-3">
                Notes
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {activities.map((activity) => (
              <tr key={activity._id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(activity.date)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{activity.category}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{activity.activityType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{formatNumber(activity.quantity)}</td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-teal-800">{formatKg(activity.emission)}</td>
                <td className="min-w-56 px-4 py-3 text-slate-600">{activity.notes || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      onClick={() => onEdit(activity)}
                      aria-label={`Edit ${activity.activityType}`}
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                      onClick={() => onDelete(activity._id)}
                      aria-label={`Delete ${activity.activityType}`}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(ActivityTable);
