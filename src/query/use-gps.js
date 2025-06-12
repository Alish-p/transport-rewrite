import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/gps';
const QUERY_KEY = 'gps';

const getGpsData = async (vehicleNo) => {
  const { data } = await axios.get(`${ENDPOINT}/${vehicleNo}`);
  return data;
};

export function useGps(vehicleNo, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, vehicleNo],
    queryFn: () => getGpsData(vehicleNo),
    enabled: !!vehicleNo && (options.enabled ?? true),
  });
}
