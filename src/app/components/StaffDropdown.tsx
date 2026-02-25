import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface StaffDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const staffOptions = ['All', 'Red', 'Pam', 'Brooks', 'Brooks Roberts', 'Sophie Brown', 'Reagan'];

export function StaffDropdown({ value, onChange }: StaffDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm text-[#667085] mr-2">Staff:</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#EAECEF] rounded-lg text-sm text-[#111] hover:bg-gray-50"
      >
        {value}
        <ChevronDown className="w-4 h-4 text-[#667085]" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white border border-[#EAECEF] rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
            {staffOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  value === option ? 'text-[#111] font-medium bg-gray-50' : 'text-[#667085]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
