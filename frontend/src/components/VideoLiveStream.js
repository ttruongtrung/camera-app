import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
const apiPath = process.env.REACT_APP_BE_API_URL;

const VideoLiveStream = ({ cameraId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => { console.log('VideoLiveStream use effect');
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [{
          src: `${apiPath}/videos/VideoStreaming/stream_${cameraId}.m3u8`,
          type: 'application/x-mpegURL'
        }]
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [cameraId]);

  return (
    <div>
      <div className="font-bold px-4 py-2 rounded-t-md bg-black text-white">Đang chiếu trực tiếp camera{cameraId}</div>
      <video ref={videoRef} className="video-js vjs-default-skin" width="500" height="282" />
    </div>
  );
};

export default VideoLiveStream;
