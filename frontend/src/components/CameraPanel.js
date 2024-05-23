import React, { useState, useContext } from 'react';
import axios from 'axios';
import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { SiStatuspal } from 'react-icons/si';
import { PiWaveform } from 'react-icons/pi';
import {
  MdOutlineModeEdit,
  MdOutlineDeleteOutline,
  MdOutlineQrCode,
} from 'react-icons/md';
import EditCameraModal from './modals/EditCameraModal';
import useCameras from '../hooks/useCameras';
import DeleteCameraModal from './modals/DeleteCameraModal';
import QrModal from './modals/QrModal';
import { CAMERA_STATUS } from '../constants/Camera';
import { getRTSPlink } from '../utils/rtspHandler';
import { AuthContext } from '../auth/AuthContext';

const CameraPanel = ({ camera, onClick, isSelected }) => {
  const [videoLength, setVideoLength] = useState('5');
  const [isStreaming, setIsStreaming] = useState(
    camera.status === CAMERA_STATUS.STARTING
  );
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { refetch } = useCameras();
  const apiPath = process.env.REACT_APP_BE_API_URL;
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [openQrModal, setOpenQrModal] = useState(false);
  const { accessToken } = useContext(AuthContext);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

  const handleStreaming = (e) => {
    e.stopPropagation();
    isStreaming ? stopStream() : startStream();
  };

  const handleOpenEditModal = (e) => {
    e.stopPropagation();
    setOpenEditModal(true);
  };

  const handleOpenDeleteModal = (e) => {
    e.stopPropagation();
    setOpenDeleteModal(true);
  };

  const handleGenerateQrCode = (e) => {
    e.stopPropagation();
    const link = `${apiPath}/api/camera/${camera.id}/segments`;
    setQrCodeValue(link);
    setOpenQrModal(true);
  };

  const handleCheckRTSPStream = async () => {
    try {
      const response = await axios.post(
        `${apiPath}/api/camera/${camera.id}/check-rtsp`
      );
      console.log('check stream', response);
    } catch (error) {
      console.error('Error checking stream:', error);
    }
  };

  const startStream = async () => {
    try {
      const rtsp = getRTSPlink(
        camera.model_type,
        camera.ip_address,
        camera.username,
        camera.password
      );
      const data = {
        rtspLink: rtsp,
        videoLength: Number(videoLength),
      };
      console.log(data);
      const response = await axios.post(
        `${apiPath}/api/camera/${camera.id}/start-capture`,
        data,
        config 
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
        `${apiPath}/api/camera/${camera.id}/stop-capture`,
        config 
      );
      console.log('Stop stream', response);
      setIsStreaming(false);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const updateCamera = async (data) => {
    try {
      const response = await axios.put(
        `${apiPath}/api/camera/${camera.id}`,
        data,
        config
      );
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCamera = async (data) => {
    try {
      const response = await axios.delete(`${apiPath}/api/camera/${camera.id}`, config);
      console.log(response);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRadioChange = (event) => {
    event.stopPropagation();
    console.log(event);
    setVideoLength(event.target.value);
  };

  const handleLabelClick = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <div
        className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg shadow-md p-4 w-96 mx-auto cursor-pointer relative"
        onClick={onClick}
      >
        {isSelected && (
          <div className="absolute inset-0 border-2 border-blue-500 rounded-lg flex justify-center overflow-hidden">
            <span className="text-xs font-semibold text-white bg-blue-500 p-1 rounded-md h-fit -mt-1">
              Đang được chọn
            </span>
          </div>
        )}
        <div className="flex gap-3 justify-between items-center mb-2">
          <h2 className="text-lg text-gray-500 font-bold ">{camera.name}</h2>
          <div className="relative flex gap-2">
            <div
              className="flex hover:text-green-800 transition text-green-500"
              onClick={handleOpenEditModal}
            >
              <MdOutlineModeEdit />
              <span className="text-sm font-bold underline">Sửa</span>
            </div>
            <div
              className="flex items-center hover:text-red-800 transition text-red-500"
              onClick={handleOpenDeleteModal}
            >
              <MdOutlineDeleteOutline />
              <span className="text-sm font-bold underline">Xóa</span>
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
            <div
              className="flex items-center gap-x-2 mt-2 text-blue-500 transition relative"
              onClick={handleGenerateQrCode}
            >
              <MdOutlineQrCode size={24} />
              <span className="font-bold text-sm underline hover:text-blue-700">
                Tạo QR code link
              </span>
            </div>
            {!isStreaming && (
              <div className="mt-2">
                <p className="font-bold text-gray-500 text-sm mb-1">
                  Chọn độ dài video:
                </p>
                <form className="flex gap-2 relative">
                  <div className="cursor-pointer">
                    <label onClick={handleLabelClick}>
                      <input
                        className="mr-1"
                        type="radio"
                        value="5"
                        checked={videoLength === '5'}
                        onChange={handleRadioChange}
                      />
                      5 phút
                    </label>
                  </div>
                  <div>
                    <label
                      className="cursor-pointer"
                      onClick={handleLabelClick}
                    >
                      <input
                        className="mr-1"
                        type="radio"
                        value="10"
                        checked={videoLength === '10'}
                        onChange={handleRadioChange}
                      />
                      10 phút
                    </label>
                  </div>
                </form>
              </div>
            )}
          </div>
          {/* <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Action
        </button> */}
          <div
            onClick={handleStreaming}
            // onClick={handleCheckRTSPStream}
            className="cursor-pointer text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out relative"
          >
            {!isStreaming ? (
              <BsFillPlayCircleFill size={48} />
            ) : (
              <BsPauseCircleFill size={48} />
            )}
          </div>
        </div>
      </div>
      <EditCameraModal
        isOpen={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onSubmit={updateCamera}
        camera={camera}
      />
      <DeleteCameraModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSubmit={deleteCamera}
      />
      <QrModal
        isOpen={openQrModal}
        onClose={() => setOpenQrModal(false)}
        qrCodeValue={qrCodeValue}
        camera={camera}
      />
    </>
  );
};

export default CameraPanel;
