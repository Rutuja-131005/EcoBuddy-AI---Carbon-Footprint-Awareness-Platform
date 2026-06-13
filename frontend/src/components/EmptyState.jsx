const EmptyState = ({ title, description }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
    {description ? <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p> : null}
  </div>
);

export default EmptyState;
