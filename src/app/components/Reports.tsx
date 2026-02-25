import React, { useState } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown, 
  Mail, 
  Clock, 
  User, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CheckCircle2,
  PhoneMissed,
  PhoneCall,
  UserPlus,
  ShoppingBag,
  History,
  ShieldAlert,
  ArrowRight,
  Flag,
  FileText as FileIcon,
  CheckSquare
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ReportsProps {
  initialTab?: 'daily' | 'weekly' | 'monthly';
  onPageChange?: (page: string) => void;
}

export function Reports({ initialTab = 'daily', onPageChange }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>(initialTab);
  const [viewMode, setViewMode] = useState<'email' | 'in-app'>('email');
  const [compareEnabled, setCompareEnabled] = useState(true);

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  const dateLabel = activeTab === 'weekly' ? 'Week of Jan 13–Jan 19' : (activeTab === 'monthly' ? 'January 2026' : 'Wed, Jan 22');

  const handleTabChange = (tab: 'daily' | 'weekly' | 'monthly') => {
    setActiveTab(tab);
    if (tab === 'monthly') {
      setViewMode('in-app');
    }
    if (onPageChange) {
      onPageChange(`reports-${tab}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] min-h-screen overflow-y-auto">
      {/* Page Header */}
      <div className="px-8 pt-8 pb-4 bg-white border-b border-[#EAECEF]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111] mb-1">Reports</h1>
            <p className="text-[#667085] text-sm">Action-driven summaries delivered by email + available in-app.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAECEF] rounded-md text-sm text-[#111] cursor-pointer hover:bg-gray-50">
              <Calendar className="w-4 h-4 text-[#667085]" />
              {dateLabel}
              <ChevronDown className="w-4 h-4 text-[#667085]" />
            </div>

            {(activeTab === 'weekly' || activeTab === 'monthly') && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAECEF] rounded-md text-sm cursor-pointer hover:bg-gray-50" onClick={() => setCompareEnabled(!compareEnabled)}>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${compareEnabled ? 'bg-[#111]' : 'bg-[#EAECEF]'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${compareEnabled ? 'left-4.5' : 'left-0.5'}`} />
                </div>
                <span className="text-[#111] font-medium whitespace-nowrap">Compare: Last {activeTab === 'weekly' ? 'week' : 'month'}</span>
              </div>
            )}

            <div className="flex bg-[#F1F3F5] p-1 rounded-lg">
              <button 
                onClick={() => setViewMode('email')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === 'email' ? 'bg-white shadow-sm text-[#111] font-medium' : 'text-[#667085]'}`}
              >
                Email Preview
              </button>
              <button 
                onClick={() => setViewMode('in-app')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${viewMode === 'in-app' ? 'bg-white shadow-sm text-[#111] font-medium' : 'text-[#667085]'}`}
              >
                In-app View
              </button>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-md text-[#667085]">
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <a href="#" className="text-xs text-[#667085] hover:underline flex items-center gap-1">
              Assumptions: Editable
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id 
                  ? 'text-[#111]' 
                  : 'text-[#667085] hover:text-[#111]'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'daily' && (viewMode === 'email' ? <DailyEmailPreview onPageChange={onPageChange} /> : <DailyInAppView />)}
          {activeTab === 'weekly' && (viewMode === 'email' ? <WeeklyEmailPreview onPageChange={onPageChange} /> : <WeeklyInAppView />)}
          {activeTab === 'monthly' && (viewMode === 'email' ? <MonthlyEmailPreview onPageChange={onPageChange} /> : <MonthlyInAppView />)}
        </div>
      </div>
    </div>
  );
}

// --- Daily Components ---

