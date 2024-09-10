const Label = ({ htmlFor, text }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1 uppercase font-bold text-[0.7rem]"
    >
      {text}
    </label>
  );
};

export default Label;
