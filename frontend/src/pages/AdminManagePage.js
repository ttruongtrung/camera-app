import React, { useState } from 'react';
import CameraList from '../components/CameraList';
import CameraModal from '../components/CameraModal';

const AdminPage = () => {
  const camerasData = [
    { id: 1, name: 'Camera 1', ip: '192.168.1.1', status: 'Online' },
    { id: 2, name: 'Camera 2', ip: '192.168.1.2', status: 'Offline' },
    { id: 3, name: 'Camera 3', ip: '192.168.1.3', status: 'Online' },
  ];
  const [cameras, setCameras] = useState(camerasData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddCamera = (camera) => {
    setCameras(prevCameras => [...prevCameras, camera]);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-8">
        <button onClick={() => setIsModalOpen(true)}>Add</button>
        <CameraList cameras={cameras} />
        <CameraModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddCamera}
        />
      </div>
    </div>
  );
};

export default AdminPage;
