import { useParams } from 'react-router-dom';
import VideoSegmentsList from '../components/VideoSegmentList';
import { ReactComponent as FooterLogo } from '../assets/icons/footer-logo.svg';
import { ReactComponent as Logo } from '../assets/icons/logo.svg';

const VideoSegmentPage = () => {
  const { cameraId } = useParams();

  return (
    <div className="min-h-screen">
      <div className="flex justify-center bg-black pt-3 pb-4">
        <Logo className="h-14" />
      </div>
      <div className="py-3 px-2 max-w-[min(572px,100%)] mx-auto bg-gray-100">
        <h2 className="text-[26px] font-bold mb-2">Camera 1</h2>
        <div className="flex justify-center">
          {cameraId && <VideoSegmentsList cameraId={cameraId} showDefault />}
        </div>
      </div>
      <div className="flex justify-center bg-black py-4">
        <FooterLogo className="h-10" />
      </div>
    </div>
  );
};

export default VideoSegmentPage;