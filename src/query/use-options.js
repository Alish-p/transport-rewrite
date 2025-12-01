import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/options';
const QUERY_KEY = 'options';

const getOptionsByGroup = async (group) => {
  const { data } = await axios.get(`${ENDPOINT}/${group}`);
  return data;
};

const createOption = async (payload) => {
  const { data } = await axios.post(ENDPOINT, payload);
  return data;
};

export function useOptions(group, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, group],
    queryFn: () => getOptionsByGroup(group),
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

