import { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const useCameras = () => {
	const { accessToken } = useContext(AuthContext);
  const config = {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  };

	const fetchCameras = async () => {
		const apiPath = process.env.REACT_APP_BE_API_URL;
		const response = await axios.get(`${apiPath}/api/cameras`, config);
		return response.data;
	};

  return useQuery('cameras', fetchCameras);
}

export default useCameras