import { useState } from 'react';
import { 
  Search, 
  RefreshCw, 
  Download, 
  ChevronDown, 
  Phone, 
  MessageSquare, 
  Mail, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  Users,
  Inbox,
  Flame,
  X,
  ChevronRight,
  Bell
} from 'lucide-react';
import { AlertsDrawer } from './AlertsDrawer';
import { CompleteAlertModal } from './CompleteAlertModal';
import { OverdueNotification } from './OverdueNotification';

type ViewMode = 'table' | 'queue';
type LeadStatus = 'New' | 'Attempting' | 'Connected' | 'Follow-up Scheduled' | 'Intro Booked' | 'Won' | 'Lost' | 'Nurture';
type LeadOutcome = 'Intro Booked' | 'Self-booked' | 'Invalid Lead' | 'Repetitive Lead' | 'Closed' | '—';

interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  received: string;
  leadAge: string;
  slaDue: string;
  slaStatus: 'within' | 'due-soon' | 'overdue';
  firstCall: string;
  attempts: string;
  lastTouch: string;
  assigned: string;
  status: LeadStatus;
  outcome: LeadOutcome;
  nextStep: string;
  nextStepDue?: string;
  intent?: string;
  objections?: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  id: number;
  type: 'received' | 'call' | 'voicemail' | 'text' | 'store-closed' | 'sla';
  timestamp: string;
  staff?: string;
  outcome?: string;
  summary?: string;
  message?: string;
}

