const PageContainer = ({ children, className = "" }) => (
  <div className={`mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8 ${className}`.trim()}>
    {children}
  </div>
);

export default PageContainer;
