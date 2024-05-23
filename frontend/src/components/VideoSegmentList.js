import { format, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { FaDatabase, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { LiaPhotoVideoSolid } from 'react-icons/lia';
import { useDebouncedCallback } from 'use-debounce';
import useSegmentList from '../hooks/useSegmentList';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';
import Video from './Video';
import InputSearch from './InputSearch';

const formatTime = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'HH:mm');
};

const formatDate = (dateString1, dateString2) => {
  const date1 = format(parseISO(dateString1), 'dd-MM-yyyy');
  const date2 = format(parseISO(dateString2), 'dd-MM-yyyy');
  if (date1 === date2) {
    return `${date1}`;
  }
  return `Từ ${date1} đến ${date2}`;
};

const formatDateTime = (dateTimeString) => {
  const date = parseISO(dateTimeString);
  return format(date, 'HH:mm dd-MM-yyyy');
};

const VideoSegmentsList = ({ cameraId, selectedCamera, showDefault }) => {
  const [currentCamera, setCurrentCamera] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [filterSegments, setFilterSegments] = useState([]);
  const apiPath = process.env.REACT_APP_BE_API_URL;
  const videoUrl = apiPath + '/api/storage/';
  const inputRef = useRef(null);

  const { data: segments, isLoading, refetch } = useSegmentList(cameraId);

  useEffect(() => {
    if (!isLoading && segments) {
      setFilterSegments(segments);
    }
  }, [segments, isLoading]);

  useEffect(() => {
    if (selectedCamera !== currentCamera) {
      setCurrentCamera(selectedCamera);
      setCurrentSegment(null);
    }
  }, [selectedCamera]);

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
    refetch();
    inputRef.current.value = '';
  };

  return (
    <>
      <div className="max-w-full md:max-w-xl">
        {currentSegment ? (
          <div className="p-4 overflow-hidden min-w-[310px] mb-4">
            <div className="relative rounded overflow-hidden w-[500px] max-w-full md:max-w-xl">
              <Video videoSrc={videoUrl + currentSegment?.description} />
              <Logo
                className="absolute left-2 top-2 h-10 opacity-50"
                size={12}
              />
            </div>
          </div>
        ) : (
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
      <div className="bg-orangeLight py-8 min-w-[310px] w-full relative mt-4">
        <div
          onClick={handleRefresh}
          className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-0 p-4 rounded-[50%] bg-orangeLight text-white shadow-lg cursor-pointer transition hover:bg-orangeE"
        >
          <FaSyncAlt className="rotate-[134deg]" size={32} />
        </div>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex px-4 gap-2 items-center justify-between w-full">
            <div className="text-white text-semibold text-xl">
              DATE: {format(new Date(), 'dd/MM/yyyy')}
            </div>
            <InputSearch ref={inputRef} handleSearch={handleSearch} />
          </div>
          <div className="flex flex-col gap-2 max-h-[430px] overflow-scroll px-2">
            {filterSegments.length > 0 ? (
              filterSegments.map((segment, index) => (
                <div
                  key={index}
                  onClick={() => handleSegmentClick(segment)}
                  className={`flex gap-3 max-w-90 min-w-[300px] items-center border border-gray-300 rounded-lg px-4 
                py-2 cursor-pointer hover:bg-gray-300 bg-white
                ${segment.id === currentSegment?.id ? 'bg-blue-100' : ''}`}
                >
                  <LiaPhotoVideoSolid size={32} />
                  <div>
                    <div className="text-sm font-semibold">
                      <span className="font-light">Time:</span>{' '}
                      <span className="text-blue-500">{formatTime(segment.startTime)} -{' '}
                      {formatTime(segment.endTime)}</span>
                    </div>
                    <div className="text-sm font-semibold">
                      <span className="font-light">Date:</span>{' '}
                      {formatDate(segment.startTime, segment.endTime)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Click to preview or download
                    </div>
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
      </div>
    </>
  );
};

export default VideoSegmentsList;
