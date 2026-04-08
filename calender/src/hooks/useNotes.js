import { useState, useEffect } from 'react';

const MAX_CHARS = 300;
const STORAGE_KEY = 'calendar-notes';

const useNotes = (month, year) => {
  const key = `${year}-${month}`;

  const [notes, setNotes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [notes]);

  const currentNote = notes[key] || '';

  const setNote = (value) => {
    if (value.length > MAX_CHARS) return;
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  return { currentNote, setNote, maxChars: MAX_CHARS };
};

export default useNotes;
