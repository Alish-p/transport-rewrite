import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/banks';
const QUERY_KEY = 'banks';

// Fetchers
const getPaginatedBanks = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};

const getBank = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createBank = async (bank) => {
  const { data } = await axios.post(ENDPOINT, bank);
  return data;
};

const updateBank = async (id, bankData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, bankData);
  return data;
};

const deleteBank = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function usePaginatedBanks(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedBanks(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useInfiniteBanks(params, options = {}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) => getPaginatedBanks({ ...(params || {}), page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + (page.banks ? page.banks.length : 0),
        0
      );
      const totalCount = lastPage.total || 0;
      return totalFetched < totalCount ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useBank(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getBank(id),
    enabled: !!id,
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createBank,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Bank added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateBank() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateBank(id, data),
    onSuccess: (updatedBank) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedBank._id], updatedBank);

      toast.success('Bank edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteBank() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (id) => deleteBank(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Bank deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}
