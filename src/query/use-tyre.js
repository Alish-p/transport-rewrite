import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

export const TYRE_QUERY_KEYS = {
    all: ['tyres'],
    details: (id) => ['tyre', id],
    list: (params) => ['tyres', { ...params }],
};

export function useGetTyres(params) {
    return useQuery({
        queryKey: TYRE_QUERY_KEYS.list(params),
        queryFn: async () => {
            const { data } = await axios.get('/api/tyre', { params });
            return data;
        },
        keepPreviousData: true,
    });
}

export function useCreateTyre() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => axios.post('/api/tyre', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TYRE_QUERY_KEYS.all });
        },
    });
}

export function useGetTyre(id) {
    return useQuery({
        queryKey: TYRE_QUERY_KEYS.details(id),
        queryFn: async () => {
            const { data } = await axios.get(`/api/tyre/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useUpdateTyre() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => axios.put(`/api/tyre/${id}`, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: TYRE_QUERY_KEYS.details(variables.id) });
            queryClient.invalidateQueries({ queryKey: TYRE_QUERY_KEYS.all });
        },
    });
}

export function useUpdateTyreThread() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => axios.post(`/api/tyre/${id}/thread`, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: TYRE_QUERY_KEYS.details(variables.id) });
            queryClient.invalidateQueries({ queryKey: TYRE_QUERY_KEYS.all });
        },
    });
}
