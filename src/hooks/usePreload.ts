import { useState, useCallback } from 'react';
import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';

/**
 * 预加载管理 Hook
 */
export function usePreload() {
  const [isOperating, setIsOperating] = useState(false);

  // 获取预加载状态
  const { data: preloadStatus, error: preloadStatusError, isLoading: preloadStatusLoading, mutate: refreshPreloadStatus } = useSWR(
    'preload-status',
    () => sdkClient.preload.getPreloadStatus(),
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: true,
    }
  );

  // 重新加载所有预加载资源
  const reloadAll = useCallback(async () => {
    setIsOperating(true);
    try {
      const result = await sdkClient.preload.reloadAll();
      // 刷新预加载状态
      await refreshPreloadStatus();
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [refreshPreloadStatus]);

  return {
    // 数据
    preloadStatus,
    
    // 加载状态
    isLoading: preloadStatusLoading,
    isOperating,
    
    // 错误状态
    error: preloadStatusError,
    
    // 操作方法
    reloadAll,
    
    // 刷新方法
    refresh: refreshPreloadStatus,
  };
}
