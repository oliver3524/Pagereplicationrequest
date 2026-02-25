import { Sidebar } from './components/Sidebar';
import { ActivityTimeline } from './components/ActivityTimeline';
import { Messages } from './components/Messages';
import { Dashboard } from './components/Dashboard';
import { TrainingMaterials } from './components/TrainingMaterials';
import { LeadTracker } from './components/LeadTracker';
import { Followups } from './components/Followups';
import { StoreSchedule } from './components/StoreSchedule';
import { FrameShowcase } from './components/FrameShowcase';
import { Reports } from './components/Reports';

export default function App() {
  // Mock follow-ups count (in real app, this would come from state/API)
  // 8 overdue leads/calls based on the mock data in Followups component
  const openFollowupsCount = 8;

  return (
    <FrameShowcase>
      {({ 
        staffFilter, 
        showMode, 
        onStaffFilterChange, 
        onShowModeChange, 
        activeFrame, 
        onFrameChange, 
        showLeads, 
        onShowLeadsChange, 
        dateRange, 
        onDateRangeChange,
        activePage,
        onPageChange
      }) => (
        <div className="flex h-full overflow-hidden">
          <Sidebar 
            activePage={activePage} 
            onPageChange={onPageChange} 
            followupsCount={openFollowupsCount}
          />
          {activePage === 'activity' && (
            <ActivityTimeline
              showMode={showMode}
              onShowModeChange={onShowModeChange}
              showLeads={showLeads}
              onShowLeadsChange={onShowLeadsChange}
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          )}
          {activePage === 'messages' && <Messages />}
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'training' && <TrainingMaterials />}
          {activePage === 'leads' && <LeadTracker onPageChange={onPageChange} />}
          {activePage === 'followups' && <Followups />}
          {activePage === 'schedule' && <StoreSchedule />}
          
          {/* Reports Pages */}
          {activePage === 'reports-daily' && <Reports initialTab="daily" onPageChange={onPageChange} />}
          {activePage === 'reports-weekly' && <Reports initialTab="weekly" onPageChange={onPageChange} />}
          {activePage === 'reports-monthly' && <Reports initialTab="monthly" onPageChange={onPageChange} />}
        </div>
      )}
    </FrameShowcase>
  );
}