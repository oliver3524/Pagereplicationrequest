import { X, Bell, ChevronDown } from 'lucide-react';

interface Alert {
  id: number;
  leadName: string;
  phone: string;
  source: string;
  overdueBy: string;
  assigned: string | null;
  attempts: string;
  leadId: number;
}

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  onComplete: (alertId: number) => void;
  onOpenLead: (leadId: number) => void;
}

export function AlertsDrawer({ isOpen, onClose, alerts, onComplete, onOpenLead }: AlertsDrawerProps) {
  if (!isOpen) return null;

  const topAlerts = alerts.slice(0, 5);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-[#EAECEF] p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-[#111] mb-1">Overdue Follow-up Tasks</h2>
              <p className="text-sm text-[#667085]">Lead Tracker • SLA: 2h no contact • Showing top 5</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[#667085]" />
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <select className="flex-1 px-3 py-2 border border-[#EAECEF] rounded-lg text-sm text-[#667085] focus:outline-none focus:border-blue-500">
              <option>Scope: Leads</option>
              <option>Scope: Missed Calls</option>
              <option>Scope: Messages</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-[#667085]">
              <input type="checkbox" className="w-4 h-4 rounded border-[#EAECEF]" />
              Only mine
            </label>
          </div>

          {alerts.length > 5 && (
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all {alerts.length} alerts →
            </button>
          )}
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-6">
          {topAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-medium text-[#111] mb-2">No overdue follow-up tasks</h3>
              <p className="text-sm text-[#667085] mb-4">All leads are within SLA</p>
              <p className="text-xs text-[#667085]">SLA is set to 2 hours. Edit in Settings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topAlerts.map((alert) => (
                <div key={alert.id} className="bg-gray-50 border border-[#EAECEF] rounded-lg p-4 hover:border-blue-300 transition-colors">
                  {/* Lead Info */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-[#111] mb-1">{alert.leadName}</h3>
                        <p className="text-xs text-[#667085] mb-2">{alert.phone}</p>
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {alert.source}
                        </span>
                      </div>
                    </div>

                    {/* Overdue Timer - Big and Obvious */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600 uppercase">Overdue</span>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mt-1">{alert.overdueBy}</div>
                    </div>

                    {/* Assignment & Attempts */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#667085]">Assigned:</span>
                        {alert.assigned ? (
                          <span className="text-xs font-medium text-[#111]">{alert.assigned}</span>
                        ) : (
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Assign →
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-[#667085]">
                        {alert.attempts === '0c / 0t' ? (
                          <span className="text-red-600 font-medium">⚠️ No attempts yet</span>
                        ) : (
                          <span>📞 {alert.attempts}</span>
                        )}
                      </div>
                    </div>

                    {/* Suggested Action */}
                    <div className="text-xs text-[#667085] italic mb-3">
                      {alert.attempts === '0c / 0t' 
                        ? 'Call now • Priority lead'
                        : `Call now • ${alert.attempts.split('/')[0].trim()} so far`
                      }
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenLead(alert.leadId)}
                      className="flex-1 px-3 py-2 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Open Lead
                    </button>
                    <button
                      onClick={() => onComplete(alert.id)}
                      className="px-3 py-2 border border-[#EAECEF] text-[#667085] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
