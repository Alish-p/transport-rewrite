import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/dashboard';
const QUERY_KEY = 'dashboard';

// Fetchers
const getDashboard = async () => {
  const { data } = await axios.get(`${ENDPOINT}/summary`);
  return data;
};

// Queries & Mutations
export function useDashboard() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getDashboard });
}
