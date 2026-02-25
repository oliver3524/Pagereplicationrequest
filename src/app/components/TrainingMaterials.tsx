import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Play, Plus, Send, Clock, BarChart3, TrendingUp, AlertCircle, CheckCircle2, Calendar, X } from 'lucide-react';
import { CoachingGuidanceModal } from './CoachingGuidanceModal';

type Tab = 'library' | 'packs' | 'assignments' | 'progress';

// Sample data
const modules = [
  {
    id: 1,
    title: "Intro Booking: Inquiry → Booked in 3 minutes",
    outcome: "Increase booked intros with a consistent close.",
    duration: "6 min",
    difficulty: 2,
    category: "Intro Booking",
    tags: ["Objection", "Close", "Follow-up"],
    isRecommended: true,
  },
  {
    id: 2,
    title: "Outbound Follow-up: 5-touch system that gets replies",
    outcome: "Turn cold leads into conversations with structured persistence.",
    duration: "8 min",
    difficulty: 2,
    category: "Outbound Calls / Follow-up Tasks",
    tags: ["Follow-up", "Cadence", "Script"],
    isRecommended: true,
  },
  {
    id: 3,
    title: "Cancellation Save: Freeze / downgrade / retain script",
    outcome: "Keep more members by offering the right alternative.",
    duration: "5 min",
    difficulty: 3,
    category: "Cancellation Saves",
    tags: ["Save", "Objection", "Retention"],
    isRecommended: true,
  },
  {
    id: 4,
    title: "Billing & Payment: Handle payment issues without churn",
    outcome: "Resolve billing problems before they become cancellations.",
    duration: "4 min",
    difficulty: 1,
    category: "Billing / Payment Issues",
    tags: ["Billing", "Recovery"],
    isRecommended: false,
  },
];

const exampleCalls = [
  {
    id: 1,
    title: "Intro booking — price objection → booked",
    duration: "3:24",
    category: "Intro",
    tags: ["Intro", "Objection"],
  },
  {
    id: 2,
    title: "Outbound follow-up — no response → reactivated",
    duration: "2:15",
    category: "Outbound",
    tags: ["Outbound", "Follow-up"],
  },
  {
    id: 3,
    title: "Cancel request — freeze offered → saved",
    duration: "4:10",
    category: "Save",
    tags: ["Save", "Retention"],
  },
];

const onboardingPacks = [
  {
    id: 1,
    title: "🔥 Handling New Prospects",
    description: "Watch Olivia execute a flawless intro booking that captures $12 and sets up a future membership sale. See how she systematically captures lead information, explains the Orange Theory concept with energy, secures the credit card before confirming the booking, and sets up the prospect for success with detailed arrival instructions.",
    keyTakeaways: [
      "4-step sales process executed in perfect sequence",
      "Credit card capture before booking confirmation",
      "Success setup prevents no-shows and builds confidence"
    ],
  },
  {
    id: 2,
    title: "🎯 Outbound Sales Done Right",
    description: "Watch Jessica convert a post-class prospect into a $1,912 annual membership using our proven 4-step outbound framework. See how she opens with \"What did you like about the class?\" then seamlessly guides Kyle through goal discovery, prescription-based selling, and the confident close with silence. Learn the exact timing and psychology that converts 31% more prospects into paying members.",
    keyTakeaways: [
      "Coach feedback as social proof leverage",
      "Silent close technique that actually works",
      "Budget discovery before price presentation",
      "OTbeat necessity positioning (\"You wouldn't play tennis without a racket\")"
    ],
  },
  {
    id: 3,
    title: "💰 Cancel-Save Recovery",
    description: "Watch Milly save a $1,788 annual membership from complete cancellation using the 4-step retention process. See how she discovers the real problem (schedule conflict, not fitness motivation), uses activity data to build rapport, then offers the perfect alternative solution. Amanda goes from canceling to downgrading to Elite membership - preserving $149/month in ongoing revenue.",
    keyTakeaways: [
      "Root cause discovery prevents defensive responses",
      "Activity data creates connection and credibility",
      "Multiple solution paths (downgrade vs. freeze)",
      "Founder rate protection as retention leverage"
    ],
  },
];

