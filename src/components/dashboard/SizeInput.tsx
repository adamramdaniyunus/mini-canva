import React from "react";
import Button from "../Button";
import InputnLabelNumber from "../InputnLabelNumber";
import { useDesignState } from "@/context/DesignContext";
import { useRouter } from "next/navigation";

const SizeInput = ({
  dimensions,
  handleChange,
}: {
  dimensions: { width: string; height: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { setState } = useDesignState();
  const router = useRouter();

  const CreatNewDesign = () => {
    setState({
      width: Number(dimensions.width),
      height: Number(dimensions.height),
    });

    router.push("/create");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <InputnLabelNumber
          text="Width"
          value={Number(dimensions.width)}
          changeEvent={handleChange}
          name="width"
        />
        <InputnLabelNumber
          text="Height"
          value={Number(dimensions.height)}
          changeEvent={handleChange}
          name="height"
        />
      </div>

      {/* Tombol Create */}
      <Button onClick={CreatNewDesign}>Create new design</Button>
    </div>
  );
};

export default SizeInput;
