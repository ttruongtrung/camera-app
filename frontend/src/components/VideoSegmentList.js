import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoSegmentsList = ({ cameraId }) => {
  const [currentSegment, setCurrentSegment] = useState(null);
  const [segments, setSegments] = useState([]);
  const videoUrl = 'http://localhost:3001/api/storage/';

  useEffect(() => { fetchSegments(); }, []);

  const fetchSegments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/camera/${cameraId}/segments`);
      console.log(';;;'. response);
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const handleSegmentClick = (segment) => {
    setCurrentSegment(segment);
  };

  return (
    <div className="mt-4 max-w-96">
      {currentSegment && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Current Segment: {currentSegment.description}</h2>
          <div>
            <video controls className="w-full" key={currentSegment.description}>
              <source src={videoUrl + currentSegment.description} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Video Segments</h2>
      <div className="flex flex-col gap-4">
        {segments.map((segment, index) => (
          <div 
            key={index} onClick={() => handleSegmentClick(segment)}
            className={`border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-gray-100 ${segment.id === currentSegment?.id ? 'bg-blue-100' : ''}`}   
          >
            <p className="mt-2 text-sm">{segment.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSegmentsList;
