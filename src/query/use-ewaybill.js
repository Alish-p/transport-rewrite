import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/ewaybill';

// Fetcher: transporter e-waybills by state and date
// params: { generated_date: 'DD/MM/YYYY', state_code: 'NN' }
const getTransporterByState = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}/transporter-by-state`, { params });
  // Normalize to a common shape used by the widget
  // Supports either an array response or { results: { message: [...] } }
  if (Array.isArray(data)) {
    return { results: { message: data } };
  }
  if (data && Array.isArray(data.results?.message)) {
    return data;
  }
  // Fallback: try common keys or wrap single object
  if (data && Array.isArray(data.message)) {
    return { results: { message: data.message } };
  }
  if (data && data.result && Array.isArray(data.result)) {
    return { results: { message: data.result } };
  }
  return { results: { message: [] } };
};

export function useTransporterEwaybillsByState(params, options = {}) {
  return useQuery({
    queryKey: ['ewaybill', 'transporter-by-state', params],
    queryFn: () => getTransporterByState(params),
    enabled: Boolean(params?.generated_date && params?.state_code),
    ...options,
  });
}
