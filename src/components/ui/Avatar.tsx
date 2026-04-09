import React from 'react';
import { avatarColors } from '../../constants';

interface AvatarProps {
  name: string;
  id: string;
  size?: string;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({ name, id, size = 'w-10 h-10 text-xs' }) => {
  const color = avatarColors[hashString(id) % avatarColors.length];
  const initials = getInitials(name);

  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white font-bold select-none flex-shrink-0 group-hover:ring-2 ring-primary/20 transition-all`}
      style={{ background: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
};
