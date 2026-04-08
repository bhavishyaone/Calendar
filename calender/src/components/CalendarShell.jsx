import { useState, useCallback, useEffect, useRef } from 'react';
import useRangeSelector from '../hooks/useRangeSelector';
import HeroImage from './HeroImage';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';

const SpiralBinding = () => (
  <div
    className="relative w-full flex items-center justify-center"
    style={{ height: '36px', background: '#2a2a2a', zIndex: 10 }}
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

const NavButton = ({ direction, onClick, label }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="nav-btn flex items-center justify-center rounded-full"
    style={{
      width: '36px',
      height: '36px',
      minWidth: '36px',
      background: 'transparent',
      border: '1.5px solid #ddd',
      cursor: 'pointer',
      color: '#555',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = '#1AABE8';
      e.currentTarget.style.borderColor = '#1AABE8';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = '#ddd';
      e.currentTarget.style.color = '#555';
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
  const range = useRangeSelector();

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

  const monthKey = `${year}-${month}`;

  return (
    <div
      className="min-h-screen flex items-start sm:items-center justify-center py-12 px-3 sm:px-4"
      style={{ background: '#e8e8e8' }}
    >
      {/* Outer wrapper: overflow visible so the hook above the card is visible */}
      <div
        className="relative w-full"
        style={{ maxWidth: '520px', paddingTop: '20px' }}
      >
        {/* Spiral binding — absolutely positioned above the card */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
          <SpiralBinding />
        </div>

        {/* Card body — overflow hidden so nothing escapes the card boundaries */}
        <div
          className="bg-white flex flex-col"
          style={{
            marginTop: '36px',
            borderRadius: '4px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'hidden',
          }}
        >
          <FadeTransition trigger={monthKey}>
            <HeroImage month={month} year={year} />
          </FadeTransition>

          <div
            className="flex flex-col sm:flex-row"
            style={{
              padding: 'clamp(14px, 4vw, 20px) clamp(14px, 5vw, 24px) clamp(18px, 5vw, 28px)',
              gap: 'clamp(12px, 4vw, 20px)',
              minHeight: '260px',
            }}
          >
            <NotesPanel month={month} year={year} />

            <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <NavButton direction="prev" onClick={goToPrev} label="Previous month" />
                <NavButton direction="next" onClick={goToNext} label="Next month" />
              </div>

              <FadeTransition trigger={monthKey}>
                <CalendarGrid
                  month={month}
                  year={year}
                  isStart={range.isStart}
                  isEnd={range.isEnd}
                  isInRange={range.isInRange}
                  isHoverRange={range.isHoverRange}
                  isHoverStart={range.isHoverStart}
                  isHoverEnd={range.isHoverEnd}
                  onDayClick={range.handleDayClick}
                  onDayHover={range.handleDayHover}
                  onDayLeave={range.handleDayLeave}
                />
              </FadeTransition>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarShell;
