import HeroImage from './HeroImage';

// ── Spiral Binding Bar ────────────────────────────────────────────────────────
const SpiralBinding = () => (
  <div className="relative w-full flex items-center justify-center"
    style={{ height: '36px', background: '#2a2a2a', zIndex: 10 }}>
    {/* Hook at center */}
    <div className="absolute flex items-start justify-center w-full" style={{ top: '-18px', zIndex: 20 }}>
      <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Nail/screw head */}
        <circle cx="14" cy="5" r="5" fill="#888" stroke="#555" strokeWidth="1.5" />
        {/* Hook body */}
        <path d="M14 10 Q14 30 6 34" stroke="#666" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>

    {/* Coil rings */}
    <div className="flex items-center justify-center gap-[7px] px-6 w-full">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className="rounded-full border-2"
          style={{
            width: '12px',
            height: '20px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d0d0d0 0%, #888 40%, #aaa 60%, #ccc 100%)',
            borderColor: '#555',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  </div>
);

// ── Main CalendarShell ────────────────────────────────────────────────────────
const CalendarShell = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return (
    // Page background (wall)
    <div className="min-h-screen flex items-center justify-center py-12"
      style={{ background: '#e8e8e8' }}>

      {/* Wall Calendar Card — portrait */}
      <div
        className="relative bg-white flex flex-col"
        style={{
          width: '520px',
          borderRadius: '4px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
          overflow: 'visible',
        }}
      >
        {/* Spiral Binding (sits on top, slightly above card) */}
        <div style={{ marginTop: '18px' }}>
          <SpiralBinding />
        </div>

        {/* Hero Section */}
        <div style={{ overflow: 'hidden' }}>
          <HeroImage month={currentMonth} year={currentYear} />
        </div>

        {/* ── Bottom Section: Notes (left) + Calendar Grid (right) ── */}
        <div className="flex" style={{ padding: '20px 24px 28px 24px', gap: '20px', minHeight: '260px' }}>

          {/* Notes Panel */}
          <div style={{ width: '160px', flexShrink: 0 }}>
            <p className="font-semibold text-zinc-700 mb-3" style={{ fontSize: '0.82rem' }}>Notes</p>
            <div className="flex flex-col gap-[10px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    height: '1px',
                    background: '#c8c8c8',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Calendar Grid Placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-zinc-300 text-sm font-medium tracking-wide">
              📅 Calendar Grid — Phase 4
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CalendarShell;
