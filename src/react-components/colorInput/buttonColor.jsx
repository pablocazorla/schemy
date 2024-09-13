import { useMemo } from "react";

const ButtonColor = ({ btnCol, opacity, color, setColor }) => {
  const [h, s, l, isCurrent] = useMemo(() => {
    const [h, s, l] = btnCol;
    const [hc, sc, lc] = color;
    const isCurrent = h === hc && s === sc && l === lc;
    return [h, s, l, isCurrent];
  }, [btnCol, color]);

  return (
    <div
      className={`border-2 rounded ${
        isCurrent ? "border-gray-400" : "border-transparent"
      }`}
    >
      <button
        className="w-5 h-5 rounded border border-gray-500 block"
        style={{ backgroundColor: `hsla(${h},${s}%,${l}%,${opacity})` }}
        onClick={() => {
          setColor(btnCol);
        }}
      ></button>
    </div>
  );
};

export default ButtonColor;
