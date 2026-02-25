import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit2, MoreVertical, Trash2, Copy } from 'lucide-react';

type DaySchedule = {
  date: string;
  dayName: string;
  dayNumber: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

type BlackoutPeriod = {
  id: string;
  dayIndex: number;
  startTime: string;
  endTime: string;
  reason?: string;
  excludeFromSLA: boolean;
};

type EditMode = 'operating' | 'blackout';
type ZoomLevel = 'compact' | 'comfortable' | 'detailed';

export function StoreSchedule() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2026, 0, 5)); // Jan 5, 2026
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('compact');
  const [weekDays, setWeekDays] = useState<DaySchedule[]>([]);
  
  // Example blackout periods
  const [blackoutPeriods, setBlackoutPeriods] = useState<BlackoutPeriod[]>([
    { id: '1', dayIndex: 2, startTime: '12:00', endTime: '13:30', reason: 'Staff meeting', excludeFromSLA: true },
    { id: '2', dayIndex: 5, startTime: '16:00', endTime: '18:00', reason: 'Private event', excludeFromSLA: true },
    { id: '3', dayIndex: 0, startTime: '09:00', endTime: '10:00', reason: 'No staff', excludeFromSLA: true },
  ]);
  
  const [dragState, setDragState] = useState<{
    isCreating: boolean;
    dayIndex: number | null;
    startTime: string | null;
    currentTime: string | null;
    isResizing: boolean;
    resizingId: string | null;
    resizeEdge: 'start' | 'end' | null;
    isDragging: boolean;
    draggingId: string | null;
    dragStartY: number | null;
  }>({
    isCreating: false,
    dayIndex: null,
    startTime: null,
    currentTime: null,
    isResizing: false,
    resizingId: null,
    resizeEdge: null,
    isDragging: false,
    draggingId: null,
    dragStartY: null,
  });

  const [popover, setPopover] = useState<{
    show: boolean;
    blockId: string | null;
    isNew: boolean;
    position: { top: number; left: number } | null;
    dayIndex: number | null;
    startTime: string;
    endTime: string;
  }>({
    show: false,
    blockId: null,
    isNew: false,
    position: null,
    dayIndex: null,
    startTime: '',
    endTime: '',
  });

  const [popoverForm, setPopoverForm] = useState({
    startTime: '',
    endTime: '',
    reason: '',
    applyToAllDays: false,
    copyToDays: [] as number[],
  });

  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [operatingHoursPopover, setOperatingHoursPopover] = useState<{
    show: boolean;
    dayIndex: number | null;
    position: { top: number; left: number } | null;
  }>({
    show: false,
    dayIndex: null,
    position: null,
  });

  const [operatingHoursForm, setOperatingHoursForm] = useState({
    openTime: '',
    closeTime: '',
    isClosed: false,
    applyToAll: false,
  });

  // Generate time options for dropdowns (15-min increments)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const time24 = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const time12 = `${hour12.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')} ${ampm}`;
        options.push({ value: time24, label: time12 });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Generate week dates
  const generateWeek = (startDate: Date): DaySchedule[] => {
    const week: DaySchedule[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      week.push({
        date: date.toISOString(),
        dayName: days[date.getDay()],
        dayNumber: date.getDate(),
        openTime: '07:00',
        closeTime: '18:00',
        isClosed: false
      });
    }
    return week;
  };

  // Initialize weekDays
  useEffect(() => {
    setWeekDays(generateWeek(currentWeekStart));
  }, [currentWeekStart]);

  // Format day header
  const formatDayHeader = (day: DaySchedule) => {
    const date = new Date(day.date);
    const month = date.getMonth() + 1;
    const dayNum = date.getDate();
    return `${day.dayName} ${month}/${dayNum}`;
  };

  // Generate time slots based on zoom level
  const getTimeSlots = () => {
    const slots = [];
    const increment = zoomLevel === 'detailed' ? 15 : zoomLevel === 'comfortable' ? 30 : 60;
    
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += increment) {
        slots.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

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

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const isTimeInRange = (time: string, openTime: string, closeTime: string) => {
    const timeMinutes = timeToMinutes(time);
    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);
    return timeMinutes >= openMinutes && timeMinutes < closeMinutes;
  };

  const isTimeInBlackout = (dayIndex: number, time: string) => {
    const timeMinutes = timeToMinutes(time);
    return blackoutPeriods.some(period => {
      if (period.dayIndex !== dayIndex) return false;
      const startMinutes = timeToMinutes(period.startTime);
      const endMinutes = timeToMinutes(period.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    });
  };

  const getBlockAtTime = (dayIndex: number, time: string): BlackoutPeriod | null => {
    const timeMinutes = timeToMinutes(time);
    return blackoutPeriods.find(period => {
      if (period.dayIndex !== dayIndex) return false;
      const startMinutes = timeToMinutes(period.startTime);
      const endMinutes = timeToMinutes(period.endTime);
      return timeMinutes >= startMinutes && timeMinutes < endMinutes;
    }) || null;
  };

  const isTimeInDragPreview = (dayIndex: number, time: string) => {
    if (!dragState.isCreating || dragState.dayIndex !== dayIndex || !dragState.startTime || !dragState.currentTime) {
      return false;
    }
    const timeMinutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(dragState.startTime);
    const currentMinutes = timeToMinutes(dragState.currentTime);
    const increment = zoomLevel === 'detailed' ? 15 : zoomLevel === 'comfortable' ? 30 : 60;
    const minTime = Math.min(startMinutes, currentMinutes);
    const maxTime = Math.max(startMinutes, currentMinutes) + increment;
    return timeMinutes >= minTime && timeMinutes < maxTime;
  };

  const handleCellMouseDown = (dayIndex: number, time: string, event: React.MouseEvent) => {
    // Check if clicking on existing block
    const existingBlock = getBlockAtTime(dayIndex, time);
    if (existingBlock) {
      // Don't start drag - block will handle its own interactions
      return;
    }

    // Only allow creating blackouts in operating hours
    if (!isTimeInRange(time, weekDays[dayIndex].openTime, weekDays[dayIndex].closeTime)) {
      return;
    }

    // Start creating new blackout period
    setDragState({
      ...dragState,
      isCreating: true,
      dayIndex,
      startTime: time,
      currentTime: time,
    });
  };

  const handleCellMouseEnter = (dayIndex: number, time: string) => {
    if (dragState.isCreating && dragState.dayIndex === dayIndex) {
      setDragState(prev => ({
        ...prev,
        currentTime: time,
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragState.isCreating && dragState.startTime && dragState.currentTime && dragState.dayIndex !== null) {
      const startMinutes = timeToMinutes(dragState.startTime);
      const currentMinutes = timeToMinutes(dragState.currentTime);
      const increment = zoomLevel === 'detailed' ? 15 : zoomLevel === 'comfortable' ? 30 : 60;
      const minTime = Math.min(startMinutes, currentMinutes);
      const maxTime = Math.max(startMinutes, currentMinutes) + increment;

      const startTime = minutesToTime(minTime);
      const endTime = minutesToTime(maxTime);

      // Get position for popover
      const position = { top: 200, left: 400 }; // Will be calculated properly below

      setPopover({
        show: true,
        blockId: null,
        isNew: true,
        position,
        dayIndex: dragState.dayIndex,
        startTime,
        endTime,
      });

      setPopoverForm({
        startTime,
        endTime,
        reason: '',
        applyToAllDays: false,
        copyToDays: [],
      });
    }

    setDragState({
      isCreating: false,
      dayIndex: null,
      startTime: null,
      currentTime: null,
      isResizing: false,
      resizingId: null,
      resizeEdge: null,
      isDragging: false,
      draggingId: null,
      dragStartY: null,
    });
  };

  const handleBlockClick = (block: BlackoutPeriod, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPopover({
      show: true,
      blockId: block.id,
      isNew: false,
      position: { top: rect.top, left: rect.left + rect.width + 8 },
      dayIndex: block.dayIndex,
      startTime: block.startTime,
      endTime: block.endTime,
    });

    setPopoverForm({
      startTime: block.startTime,
      endTime: block.endTime,
      reason: block.reason || '',
      applyToAllDays: false,
      copyToDays: [],
    });
  };

  const handleSavePopover = () => {
    if (popover.isNew && popover.dayIndex !== null) {
      // Create new block(s)
      const newBlocks: BlackoutPeriod[] = [];
      
      if (popoverForm.applyToAllDays) {
        weekDays.forEach((_, idx) => {
          newBlocks.push({
            id: `blackout-${Date.now()}-${idx}`,
            dayIndex: idx,
            startTime: popoverForm.startTime,
            endTime: popoverForm.endTime,
            reason: popoverForm.reason,
            excludeFromSLA: true,
          });
        });
      } else if (popoverForm.copyToDays.length > 0) {
        popoverForm.copyToDays.forEach(idx => {
          newBlocks.push({
            id: `blackout-${Date.now()}-${idx}`,
            dayIndex: idx,
            startTime: popoverForm.startTime,
            endTime: popoverForm.endTime,
            reason: popoverForm.reason,
            excludeFromSLA: true,
          });
        });
      } else {
        newBlocks.push({
          id: `blackout-${Date.now()}`,
          dayIndex: popover.dayIndex,
          startTime: popoverForm.startTime,
          endTime: popoverForm.endTime,
          reason: popoverForm.reason,
          excludeFromSLA: true,
        });
      }

      setBlackoutPeriods(prev => [...prev, ...newBlocks]);
    } else if (popover.blockId) {
      // Update existing block
      setBlackoutPeriods(prev =>
        prev.map(b =>
          b.id === popover.blockId
            ? { ...b, startTime: popoverForm.startTime, endTime: popoverForm.endTime, reason: popoverForm.reason }
            : b
        )
      );
    }

    setPopover({ show: false, blockId: null, isNew: false, position: null, dayIndex: null, startTime: '', endTime: '' });
  };

  const handleDeleteBlock = () => {
    if (popover.blockId) {
      setBlackoutPeriods(prev => prev.filter(b => b.id !== popover.blockId));
      setPopover({ show: false, blockId: null, isNew: false, position: null, dayIndex: null, startTime: '', endTime: '' });
    }
  };

  const handleCancelPopover = () => {
    setPopover({ show: false, blockId: null, isNew: false, position: null, dayIndex: null, startTime: '', endTime: '' });
  };

  const handleOpenOperatingHoursPopover = (dayIndex: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const day = weekDays[dayIndex];
    
    setOperatingHoursPopover({
      show: true,
      dayIndex,
      position: { top: rect.bottom + 8, left: rect.left },
    });
    
    setOperatingHoursForm({
      openTime: day.openTime,
      closeTime: day.closeTime,
      isClosed: day.isClosed,
      applyToAll: false,
    });
  };

  const handleSaveOperatingHours = () => {
    if (operatingHoursPopover.dayIndex === null) return;
    
    setWeekDays(prev => {
      if (operatingHoursForm.applyToAll) {
        // Apply to all days
        return prev.map(day => ({
          ...day,
          openTime: operatingHoursForm.isClosed ? day.openTime : operatingHoursForm.openTime,
          closeTime: operatingHoursForm.isClosed ? day.closeTime : operatingHoursForm.closeTime,
          isClosed: operatingHoursForm.isClosed,
        }));
      } else {
        // Apply to single day
        return prev.map((day, idx) =>
          idx === operatingHoursPopover.dayIndex
            ? {
                ...day,
                openTime: operatingHoursForm.isClosed ? day.openTime : operatingHoursForm.openTime,
                closeTime: operatingHoursForm.isClosed ? day.closeTime : operatingHoursForm.closeTime,
                isClosed: operatingHoursForm.isClosed,
              }
            : day
        );
      }
    });
    
    setOperatingHoursPopover({ show: false, dayIndex: null, position: null });
  };

  const handleCancelOperatingHours = () => {
    setOperatingHoursPopover({ show: false, dayIndex: null, position: null });
  };

  const formatTime12h = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const jumpToTime = (target: string) => {
    if (!gridRef.current) return;
    
    let targetHour = 0;
    switch (target) {
      case 'open':
        targetHour = parseInt(weekDays[0]?.openTime.split(':')[0] || '7');
        break;
      case 'morning':
        targetHour = 6;
        break;
      case 'afternoon':
        targetHour = 12;
        break;
      case 'evening':
        targetHour = 17;
        break;
      case 'overnight':
        targetHour = 22;
        break;
    }
    
    const rowHeight = zoomLevel === 'detailed' ? 20 : zoomLevel === 'comfortable' ? 32 : 48;
    const increment = zoomLevel === 'detailed' ? 15 : zoomLevel === 'comfortable' ? 30 : 60;
    const rowsPerHour = 60 / increment;
    const targetRow = targetHour * rowsPerHour;
    
    gridRef.current.scrollTop = targetRow * rowHeight;
  };

  // Calculate block positions for rendering
  const getBlocksForDay = (dayIndex: number) => {
    return blackoutPeriods.filter(b => b.dayIndex === dayIndex);
  };

  const getBlockStyle = (block: BlackoutPeriod) => {
    const startMinutes = timeToMinutes(block.startTime);
    const endMinutes = timeToMinutes(block.endTime);
    const increment = zoomLevel === 'detailed' ? 15 : zoomLevel === 'comfortable' ? 30 : 60;
    const rowHeight = zoomLevel === 'detailed' ? 20 : zoomLevel === 'comfortable' ? 32 : 48;
    const rowsPerHour = 60 / increment;
    
    const startRow = (startMinutes / 60) * rowsPerHour;
    const endRow = (endMinutes / 60) * rowsPerHour;
    
    return {
      top: `${startRow * rowHeight}px`,
      height: `${(endRow - startRow) * rowHeight}px`,
    };
  };

  const getCellHeight = () => {
    return zoomLevel === 'detailed' ? 'h-5' : zoomLevel === 'comfortable' ? 'h-8' : 'h-12';
  };

  if (weekDays.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50" onMouseUp={handleMouseUp}>
      {/* Header */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#111] mb-1">Store Schedule</h1>
            <p className="text-sm text-[#667085]">Manage store info, operating hours, and staff</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#667085]" />
            </button>
            <div className="text-sm font-medium text-[#111] min-w-[150px] text-center">
              {formatDateRange()}
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#667085]" />
            </button>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#111]">Store Information</h2>
          <button className="flex items-center gap-1 px-3 py-1.5 border border-[#EAECEF] rounded-lg text-xs font-medium text-[#667085] hover:bg-gray-50 transition-colors">
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-[#111] font-medium">Devon · 5052</span>
          </div>
          <div className="flex items-center gap-2 text-[#667085]">
            <span>Pacific Time (PT) (UTC-8:00)</span>
          </div>
          <div className="flex items-center gap-2 text-[#667085]">
            <span>(133) 456-2456</span>
            <span>·</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-[#EAECEF] text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs">Do not call</span>
            </label>
          </div>
        </div>
      </div>

      {/* Edit Mode Toggle & Controls */}
      <div className="bg-white border-b border-[#EAECEF] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#667085]">Zoom:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setZoomLevel('compact')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    zoomLevel === 'compact'
                      ? 'bg-white text-[#111] shadow-sm'
                      : 'text-[#667085] hover:text-[#111]'
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setZoomLevel('comfortable')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    zoomLevel === 'comfortable'
                      ? 'bg-white text-[#111] shadow-sm'
                      : 'text-[#667085] hover:text-[#111]'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  onClick={() => setZoomLevel('detailed')}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    zoomLevel === 'detailed'
                      ? 'bg-white text-[#111] shadow-sm'
                      : 'text-[#667085] hover:text-[#111]'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#EAECEF]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-[#EAECEF] rounded"></div>
            <span className="text-xs text-[#667085]">Non-operating hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-[#EAECEF] rounded"></div>
            <span className="text-xs text-[#667085]">Operating hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)' }}></div>
            <span className="text-xs text-[#667085]">Blackout time (SLA paused)</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="flex-1 overflow-hidden px-8 py-6">
        <div className="h-full bg-white border border-[#EAECEF] rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b-2 border-[#EAECEF] bg-gray-50 sticky top-0 z-10">
            <div className="px-4 py-3 text-xs font-semibold text-[#667085] border-r border-[#EAECEF]">
              Time
            </div>
            {weekDays.map((day, dayIdx) => (
              <div
                key={day.date}
                className="px-3 py-3 text-center border-r border-[#EAECEF] last:border-r-0"
              >
                <div className="text-xs font-semibold text-[#111] mb-1.5">
                  {formatDayHeader(day)}
                </div>
                <div className="flex items-center justify-center gap-1.5 group">
                  <span className="text-xs text-[#667085]">
                    {day.isClosed ? 'Closed' : `${day.openTime} - ${day.closeTime}`}
                  </span>
                  <button
                    onClick={(e) => handleOpenOperatingHoursPopover(dayIdx, e)}
                    className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-all"
                    title="Edit operating hours"
                  >
                    <Edit2 className="w-3 h-3 text-[#667085]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid with Scroll */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden" ref={gridRef}>
            <div className="relative">
              {/* Time Grid Rows */}
              <div className="divide-y divide-[#EAECEF]">
                {timeSlots.map((time, timeIdx) => (
                  <div key={time} className="grid grid-cols-8">
                    {/* Time Label - Sticky */}
                    <div className={`px-4 ${getCellHeight()} flex items-center text-xs font-medium text-[#667085] border-r border-[#EAECEF] bg-gray-50 sticky left-0 z-[5]`}>
                      {time}
                    </div>
                    
                    {/* Day Cells */}
                    {weekDays.map((day, dayIdx) => {
                      const isOperatingHours = !day.isClosed && isTimeInRange(time, day.openTime, day.closeTime);
                      const isBlackout = isTimeInBlackout(dayIdx, time);
                      const isDragPreview = isTimeInDragPreview(dayIdx, time);
                      
                      return (
                        <div
                          key={`${day.date}-${time}`}
                          className={`border-r border-[#EAECEF] last:border-r-0 transition-colors relative ${getCellHeight()} ${
                            isOperatingHours && !isBlackout && !isDragPreview
                              ? 'bg-white hover:bg-blue-50 cursor-crosshair'
                              : isDragPreview
                              ? 'bg-blue-100 border-2 border-blue-400'
                              : 'bg-gray-100'
                          }`}
                          onMouseDown={(e) => handleCellMouseDown(dayIdx, time, e)}
                          onMouseEnter={() => handleCellMouseEnter(dayIdx, time)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Blackout Blocks Overlay */}
              {weekDays.map((day, dayIdx) => {
                const blocks = getBlocksForDay(dayIdx);
                return (
                  <div
                    key={`blocks-${day.date}`}
                    className="absolute top-0 pointer-events-none"
                    style={{
                      left: `${((dayIdx + 1) / 8) * 100}%`,
                      width: `${(1 / 8) * 100}%`,
                      height: '100%',
                    }}
                  >
                    {blocks.map((block) => {
                      const style = getBlockStyle(block);
                      const isHovered = hoveredBlock === block.id;
                      
                      return (
                        <div
                          key={block.id}
                          className="absolute inset-x-0 mx-0.5 bg-blue-100 border-2 border-blue-300 rounded-md pointer-events-auto cursor-pointer hover:bg-blue-200 transition-colors group"
                          style={{
                            top: style.top,
                            height: style.height,
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(59, 130, 246, 0.15) 3px, rgba(59, 130, 246, 0.15) 6px)',
                          }}
                          onClick={(e) => handleBlockClick(block, e)}
                          onMouseEnter={() => setHoveredBlock(block.id)}
                          onMouseLeave={() => setHoveredBlock(null)}
                        >
                          <div className="px-2 py-1 text-xs font-medium text-blue-900 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">SLA PAUSED</span>
                              {block.reason && <span className="text-[10px]">{block.reason}</span>}
                            </div>
                            <button
                              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-blue-300 rounded transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBlockClick(block, e);
                              }}
                            >
                              <MoreVertical className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Anchored Popover */}
      {popover.show && (
        <>
          {/* Backdrop - subtle, non-blocking */}
          <div className="fixed inset-0 z-40" onClick={handleCancelPopover}></div>
          
          {/* Popover */}
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-[#EAECEF] w-80"
            style={{
              top: popover.position?.top || '50%',
              left: popover.position?.left || '50%',
              transform: popover.position ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className="p-4 border-b border-[#EAECEF]">
              <h3 className="text-sm font-semibold text-[#111]">Blackout Time</h3>
              {popover.dayIndex !== null && (
                <p className="text-xs text-[#667085] mt-1">
                  {formatDayHeader(weekDays[popover.dayIndex])} · Pacific Time (PT)
                </p>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Start time</label>
                  <input
                    type="time"
                    value={popoverForm.startTime}
                    onChange={(e) => setPopoverForm({ ...popoverForm, startTime: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">End time</label>
                  <input
                    type="time"
                    value={popoverForm.endTime}
                    onChange={(e) => setPopoverForm({ ...popoverForm, endTime: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#111] mb-1">Reason (optional)</label>
                <select
                  value={popoverForm.reason}
                  onChange={(e) => setPopoverForm({ ...popoverForm, reason: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select reason...</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Staff meeting">Staff meeting</option>
                  <option value="No staff">No staff</option>
                  <option value="Private event">Private event</option>
                  <option value="Classes">Classes</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-xs font-medium text-blue-900">Exclude from Lead SLA clock</span>
                </div>
                <p className="text-[10px] text-blue-700 ml-5">
                  Lead response time will not count during this period.
                </p>
              </div>

              {popover.isNew && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={popoverForm.applyToAllDays}
                      onChange={(e) => setPopoverForm({ ...popoverForm, applyToAllDays: e.target.checked, copyToDays: [] })}
                      className="w-3.5 h-3.5 rounded border-[#EAECEF] text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs text-[#667085]">Apply to all days this week</span>
                  </label>

                  {!popoverForm.applyToAllDays && (
                    <div>
                      <span className="text-xs font-medium text-[#667085] block mb-2">Or copy to specific days:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {weekDays.map((day, idx) => (
                          <label key={idx} className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={popoverForm.copyToDays.includes(idx)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPopoverForm({ ...popoverForm, copyToDays: [...popoverForm.copyToDays, idx] });
                                } else {
                                  setPopoverForm({ ...popoverForm, copyToDays: popoverForm.copyToDays.filter(d => d !== idx) });
                                }
                              }}
                              className="w-3 h-3 rounded border-[#EAECEF] text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-xs text-[#667085]">{day.dayName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#EAECEF] flex items-center justify-between gap-2">
              <div>
                {!popover.isNew && (
                  <button
                    onClick={handleDeleteBlock}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelPopover}
                  className="px-3 py-1.5 text-xs font-medium text-[#667085] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePopover}
                  className="px-3 py-1.5 text-xs font-medium bg-[#111] text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Operating Hours Popover */}
      {operatingHoursPopover.show && (
        <>
          {/* Backdrop - subtle, non-blocking */}
          <div className="fixed inset-0 z-40" onClick={handleCancelOperatingHours}></div>
          
          {/* Popover */}
          <div
            className="fixed z-50 bg-white rounded-xl shadow-2xl border border-[#EAECEF] w-80"
            style={{
              top: operatingHoursPopover.position?.top || '50%',
              left: operatingHoursPopover.position?.left || '50%',
              transform: operatingHoursPopover.position ? 'none' : 'translate(-50%, -50%)',
            }}
          >
            <div className="p-4 border-b border-[#EAECEF]">
              <h3 className="text-sm font-semibold text-[#111]">Operating Hours</h3>
              {operatingHoursPopover.dayIndex !== null && (
                <p className="text-xs text-[#667085] mt-1">
                  {formatDayHeader(weekDays[operatingHoursPopover.dayIndex])} · Pacific Time (PT)
                </p>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Open time</label>
                  <input
                    type="time"
                    value={operatingHoursForm.openTime}
                    onChange={(e) => setOperatingHoursForm({ ...operatingHoursForm, openTime: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#111] mb-1">Close time</label>
                  <input
                    type="time"
                    value={operatingHoursForm.closeTime}
                    onChange={(e) => setOperatingHoursForm({ ...operatingHoursForm, closeTime: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-xs font-medium text-blue-900">Exclude from Lead SLA clock</span>
                </div>
                <p className="text-[10px] text-blue-700 ml-5">
                  Lead response time will not count during this period.
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={operatingHoursForm.isClosed}
                    onChange={(e) => setOperatingHoursForm({ ...operatingHoursForm, isClosed: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#EAECEF] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-[#667085]">Closed</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={operatingHoursForm.applyToAll}
                    onChange={(e) => setOperatingHoursForm({ ...operatingHoursForm, applyToAll: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-[#EAECEF] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-[#667085]">Apply to all days this week</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-[#EAECEF] flex items-center justify-between gap-2">
              <div></div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelOperatingHours}
                  className="px-3 py-1.5 text-xs font-medium text-[#667085] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveOperatingHours}
                  className="px-3 py-1.5 text-xs font-medium bg-[#111] text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}