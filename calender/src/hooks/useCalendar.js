import { useMemo } from 'react';

const useCalendar = (month, year) => {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstOfMonth = new Date(year, month, 1);
    let startDow = firstOfMonth.getDay();
    startDow = (startDow + 6) % 7;

    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startDow);

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + i);
      cellDate.setHours(0, 0, 0, 0);

      const dow = (cellDate.getDay() + 6) % 7;

      cells.push({
        date: cellDate,
        day: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === month,
        isToday: cellDate.getTime() === today.getTime(),
        isWeekend: dow === 5 || dow === 6,
        colIndex: dow,
      });
    }

    return cells;
  }, [month, year]);

  return { days };
};

export default useCalendar;
