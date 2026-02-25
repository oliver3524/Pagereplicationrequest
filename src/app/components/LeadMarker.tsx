import { Flag } from 'lucide-react';
import { useState } from 'react';

interface LeadMarkerProps {
  time: string;
}

export function LeadMarker({ time }: LeadMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-[#667085] hover:text-[#111]"
      >
        <Flag className="w-3 h-3" />
      </button>
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-[#111] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-30 shadow-lg">
          Lead created – {time}
        </div>
      )}
    </div>
  );
}
