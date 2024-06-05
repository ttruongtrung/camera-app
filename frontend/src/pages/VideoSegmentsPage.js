import { useParams } from 'react-router-dom';
import VideoSegmentsList from '../components/VideoSegmentList';
import { ReactComponent as FooterLogo } from '../assets/icons/footer-logo.svg';
import Header from '../components/layout/Header';

const VideoSegmentPage = () => {
  const { cameraId } = useParams();

  return (
    <div className="min-h-screen max-w-[min(572px,100%)] mx-auto bg-black">
      <Header />
      <div className="py-2">
        <div className="flex flex-col justify-center items-center">
          {cameraId && <VideoSegmentsList cameraId={cameraId} showDefault />}
        </div>
        <div className="bg-orangeLight px-2 py-4 pb-[50px] text-white border-t-[#ffffff6e]">
          <h2 className="text-2xl mx-auto text-center">OUR PROJECTS</h2>
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-2 mt-6">
            {new Array(8).fill(0).map((_, index) => (
              <div key={index} className="w-full bg-white rounded flex justify-center items-center text-black">
                <img
                  alt={index + 1}
                  src={`/images/projects/project-${index + 1}.png`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <a href="https://tasse.vn" rel='noreferrer noopener' target='_blank'>
          <FooterLogo className="h-10" />
        </a>
      </div>
    </div>
  );
};

export default VideoSegmentPage;
