import React from "react";

const InputnLabelNumber = ({
  text,
  value,
  changeEvent,
  name
}: {
  text: string;
  value: number;
  name:string;
  changeEvent: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm">{text}</label>
      <input
        name={name}
        type="number"
        className="w-24 p-1 text-black border-1 rounded-md"
        autoFocus
        value={value}
        onChange={changeEvent}
      />
    </div>
  );
};

export default InputnLabelNumber;
