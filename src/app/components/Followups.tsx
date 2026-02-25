import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  X, 
  Clock, 
  Phone, 
  MessageSquare, 
  UserPlus,
  CheckCircle,
  Bell,
  User,
  Calendar,
  FileText,
  AlertCircle,
  MoreHorizontal,
  ArrowRight,
  ClipboardList,
  Variable
} from 'lucide-react';
import { ScriptBuilderModal } from '@/app/components/ScriptBuilderModal';

type FollowupType = 'Lead' | 'Member';
type FollowupPriority = 'Urgent' | 'Important' | 'Normal';
type TaskType = 'Intro Lead' | 'Cancellation Risk' | 'Needs Follow-up' | 'Billing' | 'Booked Intro (Confirm)';
type FollowupStatus = 'Open' | 'Cleared' | 'Hidden';

interface Followup {
  id: number;
  contactName: string;
  phone: string;
  type: FollowupType;
  priority: FollowupPriority;
  taskType: TaskType;
  status: FollowupStatus;
  outcome?: string;
  reason: string;
  dueDate: Date;
  lastActivity: Date;
  callAttempts: number;
  textAttempts: number;
  firstResponseTime: string;
  assignedTo: string;
  whatHappened: string[];
  suggestedScript: string[];
  timeline: {
    timestamp: Date;
    type: 'call' | 'text' | 'note';
    content: string;
    by: string;
  }[];
}

const TASK_OUTCOMES: Record<TaskType, string[]> = {
  'Cancellation Risk': ['Customer canceled', 'Customer retained'],
  'Booked Intro (Confirm)': ['Intro booked', 'Need followup', 'Closed'],
  'Intro Lead': ['Intro booked', 'Need followup', 'Closed'],
  'Needs Follow-up': ['Contacted', 'Need followup', 'Closed'],
  'Billing': ['Payment secured', 'Need followup', 'Closed'],
};

