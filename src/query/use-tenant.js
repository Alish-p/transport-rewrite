import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/tenants';
const QUERY_KEY = 'tenant';

const getTenant = async () => {
  const { data } = await axios.get(`${ENDPOINT}/mytenant`);
  return data;
};

const updateTenant = async (tenantData) => {
  const { data } = await axios.put(`${ENDPOINT}/mytenant`, tenantData);
  return data;
};

export function useTenant(options = {}) {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTenant, ...options });
}

export function useUpdateTenant() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateTenant,
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY], updatedTenant);
      toast.success('Tenant updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}
