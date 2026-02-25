import { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Info, ChevronDown, ChevronUp, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface KPICardProps {
  title: string;
  value: string;
  subtext: string;
  dotColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  tooltip: string;
  children?: React.ReactNode;
}

function KPICard({ title, value, subtext, dotColor, isExpanded, onToggle, tooltip, children }: KPICardProps) {
  return (
    <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          <h3 className="text-sm font-medium text-[#111]">{title}</h3>
          <button className="group relative">
            <Info className="w-4 h-4 text-[#667085]" />
            <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs p-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 z-10">
              {tooltip}
            </div>
          </button>
        </div>
        <button onClick={onToggle} className="hover:bg-gray-50 p-1 rounded">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-[#667085]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#667085]" />
          )}
        </button>
      </div>
      <div className="text-3xl font-semibold text-[#111] mb-3">{value}</div>
      <p className="text-xs text-[#667085] mb-4">{subtext}</p>
      
      {isExpanded && children && (
        <div className="mt-6 pt-6 border-t border-[#EAECEF]">
          {children}
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'trends' | 'staff'>('analytics');
  const [currentDate] = useState('Today');
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);
  
  // KPI Card expansion states
  const [expandedCards, setExpandedCards] = useState({
    mrr: false,
    ltv: false,
    leakage: false,
    roi: false,
  });

  // Card 2 sub-section states
  const [card2Subsections, setCard2Subsections] = useState({
    valueImpact: true,
    howCalculated: false,
    assumptions: false,
  });

  const toggleCard = (card: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({ ...prev, [card]: !prev[card] }));
  };

  const toggleCard2Subsection = (section: keyof typeof card2Subsections) => {
    setCard2Subsections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Data for Types of Calls donut chart
  const callTypesData = [
    { name: 'Missed', value: 3, color: '#3B82F6' },
    { name: 'Rescheduling', value: 2, color: '#60A5FA' },
    { name: 'Billing', value: 1, color: '#FCD34D' },
    { name: 'General', value: 1, color: '#34D399' },
    { name: 'Hang Up', value: 1, color: '#F87171' },
  ];

  // Data for Most Common Call Reasons bar chart
  const callReasonsData = [
    { reason: 'into_booking', value: 5 },
    { reason: 'no-show_callback', value: 3 },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#111]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg">
              <button className="hover:bg-gray-50 p-1 rounded">
                <ChevronLeft className="w-4 h-4 text-[#667085]" />
              </button>
              <span className="text-sm font-medium text-[#111] min-w-[80px] text-center">{currentDate}</span>
              <button className="hover:bg-gray-50 p-1 rounded">
                <ChevronRight className="w-4 h-4 text-[#667085]" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="3" y="3" width="4" height="4" rx="1" fill="#667085"/>
                <rect x="9" y="3" width="4" height="4" rx="1" fill="#667085"/>
                <rect x="3" y="9" width="4" height="4" rx="1" fill="#667085"/>
                <rect x="9" y="9" width="4" height="4" rx="1" fill="#667085"/>
              </svg>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 text-[#667085]" />
              <span className="text-sm font-medium text-[#111]">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'trends'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'staff'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('staff')}
          >
            Staff
          </button>
        </div>

        {/* Business Impact Section - Only on Analytics tab */}
        {activeTab === 'analytics' && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold text-[#111]">Business Impact (Owner view)</h2>
                  <p className="text-xs text-[#667085] mt-1">Assumption-based until billing sync</p>
                </div>
                <button
                  onClick={() => setShowAssumptionsModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-[#111] hover:bg-gray-200 transition-colors"
                >
                  Assumptions • Editable
                </button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              {/* KPI 1: Est. Net New MRR */}
              <KPICard
                title="Est. Net New MRR"
                value="$1,240"
                subtext="Estimated monthly recurring revenue added (joins + winbacks + cancels saved)"
                dotColor="bg-blue-500"
                isExpanded={expandedCards.mrr}
                onToggle={() => toggleCard('mrr')}
                tooltip="Overall estimated studio net-new monthly revenue movement"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#111]">Value Impact</h4>
                    <button onClick={() => toggleCard('mrr')} className="text-xs text-[#667085] hover:text-[#111]">
                      Click to collapse
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Intro bookings (expected members):</span> 5 × 0.20 × $149 = $149
                    </div>
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Memberships sold on phone:</span> 3 × $149 = $447
                    </div>
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Winbacks:</span> 2 × $149 = $298
                    </div>
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Cancellations saved:</span> 2 × $149 = $298
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAECEF]">
                    <p className="text-xs font-medium text-[#111] mb-2">Equation:</p>
                    <code className="text-xs text-[#667085] block bg-gray-50 p-2 rounded font-mono">
                      NetNewMRR_Est = (IntroBookings * IntroConv * PriceMRR) + (MembershipSold * PriceMRR) + (Winbacks * PriceMRR) + (CancelsSaved * PriceMRR)
                    </code>
                  </div>

                  <div className="pt-3 border-t border-[#EAECEF]">
                    <p className="text-xs font-medium text-[#111] mb-2">Assumptions:</p>
                    <ul className="text-xs text-[#667085] space-y-1">
                      <li>PriceMRR = $149</li>
                      <li>IntroConv = 0.20 (editable)</li>
                    </ul>
                  </div>

                  <div className="text-xs text-[#667085] pt-2">
                    <span className="font-medium">Data sources:</span> Intro bookings + membership sold from Call Table / outcomes; winbacks & cancels saved from categorized calls or disposition tags
                  </div>
                </div>
              </KPICard>

              {/* KPI 2: Attributed Net New MRR - Custom Structure */}
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-medium text-[#111]">Attributed Net New MRR (Est.)</h3>
                    <button className="group relative">
                      <Info className="w-4 h-4 text-[#667085]" />
                      <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs p-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 z-10">
                        Counts only outcomes tied to Retaintive-generated tasks resolved within the attribution window.
                      </div>
                    </button>
                  </div>
                  <button onClick={() => toggleCard('ltv')} className="hover:bg-gray-50 p-1 rounded">
                    {expandedCards.ltv ? (
                      <ChevronUp className="w-4 h-4 text-[#667085]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#667085]" />
                    )}
                  </button>
                </div>
                
                <div className="text-3xl font-semibold text-[#111] mb-3">$520</div>
                <p className="text-xs text-[#667085] mb-4">MRR estimated from resolved Retaintive tasks (follow-up/alert → outcome)</p>
                
                {!expandedCards.ltv && (
                  <div className="space-y-2">
                    <div className="text-xs">
                      <span className="text-[#667085]">Share of Net New: </span>
                      <span className="font-medium text-[#111]">42%</span>
                    </div>
                    <button 
                      onClick={() => toggleCard('ltv')}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Value Impact
                    </button>
                  </div>
                )}
                
                {expandedCards.ltv && (
                  <div className="mt-6 pt-6 border-t border-[#EAECEF] space-y-4">
                    {/* Sub-section A: Value Impact */}
                    <div className="border border-[#EAECEF] rounded-lg">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                        <h4 className="text-xs font-semibold text-[#111]">Value Impact</h4>
                        <button 
                          onClick={() => toggleCard2Subsection('valueImpact')}
                          className="text-xs text-[#667085] hover:text-[#111] flex items-center gap-1"
                        >
                          {card2Subsections.valueImpact ? 'Click to collapse' : 'Click to expand'}
                          {card2Subsections.valueImpact ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      
                      {card2Subsections.valueImpact && (
                        <div className="p-3 space-y-3">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[#667085]">Membership Sold (from tasks)</span>
                              <span className="font-mono text-[#111]">2 × $149 = $298</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#667085]">Winbacks (from tasks)</span>
                              <span className="font-mono text-[#111]">0 × $149 = $0</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#667085]">Cancels Saved (from tasks)</span>
                              <span className="font-mono text-[#111]">1 × $149 = $149</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#667085]">Intros Booked (from tasks)</span>
                              <span className="font-mono text-[#111]">1 × 0.20 × $149 = $30</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-[#EAECEF] pt-3 space-y-1">
                            <div className="text-sm font-semibold text-[#111]">Attributed Net New MRR (Est.) = $520</div>
                            <div className="text-xs text-[#667085]">Share of Net New = 42%</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sub-section B: How it's calculated */}
                    <div className="border border-[#EAECEF] rounded-lg">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                        <h4 className="text-xs font-semibold text-[#111]">How it's calculated (step-by-step)</h4>
                        <button 
                          onClick={() => toggleCard2Subsection('howCalculated')}
                          className="text-xs text-[#667085] hover:text-[#111] flex items-center gap-1"
                        >
                          {card2Subsections.howCalculated ? 'Click to collapse' : 'Click to expand'}
                          {card2Subsections.howCalculated ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      
                      {card2Subsections.howCalculated && (
                        <div className="p-3 space-y-4 text-xs">
                          <div>
                            <p className="font-semibold text-[#111] mb-2">1) We only count "attributed tasks"</p>
                            <p className="text-[#667085] mb-1">A task is included if ALL conditions are true:</p>
                            <ul className="list-disc list-inside ml-2 text-[#667085] space-y-1">
                              <li><span className="font-mono">Created by Retaintive</span>: created_by ∈ {'{retaintive_alert, retaintive_rule}'}</li>
                              <li>Staff marked it <span className="font-semibold">Resolved</span></li>
                              <li>Staff selected a credited <span className="font-semibold">Outcome</span></li>
                              <li><span className="font-mono">resolved_at ≤ created_at + AttributionWindowDays</span> (default 7)</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-[#111] mb-2">2) We count outcomes (within selected date range)</p>
                            <p className="text-[#667085] mb-1">Filter tasks by:</p>
                            <ul className="list-disc list-inside ml-2 text-[#667085] space-y-1">
                              <li><span className="font-mono">resolved_at</span> is within the currently selected period (Today / week / month)</li>
                            </ul>
                            <p className="text-[#667085] mt-2">Then count:</p>
                            <ul className="list-disc list-inside ml-2 text-[#667085] space-y-1">
                              <li><span className="font-mono">Count_MembershipSold</span> = number of tasks with outcome = membership_sold</li>
                              <li><span className="font-mono">Count_Winback</span> = number of tasks with outcome = winback</li>
                              <li><span className="font-mono">Count_CancelSaved</span> = number of tasks with outcome = cancel_saved</li>
                              <li><span className="font-mono">Count_IntroBooked</span> = number of tasks with outcome = intro_booked</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-[#111] mb-2">3) We translate outcomes into estimated MRR</p>
                            <ul className="list-disc list-inside ml-2 text-[#667085] space-y-1">
                              <li>Membership Sold, Winback, Cancel Saved each contribute <span className="font-mono">PriceMRR</span></li>
                              <li>Intro Booked is converted to MRR using <span className="font-mono">IntroConvToMRR</span> (default 0.20)</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-[#111] mb-2">4) We compute Attributed Net New MRR (Est.)</p>
                            <code className="block bg-gray-50 p-2 rounded font-mono text-[#667085]">
                              AttributedMRR_Est = (Count_MembershipSold * PriceMRR) + (Count_Winback * PriceMRR) + (Count_CancelSaved * PriceMRR) + (Count_IntroBooked * IntroConvToMRR * PriceMRR)
                            </code>
                          </div>

                          <div>
                            <p className="font-semibold text-[#111] mb-2">5) Share of Net New (optional)</p>
                            <p className="text-[#667085] mb-1">We compute share against the overall Net New MRR estimate (if that metric exists on the page):</p>
                            <code className="block bg-gray-50 p-2 rounded font-mono text-[#667085]">
                              AttributedShare = AttributedMRR_Est / max(NetNewMRR_Est, 1)
                            </code>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sub-section C: Assumptions & Data Sources */}
                    <div className="border border-[#EAECEF] rounded-lg">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
                        <h4 className="text-xs font-semibold text-[#111]">Assumptions & Data Sources</h4>
                        <button 
                          onClick={() => toggleCard2Subsection('assumptions')}
                          className="text-xs text-[#667085] hover:text-[#111] flex items-center gap-1"
                        >
                          {card2Subsections.assumptions ? 'Click to collapse' : 'Click to expand'}
                          {card2Subsections.assumptions ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      
                      {card2Subsections.assumptions && (
                        <div className="p-3 space-y-4 text-xs">
                          <div>
                            <p className="font-semibold text-[#111] mb-2">Assumptions (editable):</p>
                            <ul className="space-y-1 text-[#667085]">
                              <li><span className="font-mono">PriceMRR</span> = $149</li>
                              <li><span className="font-mono">IntroConvToMRR</span> = 0.20</li>
                              <li><span className="font-mono">AttributionWindowDays</span> = 7</li>
                              <li>Outcomes are staff-selected on task resolution</li>
                            </ul>
                          </div>

                          <div>
                            <p className="font-semibold text-[#111] mb-2">Data sources used (minimal):</p>
                            <ul className="list-disc list-inside ml-2 text-[#667085] space-y-1">
                              <li>Lead Tracker Tasks (task created_by, created_at, resolved_at, outcome)</li>
                              <li>Alert/Rule logs (or task created_by field)</li>
                              <li>Call table + message timestamps are reference context only (not required to calculate attribution)</li>
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-[#EAECEF]">
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                              View tasks used in estimate →
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* KPI 3: Leakage to Recover */}
              <KPICard
                title="Leakage to Recover"
                value="$3,900"
                subtext="Estimated value still available if missed/unworked opportunities are followed up"
                dotColor="bg-amber-500"
                isExpanded={expandedCards.leakage}
                onToggle={() => toggleCard('leakage')}
                tooltip="Recoverable opportunity from missed calls, unreturned voicemails, and uncontacted leads"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-[#111]">Value Impact</h4>
                    <button onClick={() => toggleCard('leakage')} className="text-xs text-[#667085] hover:text-[#111]">
                      Click to collapse
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Missed calls unreturned:</span> 3 × 0.60 × 0.20 × $149 = $54
                    </div>
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Voicemails not returned:</span> 2 × 0.60 × 0.20 × $149 = $36
                    </div>
                    <div className="text-[#667085]">
                      <span className="font-medium text-[#111]">Lead tracker uncontacted (SLA):</span> 15 × 0.60 × 0.20 × $149 = $268
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EAECEF]">
                    <p className="text-xs font-medium text-[#111] mb-2">Equation:</p>
                    <code className="text-xs text-[#667085] block bg-gray-50 p-2 rounded font-mono">
                      LeakageMRR_Est = (MissedCalls * ReachRate * CloseRate_Followup * PriceMRR) + (Voicemails * ReachRate * CloseRate_Followup * PriceMRR) + (OpenLeadsSLA * ReachRate * CloseRate_Followup * PriceMRR)
                    </code>
                  </div>

                  <div className="pt-3 border-t border-[#EAECEF]">
                    <p className="text-xs font-medium text-[#111] mb-2">Assumptions:</p>
                    <ul className="text-xs text-[#667085] space-y-1">
                      <li>ReachRate = 0.60 (editable)</li>
                      <li>CloseRate_Followup = 0.20 (editable)</li>
                      <li>PriceMRR = $149</li>
                    </ul>
                  </div>

                  <div className="text-xs text-[#667085] pt-2">
                    <span className="font-medium">Data sources:</span> Call Table (missed/voicemail), Lead Tracker (SLA breached)
                  </div>
                </div>
              </KPICard>

              {/* KPI 4: ROI (Est.) - Custom Structure with visible note */}
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <h3 className="text-sm font-medium text-[#111]">ROI (Est.)</h3>
                    <button className="group relative">
                      <Info className="w-4 h-4 text-[#667085]" />
                      <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs p-2 rounded opacity-0 pointer-events-none group-hover:opacity-100 z-10">
                        Return on investment based on attributed MRR to avoid over-claiming
                      </div>
                    </button>
                  </div>
                  <button onClick={() => toggleCard('roi')} className="hover:bg-gray-50 p-1 rounded">
                    {expandedCards.roi ? (
                      <ChevronUp className="w-4 h-4 text-[#667085]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#667085]" />
                    )}
                  </button>
                </div>
                
                <div className="text-3xl font-semibold text-[#111] mb-3">1.0x</div>
                <p className="text-xs text-[#667085] mb-3">Estimated return per $1 spent</p>
                
                <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-900">
                  <span className="font-medium">Note:</span> ROI is only calculated monthly.
                </div>
                
                {expandedCards.roi && (
                  <div className="mt-6 pt-6 border-t border-[#EAECEF] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-[#111]">Value Impact</h4>
                      <button onClick={() => toggleCard('roi')} className="text-xs text-[#667085] hover:text-[#111]">
                        Click to collapse
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="text-[#667085]">
                        <span className="font-medium text-[#111]">Estimated impact (period):</span> $520
                      </div>
                      <div className="text-[#667085]">
                        <span className="font-medium text-[#111]">Estimated cost (period):</span> $499
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-900">
                      <span className="font-medium">Note:</span> ROI uses attributed impact to avoid over-claiming.
                    </div>

                    <div className="pt-3 border-t border-[#EAECEF]">
                      <p className="text-xs font-medium text-[#111] mb-2">Equation:</p>
                      <code className="text-xs text-[#667085] block bg-gray-50 p-2 rounded font-mono">
                        ROI_Est = AttributedMRR_Est / PlatformFee
                        <br /><br />
                        ROI_Est = $520 / $499 = 1.0x
                      </code>
                    </div>

                    <div className="pt-3 border-t border-[#EAECEF]">
                      <p className="text-xs font-medium text-[#111] mb-2">Assumptions:</p>
                      <ul className="text-xs text-[#667085] space-y-1">
                        <li>PlatformFee = $499 (editable)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Goal Progress Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#111]">Goal progress (tier 3)</h3>
                <button 
                  onClick={() => setShowAssumptionsModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit goal
                </button>
              </div>
              
              <div className="flex items-center gap-6 text-sm mb-4">
                <div className="text-[#667085]">
                  <span className="font-medium text-[#111]">MRR Target:</span> $20,000
                </div>
                <div className="text-[#667085]">
                  <span className="font-medium text-[#111]">Current:</span> $18,760
                </div>
                <div className="text-[#667085]">
                  <span className="font-medium text-[#111]">Gap:</span> $1,240
                </div>
              </div>

              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '93.8%' }} />
                </div>
              </div>

              <p className="text-xs text-[#667085]">
                <span className="font-medium text-[#111]">Top drivers today:</span> 2 intro bookings • 0 cancels saved • 3 missed calls
              </p>
            </div>
          </>
        )}

        {/* Performance Overview */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-[#111]">Performance Overview</h2>
            <Info className="w-4 h-4 text-[#667085]" />
          </div>
          <p className="text-sm text-[#667085] mb-6">Metrics for the selected period</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Intro Booking Calls */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#111]">Intro Booking Calls</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <div className="text-sm text-[#667085] mb-6">General / analytics</div>
            <div className="text-4xl font-semibold text-[#111] mb-8">0</div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Inbound Calls</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Outbound Calls</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAECEF]">
              <div className="text-sm font-medium text-[#111] mb-3">Total Intro Booking Calls</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">All Accounts</span>
                  <span className="text-[#111] font-medium">2</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Inbound Calls Total</span>
                  <span className="text-[#111] font-medium">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Outbound Calls Total</span>
                  <span className="text-[#111] font-medium">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* New Memberships Sold */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#111]">New Memberships Sold</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <div className="text-sm text-[#667085] mb-6">General / analytics</div>
            <div className="text-4xl font-semibold text-[#111] mb-8">0</div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Inbound Calls</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Outbound Calls</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAECEF]">
              <div className="text-sm font-medium text-[#111] mb-3">Total Sales Calls</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">All Accounts</span>
                  <span className="text-[#111] font-medium">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Inbound Calls Total</span>
                  <span className="text-[#111] font-medium">0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#667085]">Outbound Calls Total</span>
                  <span className="text-[#111] font-medium">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Membership Cancellations */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#111]">Membership Cancellations</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <div className="text-sm text-[#667085] mb-6">General / analytics</div>
            <div className="text-4xl font-semibold text-teal-500 mb-8">0 Retained</div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Total Membership Cancellation Calls</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Membership Status Changes */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#111]">Membership Status Changes</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <div className="text-4xl font-semibold text-[#111] mb-8">0</div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Upgrades</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Downgrades</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Freezes</span>
                <span className="text-[#111] font-medium">0</span>
              </div>
            </div>
          </div>

          {/* Total Calls */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-[#111]">Total Calls</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <div className="text-4xl font-semibold text-[#111] mb-8">8</div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Live Conversations</span>
                <span className="text-[#111] font-medium">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Voicemail</span>
                <span className="text-[#111] font-medium">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Inbound Calls</span>
                <span className="text-[#111] font-medium">5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#667085]">Outbound Calls</span>
                <span className="text-[#111] font-medium">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row - Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Types of Calls */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-[#111]">Types of Calls</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <p className="text-xs text-[#667085] mb-6">See which call categories your studio receives</p>
            
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={callTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {callTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {callTypesData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#667085]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Most Common Call Reasons */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-medium text-[#111]">Most Common Call Reasons</h3>
              <Info className="w-4 h-4 text-[#667085]" />
            </div>
            <p className="text-xs text-[#667085] mb-6">What people are calling about, from most to least frequent</p>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callReasonsData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="reason" hide />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Assumptions Modal */}
      {showAssumptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
            <div className="sticky top-0 bg-white border-b border-[#EAECEF] px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111]">Edit Assumptions</h2>
              <button 
                onClick={() => setShowAssumptionsModal(false)}
                className="hover:bg-gray-100 p-2 rounded"
              >
                <X className="w-5 h-5 text-[#667085]" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Revenue Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Revenue Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Avg Monthly Price ($)</label>
                      <input 
                        type="number" 
                        defaultValue="199" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Gross Margin (%)</label>
                      <input 
                        type="number" 
                        defaultValue="70" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Avg Discount Rate (%)</label>
                      <input 
                        type="number" 
                        defaultValue="10" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Retention Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Retention Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Monthly Churn Rate (%)</label>
                      <input 
                        type="number" 
                        defaultValue="5" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">OR Lifetime Months (override)</label>
                      <input 
                        type="number" 
                        defaultValue="20" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                      <p className="text-xs text-[#667085] mt-1">Leave empty to use churn rate</p>
                    </div>
                  </div>
                </div>

                {/* Conversion Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Conversion Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Close Rate from Booking (%)</label>
                      <input 
                        type="number" 
                        defaultValue="40" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Close Rate after Follow-up (%)</label>
                      <input 
                        type="number" 
                        defaultValue="20" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Reach Rate (%)</label>
                      <input 
                        type="number" 
                        defaultValue="60" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Upgrade Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Upgrade Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Avg Upgrade Delta MRR ($)</label>
                      <input 
                        type="number" 
                        defaultValue="40" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Avg Downgrade Delta MRR ($)</label>
                      <input 
                        type="number" 
                        defaultValue="30" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Remaining LTV Factor (0–1)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        defaultValue="0.6" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                      <p className="text-xs text-[#667085] mt-1">For cancel-save scenarios</p>
                    </div>
                  </div>
                </div>

                {/* Cost Assumptions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Cost Assumptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Platform Fee (per period)</label>
                      <input 
                        type="number" 
                        defaultValue="499" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">Ops Labor Cost (per period)</label>
                      <input 
                        type="number" 
                        defaultValue="150" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <h3 className="text-sm font-semibold text-[#111] mb-4">Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[#667085] block mb-1">MRR Target ($)</label>
                      <input 
                        type="number" 
                        defaultValue="20000" 
                        className="w-full px-3 py-2 border border-[#EAECEF] rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#EAECEF]">
                <p className="text-xs text-[#667085] italic">
                  Note: These estimates improve automatically once billing/CRM is connected.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setShowAssumptionsModal(false)}
                  className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAssumptionsModal(false)}
                  className="px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}