interface FollowupsProps {
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function Followups({ dateRange = 'Last 7 days', onDateRangeChange }: FollowupsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | FollowupPriority>('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [showOpenOnly, setShowOpenOnly] = useState(true);
  const [includeCleared, setIncludeCleared] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState<Followup | null>(null);
  const [activeOutcomeMenu, setActiveOutcomeMenu] = useState<number | null>(null);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [scriptModalData, setScriptModalData] = useState<any>(null);

  // Mock data
  const [followups, setFollowups] = useState<Followup[]>([
    {
      id: 1,
      contactName: 'Kate Jackson',
      phone: '(215) 866-5432',
      type: 'Member',
      priority: 'Urgent',
      taskType: 'Cancellation Risk',
      status: 'Open',
      reason: 'Cancellation Risk — member said price is too high',
      dueDate: new Date(Date.now() - 30 * 60 * 1000),
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      callAttempts: 1,
      textAttempts: 1,
      firstResponseTime: '15m',
      assignedTo: 'Adriana',
      whatHappened: [
        'Member called to inquire about cancellation process',
        'Stated that current membership price is no longer within budget'
      ],
      suggestedScript: [
        'Acknowledge their fitness goals and progress so far',
        'Offer the "loyalty rate" or "downgrade" option to keep them active',
        'Highlight the value of the community and the cost of stopping momentum'
      ],
      timeline: [
        { timestamp: new Date(Date.now() - 45 * 60 * 1000), type: 'call', content: 'Inbound call: Cancellation inquiry', by: 'System' },
        { timestamp: new Date(Date.now() - 40 * 60 * 1000), type: 'text', content: 'Sent: Sorry to hear you are thinking of leaving. Let\'s chat about options!', by: 'Adriana' }
      ]
    },
    {
      id: 2,
      contactName: 'Matthew Zaist',
      phone: '(949) 735-8821',
      type: 'Lead',
      priority: 'Urgent',
      taskType: 'Booked Intro (Confirm)',
      status: 'Open',
      reason: 'Intro booked tomorrow 8:15 AM — not confirmed',
      dueDate: new Date(Date.now() - 15 * 60 * 1000),
      lastActivity: new Date(Date.now() - 60 * 60 * 1000),
      callAttempts: 0,
      textAttempts: 1,
      firstResponseTime: 'No response yet',
      assignedTo: 'Alex',
      whatHappened: [
        'Intro class booked via website for tomorrow at 8:15 AM',
        'Confirmation text sent but no reply received'
      ],
      suggestedScript: [
        'Confirm they are still planning to attend tomorrow',
        'Remind them to arrive 15 minutes early for orientation',
        'Ask if they have any specific fitness goals they want to share'
      ],
      timeline: [
        { timestamp: new Date(Date.now() - 120 * 60 * 1000), type: 'note', content: 'Intro booking received for Dec 31, 8:15 AM', by: 'System' },
        { timestamp: new Date(Date.now() - 60 * 60 * 1000), type: 'text', content: 'Sent: Looking forward to seeing you tomorrow! Can you confirm you\'re coming?', by: 'Alex' }
      ]
    },
    {
      id: 3,
      contactName: 'Melissa Sullivan',
      phone: '(718) 442-9012',
      type: 'Lead',
      priority: 'Important',
      taskType: 'Intro Lead',
      status: 'Open',
      reason: 'New lead — no call/text yet',
      dueDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      callAttempts: 0,
      textAttempts: 0,
      firstResponseTime: 'No response yet',
      assignedTo: 'Unassigned',
      whatHappened: [
        'New lead submitted via Facebook ad',
        'No outreach has been performed yet'
      ],
      suggestedScript: [
        'Introduce yourself and the studio',
        'Invite them for a complimentary intro session',
        'Ask what motivated them to reach out today'
      ],
      timeline: [
        { timestamp: new Date(Date.now() - 125 * 60 * 1000), type: 'note', content: 'Lead created from Facebook Ad Campaign', by: 'System' }
      ]
    },
    {
      id: 4,
      contactName: 'Ciaran O\'Brien',
      phone: '(303) 889-5544',
      type: 'Lead',
      priority: 'Normal',
      taskType: 'Needs Follow-up',
      status: 'Open',
      reason: 'Follow-up needed — left voicemail',
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
      lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
      callAttempts: 2,
      textAttempts: 1,
      firstResponseTime: '47m',
      assignedTo: 'Alex',
      whatHappened: [
        'Previous call attempt resulted in voicemail',
        'Lead had responded once initially but has since gone quiet'
      ],
      suggestedScript: [
        'Reference the previous voicemail and follow up on the intro offer',
        'Ask if they have a better time to talk or prefer texting',
        'Provide a clear next step (e.g., booking the class)'
      ],
      timeline: [
        { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), type: 'call', content: 'Inbound call: Inquiry about classes', by: 'System' },
        { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), type: 'text', content: 'Initial response from lead: "Interested in morning classes"', by: 'Ciaran' },
        { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), type: 'call', content: 'Outbound call: Left voicemail', by: 'Alex' }
      ]
    }
  ]);

  const handleMarkCompleted = (id: number, outcome: string) => {
    setFollowups(followups.map(f => 
      f.id === id ? { ...f, status: 'Cleared' as FollowupStatus, outcome } : f
    ));
    setActiveOutcomeMenu(null);
    if (selectedFollowup?.id === id) {
      setSelectedFollowup(null);
    }
  };

  const handleGenerateScript = (followup: Followup) => {
    setScriptModalData({
      name: followup.contactName,
      phone: followup.phone,
      type: followup.type,
      taskType: followup.taskType,
      due: 'Today 2:00 PM',
      goal: followup.taskType === 'Booked Intro (Confirm)' ? 'Get credit card on file' : 
            followup.taskType === 'Cancellation Risk' ? 'Retain member' : 'Schedule intro',
      background: followup.whatHappened,
      initialScenario: followup.taskType === 'Booked Intro (Confirm)' ? 'Intro booked — confirm + card on file' :
                       followup.taskType === 'Cancellation Risk' ? 'Cancellation risk — save attempt' :
                       followup.taskType === 'Intro Lead' ? 'New lead — no response yet' :
                       followup.taskType === 'Needs Follow-up' ? 'Left voicemail — call back' :
                       followup.taskType === 'Billing' ? 'Billing issue — payment failed' : 'New lead — no response yet'
    });
    setIsScriptModalOpen(true);
  };

  const counts = {
    urgent: followups.filter(f => f.priority === 'Urgent').length,
    important: followups.filter(f => f.priority === 'Important').length,
    normal: followups.filter(f => f.priority === 'Normal').length,
    total: followups.length
  };

  const openFollowups = followups.filter(f => f.status === 'Open');
  const overdueFollowupsCount = openFollowups.filter(f => f.dueDate < new Date()).length;
  const closedTasksCount = followups.filter(f => f.status === 'Cleared').length;
  const dueTodayCount = openFollowups.filter(f => {
    const today = new Date();
    const due = new Date(f.dueDate);
    return due.toDateString() === today.toDateString();
  }).length;

  const filteredFollowups = followups.filter(f => {
    if (showOpenOnly && f.status !== 'Open') return false;
    if (!includeCleared && f.status === 'Cleared') return false;
    if (priorityFilter !== 'All' && f.priority !== priorityFilter) return false;
    if (typeFilter !== 'All' && f.type !== typeFilter) return false;
    if (assignedFilter !== 'All' && f.assignedTo !== assignedFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return f.contactName.toLowerCase().includes(query) || f.phone.includes(query);
    }
    return true;
  });

  const dueTodayItems = filteredFollowups.filter(f => {
    const today = new Date();
    const due = new Date(f.dueDate);
    return due.toDateString() === today.toDateString() && f.status === 'Open';
  });

  const overdueItems = filteredFollowups.filter(f => 
    f.dueDate < new Date() && f.status === 'Open' && !dueTodayItems.includes(f)
  );

  const upcomingItems = filteredFollowups.filter(f => 
    f.dueDate > new Date() && f.status === 'Open' && !dueTodayItems.includes(f)
  ).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const getPriorityInfo = (priority: FollowupPriority) => {
    switch (priority) {
      case 'Urgent': return { dot: 'bg-red-500', text: 'text-red-700', label: 'Urgent' };
      case 'Important': return { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Important' };
      case 'Normal': return { dot: 'bg-gray-400', text: 'text-gray-600', label: 'Normal' };
    }
  };

  const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
      case 'Intro Lead': return 'bg-blue-100 text-blue-700';
      case 'Cancellation Risk': return 'bg-red-100 text-red-700';
      case 'Needs Follow-up': return 'bg-amber-100 text-amber-700';
      case 'Billing': return 'bg-purple-100 text-purple-700';
      case 'Booked Intro (Confirm)': return 'bg-green-100 text-green-700';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const renderFollowupRow = (followup: Followup, isOverdue: boolean = false) => {
    const p = getPriorityInfo(followup.priority);
    return (
      <div
        key={followup.id}
        className={`bg-white border border-[#EAECEF] rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${
          isOverdue ? 'border-red-200 bg-red-50/30' : ''
        } ${selectedFollowup?.id === followup.id ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => setSelectedFollowup(followup)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1.5 min-w-[80px]">
                <div className={`w-2 h-2 rounded-full ${p.dot}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${p.text}`}>{p.label}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#111] truncate">{followup.contactName}</h3>
              <span className="text-xs text-[#667085]">{followup.phone}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getTaskTypeColor(followup.taskType)}`}>
                {followup.taskType}
              </span>
              {isOverdue && <span className="text-[10px] font-bold text-red-600">OVERDUE</span>}
            </div>
            <p className="text-sm text-[#111] font-medium mb-2">{followup.reason}</p>
            <div className="flex items-center gap-4 text-xs text-[#667085]">
              <span>Last touch: {formatTime(followup.lastActivity)}</span>
              <span>Calls: {followup.callAttempts} • Texts: {followup.textAttempts}</span>
              <span className={followup.firstResponseTime === 'No response yet' ? 'text-red-500 font-medium' : ''}>
                First response: {followup.firstResponseTime}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button className="px-3 py-1.5 bg-[#111] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              Call Now
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleGenerateScript(followup);
              }}
              className="px-3 py-1.5 border border-[#EAECEF] text-[#111] rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors hidden md:flex items-center gap-2"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Generate Script
            </button>
            <button 
              onClick={() => setSelectedFollowup(followup)}
              className="px-3 py-1.5 text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
            >
              View Conversation
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setActiveOutcomeMenu(activeOutcomeMenu === followup.id ? null : followup.id)}
                className={`p-1.5 rounded-lg transition-colors ${activeOutcomeMenu === followup.id ? 'bg-green-100 text-green-600' : 'text-[#667085] hover:text-green-600 hover:bg-green-50'}`}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              {activeOutcomeMenu === followup.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-30 py-1 overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#667085] uppercase border-b border-[#EAECEF] mb-1">Select Outcome</div>
                  {TASK_OUTCOMES[followup.taskType].map(outcome => (
                    <button
                      key={outcome}
                      onClick={() => handleMarkCompleted(followup.id, outcome)}
                      className="w-full px-3 py-2 text-left text-xs text-[#111] hover:bg-gray-50 transition-colors"
                    >
                      {outcome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="bg-white border-b border-[#EAECEF] px-8 py-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-[#111] mb-1">Follow-up Tasks</h1>
              <p className="text-sm text-[#667085]">All tasks that require action—generated from leads, calls, and messages.</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-[#667085] font-medium mr-2">Today: {counts.total} tasks</span>
                <button onClick={() => setPriorityFilter(priorityFilter === 'Urgent' ? 'All' : 'Urgent')} className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${priorityFilter === 'Urgent' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>{counts.urgent} Urgent</button>
                <button onClick={() => setPriorityFilter(priorityFilter === 'Important' ? 'All' : 'Important')} className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${priorityFilter === 'Important' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}>{counts.important} Important</button>
                <button onClick={() => setPriorityFilter(priorityFilter === 'Normal' ? 'All' : 'Normal')} className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${priorityFilter === 'Normal' ? 'bg-gray-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{counts.normal} Normal</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085]"><option>Last 7 days</option></select>
              <button className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#667085] hover:bg-gray-50">Refresh</button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-xs font-medium text-blue-700 mb-1">Open Task</div>
              <div className="text-2xl font-semibold text-blue-900">{openFollowups.length}</div>
            </div>
            <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-xs font-medium text-red-700 mb-1">Overdue Task</div>
              <div className="text-2xl font-semibold text-red-900">{overdueFollowupsCount}</div>
            </div>
            <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-xs font-medium text-green-700 mb-1">Closed Task</div>
              <div className="text-2xl font-semibold text-green-900">{closedTasksCount}</div>
            </div>
          </div>
        </div>
        <div className="bg-white border-b border-[#EAECEF] px-8 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input type="text" placeholder="Search name or number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#EAECEF] rounded-lg text-sm" />
            </div>
            <select className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085]"><option>All Types</option></select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-8">
            {dueTodayItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5 text-orange-600" /><h2 className="text-lg font-semibold text-[#111]">Due Today</h2></div>
                <div className="space-y-3">{dueTodayItems.map(item => renderFollowupRow(item))}</div>
              </div>
            )}
            {overdueItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-[#111]">Overdue</h2></div>
                <div className="space-y-3">{overdueItems.map(item => renderFollowupRow(item, true))}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedFollowup && (
        <div className="w-[480px] bg-white border-l border-[#EAECEF] overflow-y-auto shadow-xl">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-[#EAECEF] sticky top-0 bg-white z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#111] mb-1">{selectedFollowup.contactName}</h2>
                  <div className="flex items-center gap-2 text-sm text-[#667085]">
                    <span>{selectedFollowup.phone}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedFollowup.type === 'Lead' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{selectedFollowup.type}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedFollowup(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-[#667085]" /></button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2 py-1 bg-red-500 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white" /><span className="text-white">{selectedFollowup.priority}</span></div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getTaskTypeColor(selectedFollowup.taskType)}`}>{selectedFollowup.taskType}</span>
              </div>
            </div>
            <div className="p-6 space-y-8 flex-1">
              <section><h3 className="text-sm font-bold text-[#111] uppercase tracking-wider mb-3">What happened</h3><ul className="space-y-2">{selectedFollowup.whatHappened.map((b, i) => (<li key={i} className="flex gap-2 text-sm text-[#667085]"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#EAECEF] shrink-0" />{b}</li>))}</ul></section>
              <section className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3"><ClipboardList className="w-4 h-4 text-blue-600" /><h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Suggested Talk Track</h3></div>
                <ul className="space-y-3">{selectedFollowup.suggestedScript.map((s, i) => (<li key={i} className="flex gap-3 text-sm text-blue-800"><span className="font-bold text-blue-400">{i + 1}.</span>{s}</li>))}</ul>
                <button onClick={() => handleGenerateScript(selectedFollowup)} className="mt-4 w-full py-2 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-100 transition-colors">Generate Script</button>
              </section>
              <section>
                <h3 className="text-sm font-bold text-[#111] uppercase tracking-wider mb-4">Timeline</h3>
                <div className="space-y-4">{selectedFollowup.timeline.map((e, i) => (<div key={i} className="flex gap-4"><div className="flex flex-col items-center"><div className="p-1.5 bg-gray-100 rounded-full">{e.type === 'call' ? <Phone className="w-3 h-3" /> : e.type === 'text' ? <MessageSquare className="w-3 h-3" /> : <FileText className="w-3 h-3" />}</div>{i !== selectedFollowup.timeline.length - 1 && <div className="w-px h-full bg-[#EAECEF] mt-1" />}</div><div><div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-bold text-[#111] uppercase">{e.by}</span></div><p className="text-sm text-[#667085]">{e.content}</p></div></div>))}</div>
              </section>
            </div>
            <div className="p-6 border-t border-[#EAECEF] bg-white sticky bottom-0">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-[#111] text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"><Phone className="w-4 h-4" />Call Now</button>
                <div className="relative">
                  <button onClick={() => setActiveOutcomeMenu(activeOutcomeMenu === selectedFollowup.id ? null : selectedFollowup.id)} className="w-full flex items-center justify-center gap-2 py-3 border border-[#EAECEF] text-[#111] rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"><CheckCircle className="w-4 h-4" />Complete<ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeOutcomeMenu === selectedFollowup.id ? 'rotate-180' : ''}`} /></button>
                  {activeOutcomeMenu === selectedFollowup.id && (
                    <div className="absolute left-0 bottom-full mb-2 w-full bg-white border border-[#EAECEF] rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="px-4 py-2 text-[10px] font-bold text-[#667085] uppercase border-b border-[#EAECEF] bg-gray-50">Select Outcome</div>
                      {TASK_OUTCOMES[selectedFollowup.taskType].map(outcome => (<button key={outcome} onClick={() => handleMarkCompleted(selectedFollowup.id, outcome)} className="w-full px-4 py-3 text-left text-sm text-[#111] hover:bg-green-50 hover:text-green-700 transition-colors border-b border-gray-50 last:border-0">{outcome}</button>))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {scriptModalData && (
        <ScriptBuilderModal isOpen={isScriptModalOpen} onClose={() => setIsScriptModalOpen(false)} leadInfo={scriptModalData} initialScenario={scriptModalData.initialScenario} />
      )}
    </div>
  );
}
