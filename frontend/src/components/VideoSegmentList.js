import { format, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { FaDatabase, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { LiaPhotoVideoSolid } from 'react-icons/lia';
import { useDebouncedCallback } from 'use-debounce';
import useSegmentList from '../hooks/useSegmentList';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import Video from './Video';
import InputSearch from './InputSearch';
import { isIOS } from '../utils/checkDevice';
import { CAMERA_TAB } from '../constants/Camera';
import LiveScore from './LiveScore';
import VideoLiveStream from './VideoLiveStream';

const formatTime = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'HH:mm');
};

const formatDate = (dateString1, dateString2) => {
  const date1 = format(parseISO(dateString1), 'dd/MM/yyyy');
  const date2 = format(parseISO(dateString2), 'dd/MM/yyyy');
  if (date1 === date2) {
    return `${date1}`;
  }
  return `Từ ${date1} đến ${date2}`;
};

const formatDateTime = (dateTimeString) => {
  const date = parseISO(dateTimeString);
  return format(date, 'HH:mm dd-MM-yyyy');
};

const VideoSegmentsList = ({ cameraId, showDefault }) => {
  const [currentTab, setCurrentTab] = useState(CAMERA_TAB.VIDEO);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [filterSegments, setFilterSegments] = useState([]);
  const liveScoreRef = useRef();
  const apiPath = process.env.REACT_APP_BE_API_URL;
  const videoUrl = apiPath + '/api/storage/';
  const inputRef = useRef(null);
  const isIosDevice = isIOS();

  const { data: segments, isLoading, refetch } = useSegmentList(cameraId);

  useEffect(() => {
    if (!isLoading && segments) {
      setFilterSegments(segments);
    }
  }, [segments, isLoading]);

  useEffect(() => {
    if (cameraId !== currentCamera) {
      setCurrentCamera(cameraId);
      setCurrentSegment(null);
    }
  }, [cameraId]);

  const handleSearch = useDebouncedCallback((value) => {
    const filterList = segments.filter(
      (segment) =>
        formatDateTime(segment.startTime).includes(value) ||
        formatDateTime(segment.endTime).includes(value)
    );
    setFilterSegments(filterList);
  }, 500);

  const handleSegmentClick = (segment) => {
    setCurrentSegment(segment);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleRefresh = () => {
    if (currentTab === CAMERA_TAB.VIDEO) {
      refetch();
      inputRef.current.value = '';
    } else {
      liveScoreRef.current.resetMatch();
    }
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <>
      <div className="max-w-full md:max-w-xl mb-6">
        {currentTab === CAMERA_TAB.SCORE && currentSegment ? (
          <div className="p-4 overflow-hidden min-w-[310px] mb-4">
            <div className="relative rounded overflow-hidden w-[500px] max-w-full md:max-w-xl">
              {isIosDevice ? (
                <>
                  <video
                    controls
                    className="w-full"
                    key={currentSegment?.description}
                  >
                    <source
                      src={videoUrl + currentSegment?.description}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <Logo
                    className="absolute left-2 top-2 h-10 opacity-50"
                    size={12}
                  />
                </>
              ) : (
                <Video videoSrc={videoUrl + currentSegment?.description} />
              )}
            </div>
          </div>
        ) : ( currentTab === CAMERA_TAB.SCORE 
            ? 
              <VideoLiveStream 
                cameraId={cameraId} 
                className="relative rounded overflow-hidden w-[500px] max-w-full md:max-w-xl"
              />
            :
              <div className="p-4 rounded overflow-hidden min-w-[310px] mb-4">
                <div className="rounded overflow-hidden w-[500px] max-w-full md:max-w-xl">
                  <div className="h-[250px] bg-gray-400 flex items-center justify-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white"></div>
                    <div className="w-6 h-6 rounded-full bg-white"></div>
                    <div className="w-6 h-6 rounded-full bg-white"></div> 
                  </div>
                </div>
              </div>
        )}
      </div>
      <div className="bg-orangeLight pb-8 min-w-[310px] w-full relative mt-6 rounded-lg">
        {/* Tab section */}
        <div className="grid grid-cols-[1fr_1fr] px-6 justify-center cursor-pointer relative -translate-y-6">
          <div
            onClick={handleRefresh}
            className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 p-4 rounded-[50%] bg-orangeLight text-white shadow-lg cursor-pointer transition hover:bg-orangeE"
          >
            <FaSyncAlt className="rotate-[134deg]" size={32} />
          </div>
          <div
            onClick={() => handleTabChange(CAMERA_TAB.VIDEO)}
            className={`p-3 text-center border border-solid border-white rounded-tl rounded-bl w-full ${
              currentTab === CAMERA_TAB.VIDEO
                ? 'bg-orangeE text-white '
                : 'bg-white'
            } transition`}
          >
            Video
          </div>
          <div
            onClick={() => handleTabChange(CAMERA_TAB.SCORE)}
            className={`w-40 p-3 text-center border border-solid border-white rounded-tr rounded-br w-full ${
              currentTab === CAMERA_TAB.SCORE
                ? 'bg-orangeE text-white '
                : 'bg-white'
            } transition`}
          >
            Live Score
          </div>
        </div>
        {currentTab === CAMERA_TAB.VIDEO && (
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="flex px-8 gap-2 items-center justify-center w-full">
              <InputSearch ref={inputRef} handleSearch={handleSearch} />
            </div>
            <div className="flex flex-col gap-2 max-h-[430px] overflow-auto px-2">
              {filterSegments.length > 0 ? (
                filterSegments.map((segment, index) => (
                  <div
                    key={index}
                    onClick={() => handleSegmentClick(segment)}
                    className={`flex gap-3 max-w-90 min-w-[300px] items-center justify-center border border-gray-300 rounded-lg px-4 
                py-2 cursor-pointer hover:bg-gray-300 
                ${
                  segment.id === currentSegment?.id ? 'bg-gray-300' : 'bg-white'
                }`}
                  >
                    <div className="text-sm font-semibold">
                      <span className="text-orangeE">
                        {formatTime(segment.startTime)} -{' '}
                        {formatTime(segment.endTime)} -{' '}
                      </span>
                      <span className="text-[#1f2937]">
                        {formatDate(segment.startTime, segment.endTime)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mt-2 flex items-center gap-4 text-white">
                  <FaDatabase />
                  No videos found
                </div>
              )}
            </div>
          </div>
        )}
        {currentTab === CAMERA_TAB.SCORE && (
          <>
            {/* <VideoLiveStream cameraId={cameraId}/> */}
            <LiveScore ref={liveScoreRef} cameraId={cameraId} />
          </>
        )}
      </div>
    </>
  );
};

export default VideoSegmentsList;
