import React from "react";
import Button from "../Button";
import InputnLabelNumber from "../InputnLabelNumber";
import { useDesignState } from "@/context/DesignContext";
import { useRouter } from "next/navigation";
import { ElementComponent } from "@/types/Element.type";
import { saveDesign } from "@/lib/indexDB";

const SizeInput = ({
  dimensions,
  handleChange,
}: {
  dimensions: { width: string; height: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { setState, setLoading, isLoading } = useDesignState();
  const router = useRouter();

  const CreatNewDesign = async() => {
    setLoading(true);
    setState({
      width: Number(dimensions.width),
      height: Number(dimensions.height),
    });

    const newDesignId = Math.floor(Math.random() * 100 + 1).toString();
    const initialComponents: ElementComponent[] = [
      {
        name: "main_frame",
        type: "main_frame",
        id: Math.floor(Math.random() * 100 + 1),
        height: Number(dimensions.height) ?? 400,
        width: Number(dimensions.width) ?? 500,
        z_index: 1,
        color: "#DBDBDB",
        image: "",
        top: 0,
        left: 0,
      },
    ];

    await saveDesign(newDesignId, initialComponents);
    setLoading(false);
    router.push(`/design/${newDesignId}/edit`);
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
      <Button disabled={isLoading} onClick={CreatNewDesign}>
        {isLoading ? "Loading" : "Create new design"}
      </Button>
    </div>
  );
};

export default SizeInput;