const assignments = [
  {
    id: 1,
    staffMember: "Sarah Johnson",
    assignedItem: "Intro Booking: Inquiry → Booked in 3 minutes",
    dueDate: "2026-01-08",
    status: "In progress",
    completionPercent: 60,
  },
  {
    id: 2,
    staffMember: "Mike Chen",
    assignedItem: "Front Desk – 7 Day Onboarding",
    dueDate: "2026-01-10",
    status: "Not started",
    completionPercent: 0,
  },
  {
    id: 3,
    staffMember: "Emma Davis",
    assignedItem: "Cancellation Save: Freeze / downgrade / retain script",
    dueDate: "2026-01-05",
    status: "Overdue",
    completionPercent: 30,
  },
  {
    id: 4,
    staffMember: "James Wilson",
    assignedItem: "Outbound Follow-up: 5-touch system that gets replies",
    dueDate: "2026-01-12",
    status: "Completed",
    completionPercent: 100,
  },
];

export function TrainingMaterials() {
  const [activeTab, setActiveTab] = useState<Tab>('library');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredModules = selectedCategories.length === 0 
    ? modules 
    : modules.filter(m => selectedCategories.includes(m.category));

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#111] mb-2">Training Materials</h1>
            <p className="text-sm text-[#667085]">Onboard new staff fast. Standardize booking, follow-ups, and saves.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#667085]" />
              <input
                type="text"
                placeholder="Search modules, calls, scripts…"
                className="w-full pl-10 pr-4 py-2 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Create
                <ChevronDown className="w-4 h-4" />
              </button>
              {showCreateMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-10">
                  <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">Module</button>
                  <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">Example Call</button>
                  <button className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50">Onboarding Pack</button>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800">
              <Send className="w-4 h-4" />
              Assign
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-8">
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'library'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('library')}
          >
            Library <span className="text-xs opacity-60">(tier 3 feature)</span>
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'packs'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('packs')}
          >
            Onboarding Packs
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'assignments'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments <span className="text-xs opacity-60">(tier 3 feature)</span>
          </button>
          <button
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'progress'
                ? 'bg-white text-[#111] shadow-sm'
                : 'text-[#667085] hover:text-[#111]'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            Progress <span className="text-xs opacity-60">(tier 3 feature)</span>
          </button>
        </div>

        {/* Library Tab */}
        {activeTab === 'library' && (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Filter Panel */}
            {showFilters && (
              <div className="col-span-3">
                <div className="bg-white border border-[#EAECEF] rounded-xl p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#111]">Filters</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="text-xs text-[#667085] hover:text-[#111]"
                    >
                      Hide
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium text-[#111] mb-3">Category</h4>
                    <div className="space-y-2">
                      {["Intro Booking", "Outbound Calls / Follow-up Tasks", "Cancellation Saves", "Billing / Payment Issues", "Scheduling / Rescheduling"].map(cat => (
                        <label key={cat} className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded border-[#EAECEF]"
                            checked={selectedCategories.includes(cat)}
                            onChange={() => toggleCategory(cat)}
                          />
                          {cat}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium text-[#111] mb-3">Difficulty</h4>
                    <div className="space-y-2">
                      {[1, 2, 3].map(level => (
                        <label key={level} className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                          <input type="checkbox" className="rounded border-[#EAECEF]" />
                          Level {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div className="mb-6">
                    <h4 className="text-xs font-medium text-[#111] mb-3">Duration</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        0–5 min
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        5–10 min
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        10+ min
                      </label>
                    </div>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <h4 className="text-xs font-medium text-[#111] mb-3">Role</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        Front Desk
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        Sales
                      </label>
                      <label className="flex items-center gap-2 text-sm text-[#667085] cursor-pointer">
                        <input type="checkbox" className="rounded border-[#EAECEF]" />
                        Manager
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Center Content */}
            <div className={showFilters ? "col-span-6" : "col-span-9"}>
              {/* Recommended Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#111] mb-4">Recommended for your studio</h2>
                <div className="space-y-4">
                  {filteredModules.filter(m => m.isRecommended).map(module => (
                    <div key={module.id} className="bg-white border border-[#EAECEF] rounded-xl p-6">
                      <h3 className="text-base font-semibold text-[#111] mb-2">{module.title}</h3>
                      <p className="text-sm text-[#667085] mb-4">{module.outcome}</p>
                      <div className="flex items-center gap-4 mb-4 text-xs text-[#667085]">
                        <span>{module.duration}</span>
                        <span>•</span>
                        <span>Difficulty {module.difficulty}</span>
                        <span>•</span>
                        <span>{module.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {module.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs text-[#667085]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                            Open
                          </button>
                          <button className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#111] hover:bg-gray-50">
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Modules */}
              <div>
                <h2 className="text-lg font-semibold text-[#111] mb-4">All Modules</h2>
                <div className="grid grid-cols-2 gap-4">
                  {filteredModules.map(module => (
                    <div key={module.id} className="bg-white border border-[#EAECEF] rounded-xl p-6">
                      <h3 className="text-sm font-semibold text-[#111] mb-2">{module.title}</h3>
                      <p className="text-xs text-[#667085] mb-3">{module.outcome}</p>
                      <div className="flex items-center gap-2 mb-3 text-xs text-[#667085]">
                        <span>{module.duration}</span>
                        <span>•</span>
                        <span>Difficulty {module.difficulty}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {module.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs text-[#667085]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-3 py-2 bg-[#111] text-white rounded-lg text-xs font-medium hover:bg-gray-800">
                          Open
                        </button>
                        <button className="flex-1 px-3 py-2 border border-[#EAECEF] rounded-lg text-xs font-medium text-[#111] hover:bg-gray-50">
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Example Calls */}
            <div className="col-span-3">
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6 sticky top-8">
                <h3 className="text-sm font-semibold text-[#111] mb-4">Example Calls</h3>
                <div className="space-y-3">
                  {exampleCalls.map(call => (
                    <div key={call.id} className="pb-3 border-b border-[#EAECEF] last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xs font-medium text-[#111] flex-1">{call.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-[#667085]" />
                        <span className="text-xs text-[#667085]">{call.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {call.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-[#667085]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                          <Play className="w-3 h-3" />
                          Play
                        </button>
                        <span className="text-[#EAECEF]">•</span>
                        <a href="#" className="text-xs text-blue-600 hover:text-blue-700">
                          Analysis
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Packs Tab */}
        {activeTab === 'packs' && (
          <div>
            <h2 className="text-lg font-semibold text-[#111] mb-6">Onboarding Packs</h2>
            <div className="grid grid-cols-3 gap-6">
              {onboardingPacks.map(pack => (
                <div key={pack.id} className="bg-white border border-[#EAECEF] rounded-xl p-6">
                  <h3 className="text-base font-semibold text-[#111] mb-3">{pack.title}</h3>
                  <p className="text-sm text-[#667085] mb-4 leading-relaxed">{pack.description}</p>
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[#111] mb-3 uppercase tracking-wide">Key Takeaways:</h4>
                    <div className="space-y-2 text-sm text-[#667085]">
                      {pack.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#111] mt-0.5">•</span>
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPack(pack.id)}
                    className="w-full px-4 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#111]">Assignments</h2>
              <div className="flex items-center gap-3">
                <select className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm">
                  <option>All Staff</option>
                  <option>Front Desk</option>
                  <option>Sales</option>
                  <option>Manager</option>
                </select>
                <select className="px-4 py-2 border border-[#EAECEF] rounded-lg text-sm">
                  <option>All Status</option>
                  <option>Not started</option>
                  <option>In progress</option>
                  <option>Completed</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>

            <div className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-[#EAECEF]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Staff Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Assigned Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#667085]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment.id} className="border-b border-[#EAECEF] last:border-b-0">
                      <td className="px-6 py-4 text-sm text-[#111]">{assignment.staffMember}</td>
                      <td className="px-6 py-4 text-sm text-[#667085]">{assignment.assignedItem}</td>
                      <td className="px-6 py-4 text-sm text-[#667085]">{assignment.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          assignment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          assignment.status === 'In progress' ? 'bg-blue-100 text-blue-700' :
                          assignment.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${assignment.completionPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#667085]">{assignment.completionPercent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-blue-600 hover:text-blue-700">View</button>
                          <span className="text-[#EAECEF]">•</span>
                          <button className="text-xs text-blue-600 hover:text-blue-700">Remind</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div>
            <h2 className="text-lg font-semibold text-[#111] mb-6">Progress Overview</h2>

            {/* Top Row Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-medium text-[#667085]">Completion Rate (30d)</h3>
                </div>
                <div className="text-3xl font-semibold text-[#111] mb-1">78%</div>
                <p className="text-xs text-[#667085]">+12% vs last month</p>
              </div>

              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-medium text-[#667085]">Overdue Items</h3>
                </div>
                <div className="text-3xl font-semibold text-[#111] mb-1">3</div>
                <p className="text-xs text-[#667085]">Across 2 staff members</p>
              </div>

              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-medium text-[#667085]">Avg Time to Complete</h3>
                </div>
                <div className="text-3xl font-semibold text-[#111] mb-1">4.2d</div>
                <p className="text-xs text-[#667085]">Target: 5 days</p>
              </div>

              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-medium text-[#667085]">Top Skill Gaps</h3>
                </div>
                <div className="text-sm font-semibold text-[#111] mb-1">Cancellation Saves</div>
                <p className="text-xs text-[#667085]">From call analysis</p>
              </div>
            </div>

            {/* Skill Coverage Chart */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-6 mb-6">
              <h3 className="text-base font-semibold text-[#111] mb-6">Skill Coverage by Category</h3>
              <div className="space-y-4">
                {[
                  { category: 'Intro Booking', coverage: 85 },
                  { category: 'Outbound / Follow-up Tasks', coverage: 72 },
                  { category: 'Cancellation Saves', coverage: 45 },
                  { category: 'Billing / Payment', coverage: 90 },
                  { category: 'Scheduling', coverage: 68 },
                ].map(item => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#667085]">{item.category}</span>
                      <span className="text-sm font-medium text-[#111]">{item.coverage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${item.coverage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Most Improved */}
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#111] mb-4">Most Improved Staff</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Johnson', modules: 5, improvement: '+45%' },
                    { name: 'James Wilson', modules: 4, improvement: '+38%' },
                    { name: 'Emma Davis', modules: 3, improvement: '+22%' },
                  ].map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-[#111]">{staff.name}</div>
                        <div className="text-xs text-[#667085]">{staff.modules} modules completed</div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">{staff.improvement}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Next */}
              <div className="bg-white border border-[#EAECEF] rounded-xl p-6">
                <h3 className="text-base font-semibold text-[#111] mb-4">Recommended Next Modules</h3>
                <div className="space-y-3">
                  {[
                    { module: 'Cancellation Save: Freeze / downgrade / retain script', reason: 'Low coverage area' },
                    { module: 'Outbound Follow-up: 5-touch system that gets replies', reason: 'High impact on conversions' },
                    { module: 'Billing & Payment: Handle payment issues without churn', reason: 'Recent call patterns' },
                  ].map((item, idx) => (
                    <div key={idx} className="pb-3 border-b border-[#EAECEF] last:border-b-0">
                      <div className="text-sm font-medium text-[#111] mb-1">{item.module}</div>
                      <div className="text-xs text-[#667085]">{item.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPack === 1 && <CoachingGuidanceModal onClose={() => setSelectedPack(null)} />}
    </div>
  );
}