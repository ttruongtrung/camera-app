import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import QRCode from 'qrcode.react';
import { FiDownload } from "react-icons/fi";


const QrModal = ({ isOpen, onClose, qrCodeValue, camera }) => {
  const qrCodeRef = useRef();

  useEffect(() => {
    Modal.setAppElement('#root');
    return () => {
      Modal.setAppElement(null);
    };
  }, []);

  const handleDownloadQRCode = () => {
    const canvas = qrCodeRef.current.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="mt-2">
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white py-6 px-12 rounded-[24px] shadow-lg mx-auto my-auto inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <div className="flex justify-between w-full">
            <span className="font-bold text-lg">Link Qr Code xem videos</span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mb-8 mr-auto">
            <span className="text-gray-500 font-semibold">Camera: {camera.name}</span>
          </div>
        
          {qrCodeValue && (
            <div ref={qrCodeRef}>
              <QRCode value={qrCodeValue} size={256} />
            </div>
          )}
          <div className="mt-8 flex gap-6">
            <button
              onClick={handleDownloadQRCode}
              className="px-4 py-2 font-bold text-sm text-white rounded-[24px] flex items-center gap-2
                bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%
              "
            >
              <FiDownload size={16}/>
              Tải Về QR
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 font-bold text-sm text-white rounded-[24px] border border-2 border-emerald-500 text-emerald-500"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QrModal;
