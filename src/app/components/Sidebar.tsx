import { LayoutDashboard, Activity, Table, MessageSquare, TrendingUp, Store, Calendar, Shield, BookOpen, CheckSquare, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  followupsCount?: number;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'General', id: 'dashboard' },
  { icon: Activity, label: 'Store Activity', section: 'General', id: 'activity' },
  { icon: Table, label: 'Call Table', section: 'General', id: 'calls' },
  { icon: MessageSquare, label: 'Messages', section: 'General', id: 'messages' },
  { icon: CheckSquare, label: 'Follow-up Tasks', section: 'General', id: 'followups', hasBadge: true },
  { icon: TrendingUp, label: 'Lead Tracker', section: 'General', id: 'leads' },
  { icon: BookOpen, label: 'Training Materials', section: 'General', id: 'training' },
];

const settingsItems = [
  { icon: Store, label: 'Stores & Groups', section: 'Settings', id: 'stores' },
  { icon: Calendar, label: 'Store Schedule', section: 'Settings', id: 'schedule' },
  { icon: Shield, label: 'Access Management', section: 'Settings', id: 'access' },
];

export function Sidebar({ activePage, onPageChange, followupsCount }: SidebarProps) {
  const [reportsExpanded, setReportsExpanded] = useState(true);

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-screen flex flex-col shrink-0">
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white text-xs font-semibold">
            D
          </div>
          <div>
            <div className="font-semibold text-sm">Devon</div>
            <div className="text-xs text-gray-500">8 phones</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* General Section */}
        <div className="py-3">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">General</div>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                item.id === activePage
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.hasBadge && followupsCount && followupsCount > 0 && (
                <div className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] text-center">
                  {followupsCount}
                </div>
              )}
            </button>
          ))}

          {/* Reports Expandable Item */}
          <div>
            <button
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                activePage.startsWith('reports-')
                  ? 'text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setReportsExpanded(!reportsExpanded)}
            >
              <FileText className="w-4 h-4" />
              Reports
              <div className="ml-auto">
                {reportsExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </div>
            </button>
            {reportsExpanded && (
              <div className="mt-1">
                {['Daily', 'Weekly', 'Monthly'].map((sub) => (
                  <button
                    key={sub}
                    className={`w-full flex items-center pl-11 pr-4 py-1.5 text-sm ${
                      activePage === `reports-${sub.toLowerCase()}`
                        ? 'text-[#111] font-semibold'
                        : 'text-[#667085] hover:bg-gray-50'
                    }`}
                    onClick={() => onPageChange(`reports-${sub.toLowerCase()}`)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="py-3">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500">Settings</div>
          {settingsItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm ${
                item.id === activePage
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <div className="font-semibold">max</div>
          <div className="text-gray-400">max@instantine.ai</div>
        </div>
      </div>
    </div>
  );
}