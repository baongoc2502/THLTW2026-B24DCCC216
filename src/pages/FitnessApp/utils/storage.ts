export const STORAGE_KEYS = {
  WORKOUTS: 'fitness_workouts',
  HEALTH: 'fitness_health',
  GOALS: 'fitness_goals',
  EXERCISES: 'fitness_exercises',
};

export const getData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};