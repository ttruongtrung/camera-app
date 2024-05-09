import React, { useState } from 'react';
import axios from 'axios';
import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { SiStatuspal } from 'react-icons/si';
import { PiWaveform } from 'react-icons/pi';
import { MdOutlineModeEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import EditCameraModal from './EditCameraModal';
import useCameras from '../hooks/useCameras';

const CameraPanel = ({ camera, onClick }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const { refetch } = useCameras();

  const handleStreaming = (e) => {
    e.stopPropagation();
    isStreaming ? stopStream() : startStream();
  };

  const handleOpenEditModal = (e) => {
    e.stopPropagation();
    setOpenEditModal(true);
  }

  const startStream = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/camera/${camera.id}/start-capture`
      );
      console.log('Start stream', response);
      setIsStreaming(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopStream = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/camera/${camera.id}/stop-capture`
      );
      console.log('Stop stream', response);
      setIsStreaming(false);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const updateCamera = async (data) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/camera/${camera.id}`, data);
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div
        className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg shadow-md p-4 w-96 mx-auto cursor-pointer"
        onClick={onClick}
      >
        <div className="flex gap-3 justify-between items-center mb-2">
          <h2 className="text-lg text-gray-500 font-bold ">{camera.name}</h2>
          <div className="flex gap-2">
            <div className="text-xl hover:opacity-40 transition" onClick={handleOpenEditModal}>
              <MdOutlineModeEdit />
            </div>
            <div className="text-xl hover:opacity-40 transition">
              <MdOutlineDeleteOutline />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-x-2 mt-2">
              <SiStatuspal size={24} />
              <span className="font-bold text-gray-500 text-sm">
                Địa chỉ IP:
              </span>{' '}
              {camera.ip_address}
            </div>
            <div className="flex items-center gap-x-2 mt-2">
              <PiWaveform size={24} />
              <span className="font-bold text-gray-500 text-sm">
                Trạng Thái:
              </span>
              <span
                className={`${
                  isStreaming
                    ? 'bg-lime-400 text-lime-700'
                    : 'bg-gray-300 text-gray-500'
                } px-2 rounded-md font-semibold`}
              >
                {isStreaming ? 'Đang stream' : 'Tạm dừng'}
              </span>
            </div>
          </div>
          {/* <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Action
        </button> */}
          <div
            onClick={handleStreaming}
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
          >
            {!isStreaming ? (
              <BsFillPlayCircleFill size={48} />
            ) : (
              <BsPauseCircleFill size={48} />
            )}
          </div>
        </div>
      </div>
      <EditCameraModal isOpen={openEditModal} onClose={() => setOpenEditModal(false)} onSubmit={updateCamera} camera={camera} />
    </>
  );
};

export default CameraPanel;
