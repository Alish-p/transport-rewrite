import { useQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/documents';
const QUERY_KEY = 'documents';

// Fetchers
const getPaginatedDocuments = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
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

