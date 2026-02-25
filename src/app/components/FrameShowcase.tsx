import { useState } from 'react';

interface FrameShowcaseProps {
  children: (props: {
    staffFilter: string;
    showMode: 'all' | 'leads';
    onStaffFilterChange: (value: string) => void;
    onShowModeChange: (value: 'all' | 'leads') => void;
    activeFrame: 'default' | 'staff' | 'leads';
    onFrameChange: (frameId: 'default' | 'staff' | 'leads') => void;
    showLeads: boolean;
    onShowLeadsChange: (value: boolean) => void;
    dateRange: { start: Date; end: Date };
    onDateRangeChange: (range: { start: Date; end: Date }) => void;
    activePage: string;
    onPageChange: (page: string) => void;
  }) => React.ReactNode;
}

export function FrameShowcase({ children }: FrameShowcaseProps) {
  const [activeFrame, setActiveFrame] = useState<'default' | 'staff' | 'leads'>('default');
  const [activePage, setActivePage] = useState('dashboard');
  const [showLeads, setShowLeads] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date('2024-12-29'),
    end: new Date('2025-01-04')
  });

  const frames = [
    { id: 'default' as const, label: 'Frame 1: Default', staffFilter: 'All', showMode: 'all' as const },
    { id: 'staff' as const, label: 'Frame 2: Staff Focus', staffFilter: 'Pam', showMode: 'all' as const },
    { id: 'leads' as const, label: 'Frame 3: Lead Focus', staffFilter: 'All', showMode: 'leads' as const },
  ];

  const currentFrame = frames.find(f => f.id === activeFrame) || frames[0];
  const [staffFilter, setStaffFilter] = useState(currentFrame.staffFilter);
  const [showMode, setShowMode] = useState(currentFrame.showMode);

  const handleFrameChange = (frameId: 'default' | 'staff' | 'leads') => {
    setActiveFrame(frameId);
    const frame = frames.find(f => f.id === frameId);
    if (frame) {
      setStaffFilter(frame.staffFilter);
      setShowMode(frame.showMode);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children({
          staffFilter,
          showMode,
          onStaffFilterChange: setStaffFilter,
          onShowModeChange: setShowMode,
          activeFrame,
          onFrameChange: handleFrameChange,
          showLeads,
          onShowLeadsChange: setShowLeads,
          dateRange,
          onDateRangeChange: setDateRange,
          activePage,
          onPageChange: setActivePage,
        })}
      </div>
    </div>
  );
}