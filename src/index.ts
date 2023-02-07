import {
  Streak,
  KEY,
  formattedDate,
  buildStreak,
  updateStreak,
} from './utils/utils';

export function streakCounter(storage: Storage, date: Date): Streak {
  const streakInLocalStorage = storage.getItem(KEY);

  if (streakInLocalStorage) {
    try {
      const streak = JSON.parse(streakInLocalStorage) as Streak;
      const state = shouldIncrementOrResetStreakCount(
        date,
        streak.lastLoginDate
      );

      const SHOULD_INCREMENT = state === 'increment';
      const SHOULD_RESET = state === 'reset';

      if (SHOULD_INCREMENT) {
        const updatedStreak = buildStreak(date, {
          currentCount: streak.currentCount + 1,
          startDate: streak.startDate,
          lastLoginDate: formattedDate(date),
        });

        // store in localStorage
        updateStreak(storage, updatedStreak);
        return updatedStreak;
      }

      if (SHOULD_RESET) {
        const updatedStreak = buildStreak(date);

        // store in localStorage
        updateStreak(storage, updatedStreak);
        return updatedStreak;
      }

      return streak;
    } catch (error) {
      console.error('Error parsing streak from localStorage', error);
    }
  }

  const streak = buildStreak(date);
  updateStreak(storage, streak);

  return streak;
}

function shouldIncrementOrResetStreakCount(
  currentDate: Date,
  lastLoginDate: string
): 'increment' | 'reset' | 'none' {
  // We get 11/5/2021
  // so to get 5, we use our helper function
  const difference =
    currentDate.getDate() - parseInt(lastLoginDate.split('/')[1]);

  // Same-day login, do nothing
  if (difference === 0) {
    return 'none';
  }

  // This means they logged in the day after the currentDate
  if (difference === 1) {
    return 'increment';
  }
  // Otherwise they logged in after a day, which would
  // break the streak
  return 'reset';
}
