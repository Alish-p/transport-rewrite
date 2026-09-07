import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/whatsapp';
const QUERY_KEY = 'whatsapp';

// Fetchers
const getConversations = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}/conversations`, { params });
  return data;
};

const getConversationMessages = async (conversationId, params) => {
  const { data } = await axios.get(`${ENDPOINT}/conversations/${conversationId}/messages`, { params });
  return data;
};

const sendMessage = async (payload) => {
  const { data } = await axios.post(`${ENDPOINT}/messages/send`, payload);
  return data;
};

const markAsRead = async (conversationId) => {
  const { data } = await axios.patch(`${ENDPOINT}/conversations/${conversationId}/read`);
  return data;
};

export function getMediaProxyUrl(mediaId) {
  return `${axios.defaults.baseURL}${ENDPOINT}/media/${mediaId}`;
}

// Hooks
export function useWhatsAppConversations(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'conversations', params],
    queryFn: () => getConversations(params),
    refetchInterval: 5000,
    keepPreviousData: true,
    ...options,
  });
}

export function useWhatsAppMessages(conversationId, params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'messages', conversationId, params],
    queryFn: () => getConversationMessages(conversationId, params),
    enabled: !!conversationId,
    refetchInterval: 3000,
    keepPreviousData: true,
    ...options,
  });
}

export function useWhatsAppInfiniteMessages(conversationId, options = {}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY, 'infinite-messages', conversationId],
    queryFn: async ({ pageParam = null }) => {
      const params = { limit: 50 };
      if (pageParam) {
        params.before = pageParam;
      }
      return getConversationMessages(conversationId, params);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      const msgs = lastPage?.data || [];
      if (!msgs.length || msgs.length < 50) {
        return undefined;
      }
      return msgs[0]?.timestamp || msgs[0]?.createdAt || undefined;
    },
    enabled: !!conversationId,
    refetchInterval: 3000,
    ...options,
  });
}

export function useSendWhatsAppMessage() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      toast.success('Message sent successfully!');
      queryClient.invalidateQueries([QUERY_KEY, 'conversations']);
      queryClient.invalidateQueries([QUERY_KEY, 'messages']);
      queryClient.invalidateQueries([QUERY_KEY, 'infinite-messages']);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'Failed to send message';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useMarkConversationAsRead() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY, 'conversations']);
    },
  });
  return mutateAsync;
}
