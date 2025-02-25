import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/transporter-payments';
const QUERY_KEY = 'transporterPayments';

// Fetchers
const getTransporterPayments = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getTransporterPayment = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createTransporterPayment = async (transporterPayment) => {
  const { data } = await axios.post(ENDPOINT, transporterPayment);
  return data;
};

const updateTransporterPayment = async (id, transporterPaymentData) => {
  console.log({ transporterPaymentDataInAPICAll: transporterPaymentData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, transporterPaymentData);
  return data;
};

const updateTransporterPaymentStatus = async (id, status) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, { status });
  return data;
};

const deleteTransporterPayment = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useTransporterPayments() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTransporterPayments });
}

export function useTransporterPayment(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTransporterPayment(id),
    enabled: !!id,
  });
}

export function useCreateTransporterPayment() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createTransporterPayment,
    onSuccess: (newTransporterPayment) => {
      console.log({ newTransporterPayment });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevTransporterPayments) => [
        ...prevTransporterPayments,
        newTransporterPayment,
      ]);
      // caching current transporterPayment
      queryClient.setQueryData([QUERY_KEY, newTransporterPayment._id], newTransporterPayment);
      toast.success('TransporterPayment added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateTransporterPayment() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateTransporterPayment(id, data),
    onSuccess: (updatedTransporterPayment) => {
      queryClient.setQueryData([QUERY_KEY], (prevTransporterPayments) =>
        prevTransporterPayments.map((transporterPayment) =>
          transporterPayment._id === updatedTransporterPayment._id
            ? updatedTransporterPayment
            : transporterPayment
        )
      );
      queryClient.setQueryData(
        [QUERY_KEY, updatedTransporterPayment._id],
        updatedTransporterPayment
      );

      toast.success('TransporterPayment edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useUpdateTransporterPaymentStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, status }) => updateTransporterPaymentStatus(id, status),
    onSuccess: (updatedTransporterPayment) => {
      queryClient.setQueryData([QUERY_KEY], (prevTransporterPayments = []) =>
        prevTransporterPayments.map((tp) =>
          tp._id === updatedTransporterPayment._id ? updatedTransporterPayment : tp
        )
      );
      queryClient.setQueryData(
        [QUERY_KEY, updatedTransporterPayment._id],
        updatedTransporterPayment
      );

      toast.success('TransporterPayment status changed successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteTransporterPayment() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTransporterPayment(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevTransporterPayments) =>
        prevTransporterPayments.filter((transporterPayment) => transporterPayment._id !== id)
      );
      toast.success('TransporterPayment deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
