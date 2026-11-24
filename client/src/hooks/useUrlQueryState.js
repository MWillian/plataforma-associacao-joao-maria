import { useCallback, useEffect, useRef, useState } from 'react';

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

  // parse costuma ser uma função criada a cada render. Se ela fosse dependência do
  // efeito abaixo, o listener seria removido e recriado em todo render, inclusive no
  // meio de um popstate (quando o App também atualiza estado), e o "voltar" do
  // navegador deixaria de ser ouvido. Por isso ela fica guardada em uma ref.
  const parseRef = useRef(parse);
  const initialValueRef = useRef(initialValue);
  const replaceHistoryRef = useRef(false);
  const setValueReplacingHistory = useCallback((nextValue) => {
    replaceHistoryRef.current = true;
    setValue(nextValue);
  }, []);

  useEffect(() => {
    parseRef.current = parse;
    initialValueRef.current = initialValue;
  });

  useEffect(() => {
    const handlePopState = () => {
      setValue(readQueryValue(key, initialValueRef.current, parseRef.current));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, [key]);

  // A primeira sincronização (ao montar a página) não pode criar entrada no histórico,
  // senão o botão "voltar" do navegador precisa de vários cliques para sair da página.
  const isFirstSyncRef = useRef(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const serializedValue = serialize(value);
    const isDefaultValue = serializedValue === serialize(initialValue);

    // Valor padrão (ex.: página 1, busca vazia) fica fora da URL.
    if (serializedValue === '' || serializedValue == null || isDefaultValue) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, serializedValue);
    }

    const isFirstSync = isFirstSyncRef.current;
    isFirstSyncRef.current = false;
    const shouldPushHistory =
      history === 'push' && !isFirstSync && !replaceHistoryRef.current;
    replaceHistoryRef.current = false;

    if (url.href === window.location.href) {
      return;
    }

    if (shouldPushHistory) {
      window.history.pushState({}, '', url);
    } else {
      window.history.replaceState({}, '', url);
    }
  }, [history, initialValue, key, serialize, value]);

  return [value, setValue, setValueReplacingHistory];
}
