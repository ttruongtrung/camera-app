import React from 'react';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
      <AiOutlineLoading3Quarters className="text-gray-600 animate-spin text-4xl" />
    </div>
  );
};

export default Loading;
