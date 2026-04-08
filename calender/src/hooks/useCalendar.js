import { useMemo } from 'react';

/**
 * useCalendar — generates a 6-row × 7-col grid of day objects for a given month.
 *
 * Each day object:
 * {
 *   date:        Date,
 *   day:         number,      // 1–31
 *   isCurrentMonth: boolean,
 *   isToday:     boolean,
 *   isWeekend:   boolean,     // Saturday or Sunday
 *   colIndex:    number,      // 0 = Mon … 6 = Sun
 * }
 *
 * @param {number} month  0-indexed (0 = January)
 * @param {number} year
 */
const useCalendar = (month, year) => {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First day of the target month
    const firstOfMonth = new Date(year, month, 1);
    // Day of week for first day: 0=Sun … 6=Sat → convert to Mon=0 … Sun=6
    let startDow = firstOfMonth.getDay(); // 0=Sun
    startDow = (startDow + 6) % 7;       // shift so Mon=0 … Sun=6

    // We need to go back `startDow` days to fill the leading overflow
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startDow);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + i);
      cellDate.setHours(0, 0, 0, 0);

      const dow = (cellDate.getDay() + 6) % 7; // Mon=0 … Sun=6

      cells.push({
        date: cellDate,
        day: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === month,
        isToday: cellDate.getTime() === today.getTime(),
        isWeekend: dow === 5 || dow === 6, // Sat or Sun
        colIndex: dow,
      });
    }

    return cells;
  }, [month, year]);

  return { days };
};

export default useCalendar;
