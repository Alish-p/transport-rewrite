import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const VEHICLE_ENDPOINT = '/api/vehicles';
const QUERY_KEY = 'vehicle-documents';

// Fetchers
const getActiveDocuments = async (vehicleId) => {
  const { data } = await axios.get(`${VEHICLE_ENDPOINT}/${vehicleId}/documents/active`);
  return data;
};

const getDocumentHistory = async (vehicleId) => {
  const { data } = await axios.get(`${VEHICLE_ENDPOINT}/${vehicleId}/documents/history`);
  return data;
};

export const getPresignedUploadUrl = async ({ vehicleId, docType, contentType }) => {
  const { data } = await axios.get(
    `${VEHICLE_ENDPOINT}/${vehicleId}/documents/upload-url`,
    { params: { docType, contentType } }
  );
  return data; // { key, uploadUrl }
};

export const createVehicleDocument = async ({ vehicleId, payload }) => {
  const { data } = await axios.post(`${VEHICLE_ENDPOINT}/${vehicleId}/documents`, payload);
  return data;
};

export const updateVehicleDocument = async ({ vehicleId, docId, payload }) => {
  const { data } = await axios.put(`${VEHICLE_ENDPOINT}/${vehicleId}/documents/${docId}`, payload);
  return data;
};

export const deleteVehicleDocument = async ({ vehicleId, docId }) => {
  const { data } = await axios.delete(`${VEHICLE_ENDPOINT}/${vehicleId}/documents/${docId}`);
  return data;
};

// Queries
export function useVehicleActiveDocuments(vehicleId, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, vehicleId, 'active'],
    queryFn: () => getActiveDocuments(vehicleId),
    enabled: !!vehicleId,
    ...options,
  });
}

export function useVehicleDocumentHistory(vehicleId, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, vehicleId, 'history'],
    queryFn: () => getDocumentHistory(vehicleId),
    enabled: !!vehicleId,
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
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to delete document';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}
