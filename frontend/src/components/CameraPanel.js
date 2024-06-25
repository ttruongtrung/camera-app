import React, { useState, useContext } from 'react';
import axios from 'axios';
import { BsFillPlayCircleFill, BsPauseCircleFill } from 'react-icons/bs';
import { SiStatuspal } from 'react-icons/si';
import { PiWaveform } from 'react-icons/pi';
import { MdLiveTv } from "react-icons/md";
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
import ToggleButton from './ToggleButton';

const CameraPanel = ({ camera, onClick, isSelected }) => {
  const [videoLength, setVideoLength] = useState('5');
  const [isCaptureStream, setIsCaptureStream] = useState(
    camera.status === CAMERA_STATUS.STARTING
  );
  const [isLiveStream, setIsLiveStream] = useState(
    camera.streamingStatus === CAMERA_STATUS.STREAMING
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

  const handleCaptureStream = (value) => {
    !value ? stopCaptureStream() : startCaptureStream();
    setIsCaptureStream(value);
  };

  const handleLiveStream = (value) => {
    !value ? stopLiveStream() : startLiveStream();
    setIsLiveStream(value);
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

  const startCaptureStream = async () => {
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
      setIsCaptureStream(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopCaptureStream = async () => {
    try {
      const response = await axios.post(
        `${apiPath}/api/camera/${camera.id}/stop-capture`,
        {},
        config 
      );
      console.log('Stop stream', response);
      setIsCaptureStream(false);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };
  
  const startLiveStream = async () => {
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
        `${apiPath}/api/camera/${camera.id}/start-stream`,
        data,
        config 
      );
      console.log('Start stream', response);
      setIsLiveStream(true);
    } catch (error) {
      console.error('Error starting stream:', error);
    }
  };

  const stopLiveStream = async () => {
    try {
      const response = await axios.post(
        `${apiPath}/api/camera/${camera.id}/stop-stream`,
        {},
        config 
      );
      console.log('Stop stream', response);
      setIsLiveStream(false);
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
        <div className="flex flex-col gap-5">
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
                Cắt video:
              </span>
              <span
                className={`${
                  isCaptureStream
                    ? 'bg-lime-400 text-lime-700'
                    : 'bg-gray-300 text-gray-500'
                } px-2 rounded-md font-semibold`}
              >
                {isCaptureStream ? 'Đang cắt' : 'Tạm dừng'}
              </span>
              <ToggleButton className="flex-1 justify-end" isToggled={isCaptureStream} handleClick={handleCaptureStream} />
            </div>
            <div className="flex items-center gap-x-2 mt-2">
              <MdLiveTv size={24} />
              <span className="font-bold text-gray-500 text-sm">
                Live stream:
              </span>
              <span
                className={`${
                  isLiveStream
                    ? 'bg-lime-400 text-lime-700'
                    : 'bg-gray-300 text-gray-500'
                } px-2 rounded-md font-semibold`}
              >
                {isLiveStream ? 'Đang stream' : 'Tạm dừng'}
              </span>
              <ToggleButton className="flex-1 justify-end" isToggled={isLiveStream} handleClick={handleLiveStream} />
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
                        disabled={isCaptureStream}
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
                        disabled={isCaptureStream}
                        checked={videoLength === '10'}
                        onChange={handleRadioChange}
                      />
                      10 phút
                    </label>
                  </div>
                </form>
              </div>
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
