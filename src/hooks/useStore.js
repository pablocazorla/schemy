import { useState, useEffect, useCallback } from "react";

const useStore = (store) => {
  const [value, setValue] = useState(store.value);

  useEffect(() => {
    const unsubscribe = store.subscribe((value) => {
      setValue(value);
    });

    return unsubscribe;
  }, [store]);

  const set = useCallback(
    (value) => {
      store.set(value);
    },
    [store]
  );

  return [value, set];
};

export default useStore;