const sampleLeads: Lead[] = [
  {
    id: 1,
    name: 'Erin Bilir',
    phone: '(914) 574-1253',
    email: 'erin.bilir@email.com',
    source: 'Web Lead',
    received: 'Dec 27 4:58 PM',
    leadAge: '2d 1h',
    slaDue: 'Overdue 1d 22h',
    slaStatus: 'overdue',
    firstCall: 'Dec 28 10:51 AM',
    attempts: '1c / 0t',
    lastTouch: 'Dec 28 10:51 AM',
    assigned: 'Adriana',
    status: 'Follow-up Scheduled',
    outcome: '—',
    nextStep: 'Call back today 4:00 PM',
    nextStepDue: '4:00 PM',
    intent: 'Interested in morning classes, asked about intro pricing',
    objections: 'Schedule conflicts with work meetings',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 27 4:58 PM', summary: 'Lead received from website contact form' },
      { id: 2, type: 'sla', timestamp: 'Dec 27 6:58 PM', summary: 'Response time (business hours): 15h 53m' },
      { id: 3, type: 'call', timestamp: 'Dec 28 10:51 AM', staff: 'Adriana', outcome: 'Left VM', summary: 'Called prospect. No answer. Left voicemail with intro class times and $12 offer. Mentioned flexible scheduling options.' },
      { id: 4, type: 'voicemail', timestamp: 'Dec 28 10:51 AM', staff: 'Adriana', summary: 'Voicemail: "Hi Erin, this is Adriana from Orange Theory. Saw you were interested in our intro class. We have morning slots at 6am, 7am, and 9am that work great for busy schedules. Call me back at..."' },
    ]
  },
  {
    id: 2,
    name: 'Marina Lancellotta',
    phone: '(703) 915-9451',
    email: 'marina.l@email.com',
    source: 'Web Lead',
    received: 'Dec 26 11:21 AM',
    leadAge: '3d 6h',
    slaDue: 'Within SLA',
    slaStatus: 'within',
    firstCall: 'Dec 27 10:49 AM',
    attempts: '2c / 1t',
    lastTouch: 'Dec 28 1:12 PM',
    assigned: 'Alex',
    status: 'Connected',
    outcome: 'Intro Booked',
    nextStep: 'Confirm intro via text',
    nextStepDue: 'Today 3:00 PM',
    intent: 'Looking to try Orange Theory after friend recommendation',
    objections: 'None identified - hot lead',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 26 11:21 AM', summary: 'Lead received from website form' },
      { id: 2, type: 'sla', timestamp: 'Dec 26 1:21 PM', summary: 'Response time (business hours): 23h 28m' },
      { id: 3, type: 'call', timestamp: 'Dec 27 10:49 AM', staff: 'Alex', outcome: 'Connected', summary: 'Spoke with Marina. Very interested after friend Sarah recommended OTF. Discussed fitness goals (weight loss, strength). Booked intro for Friday 6am class. Will send confirmation text.' },
      { id: 4, type: 'text', timestamp: 'Dec 27 10:52 AM', staff: 'Alex', message: 'Hi Marina! Great talking with you. Your intro class is confirmed for Friday Dec 29 at 6:00 AM. Arrive 15 min early. Reply YES to confirm.', summary: 'Sent intro booking confirmation text' },
      { id: 5, type: 'text', timestamp: 'Dec 28 1:12 PM', staff: 'Alex', message: 'Hi Marina - quick reminder about your intro class tomorrow at 6am! Let me know if you have any questions.', summary: 'Sent reminder text for tomorrow\'s class' },
    ]
  },
  {
    id: 3,
    name: 'Matthew Zaist',
    phone: '(949) 735-0754',
    email: 'mzaist@email.com',
    source: 'Web Lead',
    received: 'Dec 26 10:23 AM',
    leadAge: '3d 7h',
    slaDue: 'Overdue 3d',
    slaStatus: 'overdue',
    firstCall: '—',
    attempts: '0c / 0t',
    lastTouch: '—',
    assigned: 'Unassigned',
    status: 'New',
    outcome: '—',
    nextStep: 'Call now',
    intent: 'General inquiry about memberships',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 26 10:23 AM', summary: 'Lead received from website contact form' },
    ]
  },
  {
    id: 4,
    name: 'Kate Jackson',
    phone: '(512) 847-2193',
    email: 'kate.j@email.com',
    source: 'Referral',
    received: 'Dec 28 9:15 AM',
    leadAge: '1d 8h',
    slaDue: 'Due in 34m',
    slaStatus: 'due-soon',
    firstCall: 'Dec 28 11:22 AM',
    attempts: '1c / 1t',
    lastTouch: 'Dec 28 2:47 PM',
    assigned: 'Olivia',
    status: 'Attempting',
    outcome: 'Attempted',
    nextStep: 'Follow-up call tomorrow AM',
    nextStepDue: 'Tomorrow 9:00 AM',
    intent: 'Referred by member Jessica. Interested in trying class before committing',
    objections: 'Price sensitivity - asked about discounts',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 28 9:15 AM', summary: 'Lead received via member referral (Jessica Smith)' },
      { id: 2, type: 'sla', timestamp: 'Dec 28 11:15 AM', summary: 'Response time (business hours): 2h 7m' },
      { id: 3, type: 'call', timestamp: 'Dec 28 11:22 AM', staff: 'Olivia', outcome: 'No Answer', summary: 'Called Kate. No answer, no voicemail available. Will try text outreach.' },
      { id: 4, type: 'text', timestamp: 'Dec 28 2:47 PM', staff: 'Olivia', message: 'Hi Kate! This is Olivia from Orange Theory. Jessica mentioned you might be interested in trying a class. We have intro slots this week for just $12. When works for you?', summary: 'Sent intro offer via text' },
    ]
  },
  {
    id: 5,
    name: 'Sarah Mitchell',
    phone: '(617) 332-8841',
    email: 'sarah.m@email.com',
    source: 'Walk-in',
    received: 'Dec 27 2:30 PM',
    leadAge: '2d 3h',
    slaDue: 'Within SLA',
    slaStatus: 'within',
    firstCall: 'Dec 27 2:30 PM',
    attempts: '1c / 0t',
    lastTouch: 'Dec 27 2:45 PM',
    assigned: 'Adriana',
    status: 'Intro Booked',
    outcome: 'Intro Booked',
    nextStep: 'Class scheduled for Dec 30',
    nextStepDue: 'Dec 30 7:00 AM',
    intent: 'Walked in after seeing studio. Ready to try class',
    objections: 'None - hot walk-in',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 27 2:30 PM', summary: 'Walk-in lead - came into studio' },
      { id: 2, type: 'call', timestamp: 'Dec 27 2:30 PM', staff: 'Adriana', outcome: 'Connected', summary: 'Met with Sarah in person. Very enthusiastic. Works nearby and walks by studio daily. Booked intro for Saturday 7am. Captured credit card for $12 intro.' },
    ]
  },
  {
    id: 6,
    name: 'David Chen',
    phone: '(415) 892-3344',
    email: 'dchen@email.com',
    source: 'ClassPass',
    received: 'Dec 28 8:45 AM',
    leadAge: '1d 9h',
    slaDue: 'Due in 1h 12m',
    slaStatus: 'due-soon',
    firstCall: '—',
    attempts: '0c / 1t',
    lastTouch: 'Dec 28 3:20 PM',
    assigned: 'Alex',
    status: 'Attempting',
    outcome: 'No Response',
    nextStep: 'Call tomorrow if no text reply',
    nextStepDue: 'Tomorrow 10:00 AM',
    intent: 'ClassPass trial - may convert to membership',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 28 8:45 AM', summary: 'ClassPass trial booking' },
      { id: 2, type: 'text', timestamp: 'Dec 28 3:20 PM', staff: 'Alex', message: 'Hi David! Saw you booked through ClassPass. If you love the workout we have a special offer for ClassPass members - first month 50% off. Want to chat about it?', summary: 'Sent ClassPass conversion offer' },
    ]
  },
  {
    id: 7,
    name: 'Jessica Rodriguez',
    phone: '(305) 774-2891',
    email: 'jrodriguez@email.com',
    source: 'Web Lead',
    received: 'Dec 25 3:12 PM',
    leadAge: '4d 2h',
    slaDue: 'Overdue 3d 23h',
    slaStatus: 'overdue',
    firstCall: 'Dec 26 9:30 AM',
    attempts: '3c / 2t',
    lastTouch: 'Dec 28 11:15 AM',
    assigned: 'Olivia',
    status: 'Nurture',
    outcome: 'No Response',
    nextStep: 'Final text on Jan 2',
    nextStepDue: 'Jan 2 10:00 AM',
    intent: 'Interest expressed but not responding to outreach',
    objections: 'Unresponsive after multiple attempts',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 25 3:12 PM', summary: 'Lead from website form' },
      { id: 2, type: 'call', timestamp: 'Dec 26 9:30 AM', staff: 'Olivia', outcome: 'Left VM', summary: 'No answer. Left voicemail with intro offer.' },
      { id: 3, type: 'text', timestamp: 'Dec 26 2:15 PM', staff: 'Olivia', message: 'Hi Jessica! Saw your interest in Orange Theory. We have intro classes this week - when works for you?', summary: 'First text outreach' },
      { id: 4, type: 'call', timestamp: 'Dec 27 10:45 AM', staff: 'Olivia', outcome: 'No Answer', summary: 'Second call attempt. No answer.' },
      { id: 5, type: 'call', timestamp: 'Dec 28 11:15 AM', staff: 'Olivia', outcome: 'Left VM', summary: 'Third attempt. Left final voicemail with deadline offer.' },
      { id: 6, type: 'text', timestamp: 'Dec 28 11:20 AM', staff: 'Olivia', message: 'Hi Jessica - last call! Our $12 intro offer ends this week. Let me know if you want to grab a spot before then!', summary: 'Urgency-based follow-up text' },
    ]
  },
  {
    id: 8,
    name: 'Emily Watson',
    phone: '(206) 445-7723',
    email: 'ewatson@email.com',
    source: 'Corporate',
    received: 'Dec 28 1:20 PM',
    leadAge: '1d 4h',
    slaDue: 'Within SLA',
    slaStatus: 'within',
    firstCall: 'Dec 28 3:15 PM',
    attempts: '1c / 0t',
    lastTouch: 'Dec 28 3:15 PM',
    assigned: 'Alex',
    status: 'Connected',
    outcome: 'Intro Booked',
    nextStep: 'Send corporate discount info',
    nextStepDue: 'Dec 29 9:00 AM',
    intent: 'Corporate wellness program participant',
    objections: 'None - corporate partner',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 28 1:20 PM', summary: 'Corporate wellness program lead from Amazon partnership' },
      { id: 2, type: 'sla', timestamp: 'Dec 28 3:20 PM', summary: 'Response time (business hours): 1h 55m' },
      { id: 3, type: 'call', timestamp: 'Dec 28 3:15 PM', staff: 'Alex', outcome: 'Connected', summary: 'Spoke with Emily. Part of Amazon corporate wellness program. Booked intro for Monday 6pm. Discussed 20% corporate discount on memberships. Very engaged and ready to commit after trial.' },
    ]
  },
  {
    id: 9,
    name: 'Michael Torres',
    phone: '(713) 228-5569',
    email: 'mtorres@email.com',
    source: 'Web Lead',
    received: 'Dec 27 6:45 PM',
    leadAge: '2d 11m',
    slaDue: 'Overdue 1d',
    slaStatus: 'overdue',
    firstCall: '—',
    attempts: '0c / 0t',
    lastTouch: '—',
    assigned: 'Unassigned',
    status: 'New',
    outcome: '—',
    nextStep: 'Assign and call immediately',
    intent: 'Evening inquiry - likely after-work schedule preference',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 27 6:45 PM', summary: 'Lead received from website form after business hours' },
      { id: 2, type: 'store-closed', timestamp: 'Dec 27 6:45 PM - Dec 28 5:00 AM', summary: 'Store closed overnight' },
    ]
  },
  {
    id: 10,
    name: 'Amanda Foster',
    phone: '(404) 667-3321',
    email: 'afoster@email.com',
    source: 'Referral',
    received: 'Dec 28 10:30 AM',
    leadAge: '1d 7h',
    slaDue: 'Within SLA',
    slaStatus: 'within',
    firstCall: 'Dec 28 11:45 AM',
    attempts: '2c / 1t',
    lastTouch: 'Dec 28 4:30 PM',
    assigned: 'Adriana',
    status: 'Follow-up Scheduled',
    outcome: 'Attempted',
    nextStep: 'Call back Wed at 6pm',
    nextStepDue: 'Dec 30 6:00 PM',
    intent: 'Referred by member. Interested but needs to check schedule',
    objections: 'Travel schedule - out of town until Wed',
    timeline: [
      { id: 1, type: 'received', timestamp: 'Dec 28 10:30 AM', summary: 'Lead from member referral (Maria Jones)' },
      { id: 2, type: 'sla', timestamp: 'Dec 28 12:30 PM', summary: 'Response time (business hours): 1h 15m' },
      { id: 3, type: 'call', timestamp: 'Dec 28 11:45 AM', staff: 'Adriana', outcome: 'Connected', summary: 'Spoke briefly with Amanda. Traveling until Wednesday. Interested in trying class but needs to check work calendar first. Agreed to follow-up call Wednesday evening.' },
      { id: 4, type: 'call', timestamp: 'Dec 28 4:30 PM', staff: 'Adriana', outcome: 'Left VM', summary: 'Follow-up call. No answer. Left voicemail confirming Wed 6pm callback.' },
      { id: 5, type: 'text', timestamp: 'Dec 28 4:32 PM', staff: 'Adriana', message: 'Hi Amanda! Looking forward to connecting Wed at 6pm. Travel safe!', summary: 'Confirmation text sent' },
    ]
  },
];

