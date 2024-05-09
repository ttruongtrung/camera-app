import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LiaPhotoVideoSolid } from "react-icons/lia";

const VideoSegmentsList = ({ cameraId, selectedCamera, showDefault }) => {
  const [currentCamera, selectedCurrentCamera] = useState(null);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [segments, setSegments] = useState([]);
  const apiPath = process.env.REACT_APP_BE_API_URL;
  const videoUrl = apiPath + '/api/storage/';

  useEffect(() => {
    if (selectedCamera !== currentCamera) {
      selectedCurrentCamera(selectedCamera);
      setCurrentSegment(null);
    }
  }, [selectedCamera])

  useEffect(() => {
    if (cameraId) {
      fetchSegments(); 
    }
  }, [cameraId]);

  const dummy = [
    { id: 1, description: 'abc.mp4', start_time: '3:00 PM', end_time: '4:00PM'},
    { id: 2, description: 'abc.mp4', start_time: '4:00 PM', end_time: '5:00PM'},
    { id: 3, description: 'abc.mp4', start_time: '5:00 PM', end_time: '6:00PM'},
    { id: 4, description: 'abc.mp4', start_time: '6:00 PM', end_time: '7:00PM'}
  ];

  const fetchSegments = async () => {
    try {
      const response = await axios.get(`${apiPath}/api/camera/${cameraId}/segments`);
      console.log(';;;', response);
      setSegments(response.data);
      if (showDefault && response.data.length > 0) {
        setCurrentSegment(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
    //setSegments(dummy);
  };

  const handleSegmentClick = (segment) => {
    setCurrentSegment(segment);
  };

  return (
    <div className="max-w-full md:max-w-xl">
      {currentSegment && (
        <div className="bg-white p-4 rounded-lg overflow-hidden min-w-[310px] mb-4">
          <h2 className="text-xl font-semibold bg-black text-white px-4 py-2 mb-4 font-[900] -ml-4 -mt-4 w-[calc(100%+2rem)]">
            Đang xem: {currentSegment.description}
          </h2>
          <div className="rounded-lg overflow-hidden w-[500px] max-w-full md:max-w-xl">
            <video controls className="w-full" key={currentSegment.description}>
              <source src={videoUrl + currentSegment.description} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      <div className="bg-white p-4 rounded-lg overflow-hidden min-w-[310px]">
        <h2 className="text-xl font-semibold bg-black text-white px-4 py-2 mb-4 font-[900] -ml-4 -mt-4 w-[calc(100%+2rem)]">
          Đoạn video ngắn
        </h2>
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
                <div className="mt-2 text-sm font-semibold">{segment.startTime} - {segment.end_time}</div>
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
