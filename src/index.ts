import { formattedDate } from './utils/utils';

interface Streak {
  currentCount: number;
  startDate: string;
  lastLoginDate: string;
}

export function streakCounter(storage: Storage, date: Date): Streak {
  const streakInLocalStorage = storage.getItem('streak');

  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage || '');
      return streak;
    } catch (error) {
      console.error('Error parsing streak from localStorage', error);
    }
  }

  const streak = {
    currentCount: 1,
    startDate: formattedDate(date),
    lastLoginDate: formattedDate(date),
  };

  storage.setItem('streak', JSON.stringify(streak));

  return streak;
}
