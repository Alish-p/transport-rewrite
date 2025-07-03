import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/dashboard';


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

const getInvoiceStatusSummary = async () => {
  const { data } = await axios.get(`${ENDPOINT}/invoice-status-summary`);
  return data;
};

// Queries & Mutations
export function useCustomerMonthlyFreight(month) {
  return useQuery({
    queryKey: ['customerMonthlyFreight', month],
    queryFn: () => getCustomerMonthlyFreight(month),
    enabled: Boolean(month),
  });
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

// ----------------------------------------------------------------------
// Monthly expense summary
const getMonthlyExpenseSummary = async (month) => {
  const { data } = await axios.get(`${ENDPOINT}/grouped/monthly-expense`, {
    params: { month },
  });
  return data;
};

export function useMonthlyExpenseSummary(month) {
  return useQuery({
    queryKey: ['monthlyExpenseSummary', month],
    queryFn: () => getMonthlyExpenseSummary(month),
    enabled: Boolean(month),
  });
}

// ----------------------------------------------------------------------
// Subtrip status summary

const getSubtripStatusSummary = async () => {
  const { data } = await axios.get(`${ENDPOINT}/subtrip-status-summary`);
  return data;
};

export function useSubtripStatusSummary() {
  return useQuery({ queryKey: ['subtripStatusSummary'], queryFn: getSubtripStatusSummary });
}

// ----------------------------------------------------------------------
// Invoice status summary

export function useInvoiceStatusSummary() {
  return useQuery({ queryKey: ['invoiceStatusSummary'], queryFn: getInvoiceStatusSummary });
}

// ----------------------------------------------------------------------
// Financial = summary

const getFinancialMonthlyData = async () => {
  const { data } = await axios.get(`${ENDPOINT}/financial-monthly-data`);
  return data;
};

export function useFinancialMonthlyData() {
  return useQuery({ queryKey: ['financialMonthlyData'], queryFn: getFinancialMonthlyData });
}
