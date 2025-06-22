import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';

/**
 * 系统统计信息 Hook
 */
export function useSystemStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'system-stats',
    () => sdkClient.system.getSystemStats(),
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    systemStats: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 队列统计信息 Hook
 */
export function useQueueStats() {
  const { data, error, isLoading, mutate } = useSWR(
    'queue-stats',
    () => sdkClient.system.getQueueStats(),
    {
      refreshInterval: 10000, // 每10秒刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    queueStats: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
