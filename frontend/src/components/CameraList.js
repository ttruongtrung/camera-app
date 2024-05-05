import React from 'react';
import { BsPlusCircleDotted } from "react-icons/bs";
import CameraPanel from './CameraPanel';

const CameraList = ({ cameras, onAddCamera }) => {
  return (
    <div className="container mx-auto w-full">
      <h1 className="text-2xl font-bold mb-4">Camera List</h1>
      <div className="flex flex-col gap-4 justify-center items-center">
        {cameras.map(camera => (
          <CameraPanel key={camera.id} camera={camera} />
        ))}
        <div 
          className="flex items-center justify-center p-4 border-solid border-2 w-96 rounded-lg shadow-md text-gray-400 cursor-pointer hover:text-gray-500 hover:border-gray-500"
          onClick={onAddCamera}
        >
          <BsPlusCircleDotted size={48}/>
          <span className="ml-4 font-bold">Thêm mới Camera</span>
        </div>
      </div>   
    </div>
  );
};

export default CameraList;