export function LeadTracker({ onPageChange }: { onPageChange?: (page: string) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(sampleLeads[3]); // Kate Jackson selected by default
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignedFilter, setAssignedFilter] = useState('All');
  const [slaFilter, setSlaFilter] = useState('All');
  const [toggleOverdue, setToggleOverdue] = useState(false);
  const [toggleNoAttempts, setToggleNoAttempts] = useState(false);
  const [toggleHot, setToggleHot] = useState(false);
  const [toggleBooked, setToggleBooked] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(sampleLeads);
  
  // Alert System State
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAlertToComplete, setSelectedAlertToComplete] = useState<{ id: number; name: string } | null>(null);
  
  // Overdue Notification State
  const [showOverdueNotification, setShowOverdueNotification] = useState(false);

  // Mock overdue alerts data (based on leads with no contact attempts within SLA)
  const [alerts, setAlerts] = useState([
    { id: 1, leadName: 'Kate Jackson', phone: '(215) 866-****', source: 'Web Lead', overdueBy: '3h 12m', assigned: null, attempts: '0c / 0t', leadId: 4 },
    { id: 2, leadName: 'Matthew Zaist', phone: '(949) 735-****', source: 'Web Lead', overdueBy: '2h 40m', assigned: 'Adriana', attempts: '1c / 0t', leadId: 3 },
    { id: 3, leadName: 'Melissa Sullivan', phone: '(718) 442-****', source: 'Web Lead', overdueBy: '2h 05m', assigned: null, attempts: '0c / 0t', leadId: 11 },
    { id: 4, leadName: 'Ciaran O\'Brien', phone: '(303) 889-****', source: 'Web Lead', overdueBy: '1h 55m', assigned: 'Alex', attempts: '0c / 1t', leadId: 12 },
    { id: 5, leadName: 'Holly Edelstein', phone: '(206) 771-****', source: 'Web Lead', overdueBy: '1h 31m', assigned: 'Alex', attempts: '2c / 0t', leadId: 13 },
  ]);

  const handleCompleteAlert = (alertId: number) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlertToComplete({ id: alertId, name: alert.leadName });
      setIsCompleteModalOpen(true);
    }
  };

  const confirmCompleteAlert = () => {
    if (selectedAlertToComplete) {
      setAlerts(alerts.filter(a => a.id !== selectedAlertToComplete.id));
      setIsCompleteModalOpen(false);
      setSelectedAlertToComplete(null);
    }
  };

  const handleOpenLead = (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setSelectedLead(lead);
      setIsAlertsOpen(false);
    }
  };

  // Notification handlers
  const handleNotificationClose = () => {
    // Add Erin Bilir to alerts when Close is clicked
    const newAlert = {
      id: alerts.length + 1, // Generate new ID
      leadName: 'Erin Bilir',
      phone: '(914) 574-****',
      source: 'Web Lead',
      overdueBy: '1d 22h',
      assigned: 'Adriana',
      attempts: '1c / 0t',
      leadId: 1
    };
    setAlerts([...alerts, newAlert]);
    setShowOverdueNotification(false);
  };

  const handleNotificationComplete = (outcome: string) => {
    // Handle the completion with the selected outcome
    console.log(`Lead completed with outcome: ${outcome}`);
    setShowOverdueNotification(false);
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (searchQuery && !lead.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !lead.phone.includes(searchQuery) && !lead.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (sourceFilter !== 'All' && lead.source !== sourceFilter) return false;
    if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
    if (assignedFilter !== 'All' && lead.assigned !== assignedFilter) return false;
    if (slaFilter !== 'All') {
      if (slaFilter === 'Within SLA' && lead.slaStatus !== 'within') return false;
      if (slaFilter === 'Due soon' && lead.slaStatus !== 'due-soon') return false;
      if (slaFilter === 'Overdue' && lead.slaStatus !== 'overdue') return false;
    }
    if (toggleOverdue && lead.slaStatus !== 'overdue') return false;
    if (toggleNoAttempts && lead.attempts !== '0c / 0t') return false;
    if (toggleHot && lead.slaStatus !== 'due-soon') return false;
    if (toggleBooked && lead.outcome !== 'Intro Booked') return false;
    return true;
  });

  // Work queue buckets
  const overdueLeads = leads.filter(l => l.slaStatus === 'overdue');
  const dueSoonLeads = leads.filter(l => l.slaStatus === 'due-soon');
  const noAttemptsLeads = leads.filter(l => l.attempts === '0c / 0t');
  const hotLeads = leads.filter(l => l.outcome === 'Intro Booked' || l.status === 'Connected');

  const handleOutcomeChange = (leadId: number, newOutcome: LeadOutcome) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, outcome: newOutcome } : lead
      )
    );
    // Also update selected lead if it's the one being changed
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, outcome: newOutcome });
    }
  };

  const handleAssignedChange = (leadId: number, newAssigned: string) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, assigned: newAssigned } : lead
      )
    );
    // Also update selected lead if it's the one being changed
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, assigned: newAssigned });
    }
  };

  const isClosedLead = (outcome: LeadOutcome) => {
    return outcome === 'Invalid Lead' || outcome === 'Repetitive Lead' || outcome === 'Closed';
  };

  const getSLABadgeColor = (status: string) => {
    if (status === 'within') return 'bg-green-100 text-green-700';
    if (status === 'due-soon') return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      'New': 'bg-gray-100 text-gray-700',
      'Attempting': 'bg-blue-100 text-blue-700',
      'Connected': 'bg-green-100 text-green-700',
      'Follow-up Scheduled': 'bg-purple-100 text-purple-700',
      'Intro Booked': 'bg-green-100 text-green-700',
      'Won': 'bg-green-100 text-green-700',
      'Lost': 'bg-red-100 text-red-700',
      'Nurture': 'bg-amber-100 text-amber-700',
    };
    return colors[status];
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#111] mb-2">Lead Tracker</h1>
            <p className="text-sm text-[#667085]">Track lead response times and conversion outcomes</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Alerts Button */}
            <button 
              onClick={() => setIsAlertsOpen(true)}
              className="relative px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] hover:bg-gray-50 flex items-center gap-2 group"
              title="Overdue follow-up tasks (SLA: 2 hours)"
            >
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </button>

            <button className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] hover:bg-gray-50 flex items-center gap-2">
              Last 14 Days
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="p-2 border border-[#EAECEF] rounded-lg text-[#667085] hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 border border-[#EAECEF] rounded-lg text-[#667085] hover:bg-gray-50">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Inbox className="w-4 h-4 text-[#667085]" />
              <span className="text-sm text-[#667085]">Leads Received</span>
            </div>
            <div className="text-3xl font-semibold text-[#111] mb-1">105</div>
            <p className="text-xs text-[#667085]">in selected period</p>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-[#667085]">Contacted Within SLA</span>
            </div>
            <div className="text-3xl font-semibold text-green-600 mb-1">62%</div>
            <p className="text-xs text-[#667085]">SLA = 2 hours</p>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-[#667085]">Avg Time to First Call</span>
            </div>
            <div className="text-3xl font-semibold text-[#111] mb-1">3h 18m</div>
            <p className="text-xs text-[#667085]">business hours</p>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-[#667085]">Overdue Leads</span>
            </div>
            <div className="text-3xl font-semibold text-red-600 mb-1">19</div>
            <p className="text-xs text-[#667085]">needs follow-up</p>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && showAlertBanner && (
        <div className="bg-red-50 border-b border-red-200 px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">
                {alerts.length} overdue lead{alerts.length > 1 ? 's' : ''} need{alerts.length > 1 ? '' : 's'} follow-up
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onPageChange?.('followups')}
                className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                View alerts
              </button>
              <button
                onClick={() => setShowOverdueNotification(true)}
                className="px-4 py-1.5 border border-red-300 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Test button for an overdue lead
              </button>
              <button
                onClick={() => setShowAlertBanner(false)}
                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#667085]" />
            <input
              type="text"
              placeholder="Search name, phone, email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <select 
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Web Lead</option>
            <option>Walk-in</option>
            <option>Referral</option>
            <option>ClassPass</option>
            <option>Corporate</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>New</option>
            <option>Attempting</option>
            <option>Connected</option>
            <option>Follow-up Scheduled</option>
            <option>Intro Booked</option>
            <option>Won</option>
            <option>Lost</option>
            <option>Nurture</option>
          </select>

          <select 
            value={assignedFilter}
            onChange={(e) => setAssignedFilter(e.target.value)}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Adriana</option>
            <option>Alex</option>
            <option>Olivia</option>
            <option>Unassigned</option>
          </select>

          <select 
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value)}
            className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500"
          >
            <option>All</option>
            <option>Within SLA</option>
            <option>Due soon</option>
            <option>Overdue</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setToggleOverdue(!toggleOverdue)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                toggleOverdue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setToggleNoAttempts(!toggleNoAttempts)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                toggleNoAttempts ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              No Attempts
            </button>
            <button
              onClick={() => setToggleHot(!toggleHot)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                toggleHot ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              Hot
            </button>
            <button
              onClick={() => setToggleBooked(!toggleBooked)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                toggleBooked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#667085]'
              }`}
            >
              Booked
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#667085] mr-2">View:</span>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table' ? 'bg-[#111] text-white' : 'bg-white border border-[#EAECEF] text-[#667085] hover:bg-gray-50'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode('queue')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'queue' ? 'bg-[#111] text-white' : 'bg-white border border-[#EAECEF] text-[#667085] hover:bg-gray-50'
            }`}
          >
            Work Queue
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Table View */}
        {viewMode === 'table' && (
          <>
            <div className="flex-1 overflow-auto px-8 py-6">
              <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-[#EAECEF] sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Lead</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Received</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Lead Age</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">SLA Due</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">First Call</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Attempts</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Last Touch</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Assigned</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]">Outcome</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-[#667085]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, idx) => (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`border-b border-[#EAECEF] cursor-pointer transition-colors ${
                          isClosedLead(lead.outcome) 
                            ? 'bg-gray-200 hover:bg-gray-300 opacity-60' 
                            : `${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} ${selectedLead?.id === lead.id ? 'bg-blue-50 hover:bg-blue-50' : 'hover:bg-gray-50'}`
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-[#111]">{lead.name}</div>
                          <div className="text-xs text-[#667085]">{lead.phone}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#667085]">{lead.received}</td>
                        <td className="px-4 py-3 text-sm text-[#667085]">{lead.leadAge}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSLABadgeColor(lead.slaStatus)}`}>
                            {lead.slaDue}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#667085]">{lead.firstCall}</td>
                        <td className="px-4 py-3 text-sm text-[#667085]">{lead.attempts}</td>
                        <td className="px-4 py-3 text-sm text-[#667085]">{lead.lastTouch}</td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.assigned}
                            onChange={(e) => handleAssignedChange(lead.id, e.target.value)}
                            className="w-full px-2 py-1 border border-[#EAECEF] rounded text-xs text-[#667085] focus:outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="Unassigned">Unassigned</option>
                            <option value="Adriana">Adriana</option>
                            <option value="Alex">Alex</option>
                            <option value="Olivia">Olivia</option>
                          </select>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.outcome}
                            onChange={(e) => handleOutcomeChange(lead.id, e.target.value as LeadOutcome)}
                            className="w-full px-2 py-1 border border-[#EAECEF] rounded text-xs text-[#667085] focus:outline-none focus:border-blue-500 bg-white"
                          >
                            <option value="—">—</option>
                            <option value="Intro Booked">Intro Booked</option>
                            <option value="Self-booked">Self-booked</option>
                            <option value="Invalid Lead">Invalid Lead</option>
                            <option value="Repetitive Lead">Repetitive Lead</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-700">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detail Drawer */}
            {selectedLead && (
              <div className="w-[480px] bg-white border-l border-[#EAECEF] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#111] mb-1">{selectedLead.name}</h2>
                      <div className="text-sm text-[#667085] mb-2">
                        <div>{selectedLead.phone}</div>
                        <div>{selectedLead.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {selectedLead.source}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-6">
                    <button className="flex-1 px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] hover:bg-gray-50">
                      Create Follow-up
                    </button>
                    <select className="flex-1 px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500">
                      <option>Assign to staff</option>
                      <option>Adriana</option>
                      <option>Alex</option>
                      <option>Olivia</option>
                    </select>
                  </div>

                  {/* AI Summary */}
                  {selectedLead.intent && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-sm font-semibold text-[#111] mb-3">Quick Summary (AI)</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-[#111]">Intent:</span>{' '}
                          <span className="text-[#667085]">{selectedLead.intent}</span>
                        </div>
                        {selectedLead.objections && (
                          <div>
                            <span className="font-medium text-[#111]">Key objections:</span>{' '}
                            <span className="text-[#667085]">{selectedLead.objections}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-[#111]">Recommended next step:</span>{' '}
                          <span className="text-[#667085]">
                            {selectedLead.nextStep.toLowerCase().includes('call') 
                              ? 'Call within 30 min and offer 2 intro slots'
                              : 'Send confirmation text and prepare intro materials'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#111] mb-4">Lead Timeline</h3>
                    <div className="space-y-4">
                      {selectedLead.timeline.map((event) => (
                        <div key={event.id} className="relative pl-6 pb-4 border-l-2 border-[#EAECEF] last:border-l-0 last:pb-0">
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                          
                          <div className="bg-gray-50 border border-[#EAECEF] rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {event.type === 'call' && <Phone className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'text' && <MessageSquare className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'voicemail' && <Mail className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'received' && <Inbox className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'sla' && <Clock className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'store-closed' && <X className="w-3 h-3 text-[#667085]" />}
                                <span className="text-xs font-medium text-[#111]">
                                  {event.type === 'call' && 'Outbound Call'}
                                  {event.type === 'text' && 'Text Message'}
                                  {event.type === 'voicemail' && 'Voicemail'}
                                  {event.type === 'received' && 'Lead Received'}
                                  {event.type === 'sla' && 'SLA Timer'}
                                  {event.type === 'store-closed' && 'Store Closed'}
                                </span>
                              </div>
                              <span className="text-xs text-[#667085]">{event.timestamp}</span>
                            </div>
                            {event.staff && (
                              <div className="text-xs text-[#667085] mb-2">by {event.staff}</div>
                            )}
                            {event.outcome && (
                              <div className="mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  event.outcome === 'Connected' ? 'bg-green-100 text-green-700' :
                                  event.outcome === 'Left VM' ? 'bg-amber-100 text-amber-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {event.outcome}
                                </span>
                              </div>
                            )}
                            {event.summary && (
                              <p className="text-xs text-[#667085] leading-relaxed">{event.summary}</p>
                            )}
                            {event.message && (
                              <div className="mt-2 p-2 bg-white border border-[#EAECEF] rounded text-xs text-[#667085] italic">
                                "{event.message}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Step */}
                  <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#111] mb-3">Next Step</h3>
                    <select className="w-full px-4 py-2 border border-[#EAECEF] rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500">
                      <option>Call back</option>
                      <option>Text follow-up</option>
                      <option>Book intro</option>
                      <option>Mark lost</option>
                    </select>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2 border border-[#EAECEF] rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500"
                    />
                    <button className="w-full px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Work Queue View */}
        {viewMode === 'queue' && (
          <>
            <div className="flex-1 overflow-auto px-8 py-6">
              <div className="grid grid-cols-4 gap-4">
                {/* Overdue Bucket */}
                <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden">
                  <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-red-700">Overdue</h3>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                        {overdueLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {overdueLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white border border-[#EAECEF] rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
                          selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-[#111] mb-1">{lead.name}</div>
                        <div className="text-xs text-[#667085] mb-2">{lead.phone}</div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#667085]">Age: {lead.leadAge}</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                            {lead.slaDue}
                          </span>
                        </div>
                        <div className="text-xs text-[#667085]">
                          Last: {lead.lastTouch || 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Due Soon Bucket */}
                <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden">
                  <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-amber-700">Due Soon (&lt;2h)</h3>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                        {dueSoonLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {dueSoonLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white border border-[#EAECEF] rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
                          selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-[#111] mb-1">{lead.name}</div>
                        <div className="text-xs text-[#667085] mb-2">{lead.phone}</div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#667085]">Age: {lead.leadAge}</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                            {lead.slaDue}
                          </span>
                        </div>
                        <div className="text-xs text-[#667085]">
                          Last: {lead.lastTouch || 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* No Attempts Bucket */}
                <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden">
                  <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-blue-700">No Attempts</h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {noAttemptsLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {noAttemptsLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white border border-[#EAECEF] rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
                          selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-[#111] mb-1">{lead.name}</div>
                        <div className="text-xs text-[#667085] mb-2">{lead.phone}</div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#667085]">Age: {lead.leadAge}</span>
                          <span className={`px-2 py-0.5 rounded font-medium ${getSLABadgeColor(lead.slaStatus)}`}>
                            {lead.slaDue}
                          </span>
                        </div>
                        <div className="text-xs text-[#667085]">
                          Last: {lead.lastTouch || 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hot Leads Bucket */}
                <div className="bg-white border border-[#EAECEF] rounded-lg overflow-hidden">
                  <div className="bg-green-50 border-b border-green-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-green-700">Hot Leads</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {hotLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                    {hotLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white border border-[#EAECEF] rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors ${
                          selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-sm font-medium text-[#111] mb-1">{lead.name}</div>
                        <div className="text-xs text-[#667085] mb-2">{lead.phone}</div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-[#667085]">Age: {lead.leadAge}</span>
                          <span className={`px-2 py-0.5 rounded font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#667085]">
                          Last: {lead.lastTouch || 'Never'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Drawer (same as table view) */}
            {selectedLead && (
              <div className="w-[480px] bg-white border-l border-[#EAECEF] overflow-y-auto">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-[#111] mb-1">{selectedLead.name}</h2>
                      <div className="text-sm text-[#667085] mb-2">
                        <div>{selectedLead.phone}</div>
                        <div>{selectedLead.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {selectedLead.source}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-6">
                    <button className="flex-1 px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] hover:bg-gray-50">
                      Create Follow-up
                    </button>
                    <select className="flex-1 px-4 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500">
                      <option>Assign to staff</option>
                      <option>Adriana</option>
                      <option>Alex</option>
                      <option>Olivia</option>
                    </select>
                  </div>

                  {/* AI Summary */}
                  {selectedLead.intent && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="text-sm font-semibold text-[#111] mb-3">Quick Summary (AI)</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-[#111]">Intent:</span>{' '}
                          <span className="text-[#667085]">{selectedLead.intent}</span>
                        </div>
                        {selectedLead.objections && (
                          <div>
                            <span className="font-medium text-[#111]">Key objections:</span>{' '}
                            <span className="text-[#667085]">{selectedLead.objections}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-[#111]">Recommended next step:</span>{' '}
                          <span className="text-[#667085]">
                            {selectedLead.nextStep.toLowerCase().includes('call') 
                              ? 'Call within 30 min and offer 2 intro slots'
                              : 'Send confirmation text and prepare intro materials'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#111] mb-4">Lead Timeline</h3>
                    <div className="space-y-4">
                      {selectedLead.timeline.map((event) => (
                        <div key={event.id} className="relative pl-6 pb-4 border-l-2 border-[#EAECEF] last:border-l-0 last:pb-0">
                          <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                          
                          <div className="bg-gray-50 border border-[#EAECEF] rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {event.type === 'call' && <Phone className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'text' && <MessageSquare className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'voicemail' && <Mail className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'received' && <Inbox className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'sla' && <Clock className="w-3 h-3 text-[#667085]" />}
                                {event.type === 'store-closed' && <X className="w-3 h-3 text-[#667085]" />}
                                <span className="text-xs font-medium text-[#111]">
                                  {event.type === 'call' && 'Outbound Call'}
                                  {event.type === 'text' && 'Text Message'}
                                  {event.type === 'voicemail' && 'Voicemail'}
                                  {event.type === 'received' && 'Lead Received'}
                                  {event.type === 'sla' && 'SLA Timer'}
                                  {event.type === 'store-closed' && 'Store Closed'}
                                </span>
                              </div>
                              <span className="text-xs text-[#667085]">{event.timestamp}</span>
                            </div>
                            {event.staff && (
                              <div className="text-xs text-[#667085] mb-2">by {event.staff}</div>
                            )}
                            {event.outcome && (
                              <div className="mb-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  event.outcome === 'Connected' ? 'bg-green-100 text-green-700' :
                                  event.outcome === 'Left VM' ? 'bg-amber-100 text-amber-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {event.outcome}
                                </span>
                              </div>
                            )}
                            {event.summary && (
                              <p className="text-xs text-[#667085] leading-relaxed">{event.summary}</p>
                            )}
                            {event.message && (
                              <div className="mt-2 p-2 bg-white border border-[#EAECEF] rounded text-xs text-[#667085] italic">
                                "{event.message}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Step */}
                  <div className="bg-white border border-[#EAECEF] rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-[#111] mb-3">Next Step</h3>
                    <select className="w-full px-4 py-2 border border-[#EAECEF] rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500">
                      <option>Call back</option>
                      <option>Text follow-up</option>
                      <option>Book intro</option>
                      <option>Mark lost</option>
                    </select>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-2 border border-[#EAECEF] rounded-lg text-sm mb-3 focus:outline-none focus:border-blue-500"
                    />
                    <button className="w-full px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Alerts Drawer */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onComplete={handleCompleteAlert}
        onOpenLead={handleOpenLead}
      />

      {/* Complete Alert Modal */}
      <CompleteAlertModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={confirmCompleteAlert}
        leadName={selectedAlertToComplete?.name || ''}
      />

      {/* Overdue Notification Toast */}
      <OverdueNotification
        isVisible={showOverdueNotification}
        leadName="Erin Bilir"
        onComplete={handleNotificationComplete}
        onClose={handleNotificationClose}
      />
    </div>
  );
}