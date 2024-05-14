import{ useParams } from 'react-router-dom';
import VideoSegmentsList from '../components/VideoSegmentList';

const VideoSegmentPage = () => {
  const { cameraId } = useParams();

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="py-5 px-2 max-w-[min(572px,100%)] mx-auto bg-gray-100">
        <h2 className="text-[32px] font-bold mb-4">Camera 1</h2>
        <div className="flex justify-center">
          <VideoSegmentsList cameraId={cameraId} showDefault />
        </div>
      </div>
    </div>
  );
}

export default VideoSegmentPage;