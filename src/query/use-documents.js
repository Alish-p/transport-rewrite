import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/documents';
const QUERY_KEY = 'documents';

// Fetchers
const getPaginatedDocuments = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};


export const getPresignedUploadUrl = async ({ vehicleId, docType, contentType }) => {
  const { data } = await axios.get(
    `${ENDPOINT}/${vehicleId}/upload-url`,
    { params: { docType, contentType } }
  );
  return data; // { key, uploadUrl }
};

export const createVehicleDocument = async ({ vehicleId, payload }) => {
  const { data } = await axios.post(`${ENDPOINT}/${vehicleId}`, payload);
  return data;
};

export const updateVehicleDocument = async ({ vehicleId, docId, payload }) => {
  const { data } = await axios.put(`${ENDPOINT}/${vehicleId}/${docId}`, payload);
  return data;
};

export const deleteVehicleDocument = async ({ vehicleId, docId }) => {
  const { data } = await axios.delete(`${ENDPOINT}/${vehicleId}/${docId}`);
  return data;
};

// Queries
export function usePaginatedDocuments(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedDocuments(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

// Mutations
export function useCreateVehicleDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createVehicleDocument,
    onSuccess: (doc) => {
      toast.success('Document added successfully');
      // Invalidate both active and history for this vehicle
      queryClient.invalidateQueries([QUERY_KEY, doc?.vehicle, 'active']);
      queryClient.invalidateQueries([QUERY_KEY, doc?.vehicle, 'history']);
      // Also invalidate unified documents listing
      queryClient.invalidateQueries(['documents']);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to add document';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateVehicleDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: updateVehicleDocument,
    onSuccess: (doc) => {
      toast.success('Document updated successfully');
      queryClient.invalidateQueries([QUERY_KEY, doc?.vehicle, 'active']);
      queryClient.invalidateQueries([QUERY_KEY, doc?.vehicle, 'history']);
      // Also invalidate unified documents listing
      queryClient.invalidateQueries(['documents']);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to update document';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useDeleteVehicleDocument() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: deleteVehicleDocument,
    onSuccess: (res, vars) => {
      toast.success('Document deleted');
      queryClient.invalidateQueries([QUERY_KEY, vars?.vehicleId, 'active']);
      queryClient.invalidateQueries([QUERY_KEY, vars?.vehicleId, 'history']);
      // Also invalidate unified documents listing
      queryClient.invalidateQueries(['documents']);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete document';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}
