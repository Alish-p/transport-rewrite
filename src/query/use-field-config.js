import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

import { useFieldConfigContext } from 'src/auth/field-config';

const ENDPOINT = '/api/field-configs';
const QUERY_KEY = 'fieldConfigs';

// Fetchers
const getFieldConfig = async (entity) => {
  const { data } = await axios.get(`${ENDPOINT}/${entity}`);
  return data;
};

const upsertFieldConfig = async ({ entity, fields, freightConfig }) => {
  const { data } = await axios.put(`${ENDPOINT}/${entity}`, { fields, freightConfig });
  return data;
};

const upsertCustomerOverride = async ({ entity, customerId, fields }) => {
  const { data } = await axios.put(`${ENDPOINT}/${entity}/customer/${customerId}`, { fields });
  return data;
};

const deleteCustomerOverride = async ({ entity, customerId }) => {
  const { data } = await axios.delete(`${ENDPOINT}/${entity}/customer/${customerId}`);
  return data;
};

// Hooks
export function useGetFieldConfig(entity, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, entity],
    queryFn: () => getFieldConfig(entity),
    enabled: !!entity,
    ...options,
  });
}

export function useUpsertFieldConfig() {
  const queryClient = useQueryClient();
  const { refreshFieldConfigs } = useFieldConfigContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: upsertFieldConfig,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.entity], data);
      refreshFieldConfigs();
      toast.success('Field configuration updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update field configuration';
      toast.error(errorMessage);
    },
  });

  return { upsertConfig: mutateAsync, isUpdating: isPending };
}

export function useUpsertCustomerOverride() {
  const queryClient = useQueryClient();
  const { refreshFieldConfigs } = useFieldConfigContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: upsertCustomerOverride,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.entity], data);
      refreshFieldConfigs();
      toast.success('Customer override updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update customer override';
      toast.error(errorMessage);
    },
  });

  return { upsertOverride: mutateAsync, isUpdatingOverride: isPending };
}

export function useDeleteCustomerOverride() {
  const queryClient = useQueryClient();
  const { refreshFieldConfigs } = useFieldConfigContext();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCustomerOverride,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.entity], data);
      refreshFieldConfigs();
      toast.success('Customer override deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete customer override';
      toast.error(errorMessage);
    },
  });

  return { deleteOverride: mutateAsync, isDeletingOverride: isPending };
}
