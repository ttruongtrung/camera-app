import { format, parseISO } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { FaDatabase, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { LiaPhotoVideoSolid } from 'react-icons/lia';
import { useDebouncedCallback } from 'use-debounce';
import useSegmentList from '../hooks/useSegmentList';

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

const VideoSegmentsList = ({ cameraId, selectedCamera, showDefault }) => {
  const [currentCamera, selectedCurrentCamera] = useState(null);
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
      selectedCurrentCamera(selectedCamera);
      setCurrentSegment(null);
    }
  }, [selectedCamera]);

  const handleSearch = useDebouncedCallback((value) => {
    const filterList = segments.filter(
      (segment) =>
        segment.startTime.includes(value) || segment.endTime.includes(value)
    );
    setFilterSegments(filterList);
  }, 1000);

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
    setFilterSegments(segments);
  };

  return (
    <div className="max-w-full md:max-w-xl">
      {currentSegment ? (
        <div className="bg-white p-4 rounded-lg overflow-hidden min-w-[310px] mb-4">
          <h2 className="text-xl font-semibold bg-black text-white px-4 py-2 mb-4 font-[900] -ml-4 -mt-4 w-[calc(100%+2rem)]">
            Đang xem:{' '}
            {`${formatTime(currentSegment.startTime)} - ${formatTime(
              currentSegment.endTime
            )}`}
          </h2>
          <div className="rounded-lg overflow-hidden w-[500px] max-w-full md:max-w-xl">
            <video controls className="w-full" key={currentSegment.description}>
              <source
                src={videoUrl + currentSegment.description}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg overflow-hidden min-w-[310px] mb-4">
          <h2 className="text-xl font-semibold bg-black text-white px-4 py-2 mb-4 font-[900] -ml-4 -mt-4 w-[calc(100%+2rem)]">
            Đang xem: Bạn chưa chọn video nào
          </h2>
          <div className="rounded-lg overflow-hidden w-[500px] max-w-full md:max-w-xl">
            <div className="h-[250px] bg-gray-400 flex items-center justify-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white"></div>
              <div className="w-8 h-8 rounded-full bg-white"></div>
              <div className="w-8 h-8 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-4 rounded-lg min-w-[310px]">
        <div className="flex gap-2 bg-black rounded-tl rounded-tr justify-between text-white px-4 py-2 mb-4 font-semibold -ml-4 -mt-4 w-[calc(100%+2rem)]">
          <h2 className="text-xl">Đoạn video ngắn</h2>
          <button
            onClick={handleRefresh}
            className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            <FaSyncAlt />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center min-w-[300px] border border-gray-300 rounded-md overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ví dụ: 08:56"
              className="p-2 w-full focus:outline-none"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
            <button className="p-3 bg-blue-500 text-white hover:bg-blue-600">
              <FaSearch />
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[600px] overflow-scroll">
            {filterSegments.length > 0 ? (
              filterSegments.map((segment, index) => (
                <div
                  key={index}
                  onClick={() => handleSegmentClick(segment)}
                  className={`flex gap-3 max-w-90 min-w-[300px] items-center border border-gray-300 rounded-lg px-4 
                py-1 cursor-pointer hover:bg-gray-300 bg-white
                ${segment.id === currentSegment?.id ? 'bg-blue-100' : ''}`}
                >
                  <LiaPhotoVideoSolid size={32} />
                  <div>
                    <div className="text-sm font-semibold">
                      <span className="font-light">Thời gian:</span>{' '}
                      {formatTime(segment.startTime)} -{' '}
                      {formatTime(segment.endTime)}
                    </div>
                    <div className="text-sm font-semibold">
                      <span className="font-light">Ngày:</span>{' '}
                      {formatDate(segment.startTime, segment.endTime)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Chọn để xem trước hay tải về{' '}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-2 flex items-center gap-4 text-gray-500">
                <FaDatabase />
                Không tìm thấy video nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSegmentsList;
