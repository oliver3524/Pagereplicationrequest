import { Phone, Flag } from 'lucide-react';

interface CallPillProps {
  time: string;
  type: 'outbound' | 'inbound' | 'voicemail' | 'missed';
  label?: string;
  isLeadLinked?: boolean;
  leadPerson?: string;
  opacity?: number;
  stackIndex?: number;
  stackTotal?: number;
}

export function CallPill({ time, type, label, isLeadLinked = false, leadPerson, opacity = 1, stackIndex = 0, stackTotal = 1 }: CallPillProps) {
  const getTypeClass = () => {
    switch (type) {
      case 'outbound':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'inbound':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'voicemail':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'missed':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  // Calculate width and offset for stacked calls
  const widthPercent = stackTotal > 1 ? (100 / stackTotal) : 100;
  const leftOffsetPercent = stackTotal > 1 ? (stackIndex * (100 / stackTotal)) : 0;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${getTypeClass()}`}
      style={{ 
        opacity,
        width: stackTotal > 1 ? `${widthPercent}%` : '100%',
        marginLeft: stackTotal > 1 ? `${leftOffsetPercent}%` : '0',
        position: stackTotal > 1 ? 'absolute' : 'relative'
      }}
    >
      <Phone className="w-3 h-3 flex-shrink-0" />
      <span className="truncate font-medium">{leadPerson || time}</span>
      {isLeadLinked && !leadPerson && (
        <Flag className="w-3 h-3 flex-shrink-0 ml-0.5" />
      )}
      {label && (
        <span className="ml-auto text-[10px] truncate pl-1">
          {label}
        </span>
      )}
    </div>
  );
}