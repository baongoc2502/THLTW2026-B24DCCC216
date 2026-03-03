export const load = (key: string, defaultData: any) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
};

export const save = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};