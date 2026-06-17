const ProgressBar = ({ value = 0, label, toneClass = "bg-teal-600" }) => {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || `Progress ${Math.round(clamped)} percent`}
      className="h-3 overflow-hidden rounded-full bg-slate-100"
    >
      <div className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${toneClass}`} style={{ width: `${clamped}%` }} />
    </div>
  );
};

export default ProgressBar;
