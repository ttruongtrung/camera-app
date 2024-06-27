import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
const apiPath = process.env.REACT_APP_BE_API_URL;

const HLSPlayer = ({ cameraId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const videoSrc = `${apiPath}/hls/stream_${cameraId}.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }

    return () => {
      // if (Hls.isSupported()) {
      //   hls.destroy();
      // }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [cameraId]);

  return <video ref={videoRef} controls />;
};

export default HLSPlayer;
