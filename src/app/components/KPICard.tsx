import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  size?: 'large' | 'compact';
}

export function KPICard({ icon: Icon, label, value, caption, size = 'large' }: KPICardProps) {
  if (size === 'compact') {
    return (
      <div className="bg-white border border-[#EAECEF] rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm text-[#667085] mb-2">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <div className="text-2xl font-semibold mb-1 text-[#111]">{value}</div>
        <div className="text-xs text-[#667085]">{caption}</div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
      <div className="flex items-center gap-2 text-sm text-[#667085] mb-3">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="text-4xl font-semibold mb-2 text-[#111]">{value}</div>
      <div className="text-xs text-[#667085]">{caption}</div>
    </div>
  );
}
