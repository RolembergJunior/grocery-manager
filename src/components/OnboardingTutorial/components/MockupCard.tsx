interface MockupCardProps {
  title?: string;
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}

export default function MockupCard({
  title,
  children,
  highlight = false,
  className = "",
}: MockupCardProps) {
  return (
    <div
      className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${
          highlight
            ? "border-blue bg-blue/5 shadow-lg ring-2 ring-blue/20"
            : "border-gray-200 bg-white"
        }
        ${className}
      `}
    >
      {title && (
        <h4 className="text-sm font-semibold text-gray-700 mb-3">{title}</h4>
      )}
      {children}
    </div>
  );
}
