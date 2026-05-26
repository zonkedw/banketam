export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h2>{title}</h2>
        {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
