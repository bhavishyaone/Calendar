import { useState } from 'react';
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
  onDayClick   = () => {},
  onDayHover   = () => {},
  onDayLeave   = () => {},
}) => {
  const { days } = useCalendar(month, year);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const accentAlpha = accentColor + '28';
  const accentMid   = accentColor + '55';

  const textPrimary  = darkMode ? '#e5e5e5' : '#333333';
  const textOverflow = darkMode ? '#3a3a3a' : '#cccccc';
  const hoverBg      = darkMode ? '#2e2e2e' : '#f0f4f8';

  return (
    <div
      className="flex-1 select-none"
      style={{ minWidth: 0 }}
      onMouseLeave={() => { setHoveredIdx(null); onDayLeave(); }}
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

          let bgColor = 'transparent';
          if (isEndpoint) bgColor = accentColor;
          else if (inRange) bgColor = accentAlpha;
          else if (hoverRng) bgColor = accentMid;
          else if (cell.isToday) bgColor = accentColor;
          else if (isLocalHovered) bgColor = hoverBg;

          let textColor = textPrimary;
          if (isEndpoint || cell.isToday) textColor = '#ffffff';
          else if (isGray) textColor = textOverflow;
          else if (isWeekend) textColor = accentColor;

          const isActive = isEndpoint || cell.isToday;

          return (
            <div
              key={idx}
              className="flex items-center justify-center relative"
              style={{
                aspectRatio: '1 / 1',
                minHeight: '36px',
                background: hasRangeBg && !isEndpoint
                  ? (inRange ? accentAlpha : accentMid)
                  : 'transparent',
                borderRadius: 0,
                borderTopLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : 0,
                borderBottomLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : 0,
                borderTopRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : 0,
                borderBottomRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : 0,
              }}
              onClick={() => { if (!cell.isCurrentMonth) return; onDayClick(cell.date); }}
              onMouseEnter={() => {
                setHoveredIdx(idx);
                if (cell.isCurrentMonth) onDayHover(cell.date);
              }}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
