// const Video = ({videoSrc}) => {

//   return (
//     <>
//       <style>
//         {`
//           video::-webkit-media-controls-fullscreen-button {
//               display: none;
//           }
//         `}
//       </style>
//       <video
//         controls
//         //controlsList="nofullscreen"
//         className="w-full"
//         key={videoSrc}
//         style={{ WebkitAppearance: 'none', appearance: 'none' }}
//       >
//         <source src={videoSrc} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//     </>
//   );
// };

import React, { useRef, useState, useEffect } from 'react';
import { FiMaximize, FiMinimize } from 'react-icons/fi';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';

const Video = ({ videoSrc }) => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative max-h-screen max-w-screen flex justify-center" ref={containerRef}>
      <style>
        {`
          video::-webkit-media-controls-fullscreen-button {
              display: none;
          }
        `}
      </style>
      <div className={`${isFullscreen ? 'fixed top-6 right-6' : 'absolute top-2 right-2'}  z-20`}>
        <button className={`text-white bg-gray-700 rounded-full p-2`} onClick={toggleFullscreen}>
          {isFullscreen ? <FiMinimize size={24}/> : <FiMaximize size={24}/>}
        </button>
      </div>
      <video
        controls
        controlsList="nofullscreen"
        className="max-h-screen"
        key={videoSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Logo className={`${isFullscreen ? 'fixed h-20 left-6 top-6' : 'absolute h-10 left-2 top-2'}  opacity-70 z-20`} />
    </div>
  );
};

export default Video;