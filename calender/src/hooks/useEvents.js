import { useState, useEffect } from 'react';

const STORAGE_KEY = 'calendar-events';

const toDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const useEvents = () => {
  const [events, setEvents] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  const addEvent = (date, title) => {
    if (!title.trim()) return;
    const key = toDateKey(date);
    setEvents(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { id: Date.now(), title: title.trim() }],
    }));
  };

  const removeEvent = (date, id) => {
    const key = toDateKey(date);
    setEvents(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter(e => e.id !== id),
    }));
  };

  const getEvents = (date) => events[toDateKey(date)] || [];

  const hasEvents = (date) => getEvents(date).length > 0;

  return { events, addEvent, removeEvent, getEvents, hasEvents, toDateKey };
};

export default useEvents;
