import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
const apiPath = process.env.REACT_APP_BE_API_URL;

const VideoLiveStream = ({ cameraId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    console.log('VideoLiveStream useEffect triggered');

    if (videoRef.current && !playerRef.current) {
      const player = playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: true,
        preload: 'auto',
        sources: [{
          src: `${apiPath}/videos/VideoStreaming/stream_${cameraId}.m3u8`,
          type: 'application/x-mpegURL'
        }]
      });

      // TODO: Reserve for further debug
      // player.on('error', () => {
      //   console.error('VideoJS Error:', player.error());
      // });

      // player.on('loadedmetadata', () => {
      //   console.log('Video metadata loaded. Duration:', player.duration());
      // });

      // player.on('loadeddata', () => {
      //   console.log('Video data loaded. Current source:', player.currentSrc());
      // });

      // player.on('loadedalldata', () => {
      //   console.log('All video data loaded');
      // });

      // player.on('durationchange', () => {
      //   console.log('Duration changed:', player.duration());
      // });

      // player.on('timeupdate', () => {
      //   console.log('Current time:', player.currentTime());
      // });

      // player.on('waiting', () => {
      //   console.warn('Player is waiting for more data.');
      // });

      // player.on('playing', () => {
      //   console.log('Video is playing.');
      // });

      // player.on('stalled', () => {
      //   console.warn('Video has stalled.');
      // });

      // player.on('pause', () => {
      //   console.log('Video is paused.');
      // });

      // player.on('ended', () => {
      //   console.log('Video playback ended.');
      // });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [cameraId]);

  return (
    <div>
      <div className="font-bold px-4 py-2 rounded-t-md bg-black text-white">Đang chiếu trực tiếp camera {cameraId}</div>
      <video ref={videoRef} className="video-js vjs-default-skin" width="500" height="282" />
    </div>
  );
};

export default VideoLiveStream;
