import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';

const CameraModal = ({ isOpen, onClose, onAdd }) => {

  const cameraNameRef = useRef();
  const modelTypeRef = useRef();
  const ipAddressRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const rtspLinkRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cameraInfo = {
      name: cameraNameRef.current.value,
      model_type: modelTypeRef.current.value,
      ip_address: ipAddressRef.current.value,
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      rtsp_link: rtspLinkRef.current.value
    };
    onAdd(cameraInfo);
    onClose();
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="p-10">
      <div className="flex justify-between mb-4">
        <label htmlFor="name" className="block font-semibold mb-1">Tên gợi nhớ:</label>
        <input 
          type="text" name="name" id="name" ref={cameraNameRef} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="model_type" className="block font-semibold mb-1">Dòng Sản Phẩm:</label>
        <input 
          type="text" name="model_type" id="type" ref={modelTypeRef} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="ip" className="block font-semibold mb-1">Địa chỉ IP:</label>
        <input 
          type="text" name="ip_address" id="ip" ref={ipAddressRef} 
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="username" className="block font-semibold mb-1">Username:</label>
        <input 
          type="text" name="username" id="username" ref={usernameRef}
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" 
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="password" className="block font-semibold mb-1">Mật khẩu:</label>
        <input 
          type="password" name="password" id="password" autoComplete="current-password" ref={passwordRef}
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
        />
      </div>
      <div className="flex justify-between mb-4">
        <label htmlFor="rtsp_link" className="block font-semibold mb-1">RTSP Link:</label>
        <textarea 
          name="rtsp_link" id="rtsp_link" ref={rtspLinkRef}
          className="w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"  
          rows="3"
        ></textarea>
      </div>
      <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Thêm mới</button>
      <button onClick={onClose} className="py-[6px] px-4 border-solid border-2 rounded-md ml-4 box-border font-semibold">Thoát</button>
    </form>
  );

  return (
    <Modal 
      isOpen={isOpen} onRequestClose={onClose}
      className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-auto"
    >
      <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 pointer-events-none"></div>
      <div className="w-[700px] bg-white rounded-lg shadow-lg p-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Thêm mới Camera</h2>
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




