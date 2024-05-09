import { useQuery } from 'react-query';
import axios from 'axios';

const fetchCameras = async () => {
  const apiPath = process.env.REACT_APP_BE_API_URL;
    const response = await axios.get(`${apiPath}/api/cameras`);
    return response.data;
  };

const useCameras = () => {
    return useQuery('cameras', fetchCameras);
}

export default useCameras