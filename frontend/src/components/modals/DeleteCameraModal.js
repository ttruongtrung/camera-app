import React, { useEffect } from 'react';
import Modal from 'react-modal';

const DeleteCameraModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-0 left-0 flex items-center justify-center w-full h-full overflow-auto"
    >
      <div className="modal-overlay fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 pointer-events-none"></div>
      <div className="w-[700px] bg-white rounded-lg shadow-lg px-6 py-10 z-10">
        <div className="justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-center">Bạn có muốn xoá camera không?</h2>
          <div className="flex gap-6 justify-center p-6">
            <button className="rounded border py-1 w-24 text-center hover:opacity-70 transition" onClick={onClose}>Không</button>
            <button className="rounded border py-1 w-24 bg-red-500 text-white text-center hover:opacity-70 transition" onClick={handleSubmit}>Có</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCameraModal;
