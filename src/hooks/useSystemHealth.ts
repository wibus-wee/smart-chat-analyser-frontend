import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';

export function useSystemHealth() {
  const { data, error, isLoading, mutate } = useSWR(
    'system-health',
    () => sdkClient.health.getHealth(),
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: true,
      errorRetryCount: 3,
    }
  );

  const isHealthy = data?.status === 'healthy';

  return {
    health: data,
    isHealthy,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useSystemOverview() {
  const { data, error, isLoading, mutate } = useSWR(
    'system-overview',
    () => sdkClient.system.getFullSystemStatus(),
    {
      refreshInterval: 60000, // 每分钟刷新一次
      revalidateOnFocus: true,
    }
  );

  return {
    overview: data,
    isLoading,
    error,
    refresh: mutate,
  };
}
