export function debounce(fn: (...args: any[]) => void, timeout = 500) {
  let timer: number;

  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}
