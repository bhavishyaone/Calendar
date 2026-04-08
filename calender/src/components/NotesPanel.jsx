import { useRef } from 'react';
import useNotes from '../hooks/useNotes';

const BLUE = '#1AABE8';

const NotesPanel = ({ month, year }) => {
  const { currentNote, setNote, maxChars } = useNotes(month, year);
  const textareaRef = useRef(null);
  const remaining = maxChars - currentNote.length;
  const isNearLimit = remaining <= 40;
  const isAtLimit = remaining === 0;

  return (
    <div style={{ width: '160px', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <p
        className="font-semibold text-zinc-700 mb-2"
        style={{ fontSize: '0.82rem' }}
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
          color: '#444',
          background: 'transparent',
          fontFamily: 'inherit',
          width: '100%',
          padding: 0,
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent calc(1.8em - 1px),
            #d0d0d0 calc(1.8em - 1px),
            #d0d0d0 1.8em
          )`,
          backgroundAttachment: 'local',
          minHeight: '130px',
        }}
      />

      <div
        className="flex justify-end mt-1"
        style={{ fontSize: '0.65rem', color: isAtLimit ? '#e53e3e' : isNearLimit ? '#d97706' : '#aaa' }}
      >
        {remaining}/{maxChars}
      </div>
    </div>
  );
};

export default NotesPanel;
