import React from 'react'

const DesignCard = ({index} : {index:number}) => {
  return (
    <div
      className="min-w-[250px] bg-white rounded-lg flex-shrink-0 p-4 shadow-md"
    >
      <img
        src={`https://placehold.co/250x150?text=Image+${index + 1}`}
        alt={`Thumbnail ${index + 1}`}
        className="w-full h-auto rounded-md"
      />
      <p className="text-center mt-2 font-semibold">DESIGN - {index + 1}</p>
    </div>
  );
}

export default DesignCard