function DailyEmailPreview({ onPageChange }: { onPageChange?: (page: string) => void }) {
  return (
    <div className="bg-gray-100 p-8 rounded-xl border border-gray-200 shadow-inner">
      <div className="bg-white max-w-[900px] mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-[#F8F9FA] p-6 border-b border-[#EAECEF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Subject</div>
              <div className="text-lg font-bold text-[#111]">Devon OTF — Daily Ops Report (Wed, Jan 22)</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Timestamp</div>
              <div className="text-sm text-[#111]">6:05 AM</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-[#667085] mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">From:</span> Retaintive.ai Reports &lt;reports@retaintive.ai&gt;
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">To:</span> Studio Manager
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onPageChange?.('dashboard')} className="bg-[#111] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors">Open Dashboard</button>
            <button onClick={() => onPageChange?.('followups')} className="bg-white border border-[#EAECEF] text-[#111] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">View Follow-up Tasks</button>
          </div>
        </div>

        <div className="p-8">
          <ReportContent isEmail={true} />
          <EmailFooter onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
}

function DailyInAppView() {
  return <div className="max-w-[1000px] mx-auto"><ReportContent isEmail={false} /></div>;
}

// --- Weekly Components ---

function WeeklyEmailPreview({ onPageChange }: { onPageChange?: (page: string) => void }) {
  return (
    <div className="bg-gray-100 p-8 rounded-xl border border-gray-200 shadow-inner">
      <div className="bg-white max-w-[900px] mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-[#F8F9FA] p-6 border-b border-[#EAECEF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Subject</div>
              <div className="text-lg font-bold text-[#111]">Devon OTF — Weekly Ops Report (Jan 13–Jan 19)</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Timestamp</div>
              <div className="text-sm text-[#111]">Mon 6:10 AM</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-[#667085] mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">From:</span> Retaintive.ai Reports &lt;reports@retaintive.ai&gt;
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">To:</span> Studio Manager + Owner
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onPageChange?.('dashboard')} className="bg-[#111] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors">Open Dashboard</button>
            <button onClick={() => onPageChange?.('followups')} className="bg-white border border-[#EAECEF] text-[#111] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">View Follow-up Tasks</button>
            <button onClick={() => onPageChange?.('staff')} className="text-[#667085] px-3 py-2 text-sm font-semibold hover:text-[#111]">View Staff</button>
          </div>
        </div>

        <div className="p-8">
          <WeeklyContent isEmail={true} />
          <EmailFooter onPageChange={onPageChange} includeViewStaff={true} />
        </div>
      </div>
    </div>
  );
}

function WeeklyInAppView() {
  return <div className="max-w-[1000px] mx-auto"><WeeklyContent isEmail={false} /></div>;
}

function WeeklyContent({ isEmail }: { isEmail: boolean }) {
  return (
    <div className="space-y-10">
      {/* A) Weekly Summary */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm">
          <h2 className="text-lg font-bold text-[#111] mb-3">This week vs last week: Intros booked up +18%, but we got slower getting back to leads (+22 minutes on average).</h2>
          <ul className="space-y-2">
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-[#667085] rounded-full mt-1.5 flex-shrink-0" />
              <span>Overdue list got bigger: 19 → 27 leads still need follow-up.</span>
            </li>
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-[#667085] rounded-full mt-1.5 flex-shrink-0" />
              <span>Cancels saved: 11 (about $1,980/month kept).</span>
            </li>
          </ul>
        </div>
      </section>

      {/* B) Weekly Scoreboard */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Weekly Scoreboard</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="Total Calls" value="410" sub="320 inbound / 90 outbound" delta="+6% WoW" />
          <MetricTile label="LEAD CLOSING RATE" value="39.6%" sub="38 of 96 inquiries booked" delta="+10%" positive={true} />
          <MetricTile label="INTROS BOOKED" value="38" sub="Conversion focus" delta="+18%" positive={true} />
          <MetricTile label="MEMBER CHANGES" value="66" sub="Sales: 22 | Up: 8 | Down: 5 | Freeze: 31" />
          <MetricTile label="Avg Lead Response Time" value="1h 12m" sub="Goal: under 15 minutes." helper="Average time to first call/text after a lead comes in." delta="+22 min slower" positive={false} />
          <MetricTile label="Called/Texted within 2 hours" value="61%" delta="down from 70% last week" positive={false} />
          <MetricTile label="Follow-up Tasks Due" value="144" delta="+12" />
          <MetricTile label="CANCELLATION REQUESTS" value="29" sub="Saves completed: 11 ($1,980 Retained)" delta="+4" positive={false} />
        </div>
      </section>

      {/* C) Weekly Theme (System-generated) */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm border-l-4 border-l-[#111]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">Weekly Theme (System Flag)</div>
              <h2 className="text-lg font-bold text-[#111]">FOLLOW-UP TOO SLOW</h2>
            </div>
            <div className="bg-[#111] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">System Label</div>
          </div>
          <p className="text-sm text-[#667085]">We took longer to call/text leads this week. The overdue list grew because some leads didn’t get followed up fast enough (especially in the morning).</p>
        </div>
      </section>

      {/* D) Driver Breakdown */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#111]" />
            <h2 className="text-lg font-bold text-[#111]">Drivers</h2>
          </div>
          <ul className="space-y-3 mb-4">
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111]"><span className="font-bold text-[#111]">Unassigned leads increased:</span> 19 leads had no owner within 15 minutes (+12 WoW)</span>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111]"><span className="font-bold text-[#111]">Slowest response window:</span> 7–10AM average response 2h 05m (vs 1h 10m other hours)</span>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111]"><span className="font-bold text-[#111]">Backlog concentration:</span> Intro-related leads account for 63% of overdue items</span>
            </li>
          </ul>
          <p className="text-[10px] text-[#667085] italic">Drivers are computed from system flags + routing/age/time breakdowns.</p>
        </div>
      </section>

      {/* E) Staff Accountability (Weekly) */}
      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-[#111] rounded-full" />
            <h2 className="text-xl font-bold text-[#111]">Staff Accountability</h2>
          </div>
          <p className="text-[#667085] text-sm ml-3.5">Weekly production + speed + outcomes</p>
        </div>
        
        <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EAECEF]">
            <StaffStat 
              name="Sarah" 
              calls={112} inbound={70} outbound={42}
              responseTime="14m"
              topTypes={[{ label: 'Intro', count: 34 }, { label: 'Service', count: 26 }]}
              booked={14}
              showSpeed={false}
            />
            <StaffStat 
              name="Mike" 
              calls={98} inbound={74} outbound={24}
              responseTime="22m"
              topTypes={[{ label: 'Intro', count: 21 }, { label: 'Cancel', count: 18 }]}
              booked={9}
              showSpeed={false}
            />
            <StaffStat 
              name="Ana" 
              calls={74} inbound={58} outbound={16}
              responseTime="41m"
              topTypes={[{ label: 'Service', count: 22 }, { label: 'Intro', count: 18 }]}
              booked={6}
              flagged={true}
              showSpeed={false}
            />
            <StaffStat 
              name="Jordan" 
              calls={61} inbound={45} outbound={16}
              responseTime="55m"
              topTypes={[{ label: 'Intro', count: 19 }, { label: 'Cancel', count: 11 }]}
              booked={3}
              flagged={true}
              showSpeed={false}
            />
          </div>
          <div className="bg-[#F8F9FA] p-4 border-t border-[#EAECEF] flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-[#667085]" />
            <span className="text-sm font-medium text-[#111]">Manager Note:</span>
            <span className="text-sm text-[#667085]">Focus next week: routing ownership + response speed + consistent outcome logging.</span>
          </div>
        </div>
      </section>

      {/* F) Next Week Action Plan */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Next Week Action Plan</h2>
        </div>
        
        <div className="overflow-x-auto border border-[#EAECEF] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#EAECEF]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider w-[40%]">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider">Due</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider text-right">KPI Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              <ActionPlanRow 
                action="Enable lead routing rule: assign new leads within 15 minutes"
                owner="Manager" due="Mon" kpi="Unassigned leads → <5/week"
              />
              <ActionPlanRow 
                action="Enforce 2-hour follow-up + daily 4pm backlog review"
                owner="Front Desk Lead" due="Daily" kpi="Response rate within 2h → >75%"
              />
              <ActionPlanRow 
                action="Peak window coverage: 7–10AM “follow-up first” block"
                owner="Manager" due="Tue" kpi="Avg response time in window → <45m"
              />
              <ActionPlanRow 
                action="Outcome logging required for all follow-ups (Booked/Not reached/Not interested)"
                owner="Manager" due="Mon" kpi="Outcome logging rate → >85%"
              />
              <ActionPlanRow 
                action="Cancellation save refresher (15 min) + assign save champion"
                owner="Manager" due="Wed" kpi="Save attempts + completion up WoW"
              />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// --- Shared Components ---

function ActionPlanRow({ action, owner, due, kpi }: any) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex gap-3">
          <div className="mt-0.5"><CheckSquare className="w-4 h-4 text-[#667085]" /></div>
          <span className="text-sm font-medium text-[#111] leading-relaxed">{action}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold px-2 py-1 bg-[#F1F3F5] rounded text-[#111]">{owner}</span>
      </td>
      <td className="px-6 py-4 text-sm text-[#111] font-medium">{due}</td>
      <td className="px-6 py-4 text-right">
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
          {kpi}
        </span>
      </td>
    </tr>
  );
}

function EmailFooter({ onPageChange, includeViewStaff }: { onPageChange?: (page: string) => void, includeViewStaff?: boolean }) {
  return (
    <div className="mt-12 pt-8 border-t border-[#EAECEF] text-center">
      <p className="text-[10px] text-[#667085] mb-6 italic max-w-lg mx-auto">
        This report is generated from call logs + follow-up actions. Recommendations are selected from a fixed action library using system flags (not free-form AI).
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => onPageChange?.('dashboard')} className="bg-[#111] text-white px-6 py-2 rounded-md text-sm font-semibold">Open Dashboard</button>
        <button onClick={() => onPageChange?.('followups')} className="bg-white border border-[#EAECEF] text-[#111] px-6 py-2 rounded-md text-sm font-semibold">View Follow-up Tasks</button>
        {includeViewStaff && <button onClick={() => onPageChange?.('staff')} className="text-[#667085] px-4 py-2 text-sm font-semibold">View Staff</button>}
      </div>
      <a href="#" className="text-xs text-[#667085] hover:underline">Edit assumptions</a>
    </div>
  );
}

function ReportContent({ isEmail }: { isEmail: boolean }) {
  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Today's Action</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <ActionCard title="Assign & clear 8 overdue follow-ups" owner="Front Desk Lead (Sarah)" due="12:00 PM" impact="These leads are at risk of going cold." isEmail={isEmail} />
          <ActionCard title="Call back 2 credit card not captured customer" owner="Manager (You)" due="2:00 PM" impact="Immediate revenue opportunity from interested leads." isEmail={isEmail} />
          <ActionCard title="Review 2 cancellation calls + enforce save script" owner="Manager" due="5:00 PM" impact="2 saves today = ~$360 retained MRR (est.)." isEmail={isEmail} />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Daily Scoreboard</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricTile label="Total Calls" value="62" sub="44 inbound / 18 outbound" />
          <MetricTile label="Avg Time to Call Lead" value="14m" sub="Target: < 2h" />
          <MetricTile label="Lead Closing Rate" value="32.4%" sub="12 of 37 leads closed" />
          <MetricTile label="Intros Booked" value="9" sub="Conversion focus" />
          <MetricTile label="Cancellation Requests" value="5" sub="Saves completed: 2 ($298 Retained)" />
          <MetricTile label="Member Changes" value="14" sub="Sales: 4 | Up: 2 | Down: 1 | Freeze: 7" />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#111] rounded-full" />
            <h2 className="text-xl font-bold text-[#111]">Follow-Up Queue</h2>
          </div>
          <div className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">8 overdue / 21 due today — estimated revenue at risk: $1,150</div>
        </div>
        <div className="overflow-x-auto border border-[#EAECEF] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#EAECEF]">
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider">Lead / Member</th>
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider">Last Contact</th>
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider text-center">Owner</th>
                <th className="px-4 py-3 text-xs font-bold text-[#667085] uppercase tracking-wider text-right">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              <QueueRow name="Jamie P." reason="Intro Inquiry" last="Yesterday 3:14 PM" action="Call + offer 6:15PM class slot" owner="Sarah" due="11:00 AM" overdue={true} />
              <QueueRow name="Chris L." reason="Missed Call" last="Today 8:05 AM" action="Text + call back within 30 min" owner="Jordan" due="10:30 AM" overdue={true} />
              <QueueRow name="Morgan S." reason="Cancel Request" last="Today 9:12 AM" action="Run save script: freeze option + goal reset" owner="Manager" due="3:00 PM" />
              <QueueRow name="Alex R." reason="Pricing Inquiry" last="Yesterday 4:22 PM" action="Follow up on membership levels" owner="Sarah" due="11:30 AM" overdue={true} />
              <QueueRow name="Taylor B." reason="Winback" last="2 days ago" action="Offer 'First week back' promo" owner="Mike" due="2:00 PM" />
              <QueueRow name="Sam K." reason="Missed Call" last="Today 7:45 AM" action="Callback - voicemails left" owner="Jordan" due="9:30 AM" overdue={true} />
              <QueueRow name="Pat D." reason="Intro Inquiry" last="Yesterday 5:10 PM" action="Confirm trial booking" owner="Sarah" due="12:00 PM" overdue={true} />
              <QueueRow name="Riley W." reason="Cancel Request" last="Yesterday 2:00 PM" action="Manager follow up on billing complaint" owner="Manager" due="1:00 PM" overdue={true} />
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-6 bg-[#111] rounded-full" />
            <h2 className="text-xl font-bold text-[#111]">Staff Accountability</h2>
          </div>
          <p className="text-[#667085] text-sm ml-3.5">Production + outcomes (who handled calls and what converted)</p>
        </div>
        <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#EAECEF]">
            <StaffStat name="Sarah" calls={26} inbound={17} outbound={9} responseTime="11m" topTypes={[{ label: 'Outbound Intro Attempt', count: 11 }, { label: 'Cancel Saved', count: 7 }]} booked={4} showSpeed={false} />
            <StaffStat name="Mike" calls={19} inbound={12} outbound={7} responseTime="18m" topTypes={[{ label: 'Outbound Intro Attempt', count: 7 }, { label: 'Cancel Saved', count: 5 }]} booked={2} showSpeed={false} />
            <StaffStat name="Ana" calls={15} inbound={10} outbound={5} responseTime="34m" topTypes={[{ label: 'Outbound Intro Attempt', count: 6 }, { label: 'Cancel Saved', count: 5 }]} booked={1} showSpeed={false} />
            <StaffStat name="Jordan" calls={12} inbound={7} outbound={5} responseTime="52m" topTypes={[{ label: 'Outbound Intro Attempt', count: 6 }, { label: 'Cancel Saved', count: 3 }]} booked={0} showSpeed={false} />
          </div>
          <div className="bg-[#F8F9FA] p-4 border-t border-[#EAECEF] flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-[#667085]" />
            <span className="text-sm font-medium text-[#111]">Manager Note:</span>
            <span className="text-sm text-[#667085]">Focus this week: response speed + consistent outcome logging.</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---

function ActionCard({ title, owner, due, impact, isEmail }: any) {
  return (
    <div className={`flex gap-4 p-4 rounded-xl border border-[#EAECEF] ${isEmail ? 'bg-white' : 'bg-white shadow-sm hover:border-[#111] transition-colors group cursor-pointer'}`}>
      <div className="mt-1">
        <div className="w-5 h-5 border-2 border-[#EAECEF] rounded flex items-center justify-center group-hover:border-[#111]">
          <div className="w-2.5 h-2.5 bg-[#111] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[#111]">{title}</h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 bg-[#F1F3F5] rounded text-[#111]">
            <Clock className="w-3 h-3" />
            Due: {due}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm mb-2">
          <div className="flex items-center gap-1.5 text-[#667085]">
            <User className="w-3.5 h-3.5" />
            Owner: <span className="text-[#111] font-medium">{owner}</span>
          </div>
        </div>
        <div className="text-sm"><span className="font-semibold text-[#111]">Impact:</span> <span className="text-[#667085]">“{impact}”</span></div>
      </div>
    </div>
  );
}

function MetricTile({ label, value, sub, delta, positive, helper }: any) {
  return (
    <div className="p-4 bg-white border border-[#EAECEF] rounded-xl shadow-sm">
      <div className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-end justify-between gap-2 mb-1">
        <span className="text-2xl font-bold text-[#111] leading-none">{value}</span>
        {delta && (
          <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            positive === undefined ? 'bg-gray-100 text-gray-600' : 
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
          }`}>
            {positive === undefined ? <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /> : 
             positive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
            {delta}
          </div>
        )}
      </div>
      {sub && <div className="text-[13px] text-[#667085] leading-tight mt-2">{sub}</div>}
      {helper && <div className="text-[9px] text-[#98A2B3] leading-tight italic mt-1">{helper}</div>}
    </div>
  );
}

function QueueRow({ name, reason, last, action, owner, due, overdue }: any) {
  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#F1F3F5] flex items-center justify-center text-xs font-bold text-[#111]">{name.charAt(0)}</div><span className="font-bold text-[#111]">{name}</span></div></td>
      <td className="px-4 py-4"><span className="text-sm font-medium text-[#111]">{reason}</span></td>
      <td className="px-4 py-4 text-sm text-[#667085]">{last}</td>
      <td className="px-4 py-4 text-sm text-[#111] font-medium"><div className="flex items-center gap-2">{action}<ArrowRight className="w-3.5 h-3.5 text-[#667085] opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" /></div></td>
      <td className="px-4 py-4 text-center"><span className="text-xs font-bold px-2 py-1 bg-[#F1F3F5] rounded text-[#111]">{owner}</span></td>
      <td className="px-4 py-4 text-right"><span className={`text-sm font-bold ${overdue ? 'text-red-600 underline decoration-red-200' : 'text-[#111]'}`}>{due}</span></td>
    </tr>
  );
}

function StaffStat({ name, calls, inbound, outbound, responseTime, topTypes, booked, flagged, showSpeed = true }: any) {
  const isOverTarget = parseInt(responseTime) > 15;
  const isRed = parseInt(responseTime) > 30;

  return (
    <div className={`p-5 flex flex-col h-full ${flagged ? 'bg-red-50/30' : ''}`}>
      <div className="mb-5 flex justify-between items-center">
        <div className="font-bold text-[#111] text-base leading-tight">{name}</div>
        {flagged && <div className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Flagged</div>}
      </div>

      <div className="space-y-4 flex-1">
        {/* Row A: Production */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-0.5">Calls</div>
            <div className="text-2xl font-bold text-[#111] leading-none">{calls}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-0.5 text-right">In / Out</div>
            <div className="text-sm font-medium text-[#111]">{inbound} <span className="text-[#EAECEF]">/</span> {outbound}</div>
          </div>
        </div>

        {/* Row B: Speed */}
        {showSpeed && (
          <div className="flex justify-between items-end py-3 border-y border-[#F8F9FA]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#667085]" />
              <div>
                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-0.5">Avg Speed</div>
                <div className={`text-sm font-bold ${isRed ? 'text-red-600' : isOverTarget ? 'text-amber-600' : 'text-[#111]'}`}>{responseTime}</div>
              </div>
            </div>
            <div className="text-right"><div className="text-[10px] font-medium text-[#667085] italic">Target ≤ 15m</div></div>
          </div>
        )}

        {/* Row C: Outcome */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">Outcome</div>
          <div className="space-y-1.5">
            {topTypes.map((type: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <span className="text-[#667085] line-clamp-1">{type.label}</span>
                <span className="font-bold text-[#111]">{type.count}</span>
              </div>
            ))}
            <div className="pt-1.5 flex justify-between items-center border-t border-[#F8F9FA]">
              <span className="text-[11px] font-bold text-[#111]">Total Booked</span>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">{booked}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Monthly Components ---

function MonthlyEmailPreview({ onPageChange }: { onPageChange?: (page: string) => void }) {
  return (
    <div className="bg-gray-100 p-8 rounded-xl border border-gray-200 shadow-inner">
      <div className="bg-white max-w-[900px] mx-auto rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-[#F8F9FA] p-6 border-b border-[#EAECEF]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Subject</div>
              <div className="text-lg font-bold text-[#111]">Devon OTF — Monthly Ops Report (Jan 2026)</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#667085] mb-1 uppercase font-bold tracking-wider">Timestamp</div>
              <div className="text-sm text-[#111]">Mon 6:10 AM</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-[#667085] mb-6">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">From:</span> Retaintive.ai Reports &lt;reports@retaintive.ai&gt;
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#111]">To:</span> Studio Manager + Owner
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => onPageChange?.('dashboard')} className="bg-[#111] text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-black transition-colors">Open Dashboard</button>
            <button onClick={() => onPageChange?.('followups')} className="bg-white border border-[#EAECEF] text-[#111] px-5 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">View Follow-up Tasks</button>
            <button onClick={() => onPageChange?.('staff')} className="text-[#667085] px-3 py-2 text-sm font-semibold hover:text-[#111]">View Staff</button>
          </div>
        </div>

        <div className="p-8">
          <MonthlyContent isEmail={true} />
          <div className="mt-12 pt-8 border-t border-[#EAECEF] text-center">
            <p className="text-[10px] text-[#667085] mb-6 italic max-w-lg mx-auto">
              Numbers come from call logs + follow-up activity. Money impact is an estimate based on your settings.
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button onClick={() => onPageChange?.('dashboard')} className="bg-[#111] text-white px-6 py-2 rounded-md text-sm font-semibold">Open Dashboard</button>
              <button onClick={() => onPageChange?.('followups')} className="bg-white border border-[#EAECEF] text-[#111] px-6 py-2 rounded-md text-sm font-semibold">View Follow-up Tasks</button>
              <button onClick={() => onPageChange?.('staff')} className="text-[#667085] px-4 py-2 text-sm font-semibold">View Staff</button>
            </div>
            <a href="#" className="text-xs text-[#667085] hover:underline">Edit assumptions</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthlyInAppView() {
  return <div className="max-w-[1000px] mx-auto"><MonthlyContent isEmail={false} /></div>;
}

function MonthlyContent({ isEmail }: { isEmail: boolean }) {
  return (
    <div className="space-y-10">
      {/* 1) Monthly Summary */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm">
          <h2 className="text-lg font-bold text-[#111] mb-3">This month vs last month: more intros booked, but we got slower getting back to leads.</h2>
          <ul className="space-y-2">
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Good: Intros booked 112 → 126 (+14)</span>
            </li>
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Not good: Avg time to first call/text 38m → 47m (+9m slower)</span>
            </li>
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Risk: Overdue follow-ups ended higher 41 → 58</span>
            </li>
            <li className="flex gap-2 text-sm text-[#667085]">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
              <span>Money (estimate): About $6,480/month added/kept (based on your settings)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2) Monthly Scoreboard */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Monthly Scoreboard</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile label="Total Calls" value="1,780" sub="1,420 inbound / 360 outbound" delta="+8%" positive={true} />
          <MetricTile label="Intros Booked" value="126" delta="+12%" positive={true} />
          <MetricTile label="Lead Closing Rate" value="31.3%" sub="126 of 402 inquiries booked" delta="up" positive={true} />
          <MetricTile label="New Memberships Sold" value="84" delta="+5%" positive={true} />
          <MetricTile label="Avg Time to First Call/Text" value="47m" delta="+9m slower" positive={false} helper="Average time to first call/text after a lead comes in." sub="Goal: under 15 minutes." />
          <MetricTile label="Called/Texted within 2 hours" value="68%" delta="down from 74% last month" positive={false} />
          <MetricTile label="Follow-up Tasks Due (month)" value="612" delta="+40" positive={false} />
          <MetricTile label="Cancellation Requests" value="122" delta="+9" positive={false} />
        </div>
      </section>

      {/* 3) Monthly Theme */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm border-l-4 border-l-[#111]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">Monthly Theme (System Flag)</div>
              <h2 className="text-lg font-bold text-[#111]">FOLLOW-UP TOO SLOW</h2>
            </div>
            <div className="bg-[#111] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">System Label</div>
          </div>
          <p className="text-sm text-[#667085]">This month we took longer to call/text leads. The overdue list grew, especially in the morning.</p>
        </div>
      </section>

      {/* 4) Drivers */}
      <section>
        <div className="bg-white p-6 rounded-xl border border-[#EAECEF] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#111]" />
            <h2 className="text-lg font-bold text-[#111]">Drivers</h2>
          </div>
          <ul className="space-y-3 mb-4">
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111] font-medium"><span className="font-bold">Unassigned leads increased:</span> 64 leads had no owner within 15 minutes (+21 MoM)</span>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111] font-medium"><span className="font-bold">Slowest time window:</span> 7–10AM average first response 1h 18m (vs 42m other hours)</span>
            </li>
            <li className="flex gap-3 text-sm">
              <div className="w-5 h-5 bg-[#F8F9FA] rounded flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-[#111] rounded-full" />
              </div>
              <span className="text-[#111] font-medium"><span className="font-bold">Backlog mix:</span> Intro-related leads are 61% of overdue items</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5) ROI */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Estimated ROI (conservative)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ROICard label="Estimated value added" value="$4,500" sub="from extra intros booked" />
          <ROICard label="Estimated value kept" value="$2,280" sub="from cancels saved" />
          <ROICard label="Tool cost" value="$299" sub="Standard Monthly Plan" />
          <ROICard label="Net impact (estimate)" value="+$6,481" sub="Total monthly value" highlight={true} />
        </div>
        <p className="text-[10px] text-[#667085] mt-3 italic">This is an estimate based on your settings. Click Assumptions: Editable to adjust.</p>
      </section>

      {/* 6) Owner Decisions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Owner Decisions (pick 1–2)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DecisionCard 
            title="Turn on lead routing"
            why="Too many leads sit unassigned"
            what="Assign every new lead within 15 minutes"
            impact="Faster follow-up → more intros booked"
          />
          <DecisionCard 
            title="Morning follow-up block"
            why="7–10AM is the slowest response time"
            what="First 30 minutes of each shift = follow-ups only"
            impact="Smaller overdue list"
          />
          <DecisionCard 
            title="Outcome logging rule"
            why="Follow-up tasks happen but aren’t marked"
            what="Every follow-up must be marked booked / not reached / not interested"
            impact="Better tracking + coaching"
          />
        </div>
      </section>

      {/* 7) Next Month Plan */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-6 bg-[#111] rounded-full" />
          <h2 className="text-xl font-bold text-[#111]">Next Month Plan</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1 bg-[#111] text-white text-xs font-bold rounded-full uppercase tracking-wider">Get faster getting back to leads</div>
          <div className="px-3 py-1 bg-[#F1F3F5] text-[#111] text-xs font-bold rounded-full uppercase tracking-wider">Shrink the overdue list</div>
          <div className="px-3 py-1 bg-[#F1F3F5] text-[#111] text-xs font-bold rounded-full uppercase tracking-wider">Improve intro booking conversion</div>
        </div>

        <div className="overflow-x-auto border border-[#EAECEF] rounded-xl bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-[#EAECEF]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider w-[40%]">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider">Owner</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider">Due</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#667085] uppercase tracking-wider text-right">Metric Moved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECEF]">
              <ActionPlanRow action="Assign every new lead within 15 minutes" owner="Manager" due="Feb 3" kpi="Unassigned leads" />
              <ActionPlanRow action="Daily 4pm overdue review" owner="Front Desk Lead" due="Daily" kpi="Overdue backlog" />
              <ActionPlanRow action="7–10AM coverage schedule" owner="Manager" due="Feb 5" kpi="Response time" />
              <ActionPlanRow action="Outcome logging required" owner="All staff" due="Feb 1" kpi="Data quality" />
              <ActionPlanRow action="Cancel save practice (15 min weekly)" owner="Manager" due="Weekly" kpi="Saves completed" />
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// --- Helper Components ---

function ROICard({ label, value, sub, highlight }: any) {
  return (
    <div className={`p-5 rounded-xl border ${highlight ? 'bg-[#111] border-[#111] text-white' : 'bg-white border-[#EAECEF]'}`}>
      <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${highlight ? 'text-gray-400' : 'text-[#667085]'}`}>{label}</div>
      <div className="text-2xl font-bold mb-1 leading-none">{value}</div>
      <div className={`text-[11px] ${highlight ? 'text-gray-400' : 'text-[#667085]'}`}>{sub}</div>
    </div>
  );
}

function DecisionCard({ title, why, what, impact }: any) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#EAECEF] shadow-sm hover:border-[#111] transition-colors">
      <h3 className="font-bold text-[#111] mb-3">{title}</h3>
      <div className="space-y-3">
        <div>
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">Why</div>
          <div className="text-xs text-[#111] font-medium leading-relaxed">{why}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">What to do</div>
          <div className="text-xs text-[#111] font-medium leading-relaxed">{what}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1">Expected impact</div>
          <div className="text-xs text-emerald-600 font-bold leading-relaxed">{impact}</div>
        </div>
      </div>
    </div>
  );
}
