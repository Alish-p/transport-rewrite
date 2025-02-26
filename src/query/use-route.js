import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/routes';
const QUERY_KEY = 'routes';

// Fetchers
const getRoutes = async ({ queryKey }) => {
  const [, customerId] = queryKey;
  let url = ENDPOINT;

  // If we have a customerId, append it as a query parameter
  if (customerId) {
    url += `?customerId=${customerId}`;
  }

  const { data } = await axios.get(url);
  return data;
};

const getRoute = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createRoute = async (route) => {
  const { data } = await axios.post(ENDPOINT, route);
  return data;
};

const updateRoute = async (id, routeData) => {
  console.log({ routeDataInAPICAll: routeData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, routeData);
  return data;
};

const deleteRoute = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useRoutes(customerId) {
  return useQuery({
    queryKey: [QUERY_KEY, customerId],
    queryFn: getRoutes,
  });
}

export function useRoute(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getRoute(id),
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createRoute,
    onSuccess: (newRoute) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Route added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateRoute(id, data),
    onSuccess: (updatedRoute) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedRoute._id], updatedRoute);

      toast.success('Route edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteRoute(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Route deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
