import { FillColor, StrokeColor, TextColor } from "@/store/element-props";
import ColorInput from "@/components/colorInput";
import Label from "@/components/label";
import FontFamilyInput from "../FontFamilyInput";
import ButtonOptions from "../buttonOptions";
import ButtonTextStyle from "../buttonTextStyle";

const Editor = () => {
  return (
    <div className="text-sm">
      <div className="mb-4">
        <Label htmlFor="" text="Background" />
        <ColorInput colorProp={FillColor} editOpacity />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Border color" />
        <ColorInput colorProp={StrokeColor} />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Border Width" />
        <ButtonOptions type="strokeWidth" />
      </div>
      <div className="mb-4">
        <Label htmlFor="" text="Text color" />
        <ColorInput colorProp={TextColor} />
      </div>
      <div className="flex mb-4 gap-4">
        <div className="grow">
          <Label htmlFor="" text="Font Family" />
          <FontFamilyInput />
        </div>
        <div className="">
          <Label htmlFor="" text="Style" />
          <ButtonTextStyle />
        </div>
      </div>
      <div className="flex mb-4 gap-4">
        <div className="">
          <Label htmlFor="" text="Size" />
          <ButtonOptions type="fontSize" />
        </div>
        <div className="">
          <Label htmlFor="" text="Align" />
          <ButtonOptions type="textAlign" />
        </div>
      </div>
    </div>
  );
};

export default Editor;
