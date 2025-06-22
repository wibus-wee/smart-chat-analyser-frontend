import { useState, useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import sdkClient from '../lib/sdk-client';
import type { TaskData, TaskListQuery, TaskStatus } from '../sdk';

export function useAnalysisTask() {
  const [isCreating, setIsCreating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const createTask = useCallback(async (taskData: TaskData) => {
    setIsCreating(true);
    try {
      const result = await sdkClient.tasks.createTask(taskData);
      // 刷新任务列表
      mutate('recent-tasks');
      return result;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const cancelTask = useCallback(async (taskId: string) => {
    setIsCancelling(true);
    try {
      const result = await sdkClient.tasks.cancelTask(taskId);
      // 刷新任务列表
      mutate('recent-tasks');
      return result;
    } finally {
      setIsCancelling(false);
    }
  }, []);

  return {
    createTask,
    cancelTask,
    isCreating,
    isCancelling,
  };
}

export function useTaskStatus(taskId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    taskId ? ['task-status', taskId] : null,
    () => sdkClient.tasks.getTaskStatus(taskId!),
    {
      refreshInterval: (data) => {
        // 如果任务还在进行中，每2秒刷新一次
        if (data?.status === 'pending' || data?.status === 'running') {
          return 2000;
        }
        // 任务完成后停止刷新
        return 0;
      },
      revalidateOnFocus: true,
    }
  );

  return {
    taskStatus: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useTaskResult(taskId: string | null) {
  const { data, error, isLoading } = useSWR(
    taskId ? ['task-result', taskId] : null,
    () => sdkClient.tasks.getTaskResult(taskId!),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    taskResult: data,
    isLoading,
    error,
  };
}

export function useTaskList(query: TaskListQuery = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ['task-list', query],
    ([, query]) => sdkClient.tasks.getTaskList(query),
    {
      refreshInterval: 10000, // 每10秒刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    taskList: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useTasksByStatus(status: TaskStatus, limit: number = 20, offset: number = 0) {
  const { data, error, isLoading, mutate } = useSWR(
    ['tasks-by-status', status, limit, offset],
    ([, status, limit, offset]) => sdkClient.tasks.getTasksByStatus(status, limit, offset),
    {
      refreshInterval: 5000, // 每5秒刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    taskList: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useRunningTasks(limit: number = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    ['running-tasks', limit],
    ([, limit]) => sdkClient.tasks.getRunningTasks(limit),
    {
      refreshInterval: 2000, // 每2秒刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    runningTasks: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

// 获取最近的任务列表（这里需要后端支持，暂时模拟）
export function useRecentTasks() {
  const { data, error, isLoading, mutate } = useSWR(
    'recent-tasks',
    async () => {
      // 这里应该调用获取任务列表的 API
      // 暂时返回空数组，等后端支持后再实现
      return [];
    },
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  return {
    recentTasks: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}
