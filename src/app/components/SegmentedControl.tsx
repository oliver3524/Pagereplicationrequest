import { Info } from 'lucide-react';
import { useState } from 'react';

interface SegmentedControlProps {
  value: 'all' | 'leads';
  onChange: (value: 'all' | 'leads') => void;
}

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-[#667085]">Show:</label>
      <div className="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onChange('all')}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            value === 'all'
              ? 'bg-white text-[#111] font-medium shadow-sm'
              : 'text-[#667085] hover:text-[#111]'
          }`}
        >
          All calls
        </button>
        <button
          onClick={() => onChange('leads')}
          className={`px-4 py-1.5 text-sm rounded-md transition-colors ${
            value === 'leads'
              ? 'bg-white text-[#111] font-medium shadow-sm'
              : 'text-[#667085] hover:text-[#111]'
          }`}
        >
          Lead calls
        </button>
      </div>
      <div className="relative">
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="text-[#667085] hover:text-[#111]"
        >
          <Info className="w-4 h-4" />
        </button>
        {showTooltip && (
          <div className="absolute left-0 top-full mt-2 bg-[#111] text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-30 shadow-lg">
            Shows calls tied to leads + lead arrival markers
          </div>
        )}
      </div>
    </div>
  );
}
