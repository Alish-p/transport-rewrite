import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/subtrips';
const QUERY_KEY = 'subtrips';

// Fetchers
const getSubtrips = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getSubtrip = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const getClosedTripsByCustomerAndDate = async ({ queryKey }) => {
  const [, customerId, fromDate, toDate] = queryKey;
  if (!customerId || !fromDate || !toDate) return [];

  const { data } = await axios.post('/api/subtrips/fetchClosedTripsByCustomerAndDate', {
    customerId,
    fromDate,
    toDate,
  });
  return data;
};

const getTripsCompletedByDriverAndDate = async ({ queryKey }) => {
  const [, driverId, periodStartDate, periodEndDate] = queryKey;
  if (!driverId || !periodStartDate || !periodEndDate) return [];

  const { data } = await axios.post('/api/subtrips/fetchTripsCompletedByDriverAndDate', {
    driverId,
    fromDate: periodStartDate,
    toDate: periodEndDate,
  });
  return data;
};

const getClosedSubtripsByTransporterAndDate = async ({ queryKey }) => {
  const [, transporterId, periodStartDate, periodEndDate] = queryKey;
  if (!transporterId || !periodStartDate || !periodEndDate) return [];

  const { data } = await axios.post('/api/subtrips/fetchClosedSubtripsByTransporterAndDate', {
    transporterId,
    fromDate: periodStartDate,
    toDate: periodEndDate,
  });
  return data;
};

const createSubtrip = async (subtrip) => {
  const { data } = await axios.post(ENDPOINT, subtrip);
  return data;
};

const updateSubtrip = async (id, subtripData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, subtripData);
  return data;
};

const updateSubtripMaterialInfo = async (id, subtripData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/material-info`, subtripData);
  return data;
};

const updateSubtripReceiveInfo = async (id, subtripData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/recieve`, subtripData);
  return data;
};

const updateSubtripResolveInfo = async (id, subtripData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/resolve`, subtripData);
  return data;
};

const updateSubtripCloseInfo = async (id, subtripData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/close`, subtripData);
  return data;
};

const deleteSubtrip = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useSubtrips() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getSubtrips });
}

export function useClosedTripsByCustomerAndDate(customerId, fromDate, toDate) {
  return useQuery({
    queryKey: ['closed-trips', customerId, fromDate, toDate],
    queryFn: getClosedTripsByCustomerAndDate,
    enabled: !!customerId && !!fromDate && !!toDate,
  });
}

export function useTripsCompletedByDriverAndDate(driverId, periodStartDate, periodEndDate) {
  return useQuery({
    queryKey: ['closed-trips', driverId, periodStartDate, periodEndDate],
    queryFn: getTripsCompletedByDriverAndDate,
    enabled: !!driverId && !!periodStartDate && !!periodEndDate,
  });
}

export function useClosedSubtripsByTransporterAndDate(
  transporterId,
  periodStartDate,
  periodEndDate
) {
  return useQuery({
    queryKey: ['closed-subtrips', transporterId, periodStartDate, periodEndDate],
    queryFn: getClosedSubtripsByTransporterAndDate,
    enabled: !!transporterId && !!periodStartDate && !!periodEndDate,
  });
}

export function useSubtrip(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getSubtrip(id),
    enabled: !!id,
  });
}

export function useCreateSubtrip() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createSubtrip,
    onSuccess: (newSubtrip) => {
      console.log({ newSubtrip });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) => [...prevSubtrips, newSubtrip]);
      // caching current subtrip
      queryClient.setQueryData([QUERY_KEY, newSubtrip._id], newSubtrip);
      toast.success('Subtrip added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateSubtrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateSubtrip(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteSubtrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteSubtrip(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) =>
        prevSubtrips.filter((subtrip) => subtrip._id !== id)
      );
      toast.success('Subtrip deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateSubtripMaterialInfo() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateSubtripMaterialInfo(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips = []) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip Material Info added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useUpdateSubtripReceiveInfo() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateSubtripReceiveInfo(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips = []) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip Receive Info added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useUpdateSubtripResolveInfo() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateSubtripResolveInfo(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips = []) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip Resolve Info added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useUpdateSubtripCloseInfo() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateSubtripCloseInfo(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips = []) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip Close Info added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}
