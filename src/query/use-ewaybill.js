import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/ewaybill';

// Fetcher: transporter e-waybills by date
// params: { generated_date: 'DD/MM/YYYY' }
const getTransporterEwaybills = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}/transporter`, { params });
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

export function useTransporterEwaybills(params, options = {}) {
  return useQuery({
    queryKey: ['ewaybill', 'transporter', params],
    queryFn: () => getTransporterEwaybills(params),
    enabled: Boolean(params?.generated_date),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
}

// Fetch single E-waybill by number
const getEwaybillByNumber = async (number) => {
  const { data } = await axios.get(`${ENDPOINT}/${number}`);
  return data;
};

export function useEwaybillByNumber(number, options = {}) {
  return useQuery({
    queryKey: ['ewaybill', number],
    queryFn: () => getEwaybillByNumber(number),
    enabled: Boolean(number),
    ...options,
  });
}
