import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/tasks';
const QUERY_KEY = 'tasks';

// Fetchers
const getTasks = async () => {
  const { data } = await axios.get(ENDPOINT);
  console.log({ data });
  return data;
};

const getTask = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createTask = async (column, task) => {
  const { data } = await axios.post(ENDPOINT, { ...task, status: column });
  return data;
};

const updateTask = async (column, task) => {
  const { data } = await axios.put(`${ENDPOINT}/${task?._id}`, { ...task, status: column });
  return data;
};

const updateTaskStatus = async (id, status) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, { status });
  return data;
};

const deleteTask = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useTasks() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTasks });
}

export function useTask(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ column, task }) => createTask(column, task),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Task added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ column, task }) => updateTask(column, task),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedTask._id], updatedTask);

      toast.success('Task edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, status }) => updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedTask._id], updatedTask);

      toast.success('Task status changed successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
