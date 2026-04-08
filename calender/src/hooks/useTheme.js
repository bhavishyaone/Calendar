import { useEffect } from 'react';
import MONTH_ACCENTS from '../data/monthThemes';

const useTheme = (month) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    try {
      localStorage.removeItem('calendar-theme');
    } catch {}
  }, []);

  const accentColor = MONTH_ACCENTS[month];

  return { accentColor };
};

export default useTheme;
