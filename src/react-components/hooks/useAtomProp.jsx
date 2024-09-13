import { useEffect, useState } from "react";

const useAtomProp = (atomProp) => {
  const [value, setValue] = useState(atomProp.get());

  useEffect(() => {
    atomProp.subscribe(setValue);
  }, [atomProp]);

  const onChange = (newValue) => {
    atomProp.set(newValue);
  };

  return [value, onChange];
};

export default useAtomProp;
