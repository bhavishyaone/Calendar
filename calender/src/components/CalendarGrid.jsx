import useCalendar from '../hooks/useCalendar';

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

// The blue accent colour matching the reference image
const BLUE = '#1AABE8';

/**
 * CalendarGrid — renders the full 7-column, 6-row calendar grid.
 * Matches the reference layout:
 *   - Weekday headers: MON–FRI dark, SAT–SUN blue
 *   - Current-month dates: dark text
 *   - Overflow dates (prev/next month): light gray
 *   - SAT/SUN dates: blue accent
 *   - Today's date: filled blue circle
 *
 * @param {{ month: number, year: number }} props  month is 0-indexed
 */
const CalendarGrid = ({ month, year }) => {
  const { days } = useCalendar(month, year);

  return (
    <div className="flex-1 select-none" style={{ minWidth: 0 }}>
      {/* ── Weekday Headers ── */}
      <div
        className="grid mb-2"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}
      >
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

      {/* ── Day Cells ── */}
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}
      >
        {days.map((cell, idx) => {
          const isGray = !cell.isCurrentMonth;
          const isBlueDate = cell.isWeekend && cell.isCurrentMonth;

          return (
            <div
              key={idx}
              className="flex items-center justify-center"
              style={{ aspectRatio: '1 / 1' }}
            >
              <span
                className="flex items-center justify-center font-medium transition-all duration-150"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  fontSize: '0.78rem',
                  cursor: cell.isCurrentMonth ? 'pointer' : 'default',
                  // Today: filled blue circle, white text
                  background: cell.isToday ? BLUE : 'transparent',
                  color: cell.isToday
                    ? '#fff'
                    : isGray
                    ? '#ccc'
                    : isBlueDate
                    ? BLUE
                    : '#333',
                  fontWeight: cell.isToday ? '700' : isBlueDate ? '600' : '400',
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
