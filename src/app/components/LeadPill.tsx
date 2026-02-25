import { User } from 'lucide-react';

interface LeadPillProps {
  time: string;
  person: string;
  opacity?: number;
  stackIndex?: number;
  stackTotal?: number;
}

export function LeadPill({ time, person, opacity = 1, stackIndex = 0, stackTotal = 1 }: LeadPillProps) {
  // Calculate width and offset for stacked leads
  const widthPercent = stackTotal > 1 ? (100 / stackTotal) : 100;
  const leftOffsetPercent = stackTotal > 1 ? (stackIndex * (100 / stackTotal)) : 0;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border bg-amber-50 text-amber-700 border-amber-200 text-xs"
      style={{ 
        opacity,
        width: stackTotal > 1 ? `${widthPercent}%` : '100%',
        marginLeft: stackTotal > 1 ? `${leftOffsetPercent}%` : '0',
        position: stackTotal > 1 ? 'absolute' : 'relative'
      }}
    >
      <User className="w-3 h-3 flex-shrink-0" />
      <span className="truncate font-medium">{time}</span>
      <span className="truncate text-[10px] ml-auto pl-1">{person}</span>
    </div>
  );
}
