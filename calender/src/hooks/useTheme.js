import { useState, useEffect } from 'react';
import MONTH_ACCENTS from '../data/monthThemes';

const useTheme = (month) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('calendar-theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    try {
      localStorage.setItem('calendar-theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(d => !d);
  const accentColor = MONTH_ACCENTS[month];

  return { darkMode, toggleDarkMode, accentColor };
};

export default useTheme;
