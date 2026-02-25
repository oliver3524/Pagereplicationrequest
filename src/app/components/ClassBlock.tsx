interface ClassBlockProps {
  label: string;
  startPercent: number;
  heightPercent: number;
}

export function ClassBlock({ label, startPercent, heightPercent }: ClassBlockProps) {
  return (
    <div
      className="absolute left-1 right-1 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center"
      style={{
        top: `${startPercent}%`,
        height: `${heightPercent}%`,
      }}
    >
      <span className="text-xs text-orange-700 font-medium">{label}</span>
    </div>
  );
}
