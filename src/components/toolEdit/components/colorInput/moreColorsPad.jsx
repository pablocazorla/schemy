import { hexToHSLarray, HSLarrayToHex } from "@/js/utils";
import ButtonOpacity from "./buttonOpacity";
import ButtonColor from "./buttonColor";
import Label from "../label";
import { useEffect, useRef, useState } from "react";
import { DEFAULT_OPACITIES } from "@/js/constants";
import { prop_colorCollection } from "@/js/store";
import useAtomProp from "../../hooks/useAtomProp";

const MoreColorsPad = ({
  opacity,
  color,
  setColor,
  setOpacity,
  setMoreColorsOpen,
}) => {
  const padRef = useRef(null);
  const [defaultColors, setDefaultColors] = useAtomProp(prop_colorCollection);

  useEffect(() => {
    let overPad = true;
    const $pad = padRef.current;
    const clickOverPad = () => {
      overPad = true;
    };
    const clickOverWindows = () => {
      if (!overPad) {
        setMoreColorsOpen(false);
      }
      overPad = false;
    };

    $pad.addEventListener("click", clickOverPad);
    window.addEventListener("click", clickOverWindows);

    return () => {
      $pad.removeEventListener("click", clickOverPad);
      window.removeEventListener("click", clickOverWindows);
    };
  }, [setMoreColorsOpen]);

  const [newColor, setNewColor] = useState([0, 0, 0]);

  return (
    <div className="bg-base mt-2 rounded p-2 relative more-colors" ref={padRef}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {defaultColors.map((btnCol, i) => {
          if (i < 5) {
            return null;
          }
          return (
            <ButtonColor
              key={i}
              btnCol={btnCol}
              opacity={opacity}
              color={color}
              setColor={setColor}
            />
          );
        })}
        <div className="relative cursor-pointer">
          <div className="w-5 h-5  border border-gray-500 rounded flex items-center justify-center">
            +
          </div>
          <input
            type="color"
            value={HSLarrayToHex(newColor)}
            className="border-0 w-5 h-5 block p-0 m-0 absolute top-0 left-0 opacity-0 cursor-pointer"
            title="Agregar color"
            onChange={(e) => {
              const newColor = hexToHSLarray(e.target.value);
              setNewColor(newColor);
            }}
            onBlur={(e) => {
              setColor(newColor);
              setDefaultColors([newColor, ...defaultColors]);
            }}
          />
        </div>
      </div>
      <Label text="Opacity" />
      <div className="flex items-center gap-2">
        {DEFAULT_OPACITIES.map((btnOp, i) => {
          return (
            <ButtonOpacity
              key={i}
              btnOp={btnOp}
              color={color}
              opacity={opacity}
              setOpacity={setOpacity}
            />
          );
        })}
      </div>
    </div>
  );
};
export default MoreColorsPad;
