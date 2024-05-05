import React, {useState} from 'react';
import axios from 'axios';
import { BsFillPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import { SiStatuspal } from "react-icons/si";
import { PiWaveform } from "react-icons/pi";

const CameraPanel = ({ camera }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const handleStreaming = () => {
    isStreaming ? stopStream() : startStream();
  };

  const startStream = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/camera/${camera.id}/start-capture`);
      console.log('Start stream', response);
      setIsStreaming(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/camera/${camera.id}/stop-capture`);
      console.log('Stop stream', response);
      setIsStreaming(false);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg shadow-md p-4 w-96 mx-auto">
      <h2 className="text-lg text-gray-500 font-bold mb-2">{camera.name}</h2>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-x-2 mt-2">
            <SiStatuspal size={24}/>
            <span className="font-bold text-gray-500 text-sm">Địa chỉ IP:</span> {camera.ip_address}
          </div>
          <div className="flex items-center gap-x-2 mt-2">
            <PiWaveform size={24}/>
            <span className="font-bold text-gray-500 text-sm">Trạng Thái:</span> 
            <span className={`${isStreaming ? 'bg-lime-400 text-lime-700' : 'bg-gray-300 text-gray-500'} px-2 rounded-md font-semibold`}>{isStreaming ? 'Đang stream' : 'Tạm dừng'}</span>
          </div>
        </div>
        {/* <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Action
        </button> */}
        <div 
          onClick={handleStreaming}
          className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
        >
          {!isStreaming
            ? <BsFillPlayCircleFill size={48} />
            : <BsPauseCircleFill size={48} />
          }
        </div>     
      </div>
    </div>
  );
}

export default CameraPanel;