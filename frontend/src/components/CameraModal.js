import React, { useState } from 'react';
import Modal from 'react-modal';

const CameraModal = ({ isOpen, onClose, onAdd }) => {
  const [cameraInfo, setCameraInfo] = useState({
    name: '',
    type: '',
    ip: '',
    username: 'admin',
    password: 'admin',
    rtspLink: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCameraInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(cameraInfo);
    onClose();
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="p-10">
      <div className="flex justify-between mb-4">
        <label htmlFor="name" className="block font-semibold mb-1">Name:</label>
        <input 
          type="text" name="name" id="name" value={cameraInfo.name} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="type" className="block font-semibold mb-1">Type:</label>
        <input 
          type="text" name="type" id="type" value={cameraInfo.type} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="ip" className="block font-semibold mb-1">IP:</label>
        <input 
          type="text" name="ip" id="ip" value={cameraInfo.ip} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="username" className="block font-semibold mb-1">Username:</label>
        <input 
          type="text" name="username" id="username" value={cameraInfo.username} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="password" className="block font-semibold mb-1">Password:</label>
        <input 
          type="password" name="password" id="password" value={cameraInfo.password} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="rtspLink" className="block font-semibold mb-1">RTSP Link:</label>
        <textarea 
          name="rtspLink" id="rtspLink" value={cameraInfo.rtspLink} onChange={handleChange} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
          rows="3"
        ></textarea>
      </div>
      <button type="submit" className="btn-primary mt-4">Add Camera</button>
    </form>
  );

  return (
    <Modal 
      isOpen={isOpen} onRequestClose={onClose} 
      className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-auto"
    >
      {/* <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 pointer-events-none"></div> */}
      <div className="w-[700px] bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Camera</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <FormContent />
      </div>
    </Modal>
  );
};

export default CameraModal;




