import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const apiPath = process.env.REACT_APP_BE_API_URL;

const HLSPlayer = ({ cameraId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const videoSrc = `${apiPath}/hls/stream_${cameraId}.m3u8`;

    const initializeHLS = () => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        });
      }
    };

    // Initialize HLS.js when component mounts or cameraId changes
    initializeHLS();

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      } else {
        video.pause();
        video.src = ''; // Clear source to stop playback
      }
    };
  }, [cameraId]);

  return <video ref={videoRef} controls />;
};

export default HLSPlayer;


