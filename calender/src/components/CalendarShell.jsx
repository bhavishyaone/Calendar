import { useState, useCallback, useEffect, useRef } from 'react';
import useRangeSelector from '../hooks/useRangeSelector';
import useTheme from '../hooks/useTheme';
import useEvents from '../hooks/useEvents';
import useNotes from '../hooks/useNotes';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';
import EventModal from './EventModal';


const TwinLoop = () => (
  <svg width="14" height="26" viewBox="0 0 14 26" className="flex-shrink-0 block">
    <rect x="2" y="16" width="10" height="5" rx="2" fill="#151515" />
    {/* Left loop */}
    <path d="M 4 18 L 4 6 Q 4 1 7 1 Q 11 1 11 8 L 11 18" fill="none" stroke="#2a2a2a" strokeWidth="1.5" />
    <path d="M 4 18 L 4 6 Q 4 1 7 1 Q 11 1 11 8 L 11 18" fill="none" stroke="#888888" strokeWidth="0.5" />
    {/* Right loop */}
    <path d="M 7 18 L 7 6 Q 7 1 10 1 Q 14 1 14 8 L 14 18" fill="none" stroke="#111111" strokeWidth="1.2" />
  </svg>
);

const CenterHanger = () => (
  <svg width="34" height="42" viewBox="0 0 34 42" className="flex-shrink-0 block">
    <rect x="2" y="32" width="10" height="5" rx="2" fill="#151515" />
    <rect x="22" y="32" width="10" height="5" rx="2" fill="#151515" />
    {/* Hanger wire extending up */}
    <path d="M 7 34 L 7 24 L 14 14 C 14 8, 14 3, 17 3 C 20 3, 20 8, 20 14 L 27 24 L 27 34" fill="none" stroke="#2a2a2a" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Hanger wire highlight */}
    <path d="M 7 34 L 7 24 L 14 14 C 14 8, 14 3, 17 3 C 20 3, 20 8, 20 14 L 27 24 L 27 34" fill="none" stroke="#888888" strokeWidth="1" strokeLinejoin="round" />
  </svg>
);

const SpiralBinding = () => (
  <div
    className="absolute w-full flex items-end justify-center pointer-events-none overflow-hidden"
    style={{ top: '-30px', left: 0, zIndex: 10, gap: 'min(1vw, 6px)' }}
  >
    {Array.from({ length: 12 }).map((_, i) => <TwinLoop key={`l-${i}`} />)}
    <CenterHanger />
    {Array.from({ length: 12 }).map((_, i) => <TwinLoop key={`r-${i}`} />)}
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
  const { accentColor } = useTheme(month);
  const eventsHook = useEvents();
  const { currentNote, setNote, maxChars } = useNotes(month, year);

  const goToPrev = useCallback(() => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(month - 1);
    }
  }, [month]);

  const goToNext = useCallback(() => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(month + 1);
    }
  }, [month]);

  const goToToday = useCallback(() => {
    const t = new Date();
    setMonth(t.getMonth());
    setYear(t.getFullYear());
  }, []);

  const monthKey = `${year}-${month}`;
  const bindingBg = '#2a2a2a';
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
        style={{ maxWidth: '520px', marginTop: '36px' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <SpiralBinding />
        </div>

        <div
          className="flex flex-col"
          style={{
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
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

                </div>
                <NavButton direction="next" onClick={goToNext} label="Next month" accentColor={accentColor} />
              </div>
              <FadeTransition trigger={monthKey}>
                <CalendarGrid
                  month={month}
                  year={year}
                  accentColor={accentColor}

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

          onAdd={eventsHook.addEvent}
          onRemove={eventsHook.removeEvent}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
};

export default CalendarShell;
