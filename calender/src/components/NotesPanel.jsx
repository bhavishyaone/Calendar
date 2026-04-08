import { useRef } from 'react';
import useNotes from '../hooks/useNotes';

const NotesPanel = ({ month, year, accentColor = '#1AABE8' }) => {
  const { currentNote, setNote, maxChars } = useNotes(month, year);
  const textareaRef = useRef(null);
  const remaining = maxChars - currentNote.length;
  const isNearLimit = remaining <= 40;
  const isAtLimit = remaining === 0;

  return (
    <div style={{ width: '150px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <p
        className="font-semibold mb-2"
        style={{ fontSize: '0.82rem', color: 'var(--notes-label)' }}
      >
        Notes
      </p>

      <textarea
        ref={textareaRef}
        value={currentNote}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note…"
        maxLength={maxChars}
        style={{
          flex: 1,
          resize: 'none',
          border: 'none',
          outline: 'none',
          fontSize: '0.75rem',
          lineHeight: '1.8',
          color: 'var(--notes-text)',
          background: 'transparent',
          fontFamily: 'inherit',
          width: '100%',
          padding: 0,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent calc(1.8em - 1px),
            var(--notes-line) calc(1.8em - 1px),
            var(--notes-line) 1.8em
          )`,
          backgroundAttachment: 'local',
          minHeight: '120px',
          caretColor: accentColor,
        }}
      />

      <div
        className="flex justify-end mt-1"
        style={{
          fontSize: '0.65rem',
          color: isAtLimit ? '#e53e3e' : isNearLimit ? '#d97706' : 'var(--text-muted)',
        }}
      >
        {remaining}/{maxChars}
      </div>
    </div>
  );
};

export default NotesPanel;
