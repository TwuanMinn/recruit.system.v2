import { useState, useEffect } from 'react';

export function useDarkMode(): [boolean, () => void] {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('recruitment_dark_mode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('recruitment_dark_mode', String(dark));
  }, [dark]);

  const toggle = () => setDark((prev) => !prev);
  return [dark, toggle];
}
