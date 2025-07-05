import { toast } from 'sonner';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/routes';
const QUERY_KEY = 'routes';

// Fetchers
const getRoutes = async ({ queryKey }) => {
  const [, customerId, genericRoutes] = queryKey;
  let url = ENDPOINT;
  const params = new URLSearchParams();

  // If we have a customerId, append it as a query parameter
  if (customerId) {
    params.append('customerId', customerId);
  }

  // If genericRoutes is true, append it as a query parameter
  if (genericRoutes) {
    params.append('genericRoutes', 'true');
  }

  // Append params to URL if they exist
  if (params.toString()) {
    url += `?${params.toString()}`;
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

const getPaginatedRoutes = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};

// Queries & Mutations
export function useRoutes(customerId, genericRoutes) {
  return useQuery({
    queryKey: [QUERY_KEY, customerId, genericRoutes],
    queryFn: getRoutes,
  });
}

export function usePaginatedRoutes(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedRoutes(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useInfiniteRoutes(params, options = {}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedRoutes({ ...(params || {}), page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) =>
          acc +
          (page.routes
            ? page.routes.length
            : page.results
            ? page.results.length
            : 0),
        0
      );
      const totalCount =
        lastPage.total ??
        (lastPage.totals ? lastPage.totals.all?.count : undefined) ??
        0;
      return totalFetched < totalCount ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
    enabled: !!params,
    ...options,
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
    onSuccess: () => {
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
    onSuccess: (_) => {
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
