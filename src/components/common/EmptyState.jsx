export const EmptyState = ({ icon, title, children, action }) => (
  <div className="card flex flex-col items-center gap-4 px-6 py-12 text-center">
    {icon && <div className="text-teal">{icon}</div>}
    <h2>{title}</h2>
    {children && <div className="max-w-prose text-muted">{children}</div>}
    {action}
  </div>
);
