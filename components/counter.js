"use client";  

import { useEffect, useState } from 'react';

export default function Counter({ end, duration }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const endVal = parseInt(end);
    const increment = endVal / (duration / 100);
    
    const handle = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        clearInterval(handle);
        setCount(endVal);
      } else {
        setCount(Math.ceil(start));
      }
    }, 100);

    return () => clearInterval(handle);
  }, [end, duration]);

  return (
    <span>+{count}</span>
  );
}
