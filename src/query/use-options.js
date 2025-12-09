import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/options';
const QUERY_KEY = 'options';

const getOptionsByGroup = async (group, params) => {
  const { data } = await axios.get(`${ENDPOINT}/${group}`, { params });
  return data;
};

const createOption = async (payload) => {
  const { data } = await axios.post(ENDPOINT, payload);
  return data;
};

const updateOption = async (id, payload) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, payload);
  return data;
};

const deleteOption = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

export function useOptions(group, options = {}, params = undefined) {
  return useQuery({
    queryKey: [QUERY_KEY, group, params],
    queryFn: () => getOptionsByGroup(group, params),
    enabled: !!group,
    ...options,
  });
}

export function useCreateOption() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: createOption,
    onSuccess: (createdOption) => {
      const group = createdOption?.group;
      if (group) {
        queryClient.invalidateQueries([QUERY_KEY, group]);
      } else {
        queryClient.invalidateQueries([QUERY_KEY]);
      }
      toast.success('Option saved');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useUpdateOption() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateOption(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Option updated');
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteOption() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: deleteOption,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Option deleted');
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}
