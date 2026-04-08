import { useState, useRef } from 'react';
import useCalendar from '../hooks/useCalendar';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const CalendarGrid = ({
  month,
  year,
  accentColor = '#1AABE8',
  darkMode = false,
  isStart      = () => false,
  isEnd        = () => false,
  isInRange    = () => false,
  isHoverRange = () => false,
  isHoverStart = () => false,
  isHoverEnd   = () => false,
  hasEvents    = () => false,
  onDayClick        = () => {},
  onDayHover        = () => {},
  onDayLeave        = () => {},
  onDayDoubleClick  = () => {},
  onEscape          = () => {},
}) => {
  const { days } = useCalendar(month, year);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const gridRef = useRef(null);
  const usingKeyboard = useRef(false);
  const clickTimeout = useRef(null);

  const accentAlpha = accentColor + '28';
  const accentMid   = accentColor + '55';
  const textPrimary  = darkMode ? '#e5e5e5' : '#333333';
  const textOverflow = darkMode ? '#3a3a3a' : '#cccccc';
  const hoverBg      = darkMode ? '#2e2e2e' : '#f0f4f8';

  const handleKeyDown = (e) => {
    if (focusedIdx === null && e.key === 'Tab') return;

    let next = focusedIdx ?? 14;

    if (e.key === 'ArrowRight') { e.preventDefault(); next = Math.min(41, next + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next = Math.max(0, next - 1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); next = Math.min(41, next + 7); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); next = Math.max(0, next - 7); }
    else if ((e.key === 'Enter' || e.key === ' ') && focusedIdx !== null) {
      e.preventDefault();
      const cell = days[focusedIdx];
      if (cell?.isCurrentMonth) onDayClick(cell.date);
      return;
    } else if (e.key === 'Escape') {
      onEscape();
      return;
    } else return;

    setFocusedIdx(next);
    usingKeyboard.current = true;
  };

  const handleCellClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    clickTimeout.current = setTimeout(() => {
      onDayClick(cell.date);
    }, 200);
  };

  const handleCellDoubleClick = (cell) => {
    if (!cell.isCurrentMonth) return;
    if (clickTimeout.current) clearTimeout(clickTimeout.current);
    onDayDoubleClick(cell.date);
  };

  return (
    <div
      ref={gridRef}
      role="grid"
      className="flex-1 select-none outline-none"
      style={{ minWidth: 0 }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={() => { usingKeyboard.current = false; setFocusedIdx(null); }}
      onFocus={() => { if (usingKeyboard.current) setFocusedIdx(f => f ?? 14); }}
      onBlur={() => { setFocusedIdx(null); usingKeyboard.current = false; }}
      onMouseLeave={() => { setHoveredIdx(null); onDayLeave(); }}
      aria-label="Calendar grid"
      aria-activedescendant={focusedIdx !== null && days[focusedIdx] ? `cell-${days[focusedIdx].date.getTime()}` : undefined}
    >
      <div className="grid mb-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className="text-center font-semibold"
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.05em',
              color: i >= 5 ? accentColor : (darkMode ? '#aaaaaa' : '#444444'),
              paddingBottom: '6px',
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map((cell, idx) => {
          const isGray     = !cell.isCurrentMonth;
          const isWeekend  = cell.isWeekend && cell.isCurrentMonth;
          const start      = isStart(cell.date);
          const end        = isEnd(cell.date);
          const inRange    = isInRange(cell.date);
          const hoverRng   = isHoverRange(cell.date);
          const hoverSt    = isHoverStart(cell.date);
          const hoverEn    = isHoverEnd(cell.date);
          const isEndpoint = start || end || hoverSt || hoverEn;
          const hasRangeBg = inRange || hoverRng;
          const colIndex   = idx % 7;
          const isFirstCol = colIndex === 0;
          const isLastCol  = colIndex === 6;
          const isLocalHovered = hoveredIdx === idx && !isEndpoint && !cell.isToday && cell.isCurrentMonth;
          const isFocused  = focusedIdx === idx && cell.isCurrentMonth && usingKeyboard.current;
          const cellHasEvents = cell.isCurrentMonth && hasEvents(cell.date);

          let bgColor = 'transparent';
          if (isEndpoint) bgColor = accentColor;
          else if (inRange) bgColor = accentAlpha;
          else if (hoverRng) bgColor = accentMid;
          else if (cell.isToday) bgColor = accentColor;
          else if (isLocalHovered || isFocused) bgColor = hoverBg;

          let textColor = textPrimary;
          if (isEndpoint || cell.isToday) textColor = '#ffffff';
          else if (isGray) textColor = textOverflow;
          else if (isWeekend) textColor = accentColor;

          const isActive = isEndpoint || cell.isToday;

          return (
            <div
              key={cell.date.getTime()}
              id={`cell-${cell.date.getTime()}`}
              role="gridcell"
              className="flex flex-col items-center justify-center relative"
              style={{
                aspectRatio: '1 / 1',
                minHeight: '36px',
                background: hasRangeBg && !isEndpoint
                  ? (inRange ? accentAlpha : accentMid)
                  : 'transparent',
                borderTopLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : isFocused ? '4px' : 0,
                borderBottomLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : isFocused ? '4px' : 0,
                borderTopRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : isFocused ? '4px' : 0,
                borderBottomRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : isFocused ? '4px' : 0,
                outline: isFocused ? `2px solid ${accentColor}` : 'none',
                outlineOffset: '-2px',
              }}
              onClick={() => handleCellClick(cell)}
              onDoubleClick={() => handleCellDoubleClick(cell)}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                if (cell.isCurrentMonth) onDayHover(cell.date);
              }}
              title={cellHasEvents ? 'Double-click to view events' : cell.isCurrentMonth ? 'Double-click to add event' : ''}
            >
              <span
                className={`cal-day-inner${isActive ? ' active' : ''} flex items-center justify-center font-medium z-10 relative`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '0.78rem',
                  cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                  background: bgColor,
                  color: textColor,
                  fontWeight: isEndpoint || cell.isToday ? '700' : isWeekend ? '600' : '400',
                  boxShadow: isEndpoint ? `0 2px 8px ${accentColor}66` : 'none',
                  transform: isLocalHovered ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {cell.day}
              </span>

              {cellHasEvents && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: isEndpoint || cell.isToday ? '#fff' : accentColor,
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
