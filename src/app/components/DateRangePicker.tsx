import { Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  value: { start: Date; end: Date };
  onChange: (range: { start: Date; end: Date }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    const daysDiff = Math.ceil((value.end.getTime() - newStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // If new start makes range > 7 days, adjust end date
    if (daysDiff > 7) {
      const newEnd = new Date(newStart);
      newEnd.setDate(newEnd.getDate() + 6);
      onChange({ start: newStart, end: newEnd });
    } else {
      onChange({ ...value, start: newStart });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    const daysDiff = Math.ceil((newEnd.getTime() - value.start.getTime()) / (1000 * 60 * 60 * 24));
    
    // If new end makes range > 7 days, adjust to max 7 days
    if (daysDiff > 7) {
      const adjustedEnd = new Date(value.start);
      adjustedEnd.setDate(adjustedEnd.getDate() + 6);
      onChange({ ...value, end: adjustedEnd });
    } else {
      onChange({ ...value, end: newEnd });
    }
  };

  const getMaxEndDate = () => {
    const maxEnd = new Date(value.start);
    maxEnd.setDate(maxEnd.getDate() + 6);
    return maxEnd.toISOString().split('T')[0];
  };

  const getMinStartDate = () => {
    const minStart = new Date(value.end);
    minStart.setDate(minStart.getDate() - 6);
    return minStart.toISOString().split('T')[0];
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg hover:bg-gray-50 text-sm font-medium text-[#111]"
      >
        <Calendar className="w-4 h-4" />
        <span>{formatDate(value.start)} – {formatDate(value.end)}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-[#EAECEF] rounded-lg shadow-lg p-4 z-10 min-w-[320px]">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#667085] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={value.start.toISOString().split('T')[0]}
                max={getMaxEndDate()}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[#667085] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={value.end.toISOString().split('T')[0]}
                min={value.start.toISOString().split('T')[0]}
                max={getMaxEndDate()}
                onChange={handleEndDateChange}
                className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#111] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2 border-t border-[#EAECEF]">
              <p className="text-xs text-[#667085]">
                Maximum range: 7 days
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
