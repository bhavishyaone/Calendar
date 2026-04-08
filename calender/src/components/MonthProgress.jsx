const MonthProgress = ({ month, year, accentColor, darkMode }) => {
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

  if (!isCurrentMonth) return null;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const percent = Math.round((today.getDate() / daysInMonth) * 100);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: '0.62rem', color: darkMode ? '#666' : '#aaa', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Month Progress
        </span>
        <span style={{ fontSize: '0.62rem', color: accentColor, fontWeight: 700 }}>
          {percent}%
        </span>
      </div>
      <div style={{ height: '3px', borderRadius: '2px', background: darkMode ? '#2a2a2a' : '#eeeeee', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: accentColor,
            borderRadius: '2px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
};

export default MonthProgress;
