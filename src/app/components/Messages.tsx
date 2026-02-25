import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Search, ChevronDown } from 'lucide-react';
import { MessageKPICard } from './MessageKPICard';
import { FilterChip } from './FilterChip';
import { ThreadItem } from './ThreadItem';
import { ConversationPanel } from './ConversationPanel';
import { DateRangePicker } from './DateRangePicker';

interface Thread {
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
  waitingTime?: string;
  tier?: 'tier-2';
  messages: Array<{
    content: string;
    direction: 'inbound' | 'outbound';
    timestamp?: string;
    type?: 'text' | 'call';
    callDuration?: string;
    handledBy?: string;
  }>;
  relatedActivity?: string;
}

const mockThreads: Thread[] = [
  {
    id: '1',
    name: 'Victoria DREIBELBIS',
    phone: '+1 610 555 1362',
    preview: 'Hi - this is Victoria Dreibilbis. You kindly paused my membership for 2 months due to my broke foot but can you please also pause it for February as I won\'t be able to walk till then. Thank you!',
    timestamp: 'Jan 4 12:18 PM',
    recipient: 'Devon',
    isOverdue: true,
    overdueTime: 'Overdue 3h',
    needsReply: true,
    contactType: 'member',
    assignedTo: 'Pam',
    waitingTime: '3h 12m',
    messages: [
      {
        content: 'Hi - this is Victoria Dreibilbis. You kindly paused my membership for 2 months due to my broke foot but can you please also pause it for February as I won\'t be able to walk till then. Thank you!',
        direction: 'inbound',
        timestamp: 'Jan 4 12:18 PM',
        handledBy: 'Pam'
      }
    ],
    relatedActivity: 'Last call attempt: Outbound 10:07 AM (1m)'
  },
  {
    id: '2',
    name: 'Iman Ekhshaish',
    phone: '+1 510 904 4985',
    preview: 'I just was calling to return your call. I had previously needed to cancel my class for myself and my mom...',
    timestamp: 'Jan 4 2:32 PM',
    recipient: 'Devon',
    isOverdue: true,
    overdueTime: 'Overdue 5h',
    needsReply: true,
    contactType: 'lead',
    tier: 'tier-2',
    assignedTo: undefined,
    waitingTime: '5h 28m',
    messages: [
      {
        content: 'Hi, my apologies. I actually just called; I try to schedule the classes online for myself and my mom, but I meant to schedule my mom on Wednesday at 8AM. And I scheduled her for Monday at 8AM.',
        direction: 'inbound',
        timestamp: 'Jan 4 2:32 PM',
        handledBy: 'Devon'
      },
      {
        content: 'So I wanted us to be scheduled together on Wednesday at 8AM. Our last name is Ekhshaish EB, my name is Iman and her name is Emira. Thank you so much and my number is 510-904-4985.',
        direction: 'inbound',
        handledBy: 'Devon'
      },
      {
        content: 'Outbound call',
        direction: 'outbound',
        timestamp: 'Jan 4 2:45 PM',
        type: 'call',
        callDuration: '2m 15s',
        handledBy: 'Devon'
      },
      {
        content: 'Hey, thank you so much for the call. I have already booked on Thursday.',
        direction: 'inbound',
        timestamp: 'Jan 4 2:50 PM',
        handledBy: 'Devon'
      }
    ],
    relatedActivity: 'Last call attempt: Inbound 2:31 PM (0:21)'
  },
  {
    id: '3',
    name: 'Sarah Miller',
    phone: '+1 415 555 2847',
    preview: 'Hey! I wanted to check if there are any spots available for the 6 PM class tomorrow?',
    timestamp: 'Jan 4 4:45 PM',
    recipient: 'Devon',
    needsReply: true,
    contactType: 'member',
    assignedTo: 'Brooks',
    waitingTime: '1h 15m',
    messages: [
      {
        content: 'Hey! I wanted to check if there are any spots available for the 6 PM class tomorrow?',
        direction: 'inbound',
        timestamp: 'Jan 4 4:45 PM',
        handledBy: 'Brooks'
      }
    ]
  },
  {
    id: '4',
    name: 'John Anderson',
    phone: '+1 925 555 3921',
    preview: 'Thanks for getting back to me! I\'ll see you at the studio on Monday.',
    timestamp: 'Jan 4 3:20 PM',
    recipient: 'Devon',
    needsReply: true,
    contactType: 'lead',
    tier: 'tier-2',
    assignedTo: 'Red',
    waitingTime: '45m',
    messages: [
      {
        content: 'Hi! I saw your ad and I\'m interested in signing up for a trial class. What times do you have available this week?',
        direction: 'inbound',
        timestamp: 'Jan 4 2:15 PM',
        handledBy: 'Red'
      },
      {
        content: 'Hi John! Thanks for reaching out. We have spots available Monday at 7 AM, Wednesday at 6 PM, or Friday at 5:30 PM. Which works best for you?',
        direction: 'outbound',
        timestamp: 'Jan 4 2:35 PM',
        handledBy: 'Red'
      },
      {
        content: 'Thanks for getting back to me! I\'ll see you at the studio on Monday.',
        direction: 'inbound',
        timestamp: 'Jan 4 3:20 PM',
        handledBy: 'Red'
      }
    ]
  },
  {
    id: '5',
    name: 'Lisa Chen',
    phone: '+1 408 555 7712',
    preview: 'Perfect! I\'ve added it to my calendar. Looking forward to it!',
    timestamp: 'Jan 4 11:30 AM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'member',
    assignedTo: 'Pam',
    messages: [
      {
        content: 'Can I reschedule my Thursday class to Friday instead?',
        direction: 'inbound',
        timestamp: 'Jan 4 10:15 AM',
        handledBy: 'Pam'
      },
      {
        content: 'Absolutely! I\'ve moved you to Friday at 6 PM. You\'re all set!',
        direction: 'outbound',
        timestamp: 'Jan 4 10:45 AM',
        handledBy: 'Pam'
      },
      {
        content: 'Perfect! I\'ve added it to my calendar. Looking forward to it!',
        direction: 'inbound',
        timestamp: 'Jan 4 11:30 AM',
        handledBy: 'Pam'
      }
    ]
  },
  {
    id: '6',
    name: 'Unknown',
    phone: '+1 510 555 8834',
    preview: 'Stop',
    timestamp: 'Jan 4 10:15 PM',
    recipient: 'Devon',
    contactType: 'unknown',
    assignedTo: undefined,
    messages: [
      {
        content: 'Stop',
        direction: 'inbound',
        timestamp: 'Jan 4 10:15 PM',
        handledBy: 'Devon'
      }
    ]
  },
  {
    id: '7',
    name: 'Mike Thompson',
    phone: '+1 650 555 4421',
    preview: 'Great! Looking forward to the session.',
    timestamp: 'Jan 4 9:15 AM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'member',
    assignedTo: 'Brooks',
    messages: [
      {
        content: 'Hey, can I book a personal training session for next Tuesday?',
        direction: 'inbound',
        timestamp: 'Jan 4 8:30 AM',
        handledBy: 'Brooks'
      },
      {
        content: 'Of course! I have slots at 10 AM and 2 PM. Which works better?',
        direction: 'outbound',
        timestamp: 'Jan 4 8:45 AM',
        handledBy: 'Brooks'
      },
      {
        content: 'Great! Looking forward to the session.',
        direction: 'inbound',
        timestamp: 'Jan 4 9:15 AM',
        handledBy: 'Brooks'
      }
    ]
  },
  {
    id: '8',
    name: 'Emma Rodriguez',
    phone: '+1 408 555 9912',
    preview: 'Perfect, thanks so much!',
    timestamp: 'Jan 4 1:20 PM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'lead',
    assignedTo: 'Pam',
    messages: [
      {
        content: 'Hi! I\'m interested in your intro offer. What does it include?',
        direction: 'inbound',
        timestamp: 'Jan 4 12:45 PM',
        handledBy: 'Pam'
      },
      {
        content: 'Hi Emma! Our intro offer includes 3 classes for $45. You can use them anytime within 2 weeks. Would you like to sign up?',
        direction: 'outbound',
        timestamp: 'Jan 4 1:00 PM',
        handledBy: 'Pam'
      },
      {
        content: 'Perfect, thanks so much!',
        direction: 'inbound',
        timestamp: 'Jan 4 1:20 PM',
        handledBy: 'Pam'
      }
    ]
  },
  {
    id: '9',
    name: 'David Park',
    phone: '+1 510 555 3387',
    preview: 'Sounds good, see you then!',
    timestamp: 'Jan 4 3:45 PM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'member',
    assignedTo: 'Red',
    messages: [
      {
        content: 'Can I bring a friend to tomorrow\'s class?',
        direction: 'inbound',
        timestamp: 'Jan 4 3:10 PM',
        handledBy: 'Red'
      },
      {
        content: 'Absolutely! Just make sure they fill out the waiver online before class.',
        direction: 'outbound',
        timestamp: 'Jan 4 3:30 PM',
        handledBy: 'Red'
      },
      {
        content: 'Sounds good, see you then!',
        direction: 'inbound',
        timestamp: 'Jan 4 3:45 PM',
        handledBy: 'Red'
      }
    ]
  },
  {
    id: '10',
    name: 'Jessica Wong',
    phone: '+1 925 555 7743',
    preview: 'Thank you!',
    timestamp: 'Jan 4 5:20 PM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'member',
    assignedTo: 'Brooks',
    messages: [
      {
        content: 'What time does the studio close tonight?',
        direction: 'inbound',
        timestamp: 'Jan 4 5:05 PM',
        handledBy: 'Brooks'
      },
      {
        content: 'We close at 9 PM tonight!',
        direction: 'outbound',
        timestamp: 'Jan 4 5:15 PM',
        handledBy: 'Brooks'
      },
      {
        content: 'Thank you!',
        direction: 'inbound',
        timestamp: 'Jan 4 5:20 PM',
        handledBy: 'Brooks'
      }
    ]
  },
  {
    id: '11',
    name: 'Alex Martinez',
    phone: '+1 415 555 6628',
    preview: 'Perfect, I\'ll be there!',
    timestamp: 'Jan 3 4:30 PM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'lead',
    assignedTo: 'Devon',
    messages: [
      {
        content: 'Is the intro class still available this week?',
        direction: 'inbound',
        timestamp: 'Jan 3 3:45 PM',
        handledBy: 'Devon'
      },
      {
        content: 'Yes! We have intro classes Monday, Wednesday, and Friday at 6 PM.',
        direction: 'outbound',
        timestamp: 'Jan 3 4:00 PM',
        handledBy: 'Devon'
      },
      {
        content: 'Perfect, I\'ll be there!',
        direction: 'inbound',
        timestamp: 'Jan 3 4:30 PM',
        handledBy: 'Devon'
      }
    ]
  },
  {
    id: '12',
    name: 'Rachel Green',
    phone: '+1 650 555 8821',
    preview: 'Awesome, thanks!',
    timestamp: 'Jan 3 2:15 PM',
    recipient: 'Devon',
    isResolved: true,
    contactType: 'member',
    assignedTo: 'Pam',
    messages: [
      {
        content: 'Can I freeze my membership for next month?',
        direction: 'inbound',
        timestamp: 'Jan 3 1:30 PM',
        handledBy: 'Pam'
      },
      {
        content: 'Sure! I\'ll freeze it starting February 1st. Just send me a heads up when you\'re ready to resume.',
        direction: 'outbound',
        timestamp: 'Jan 3 2:00 PM',
        handledBy: 'Pam'
      },
      {
        content: 'Awesome, thanks!',
        direction: 'inbound',
        timestamp: 'Jan 3 2:15 PM',
        handledBy: 'Pam'
      }
    ]
  }
];

