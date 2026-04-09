import type { ColorSet, ResultOption, Level, InterviewStatus, Gender } from './types';

// ===== Pagination =====
export const ITEMS_PER_PAGE = 10;

// ===== Level Colors =====
export const levelColors: Record<Level, ColorSet> = {
  Senior: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  Beginner: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
  Newbie: { bg: '#ede9fe', text: '#5b21b6', border: '#8b5cf6' },
};

// ===== Result Options (No "Yes" / "No") =====
export const resultOptions: ResultOption[] = [
  { value: '', label: '— Select —' },
  { value: 'Potential Talented', label: '⭐ Potential Talented' },
  { value: 'Hired', label: '🎉 Hired' },
  { value: 'Rejected', label: '🚫 Rejected' },
  { value: 'Future Consideration', label: '🔮 Future Consideration' },
];

// ===== Result Colors =====
export const resultColors: Record<string, ColorSet> = {
  'Potential Talented': { bg: '#fef3c7', text: '#92400e' },
  Hired: { bg: '#dbeafe', text: '#1e40af' },
  Rejected: { bg: '#fce7f3', text: '#9d174d' },
  'Future Consideration': { bg: '#ede9fe', text: '#5b21b6' },
};

// ===== Confirm Status Colors =====
export const confirmColors: Record<InterviewStatus, ColorSet> = {
  Confirmed: { bg: '#d1fae5', text: '#065f46', border: '#10b981', icon: '✅' },
  Rejected: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444', icon: '❌' },
  'No Response': { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db', icon: '⏳' },
};

// ===== Gender Icons =====
export const genderIcons: Record<Gender, string> = {
  Male: '♂️',
  Female: '♀️',
  Other: '⚧',
};

// ===== Avatar Colors =====
export const avatarColors: string[] = [
  '#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b',
  '#06b6d4', '#ef4444', '#14b8a6', '#a855f7', '#3b82f6',
];

// ===== Avatar Gradients =====
export const avatarGradients: Record<Gender, string> = {
  Male: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  Female: 'linear-gradient(135deg, #ec4899, #f472b6)',
  Other: 'linear-gradient(135deg, #10b981, #34d399)',
};

// ===== Local Storage Key =====
export const STORAGE_KEY = 'recruitment_system_candidates';
