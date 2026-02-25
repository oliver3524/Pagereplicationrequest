interface MessageKPICardProps {
  title: string;
  value: string | number;
  caption: string;
}

export function MessageKPICard({ title, value, caption }: MessageKPICardProps) {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-4 shadow-sm">
      <div className="text-xs font-medium text-[#667085] mb-2">{title}</div>
      <div className="text-3xl font-semibold text-[#111] mb-1">{value}</div>
      <div className="text-xs text-[#667085]">{caption}</div>
    </div>
  );
}
