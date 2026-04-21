import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setVal(value), delay);
    return () => clearTimeout(t);
  }, [value]);

  return val;
};