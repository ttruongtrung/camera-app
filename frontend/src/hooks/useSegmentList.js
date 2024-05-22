import { useQuery } from 'react-query';
import axios from 'axios';

const useSegmentList = (cameraId) => {

  const fetchSegments = async () => {
    const apiPath = process.env.REACT_APP_BE_API_URL;
    try {
      const response = await axios.get(
        `${apiPath}/api/camera/${cameraId}/segments`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  return useQuery(['segments', cameraId], fetchSegments);
};

export default useSegmentList;
