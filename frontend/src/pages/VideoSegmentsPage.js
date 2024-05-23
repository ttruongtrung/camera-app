import { useParams } from 'react-router-dom';
import VideoSegmentsList from '../components/VideoSegmentList';
import { ReactComponent as FooterLogo } from '../assets/icons/footer-logo.svg';
import Header from '../components/layout/Header';

const VideoSegmentPage = () => {
  const { cameraId } = useParams();

  return (
    <div className="min-h-screen max-w-[min(572px,100%)] mx-auto bg-black">
      <Header/>
      <div className="py-2">
        <div className="flex flex-col justify-center items-center">
          {cameraId && <VideoSegmentsList cameraId={cameraId} showDefault />}
        </div>
        <div className="bg-orangeLight px-2 py-6 pb-[60px] text-white">
          <h2 className="text-2xl mx-auto text-center">PROJECTS</h2>
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mt-4">
            <div className="w-full bg-white h-[80px] rounded flex justify-center items-center text-black">Project 1</div>
            <div className="w-full bg-white h-[80px] rounded flex justify-center items-center text-black">Project 2</div>
            <div className="w-full bg-white h-[80px] rounded flex justify-center items-center text-black">Project 3</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <FooterLogo className="h-10" />
      </div>
    </div>
  );
};

export default VideoSegmentPage;
