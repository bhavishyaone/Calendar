import { useState, useRef } from 'react';

const EventModal = ({ date, events, accentColor, darkMode, onAdd, onRemove, onClose }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(date, input.trim());
      setInput('');
      inputRef.current?.focus();
    }
  };

  const cardBg   = darkMode ? '#1c1c1e' : '#ffffff';
  const itemBg   = darkMode ? '#111111' : '#f5f5f5';
  const textMain = darkMode ? '#e5e5e5' : '#333333';
  const textSub  = darkMode ? '#aaaaaa' : '#666666';
  const inputBg  = darkMode ? '#0f0f0f' : '#f9f9f9';
  const borderC  = darkMode ? '#2a2a2a' : '#eeeeee';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-2xl p-5 flex flex-col"
        style={{
          maxWidth: '360px',
          background: cardBg,
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
          border: `1px solid ${borderC}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p style={{ fontSize: '0.68rem', color: accentColor, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
              Events
            </p>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: textMain }}>
              {dateStr}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textSub, fontSize: '1.1rem', lineHeight: 1, padding: '2px' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Add an event…"
            style={{
              flex: 1,
              border: `1.5px solid ${borderC}`,
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '0.82rem',
              background: inputBg,
              color: textMain,
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              background: accentColor,
              border: 'none',
              borderRadius: '10px',
              padding: '8px 14px',
              cursor: 'pointer',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              flexShrink: 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {events.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: textSub, textAlign: 'center', padding: '16px 0' }}>
              No events yet
            </p>
          )}
          {events.map(ev => (
            <div
              key={ev.id}
              className="flex items-center justify-between"
              style={{ padding: '8px 12px', borderRadius: '10px', background: itemBg }}
            >
              <div className="flex items-center gap-2">
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: accentColor,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '0.8rem', color: textMain }}>{ev.title}</span>
              </div>
              <button
                onClick={() => onRemove(date, ev.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53e3e', fontSize: '0.75rem', padding: '2px 4px', lineHeight: 1 }}
                aria-label="Remove event"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
