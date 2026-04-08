import { useState } from 'react';
import useCalendar from '../hooks/useCalendar';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const BLUE = '#1AABE8';
const BLUE_LIGHT = '#e6f6fd';
const BLUE_MID   = '#b3e3f7';

const CalendarGrid = ({
  month,
  year,
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
              color: i >= 5 ? BLUE : '#444',
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
          const isBlueDate = cell.isWeekend && cell.isCurrentMonth;
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
          if (isEndpoint) bgColor = BLUE;
          else if (inRange) bgColor = BLUE_LIGHT;
          else if (hoverRng) bgColor = BLUE_MID;
          else if (cell.isToday) bgColor = BLUE;
          else if (isLocalHovered) bgColor = '#f0f4f8';

          let textColor = '#333';
          if (isEndpoint || cell.isToday) textColor = '#fff';
          else if (isGray) textColor = '#ccc';
          else if (isBlueDate) textColor = BLUE;

          const isActive = isEndpoint || cell.isToday;

          return (
            <div
              key={idx}
              className="cal-day-cell flex items-center justify-center relative"
              style={{
                aspectRatio: '1 / 1',
                minHeight: '36px',
                background: hasRangeBg && !isEndpoint
                  ? (inRange ? BLUE_LIGHT : BLUE_MID)
                  : 'transparent',
                borderRadius: 0,
                borderTopLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : 0,
                borderBottomLeftRadius: (start || hoverSt || isFirstCol) && hasRangeBg ? '50%' : 0,
                borderTopRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : 0,
                borderBottomRightRadius: (end || hoverEn || isLastCol) && hasRangeBg ? '50%' : 0,
              }}
              onClick={() => {
                if (!cell.isCurrentMonth) return;
                onDayClick(cell.date);
              }}
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
                  fontWeight: isEndpoint || cell.isToday ? '700' : isBlueDate ? '600' : '400',
                  boxShadow: isEndpoint ? '0 2px 8px rgba(26,171,232,0.4)' : 'none',
                  transform: isLocalHovered ? 'scale(1.15)' : 'scale(1)',
                  transition: 'background 0.12s, color 0.12s, box-shadow 0.12s, transform 0.1s',
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
