import { useState, useCallback, useEffect, useRef } from 'react';
import useRangeSelector from '../hooks/useRangeSelector';
import useTheme from '../hooks/useTheme';
import useEvents from '../hooks/useEvents';
import useNotes from '../hooks/useNotes';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import EventModal from './EventModal';
import MonthProgress from './MonthProgress';


const SpiralBinding = ({ bindingBg }) => (
  <div
    className="relative w-full flex items-center justify-center"
    style={{ height: '36px', background: bindingBg, zIndex: 10 }}
  >
    <div className="absolute flex items-start justify-center w-full" style={{ top: '-18px', zIndex: 20 }}>
      <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="5" r="5" fill="#888" stroke="#555" strokeWidth="1.5" />
        <path d="M14 10 Q14 30 6 34" stroke="#666" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
    <div className="flex items-center justify-center gap-[5px] sm:gap-[7px] px-4 sm:px-6 w-full overflow-hidden">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '10px',
            height: '18px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d0d0d0 0%, #888 40%, #aaa 60%, #ccc 100%)',
            border: '1.5px solid #555',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  </div>
);

const NavButton = ({ direction, onClick, label, accentColor }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="nav-btn flex items-center justify-center rounded-full"
    style={{
      width: '36px',
      height: '36px',
      minWidth: '36px',
      background: 'transparent',
      border: '1.5px solid var(--border-light)',
      cursor: 'pointer',
      color: 'var(--text-secondary)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = accentColor;
      e.currentTarget.style.borderColor = accentColor;
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'var(--border-light)';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
    {direction === 'prev' ? (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

const DarkModeToggle = ({ darkMode, onToggle, accentColor }) => (
  <button
    onClick={onToggle}
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    className="nav-btn flex items-center justify-center rounded-full"
    style={{
      width: '36px',
      height: '36px',
      minWidth: '36px',
      background: darkMode ? accentColor : 'transparent',
      border: `1.5px solid ${darkMode ? accentColor : 'var(--border-light)'}`,
      cursor: 'pointer',
      color: darkMode ? '#fff' : 'var(--text-secondary)',
      transition: 'background 0.2s, border-color 0.2s, color 0.2s',
    }}
  >
    {darkMode ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

const FadeTransition = ({ trigger, children }) => {
  const [visible, setVisible] = useState(true);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (prevTrigger.current !== trigger) {
      setVisible(false);
      const t = setTimeout(() => {
        setVisible(true);
        prevTrigger.current = trigger;
      }, 180);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <div
      style={{
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
      }}
    >
      {children}
    </div>
  );
};


const CalendarShell = () => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [modalDate, setModalDate] = useState(null);

  const range = useRangeSelector();
  const { darkMode, toggleDarkMode, accentColor } = useTheme(month);
  const eventsHook = useEvents();
  const { currentNote, setNote, maxChars } = useNotes(month, year);

  const goToPrev = useCallback(() => {
    setMonth(m => {
      if (m === 0) { setYear(y => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const goToNext = useCallback(() => {
    setMonth(m => {
      if (m === 11) { setYear(y => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setMonth(t.getMonth());
    setYear(t.getFullYear());
  }, []);

  const monthKey = `${year}-${month}`;
  const bindingBg = darkMode ? '#111111' : '#2a2a2a';
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const handleEscape = useCallback(() => {
    range.reset();
    setModalDate(null);
  }, [range]);

  return (
    <div
      className="min-h-screen flex items-start sm:items-center justify-center py-12 px-3 sm:px-4"
      style={{ background: 'var(--bg-wall)', transition: 'background 0.3s ease' }}
    >
      <div
        className="relative w-full"
        style={{ maxWidth: '520px', paddingTop: '20px' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <SpiralBinding bindingBg={bindingBg} />
        </div>

        <div
          className="flex flex-col"
          style={{
            marginTop: '36px',
            borderRadius: '4px',
            boxShadow: darkMode
              ? '0 20px 60px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)'
              : '0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          <FadeTransition trigger={monthKey}>
            <HeroImage month={month} year={year} accentColor={accentColor} />
          </FadeTransition>

          <div
            className="flex flex-col sm:flex-row"
            style={{
              padding: 'clamp(14px, 4vw, 20px) clamp(14px, 5vw, 24px) clamp(18px, 5vw, 24px)',
              gap: 'clamp(12px, 4vw, 20px)',
              minHeight: '260px',
            }}
          >
            <NotesPanel
              currentNote={currentNote}
              setNote={setNote}
              maxChars={maxChars}
              accentColor={accentColor}
            />

            <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <NavButton direction="prev" onClick={goToPrev} label="Previous month" accentColor={accentColor} />
                <div className="flex items-center gap-1">
                  {!isCurrentMonth && (
                    <button
                      onClick={goToToday}
                      aria-label="Go to today"
                      title="Today"
                      style={{
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: `1.5px solid ${accentColor}`,
                        background: 'transparent',
                        color: accentColor,
                        cursor: 'pointer',
                        letterSpacing: '0.04em',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = accentColor; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = accentColor; }}
                    >
                      TODAY
                    </button>
                  )}
                  <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} accentColor={accentColor} />
                </div>
                <NavButton direction="next" onClick={goToNext} label="Next month" accentColor={accentColor} />
              </div>

              <MonthProgress month={month} year={year} accentColor={accentColor} darkMode={darkMode} />

              <FadeTransition trigger={monthKey}>
                <CalendarGrid
                  month={month}
                  year={year}
                  accentColor={accentColor}
                  darkMode={darkMode}
                  isStart={range.isStart}
                  isEnd={range.isEnd}
                  isInRange={range.isInRange}
                  isHoverRange={range.isHoverRange}
                  isHoverStart={range.isHoverStart}
                  isHoverEnd={range.isHoverEnd}
                  hasEvents={eventsHook.hasEvents}
                  onDayClick={range.handleDayClick}
                  onDayHover={range.handleDayHover}
                  onDayLeave={range.handleDayLeave}
                  onDayDoubleClick={(date) => setModalDate(date)}
                  onEscape={handleEscape}
                />
              </FadeTransition>
            </div>
          </div>

        </div>
      </div>

      {modalDate && (
        <EventModal
          date={modalDate}
          events={eventsHook.getEvents(modalDate)}
          accentColor={accentColor}
          darkMode={darkMode}
          onAdd={eventsHook.addEvent}
          onRemove={eventsHook.removeEvent}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
};

export default CalendarShell;
