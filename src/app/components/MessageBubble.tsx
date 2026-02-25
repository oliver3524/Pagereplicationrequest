import { Phone } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  direction: 'inbound' | 'outbound';
  timestamp?: string;
  type?: 'text' | 'call';
  callDuration?: string;
}

export function MessageBubble({ content, direction, timestamp, type = 'text', callDuration }: MessageBubbleProps) {
  if (type === 'call') {
    return (
      <div className="flex justify-center mb-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-[#EAECEF] rounded-lg text-xs text-[#667085]">
          <Phone className="w-3 h-3" />
          <span>{content}</span>
          {timestamp && <span>• {timestamp}</span>}
          {callDuration && <span>• {callDuration}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${direction === 'outbound' ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] ${direction === 'outbound' ? 'items-end' : 'items-start'} flex flex-col`}>
        {timestamp && (
          <div className="text-xs text-[#667085] mb-1 px-1">
            {timestamp}
          </div>
        )}
        <div
          className={`px-4 py-2.5 rounded-lg text-sm ${
            direction === 'inbound'
              ? 'bg-gray-100 text-[#111]'
              : 'bg-blue-50 text-[#111]'
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}