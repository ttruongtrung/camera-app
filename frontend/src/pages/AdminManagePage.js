import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CameraList from '../components/CameraList';
import CameraModal from '../components/CameraModal';
import VideoSegmentsList from '../components/VideoSegmentList';

const AdminPage = () => {
  const [cameras, setCameras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiPath = process.env.REACT_APP_BE_API_URL;

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${apiPath}/api/cameras`);
      setCameras(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  
  const handleAddCamera = async (camera) => {
    try {
      await axios.post('http://localhost:3001/api/camera', camera);
      fetchCameras();
      console.log('Camera added:', camera);
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center gap-20">
      <div className="py-8">
        <CameraList cameras={cameras} onAddCamera={() => setIsModalOpen(true)}/>
        <CameraModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddCamera}
        />
      </div>
      <div className="py-8">
        <VideoSegmentsList cameraId={1}/>
      </div>
    </div>
  );
};

export default AdminPage;
