import { useId } from "react";

const ChartPanel = ({ title, subtitle, children, height = "h-80", summary = "" }) => {
  const titleId = useId();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby={titleId}>
      <div className="mb-4">
        <h2 id={titleId} className="text-lg font-semibold text-slate-950">
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className={`chart-shell ${height}`} role="img" aria-label={summary || `${title}. ${subtitle || ""}`.trim()}>
        {children}
      </div>
    </section>
  );
};

export default ChartPanel;
