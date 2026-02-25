import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw, Phone, MessageSquare, Users, Activity, User } from 'lucide-react';

type DayActivity = {
  date: string;
  dayName: string;
  dayNumber: number;
  calls: number;
  messages: number;
  leads: number;
};

type ActivityBlock = {
  id: string;
  dayIndex: number;
  startHour: number;
  duration: number; // in hours
  calls?: number;
  messages?: number;
  leads?: number;
  staff?: string; // Staff member name
};

export function ActivityTimeline() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 0, 12)); // Jan 12, 2026
  const [weekDays, setWeekDays] = useState<DayActivity[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string>('All Staff');

  const staffNames = ['Stephanie', 'Olivia', 'Bob', 'Unidentified'];

  // Example activity blocks
  const [activities] = useState<ActivityBlock[]>([
    // Monday
    { id: '1', dayIndex: 0, startHour: 0, duration: 0.5, leads: 1, staff: 'Stephanie' },
    { id: '2', dayIndex: 0, startHour: 3, duration: 0.5, calls: 1, staff: 'Olivia' },
    { id: '3', dayIndex: 0, startHour: 5, duration: 0.5, calls: 5, leads: 1, staff: 'Bob' },
    { id: '4', dayIndex: 0, startHour: 8, duration: 1, calls: 4, staff: 'Stephanie' },
    { id: '5', dayIndex: 0, startHour: 10, duration: 0.5, calls: 1, staff: 'Unidentified' },
    { id: '6', dayIndex: 0, startHour: 11, duration: 0.5, calls: 2, staff: 'Olivia' },
    { id: '7', dayIndex: 0, startHour: 11.5, duration: 0.5, calls: 4, staff: 'Bob' },
    { id: '8', dayIndex: 0, startHour: 14, duration: 1.5, calls: 13, messages: 5, staff: 'Stephanie' },
    { id: '9', dayIndex: 0, startHour: 17, duration: 0.5, leads: 2, staff: 'Olivia' },
    { id: '10', dayIndex: 0, startHour: 19, duration: 0.5, leads: 1, staff: 'Unidentified' },
    { id: '11', dayIndex: 0, startHour: 20, duration: 0.5, leads: 1, staff: 'Bob' },
    
    // Tuesday
    { id: '12', dayIndex: 1, startHour: 1, duration: 0.5, messages: 1, staff: 'Stephanie' },
    { id: '13', dayIndex: 1, startHour: 4, duration: 1, calls: 1, messages: 1, staff: 'Olivia' },
    { id: '14', dayIndex: 1, startHour: 5, duration: 0.5, messages: 1, staff: 'Bob' },
    { id: '15', dayIndex: 1, startHour: 5.5, duration: 0.5, messages: 5, staff: 'Unidentified' },
    { id: '16', dayIndex: 1, startHour: 6, duration: 0.5, calls: 1, messages: 1, staff: 'Stephanie' },
    { id: '17', dayIndex: 1, startHour: 6.5, duration: 0.5, calls: 3, messages: 2, staff: 'Olivia' },
    { id: '18', dayIndex: 1, startHour: 9, duration: 1, calls: 4, leads: 1, staff: 'Bob' },
    { id: '19', dayIndex: 1, startHour: 11, duration: 0.5, calls: 2, leads: 1, staff: 'Stephanie' },
    { id: '20', dayIndex: 1, startHour: 12, duration: 0.5, calls: 1, staff: 'Unidentified' },
    { id: '21', dayIndex: 1, startHour: 13, duration: 0.5, calls: 1, staff: 'Olivia' },
    { id: '22', dayIndex: 1, startHour: 14, duration: 0.5, calls: 1, staff: 'Bob' },
    { id: '23', dayIndex: 1, startHour: 15, duration: 0.5, leads: 1, staff: 'Stephanie' },
    { id: '24', dayIndex: 1, startHour: 17, duration: 0.5, messages: 1, staff: 'Unidentified' },
    { id: '25', dayIndex: 1, startHour: 18, duration: 0.5, leads: 1, staff: 'Olivia' },
    { id: '26', dayIndex: 1, startHour: 20, duration: 0.5, leads: 1, staff: 'Bob' },
    
    // Wednesday
    { id: '27', dayIndex: 2, startHour: 2, duration: 0.5, leads: 1, staff: 'Stephanie' },
    { id: '28', dayIndex: 2, startHour: 5, duration: 1, messages: 4, staff: 'Olivia' },
    { id: '29', dayIndex: 2, startHour: 6, duration: 0.5, messages: 2, leads: 1, staff: 'Bob' },
    { id: '30', dayIndex: 2, startHour: 7, duration: 0.5, calls: 5, messages: 13, leads: 2, staff: 'Stephanie' },
    { id: '31', dayIndex: 2, startHour: 11, duration: 0.5, leads: 1, staff: 'Unidentified' },
    { id: '32', dayIndex: 2, startHour: 12, duration: 0.5, calls: 1, leads: 1, staff: 'Olivia' },
    { id: '33', dayIndex: 2, startHour: 13, duration: 0.5, calls: 2, messages: 1, staff: 'Bob' },
    { id: '34', dayIndex: 2, startHour: 15, duration: 1, calls: 5, messages: 10, leads: 1, staff: 'Stephanie' },
    { id: '35', dayIndex: 2, startHour: 17, duration: 0.5, calls: 1, messages: 4, leads: 1, staff: 'Unidentified' },
    { id: '36', dayIndex: 2, startHour: 19, duration: 0.5, messages: 1, leads: 1, staff: 'Olivia' },
    { id: '37', dayIndex: 2, startHour: 21, duration: 0.5, leads: 1, staff: 'Bob' },
    
    // Thursday
    { id: '38', dayIndex: 3, startHour: 1, duration: 0.5, leads: 1, staff: 'Stephanie' },
    { id: '39', dayIndex: 3, startHour: 3, duration: 0.5, calls: 1, staff: 'Olivia' },
    { id: '40', dayIndex: 3, startHour: 7, duration: 1, calls: 2, messages: 3, staff: 'Bob' },
    { id: '41', dayIndex: 3, startHour: 9, duration: 0.5, calls: 3, leads: 1, staff: 'Stephanie' },
    { id: '42', dayIndex: 3, startHour: 10, duration: 0.5, messages: 2, staff: 'Unidentified' },
    { id: '43', dayIndex: 3, startHour: 12, duration: 0.5, calls: 1, messages: 1, staff: 'Olivia' },
    { id: '44', dayIndex: 3, startHour: 14, duration: 1, calls: 5, messages: 7, leads: 1, staff: 'Bob' },
    { id: '45', dayIndex: 3, startHour: 16, duration: 0.5, calls: 2, staff: 'Stephanie' },
    { id: '46', dayIndex: 3, startHour: 18, duration: 0.5, messages: 1, staff: 'Unidentified' },
    { id: '47', dayIndex: 3, startHour: 21, duration: 0.5, leads: 2, staff: 'Olivia' },
    
    // Friday
    { id: '48', dayIndex: 4, startHour: 0, duration: 0.5, calls: 2, staff: 'Bob' },
    { id: '49', dayIndex: 4, startHour: 2, duration: 0.5, leads: 1, staff: 'Stephanie' },
    { id: '50', dayIndex: 4, startHour: 5, duration: 1, calls: 3, messages: 2, leads: 1, staff: 'Olivia' },
    { id: '51', dayIndex: 4, startHour: 8, duration: 0.5, calls: 1, staff: 'Unidentified' },
    { id: '52', dayIndex: 4, startHour: 10, duration: 1, calls: 4, messages: 3, staff: 'Bob' },
    { id: '53', dayIndex: 4, startHour: 13, duration: 0.5, calls: 2, messages: 1, staff: 'Stephanie' },
    { id: '54', dayIndex: 4, startHour: 15, duration: 0.5, messages: 3, staff: 'Olivia' },
    { id: '55', dayIndex: 4, startHour: 16, duration: 0.5, calls: 1, staff: 'Unidentified' },
    { id: '56', dayIndex: 4, startHour: 18, duration: 0.5, calls: 5, messages: 2, leads: 1, staff: 'Bob' },
    { id: '57', dayIndex: 4, startHour: 20, duration: 0.5, leads: 2, staff: 'Stephanie' },
    
    // Saturday
    { id: '58', dayIndex: 5, startHour: 3, duration: 1, messages: 2, leads: 1, staff: 'Olivia' },
    { id: '59', dayIndex: 5, startHour: 6, duration: 0.5, calls: 1, leads: 1, staff: 'Bob' },
    { id: '60', dayIndex: 5, startHour: 8, duration: 0.5, calls: 3, staff: 'Stephanie' },
    { id: '61', dayIndex: 5, startHour: 10, duration: 1, calls: 2, messages: 4, leads: 2, staff: 'Unidentified' },
    { id: '62', dayIndex: 5, startHour: 13, duration: 0.5, messages: 1, staff: 'Olivia' },
    { id: '63', dayIndex: 5, startHour: 15, duration: 1, calls: 4, messages: 2, staff: 'Bob' },
    { id: '64', dayIndex: 5, startHour: 18, duration: 0.5, calls: 1, messages: 1, staff: 'Stephanie' },
    { id: '65', dayIndex: 5, startHour: 21, duration: 0.5, leads: 1, staff: 'Unidentified' },
    
    // Sunday
    { id: '66', dayIndex: 6, startHour: 2, duration: 0.5, messages: 1, staff: 'Olivia' },
    { id: '67', dayIndex: 6, startHour: 5, duration: 1, calls: 2, leads: 1, staff: 'Bob' },
    { id: '68', dayIndex: 6, startHour: 8, duration: 0.5, calls: 1, messages: 2, staff: 'Stephanie' },
    { id: '69', dayIndex: 6, startHour: 10, duration: 1, messages: 3, leads: 1, staff: 'Unidentified' },
    { id: '70', dayIndex: 6, startHour: 13, duration: 0.5, calls: 4, messages: 1, staff: 'Olivia' },
    { id: '71', dayIndex: 6, startHour: 15, duration: 0.5, calls: 1, staff: 'Bob' },
    { id: '72', dayIndex: 6, startHour: 17, duration: 0.5, messages: 2, staff: 'Stephanie' },
    { id: '73', dayIndex: 6, startHour: 19, duration: 0.5, calls: 2, leads: 1, staff: 'Unidentified' },
  ]);

  // Generate week dates
  const generateWeek = (startDate: Date): DayActivity[] => {
    const week: DayActivity[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Calculate activities for this day (filtered by selected staff)
      const filteredActivities = selectedStaff === 'All Staff' 
        ? activities.filter(a => a.dayIndex === i)
        : activities.filter(a => a.dayIndex === i && a.staff === selectedStaff);
      
      const calls = filteredActivities.reduce((sum, a) => sum + (a.calls || 0), 0);
      const messages = filteredActivities.reduce((sum, a) => sum + (a.messages || 0), 0);
      const leads = filteredActivities.reduce((sum, a) => sum + (a.leads || 0), 0);
      
      week.push({
        date: date.toISOString(),
        dayName: days[date.getDay()],
        dayNumber: date.getDate(),
        calls,
        messages,
        leads,
      });
    }
    return week;
  };

  // Initialize weekDays
  useEffect(() => {
    setWeekDays(generateWeek(currentWeekStart));
    // Set initial selected block
    setSelectedBlock('39');
  }, [currentWeekStart, selectedStaff]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatDateRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    
    const startMonth = currentWeekStart.toLocaleString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const startDay = currentWeekStart.getDate();
    const endDay = endDate.getDate();
    const year = currentWeekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}-${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const formatDayHeader = (day: DayActivity) => {
    const date = new Date(day.date);
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day.dayName} ${day.dayNumber}`;
  };

  const formatFullDateRange = () => {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(currentWeekStart.getDate() + 6);
    
    const startMonth = currentWeekStart.toLocaleString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleString('en-US', { month: 'short' });
    const startDay = currentWeekStart.getDate();
    const endDay = endDate.getDate();
    const year = currentWeekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${startMonth} ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const getBlockStyle = (block: ActivityBlock) => {
    const hourHeight = 60; // pixels per hour
    const top = block.startHour * hourHeight;
    const height = block.duration * hourHeight;
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };

  const getBlockColor = (isSelected: boolean, isHovered: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 border-blue-600';
    }
    if (isHovered) {
      return 'bg-blue-400 border-blue-500';
    }
    return 'bg-blue-100 border-blue-200';
  };

  const getBlockTextColor = (isSelected: boolean) => {
    if (isSelected) {
      return 'text-white';
    }
    return 'text-[#111]';
  };

  const totalActivities = activities.length;
  const totalCalls = activities.reduce((sum, a) => sum + (a.calls || 0), 0);
  const totalMessages = activities.reduce((sum, a) => sum + (a.messages || 0), 0);
  const totalLeads = activities.reduce((sum, a) => sum + (a.leads || 0), 0);

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i === 0 ? 12 : i > 12 ? i - 12 : i} ${i < 12 ? 'AM' : 'PM'}`);

  if (weekDays.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#111] mb-1">Store Activity</h1>
            <p className="text-sm text-[#667085]">Activity timeline for the selected store</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-[#EAECEF]"
            >
              <ChevronLeft className="w-4 h-4 text-[#667085]" />
            </button>
            <div className="text-sm font-medium text-[#111] min-w-[150px] text-center">
              {formatDateRange()}
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors border border-[#EAECEF]"
            >
              <ChevronRight className="w-4 h-4 text-[#667085]" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-[#EAECEF] rounded-lg text-sm font-medium text-[#667085] hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAECEF] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#667085]" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#111]">{totalActivities}</div>
                <div className="text-xs text-[#667085]">Total Activities</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#111]">{totalCalls}</div>
                <div className="text-xs text-[#667085]">Calls</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#111]">{totalMessages}</div>
                <div className="text-xs text-[#667085]">Messages</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#EAECEF] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-[#111]">{totalLeads}</div>
                <div className="text-xs text-[#667085]">Leads</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#667085]">
              {formatFullDateRange()} <span className="font-medium text-[#111]">({totalActivities} activities)</span>
            </div>
            {/* Staff Filter */}
            <select 
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="px-3 py-1.5 text-sm border border-[#EAECEF] rounded-lg text-[#111] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All Staff">All Staff</option>
              {staffNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <select className="px-2 py-1 text-xs border border-[#EAECEF] rounded-lg text-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>12 AM</option>
              </select>
              <span className="text-xs text-[#667085]">to</span>
              <select className="px-2 py-1 text-xs border border-[#EAECEF] rounded-lg text-[#667085] focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>12 AM</option>
              </select>
            </div>
            <button className="px-3 py-1 text-xs font-medium text-[#667085] hover:bg-gray-50 rounded-lg transition-colors">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="flex-1 overflow-hidden px-8 py-6">
        <div className="h-full bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b-2 border-[#EAECEF] bg-gray-50 sticky top-0 z-10">
            <div className="px-3 py-3 text-xs font-semibold text-[#667085] border-r border-[#EAECEF]">
              {/* Empty for time column */}
            </div>
            {weekDays.map((day) => (
              <div
                key={day.date}
                className="px-2 py-3 text-center border-r border-[#EAECEF] last:border-r-0"
              >
                <div className="text-xs font-semibold text-[#111] mb-2">
                  {formatDayHeader(day)}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-[#667085]">
                  <span className="flex items-center gap-0.5">
                    <Phone className="w-3 h-3" />
                    {day.calls}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-3 h-3" />
                    {day.messages}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Users className="w-3 h-3" />
                    {day.leads}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid with Activities */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="grid grid-cols-8">
              {/* Time Column */}
              <div className="border-r border-[#EAECEF] bg-gray-50">
                {timeSlots.map((time, idx) => (
                  <div
                    key={idx}
                    className="h-[60px] px-2 py-1 text-[10px] text-[#667085] border-b border-[#EAECEF]"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Day Columns with Activities */}
              {weekDays.map((day, dayIdx) => (
                <div
                  key={day.date}
                  className="border-r border-[#EAECEF] last:border-r-0 relative"
                  style={{ minHeight: '1440px' }} // 24 hours * 60px
                >
                  {/* Hour Grid Lines */}
                  {timeSlots.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[60px] border-b border-[#EAECEF]"
                    />
                  ))}

                  {/* Activity Blocks */}
                  <div className="absolute inset-0 pointer-events-none">
                    {activities
                      .filter(a => {
                        // Filter by day
                        if (a.dayIndex !== dayIdx) return false;
                        // Filter by selected staff
                        if (selectedStaff !== 'All Staff' && a.staff !== selectedStaff) return false;
                        return true;
                      })
                      .map((block) => {
                        const style = getBlockStyle(block);
                        const isSelected = selectedBlock === block.id;
                        const isHovered = hoveredBlock === block.id;
                        
                        return (
                          <div
                            key={block.id}
                            className={`absolute inset-x-1 border-2 rounded-md pointer-events-auto cursor-pointer transition-all ${getBlockColor(isSelected, isHovered)}`}
                            style={{
                              top: style.top,
                              height: style.height,
                            }}
                            onClick={() => setSelectedBlock(block.id)}
                            onMouseEnter={() => setHoveredBlock(block.id)}
                            onMouseLeave={() => setHoveredBlock(null)}
                          >
                            <div className={`px-2 py-1 text-[10px] font-medium flex items-center gap-1.5 flex-wrap ${getBlockTextColor(isSelected)}`}>
                              {block.calls && (
                                <span className="flex items-center gap-0.5">
                                  <Phone className="w-3 h-3" />
                                  {block.calls}
                                </span>
                              )}
                              {block.messages && (
                                <span className="flex items-center gap-0.5">
                                  <MessageSquare className="w-3 h-3" />
                                  {block.messages}
                                </span>
                              )}
                              {block.leads && (
                                <span className="flex items-center gap-0.5">
                                  <User className="w-3 h-3" />
                                  {block.leads}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-[#EAECEF] px-8 py-3">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-[#667085]">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-600" />
            <span className="text-xs text-[#667085]">SMS</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-[#667085]">Voicemail</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-[#667085]">Leads</span>
          </div>
        </div>
      </div>
    </div>
  );
}