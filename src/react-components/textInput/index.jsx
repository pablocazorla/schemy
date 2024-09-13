import { useState } from "react";

const TextInput = () => {
  const [x, setX] = useState(400);
  const [y, setY] = useState(200);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(60);

  return null;

  return (
    <div
      className="absolute top-10 left-10"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <textarea
        className="resize-none text-black"
        style={{ width, height }}
        value="Texto"
      />
    </div>
  );
};

export default TextInput;
