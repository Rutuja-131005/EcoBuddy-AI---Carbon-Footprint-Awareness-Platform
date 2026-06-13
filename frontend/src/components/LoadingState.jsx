const LoadingState = ({ label = "Loading EcoBuddy data..." }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-64 items-center justify-center rounded-lg border border-slate-200 bg-white p-8 shadow-soft"
  >
    <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
      <span className="h-3 w-3 animate-ping rounded-full bg-teal-600" />
      {label}
    </div>
  </div>
);

export default LoadingState;
