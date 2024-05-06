import{ useParams } from 'react-router-dom';

const VideoSegmentPage = () => {
  const { cameraId } = useParams();
  const apiPath = process.env.REACT_APP_BE_API_URL;

  return (
    <VideoSegmentPage cameraId={cameraId} />
  );
}

export default VideoSegmentPage;