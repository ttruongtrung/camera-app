import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LiaPhotoVideoSolid } from "react-icons/lia";

const VideoSegmentsList = ({ cameraId }) => {
  const [currentSegment, setCurrentSegment] = useState(null);
  const [segments, setSegments] = useState([]);
  const videoUrl = 'http://localhost:3001/api/storage/';

  useEffect(() => { fetchSegments(); }, []);

  const dummy = [
    { id: 1, description: 'abc.mp4', start_time: '3:00 PM', end_time: '4:00PM'},
    { id: 2, description: 'abc.mp4', start_time: '4:00 PM', end_time: '5:00PM'},
    { id: 3, description: 'abc.mp4', start_time: '5:00 PM', end_time: '6:00PM'},
    { id: 4, description: 'abc.mp4', start_time: '6:00 PM', end_time: '7:00PM'}
  ];

  const fetchSegments = async () => {
    // try {
    //   const response = await axios.get(`http://localhost:3001/api/camera/${cameraId}/segments`);
    //   console.log(';;;'. response);
    //   setSegments(response.data);
    // } catch (error) {
    //   console.error('Error fetching cameras:', error);
    // }
    setSegments(dummy);
  };

  const handleSegmentClick = (segment) => {
    setCurrentSegment(segment);
  };

  return (
    <div className="max-w-xl">
      {currentSegment && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold bg-gray-200 text-gray-700 px-4 py-2 mb-2 rounded-lg font-[900]">
            Đang xem: {currentSegment.description}
          </h2>
          <div className="rounded-md overflow-hidden w-[500px] max-w-xl">
            <video controls className="w-full" key={currentSegment.description}>
              <source src={videoUrl + currentSegment.description} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold bg-gray-200 text-gray-700 px-4 py-2 mb-2 rounded-lg font-[900]">Đoạn video ngắn</h2>
        <div className="flex flex-col items-center gap-2">
          {segments.map((segment, index) => (
            <div 
              key={index} onClick={() => handleSegmentClick(segment)}
              className={`flex gap-2 max-w-96 items-center border border-gray-300 rounded-lg px-4 
                py-1 cursor-pointer hover:bg-gray-300 bg-white
                ${segment.id === currentSegment?.id ? 'bg-blue-100' : ''}`
              }   
            >
              <LiaPhotoVideoSolid size={32}/>
              <div>
                <div className="mt-2 text-sm font-semibold">{segment.start_time} - {segment.end_time}</div>
                <div className="text-xs text-gray-500">Chọn để xem trước hay tải về </div>
              </div>
              
            </div>
          ))}
        </div>
      </div> 
    </div>
  );
};

export default VideoSegmentsList;
