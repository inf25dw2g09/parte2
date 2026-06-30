import { useState, useEffect, useCallback } from 'react';

// Hook personalizado que centraliza o padrão repetido em todas as páginas:
// chamar a API e gerir os estados loading / error / data, com cleanup
// para não fazer setState depois do componente desmontar.
// Devolve também reload() para repetir o pedido (ex: após apagar um item)
// e setData() para ajustes otimistas locais.
//
// Uso: const { data, loading, error, reload } = useFetch(() => getTasks(), []);
export default function useFetch(fetcher, deps = []) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const reload = useCallback(() => setReloadFlag((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve(fetcher())
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Ocorreu um erro ao carregar os dados.'
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadFlag]);

  return { data, loading, error, reload, setData };
}