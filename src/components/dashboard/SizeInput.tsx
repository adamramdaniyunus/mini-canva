import React from "react";
import Button from "../Button";
import InputnLabelNumber from "../InputnLabelNumber";
import { useDesignState } from "@/context/DesignContext";
import { useRouter } from "next/navigation";
import { createDesign } from "@/lib/indexDB";
import { CanvasType } from "@/types/CanvasType";
import toast from "react-hot-toast";

const SizeInput = ({
  dimensions,
  handleChange,
}: {
  dimensions: { width: string; height: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { setState, setLoading, isLoading } = useDesignState();
  const router = useRouter();

  const CreatNewDesign = async () => {
    setLoading(true);
    setState({
      width: Number(dimensions.width),
      height: Number(dimensions.height),
    });
    let promise: { data: { project_id: string, frame_id: string } } = { data: { project_id: "", frame_id: "" } };

    // Call API to create new design
    try {
      const response = await fetch("/api/design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          width: Number(dimensions.width),
          height: Number(dimensions.height),
        }),
      });
      promise = await response.json();
    } catch (error) {
      console.error("Error creating new design:", error);
      toast.error("Something wrong, please try again later.")
      setLoading(false);
      return;
    }

    const newDesignId = promise.data.project_id; // Use the project_id from the response
    const initialComponents: CanvasType =   {
      id: promise.data.frame_id,
      height: Number(dimensions.height) ?? 400,
      width: Number(dimensions.width) ?? 500,
      background_color: "#DBDBDB",
      background_image: "",
      components: [],
      project_id: newDesignId,
    }

    await createDesign(newDesignId, initialComponents);
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
