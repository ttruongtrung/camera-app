import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraList from '../components/CameraList';
import CameraModal from '../components/CameraModal';
import VideoSegmentsList from '../components/VideoSegmentList';
import useCameras from '../hooks/useCameras';
import Loading from '../components/Loading';

const AdminPage = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: cameras, isLoading } = useCameras();

  console.log(cameras);

  const handleAddCamera = async (camera) => {
    try {
      await axios.post('http://localhost:3001/api/camera', camera);
      console.log('Camera added:', camera);
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center gap-20">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="py-8">
            <CameraList
              cameras={cameras}
              onAddCamera={() => setIsModalOpen(true)}
              onSelectCamera={setSelectedCamera}
            />
            <CameraModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddCamera}
            />
          </div>
          <div className="py-8">
            <VideoSegmentsList cameraId={selectedCamera} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
