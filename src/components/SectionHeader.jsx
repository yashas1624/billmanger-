export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="px-4 mb-3">
      <h3 className="text-sm font-bold text-gray-800 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}
