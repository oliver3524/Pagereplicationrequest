import { StatusBadge } from './StatusBadge';

interface ThreadItemProps {
  id: string;
  name: string;
  phone: string;
  preview: string;
  timestamp: string;
  recipient: string;
  isOverdue?: boolean;
  overdueTime?: string;
  needsReply?: boolean;
  isResolved?: boolean;
  contactType?: 'lead' | 'member' | 'unknown';
  assignedTo?: string;
  tier?: 'tier-2';
  selected?: boolean;
  onClick?: () => void;
}

export function ThreadItem({
  name,
  phone,
  preview,
  timestamp,
  recipient,
  isOverdue = false,
  overdueTime,
  needsReply = false,
  isResolved = false,
  contactType = 'unknown',
  assignedTo,
  tier,
  selected = false,
  onClick
}: ThreadItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-[#EAECEF] hover:bg-gray-50 transition-colors ${
        selected ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
          {name.charAt(0)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-[#111] truncate">
                {name} <span className="font-normal text-[#667085]">/ {phone}</span>
              </div>
              <div className="text-xs text-[#667085]">{recipient}</div>
            </div>
            <span className="text-xs text-[#667085] whitespace-nowrap ml-2">{timestamp}</span>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {needsReply && !isResolved && <StatusBadge type="needs-reply" />}
            {isResolved && <StatusBadge type="resolved" />}
            {contactType === 'lead' && tier === 'tier-2' && <StatusBadge type="lead" label="Lead (Tier 2)" />}
            {contactType === 'lead' && !tier && <StatusBadge type="lead" />}
            {contactType === 'member' && <StatusBadge type="member" />}
            {contactType === 'unknown' && <StatusBadge type="unknown" />}
          </div>

          {/* Preview */}
          <div className="text-xs text-[#667085] line-clamp-2 mb-1">
            {preview}
          </div>

          {/* Assignment */}
          <div className="text-xs text-[#667085]">
            {assignedTo ? `Assigned to: ${assignedTo}` : 'Unassigned'}
          </div>
        </div>
      </div>
    </button>
  );
}