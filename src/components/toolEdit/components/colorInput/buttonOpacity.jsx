import { useMemo } from "react";

const ButtonOpacity = ({ btnOp, color, opacity, setOpacity }) => {
  const [h, s, l, isCurrent] = useMemo(() => {
    const [h, s, l] = color;
    const isCurrent = btnOp === opacity;
    return [h, s, l, isCurrent];
  }, [btnOp, color, opacity]);

  return (
    <div
      className={`border-2 rounded ${
        isCurrent ? "border-gray-400" : "border-transparent"
      }`}
    >
      <button
        className="w-5 h-5 rounded border border-gray-500 block bg-base"
        onClick={() => {
          setOpacity(btnOp);
        }}
      >
        <span
          className="w-full h-full  block"
          style={{ backgroundColor: `hsla(${h},${s}%,${l}%,${btnOp})` }}
        ></span>
      </button>
    </div>
  );
};

export default ButtonOpacity;
