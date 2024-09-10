import { useEffect, useState } from "react";
import Label from "./components/label";
import ColorInput from "./components/colorInput";
import { prop_fillColor, prop_strokeColor, prop_textColor } from "@/js/store";

const Editor = () => {
  return (
    <div className="text-sm">
      <div className="mb-4">
        <Label htmlFor="" text="Background" />
        <ColorInput colorProp={prop_fillColor} propToUpdate="fill" />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Border color" />
        <ColorInput colorProp={prop_strokeColor} propToUpdate="stroke" />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Text color" />
        <ColorInput colorProp={prop_textColor} propToUpdate="textFill" />
      </div>
    </div>
  );
};

export default Editor;