export function Messages() {
  const [selectedThreadId, setSelectedThreadId] = useState<string>('1');
  const [messageTypeFilter, setMessageTypeFilter] = useState<'sms' | 'voicemail' | 'fax'>('sms');
  const [triageFilter, setTriageFilter] = useState<'all' | 'needs-reply'>('needs-reply');
  const [assignedFilter, setAssignedFilter] = useState('all');
  const [contactTypeFilter, setContactTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staffKPIFilter, setStaffKPIFilter] = useState('all'); // New filter for KPI cards
  const [dateRange, setDateRange] = useState({
    start: new Date('2024-12-29'),
    end: new Date('2025-01-04')
  });

  const selectedThread = mockThreads.find(t => t.id === selectedThreadId);

  // Filter threads
  const filteredThreads = mockThreads
    .filter(thread => {
      if (triageFilter === 'needs-reply') return thread.needsReply && !thread.isResolved;
      return true;
    })
    .filter(thread => {
      if (assignedFilter === 'all') return true;
      if (assignedFilter === 'unassigned') return !thread.assignedTo;
      return thread.assignedTo === assignedFilter;
    })
    .filter(thread => {
      if (contactTypeFilter === 'all') return true;
      return thread.contactType === contactTypeFilter;
    })
    .filter(thread => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        thread.name.toLowerCase().includes(query) ||
        thread.phone.includes(query) ||
        thread.preview.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      // Sort: needs reply first, then others
      if (a.needsReply && !b.needsReply) return -1;
      if (!a.needsReply && b.needsReply) return 1;
      return 0;
    });

  // Calculate KPIs
  const unrepliedCount = mockThreads.filter(t => t.needsReply && !t.isResolved).length;
  const overdueCount = mockThreads.filter(t => t.isOverdue).length;
  const leadNeedsReplyCount = mockThreads.filter(t => t.needsReply && t.contactType === 'lead').length;

  // Calculate inbound/outbound message counts based on staff filter
  const totalInbound = mockThreads.reduce((count, thread) => {
    return count + thread.messages.filter(m => {
      if (m.direction !== 'inbound') return false;
      if (staffKPIFilter === 'all') return true;
      return m.handledBy === staffKPIFilter;
    }).length;
  }, 0);
  
  const totalOutbound = mockThreads.reduce((count, thread) => {
    return count + thread.messages.filter(m => {
      if (m.direction !== 'outbound') return false;
      if (staffKPIFilter === 'all') return true;
      return m.handledBy === staffKPIFilter;
    }).length;
  }, 0);

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
      <div className="p-8 flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#111]">Messages</h1>
            <p className="text-sm text-[#667085] mt-1">SMS, Voicemail, and Fax messages</p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg hover:bg-gray-50 text-sm font-medium text-[#111]">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Staff Filter for KPIs */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-[#667085]">Filter by staff member:</span>
          <div className="relative">
            <select
              value={staffKPIFilter}
              onChange={(e) => setStaffKPIFilter(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-[#EAECEF] rounded-lg text-sm text-[#111] bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All staff members</option>
              <option value="Pam">Pam</option>
              <option value="Red">Red</option>
              <option value="Brooks">Brooks</option>
              <option value="Devon">Devon</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#667085] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <MessageKPICard
            title="Inbound texts"
            value={totalInbound}
            caption="Received this week"
          />
          <MessageKPICard
            title="Outbound texts"
            value={totalOutbound}
            caption="Sent this week"
          />
          <MessageKPICard
            title="Average reply time"
            value="18 min"
            caption="Last 7 days"
          />
        </div>

        {/* Filter / Inbox Control Bar */}
        <div className="bg-white border border-[#EAECEF] rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Left side - Message Type + Triage */}
            <div className="flex items-center gap-3">
              <FilterChip
                label="SMS"
                count={125}
                selected={messageTypeFilter === 'sms'}
                onClick={() => setMessageTypeFilter('sms')}
              />
              <FilterChip
                label="Voicemail"
                selected={messageTypeFilter === 'voicemail'}
                onClick={() => setMessageTypeFilter('voicemail')}
              />
              <FilterChip
                label="Fax"
                selected={messageTypeFilter === 'fax'}
                onClick={() => setMessageTypeFilter('fax')}
              />

              <div className="w-px h-6 bg-[#EAECEF]" />

              <FilterChip
                label="Needs Reply"
                selected={triageFilter === 'needs-reply'}
                onClick={() => setTriageFilter('needs-reply')}
              />
              <FilterChip
                label="All"
                selected={triageFilter === 'all'}
                onClick={() => setTriageFilter('all')}
              />
            </div>

            {/* Right side - Dropdowns + Search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#667085]">Assigned:</span>
                <div className="relative">
                  <select
                    value={assignedFilter}
                    onChange={(e) => setAssignedFilter(e.target.value)}
                    className="appearance-none px-3 py-1.5 pr-8 border border-[#EAECEF] rounded-lg text-sm text-[#111] bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All staff</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="Pam">Pam</option>
                    <option value="Red">Red</option>
                    <option value="Brooks">Brooks</option>
                    <option value="Devon">Devon</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#667085] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#667085]">Type:</span>
                <div className="relative">
                  <select
                    value={contactTypeFilter}
                    onChange={(e) => setContactTypeFilter(e.target.value)}
                    className="appearance-none px-3 py-1.5 pr-8 border border-[#EAECEF] rounded-lg text-sm text-[#111] bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="lead">Lead</option>
                    <option value="member">Member</option>
                    <option value="unknown">Unknown</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#667085] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name or number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-[#EAECEF] rounded-lg text-sm text-[#111] bg-white placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Panel Inbox */}
      <div className="flex-1 flex gap-6 px-8 pb-8 overflow-hidden">
        {/* Left Column - Thread List */}
        <div className="w-[35%] bg-white border border-[#EAECEF] rounded-xl overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map(thread => (
              <ThreadItem
                key={thread.id}
                {...thread}
                selected={thread.id === selectedThreadId}
                onClick={() => setSelectedThreadId(thread.id)}
              />
            ))}
            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-[#667085]">
                <p className="text-sm">No messages match your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Conversation Panel */}
        <div className="flex-1 overflow-hidden">
          {selectedThread ? (
            <ConversationPanel
              name={selectedThread.name}
              phone={selectedThread.phone}
              contactType={selectedThread.contactType}
              isOverdue={selectedThread.isOverdue}
              overdueTime={selectedThread.overdueTime}
              needsReply={selectedThread.needsReply}
              assignedTo={selectedThread.assignedTo}
              waitingTime={selectedThread.waitingTime}
              messages={selectedThread.messages}
              relatedActivity={selectedThread.relatedActivity}
              onAssign={(staff) => console.log('Assign to:', staff)}
              onMarkResolved={() => console.log('Mark resolved')}
              onCreateFollowup={() => console.log('Create follow-up')}
            />
          ) : (
            <div className="bg-white border border-[#EAECEF] rounded-xl h-full flex items-center justify-center">
              <p className="text-[#667085]">Select a conversation to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}