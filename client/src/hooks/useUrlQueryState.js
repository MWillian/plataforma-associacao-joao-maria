import { useEffect, useState } from 'react';

function readQueryValue(key, initialValue, parse) {
  const value = new URLSearchParams(window.location.search).get(key);

  return value === null ? initialValue : parse(value);
}

export function useUrlQueryState(
  key,
  initialValue,
  { parse = (value) => value, serialize = (value) => value, history = 'replace' } = {}
) {
  const [value, setValue] = useState(() =>
    readQueryValue(key, initialValue, parse)
  );

  useEffect(() => {
    const handlePopState = () => {
      setValue(readQueryValue(key, initialValue, parse));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialValue, key, parse]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const serializedValue = serialize(value);

    if (serializedValue === '' || serializedValue == null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, serializedValue);
    }

    if (url.href === window.location.href) {
      return;
    }

    if (history === 'push') {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }, [history, key, serialize, value]);

  return [value, setValue];
}
