import { X, AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface OverdueNotificationProps {
  isVisible: boolean;
  leadName: string;
  onComplete: (outcome: string) => void;
  onClose: () => void;
}

export function OverdueNotification({ isVisible, leadName, onComplete, onClose }: OverdueNotificationProps) {
  const [showOutcomeDropdown, setShowOutcomeDropdown] = useState(false);

  if (!isVisible) return null;

  const outcomes = [
    'Intro Booked',
    'Self-booked',
    'Invalid Lead',
    'Repetitive Lead',
    'Closed'
  ];

  const handleOutcomeSelect = (outcome: string) => {
    onComplete(outcome);
    setShowOutcomeDropdown(false);
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className="bg-white border border-red-300 rounded-lg shadow-2xl w-[380px] overflow-hidden">
        {/* Header with red accent */}
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-semibold text-red-700">Lead Overdue Alert</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-[#111] mb-4">
            <span className="font-semibold">{leadName}</span> has been overdue. Please contact the lead as soon as possible.
          </p>

          {/* Outcome Dropdown (shown when Complete is clicked) */}
          {showOutcomeDropdown && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-[#667085] mb-2">Select Outcome</label>
              <div className="border border-[#EAECEF] rounded-lg overflow-hidden">
                {outcomes.map((outcome) => (
                  <button
                    key={outcome}
                    onClick={() => handleOutcomeSelect(outcome)}
                    className="w-full px-4 py-2 text-left text-sm text-[#111] hover:bg-gray-50 transition-colors border-b border-[#EAECEF] last:border-b-0"
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#EAECEF] text-[#667085] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setShowOutcomeDropdown(!showOutcomeDropdown)}
              className="flex-1 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              Complete
              <ChevronDown className={`w-4 h-4 transition-transform ${showOutcomeDropdown ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
