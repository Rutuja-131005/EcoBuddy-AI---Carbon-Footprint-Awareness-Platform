const PageHeader = ({ eyebrow, title, description, action }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{eyebrow}</p> : null}
      <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
    </div>
    {action ? <div className="flex-none">{action}</div> : null}
  </div>
);

export default PageHeader;
