import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/dashboard';
const QUERY_KEY = 'dashboard';

// Fetchers
const getDashboard = async () => {
  const { data } = await axios.get(`${ENDPOINT}/summary`);
  return data;
};

const getCustomerMonthlyFreight = async (month) => {
  // month should be a string in "YYYY-MM" format
  const { data } = await axios.get(`${ENDPOINT}/customer-monthly-freight`, {
    params: { month },
  });
  return data;
};

const getSubtripsExpiry = async () => {
  const { data } = await axios.get(`${ENDPOINT}/subtrips-expiry`);
  return data;
};

const getSubtripMonthlyData = async () => {
  const { data } = await axios.get(`${ENDPOINT}/subtrip-monthly-data`);
  return data;
};


const getCounts = async () => {
  const { data } = await axios.get(`${ENDPOINT}/counts`);
  return data;
};




// Queries & Mutations
export function useDashboard() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getDashboard });
}

export function useCustomerMonthlyFreight(month) {
  return useQuery(
    {
      queryKey: ['customerMonthlyFreight', month],
      queryFn: () => getCustomerMonthlyFreight(month),
      enabled: Boolean(month),
    }
  );
}


export function useSubtripsExpiry() {
  return useQuery({ queryKey: ['subtripsExpiry'], queryFn: getSubtripsExpiry });
}

export function useSubtripMonthlyData() {
  return useQuery({ queryKey: ['subtripMonthlyData'], queryFn: getSubtripMonthlyData });
}

export function useDashboardCounts() {
  return useQuery({ queryKey: ['counts'], queryFn: getCounts });
}
