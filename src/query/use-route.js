import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/routes';
const QUERY_KEY = 'routes';

// Fetchers
const getRoutes = async () => {
  const { data } = await axios.get(ENDPOINT);
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
export function useRoutes() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getRoutes });
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
      console.log({ newRoute });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevRoutes) => [...prevRoutes, newRoute]);
      // caching current route
      queryClient.setQueryData([QUERY_KEY, newRoute._id], newRoute);
      toast.success('Route added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
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
      queryClient.setQueryData([QUERY_KEY], (prevRoutes) =>
        prevRoutes.map((route) => (route._id === updatedRoute._id ? updatedRoute : route))
      );
      queryClient.setQueryData([QUERY_KEY, updatedRoute._id], updatedRoute);

      toast.success('Route edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
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
      queryClient.setQueryData([QUERY_KEY], (prevRoutes) =>
        prevRoutes.filter((route) => route._id !== id)
      );
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
