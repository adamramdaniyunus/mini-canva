import React from "react";
import Button from "../Button";
import InputnLabelNumber from "../InputnLabelNumber";

const SizeInput = ({
  dimensions,
  handleChange,
}: {
  dimensions: {width: string, height:string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <InputnLabelNumber text="Width" value={Number(dimensions.width)} changeEvent={handleChange} name="width"/>
        <InputnLabelNumber text="Height" value={Number(dimensions.height)} changeEvent={handleChange} name="height"/>
      </div>

      {/* Tombol Create */}
      <Button>Create new design</Button>
    </div>
  );
};

export default SizeInput;
