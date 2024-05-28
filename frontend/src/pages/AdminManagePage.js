import React, { useState, useContext } from 'react';
import axios from 'axios';
import CameraList from '../components/CameraList';
import CameraModal from '../components/modals/CameraModal';
import VideoSegmentsList from '../components/VideoSegmentList';
import useCameras from '../hooks/useCameras';
import Loading from '../components/Loading';
import useProtectedRoute from '../auth/useProtectedRoute';
import { AuthContext } from '../auth/AuthContext';

const AdminPage = () => {
  useProtectedRoute(); 
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: cameras, isLoading, refetch } = useCameras();
  const { accessToken } = useContext(AuthContext);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };
  const apiPath = process.env.REACT_APP_BE_API_URL;

  const handleAddCamera = async (camera) => {
    try {
      await axios.post(`${apiPath}/api/camera`, camera, config);
      console.log('Camera added:', camera);
      refetch();
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
              selectedCameraId={selectedCamera}
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
