interface CompleteAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
}

export function CompleteAlertModal({ isOpen, onClose, onConfirm, leadName }: CompleteAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-[440px] p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-[#111] mb-3">Mark alert as complete?</h3>
        <p className="text-sm text-[#667085] mb-2">
          This will remove <span className="font-medium text-[#111]">{leadName}</span> from the overdue alerts list.
        </p>
        <p className="text-sm text-[#667085] mb-4">
          This means the lead has been contacted or handled appropriately.
        </p>

        {/* Optional Reason Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#111] mb-2">Reason (optional)</label>
          <select className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500">
            <option value="">Select reason...</option>
            <option value="contacted">Contacted</option>
            <option value="not-valid">Not a valid lead</option>
            <option value="scheduled">Scheduled for later</option>
            <option value="duplicate">Duplicate lead</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#EAECEF] text-[#667085] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
