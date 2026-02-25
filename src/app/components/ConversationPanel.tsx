import { MessageBubble } from './MessageBubble';
import { StatusBadge } from './StatusBadge';
import { ChevronDown } from 'lucide-react';

interface Message {
  content: string;
  direction: 'inbound' | 'outbound';
  timestamp?: string;
  type?: 'call' | 'text';
  callDuration?: string;
}

interface ConversationPanelProps {
  name: string;
  phone: string;
  contactType?: 'lead' | 'member' | 'unknown';
  isOverdue?: boolean;
  overdueTime?: string;
  needsReply?: boolean;
  assignedTo?: string;
  waitingTime?: string;
  tier?: 'tier-2';
  messages: Message[];
  relatedActivity?: string;
  onAssign?: (staff: string) => void;
  onMarkResolved?: () => void;
  onCreateFollowup?: () => void;
}

export function ConversationPanel({
  name,
  phone,
  contactType = 'unknown',
  isOverdue = false,
  overdueTime,
  needsReply = false,
  assignedTo,
  waitingTime,
  tier,
  messages,
  relatedActivity,
  onAssign,
  onMarkResolved,
  onCreateFollowup
}: ConversationPanelProps) {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#EAECEF]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-[#111] mb-2">
              {name} <span className="font-normal text-[#667085]">/ {phone}</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {needsReply && <StatusBadge type="needs-reply" />}
              {contactType === 'lead' && tier === 'tier-2' && <StatusBadge type="lead" label="Lead (Tier 2)" />}
              {contactType === 'lead' && !tier && <StatusBadge type="lead" />}
              {contactType === 'member' && <StatusBadge type="member" />}
              {contactType === 'unknown' && <StatusBadge type="unknown" />}
            </div>
          </div>
        </div>

        {/* Related Activity */}
        {relatedActivity && (
          <div className="text-xs text-[#667085] mb-3">
            {relatedActivity}{' '}
            <button className="text-blue-600 hover:underline">View call</button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={assignedTo || ''}
              onChange={(e) => onAssign?.(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Assign to...</option>
              <option value="Pam">Pam</option>
              <option value="Red">Red</option>
              <option value="Brooks">Brooks</option>
              <option value="Devon">Devon</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#667085] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={onMarkResolved}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] bg-white hover:bg-gray-50"
          >
            Mark Resolved
          </button>
          <button
            onClick={onCreateFollowup}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] bg-white hover:bg-gray-50"
          >
            Create Follow-up
          </button>
        </div>
      </div>

      {/* Conversation Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        {waitingTime && (
          <div className="text-xs mb-4 p-2 rounded bg-orange-50 text-orange-700">
            SLA: Waiting {waitingTime}
          </div>
        )}
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            content={msg.content}
            direction={msg.direction}
            timestamp={msg.timestamp}
            type={msg.type}
            callDuration={msg.callDuration}
          />
        ))}
      </div>
    </div>
  );
}