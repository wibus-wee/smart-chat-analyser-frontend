import { useState, useCallback } from 'react';
import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';
import type {
  PreloadModelResponse,
  CancelPreloadResponse,
  ClearModelResponse,
  PreloadStatus
} from '../sdk';

/**
 * 模型管理 Hook
 */
export function useModelManagement() {
  const [isOperating, setIsOperating] = useState(false);

  // 获取模型信息
  const { data: modelInfo, error: modelInfoError, isLoading: modelInfoLoading, mutate: refreshModelInfo } = useSWR(
    'model-info',
    () => sdkClient.models.getModelInfo(),
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: true,
    }
  );

  // 获取预加载状态
  const { data: preloadStatus, error: preloadStatusError, isLoading: preloadStatusLoading, mutate: refreshPreloadStatus } = useSWR(
    'preload-status',
    () => sdkClient.models.getPreloadStatus(),
    {
      refreshInterval: (data) => {
        // 如果有模型正在预加载，每2秒刷新一次
        if (data?.status && typeof data.status === 'object') {
          const statuses = Object.values(data.status) as PreloadStatus[];
          const hasInProgress = statuses.some(status => status.status === 'in_progress');
          return hasInProgress ? 2000 : 30000;
        }
        return 30000;
      },
      revalidateOnFocus: true,
    }
  );

  // 预加载模型
  const preloadModel = useCallback(async (modelKey?: string, force?: boolean): Promise<PreloadModelResponse> => {
    setIsOperating(true);
    try {
      const result = await sdkClient.models.preloadModel(modelKey, force);
      // 刷新相关数据
      await Promise.all([
        refreshModelInfo(),
        refreshPreloadStatus(),
      ]);
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [refreshModelInfo, refreshPreloadStatus]);

  // 取消预加载
  const cancelPreload = useCallback(async (modelKey: string): Promise<CancelPreloadResponse> => {
    setIsOperating(true);
    try {
      const result = await sdkClient.models.cancelPreload(modelKey);
      // 刷新相关数据
      await Promise.all([
        refreshModelInfo(),
        refreshPreloadStatus(),
      ]);
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [refreshModelInfo, refreshPreloadStatus]);

  // 清除模型缓存
  const clearModelCache = useCallback(async (modelKey?: string): Promise<ClearModelResponse> => {
    setIsOperating(true);
    try {
      const result = await sdkClient.models.clearModelCache(modelKey);
      // 刷新相关数据
      await Promise.all([
        refreshModelInfo(),
        refreshPreloadStatus(),
      ]);
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [refreshModelInfo, refreshPreloadStatus]);

  // 预加载所有模型
  const preloadAllModels = useCallback(async (force?: boolean): Promise<PreloadModelResponse> => {
    return preloadModel(undefined, force);
  }, [preloadModel]);

  // 清除所有模型缓存
  const clearAllModelCache = useCallback(async (): Promise<ClearModelResponse> => {
    return clearModelCache();
  }, [clearModelCache]);

  // 获取模型状态信息
  const getModelStatus = useCallback((modelKey: string): PreloadStatus | null => {
    // 优先从 preloadStatus 获取
    if (preloadStatus?.status && typeof preloadStatus.status === 'object') {
      const statuses = preloadStatus.status as Record<string, PreloadStatus>;
      if (statuses[modelKey]) {
        return statuses[modelKey];
      }
    }

    // 如果 preloadStatus 没有，尝试从 modelInfo.preload_status 获取
    if (modelInfo?.preload_status && typeof modelInfo.preload_status === 'object') {
      const statuses = modelInfo.preload_status as Record<string, PreloadStatus>;
      return statuses[modelKey] || null;
    }

    return null;
  }, [preloadStatus, modelInfo]);

  // 检查模型是否正在操作中
  const isModelOperating = useCallback((modelKey: string): boolean => {
    const status = getModelStatus(modelKey);
    return status?.status === 'in_progress' || isOperating;
  }, [getModelStatus, isOperating]);

  // 获取所有可用模型及其状态
  const getModelsWithStatus = useCallback(() => {
    if (!modelInfo?.available_models) return [];

    return modelInfo.available_models.map(modelKey => {
      const status = getModelStatus(modelKey);
      const isLoaded = modelInfo.loaded_models?.includes(modelKey) || false;

      return {
        key: modelKey,
        name: status?.model_name || modelKey,
        status: status?.status || 'not_started',
        progress: status?.progress || 0,
        error: status?.error,
        isLoaded,
        priority: status?.priority,
      };
    });
  }, [modelInfo, getModelStatus]);

  return {
    // 数据
    modelInfo,
    preloadStatus,
    modelsWithStatus: getModelsWithStatus(),
    
    // 加载状态
    isLoading: modelInfoLoading || preloadStatusLoading,
    isOperating,
    
    // 错误状态
    error: modelInfoError || preloadStatusError,
    
    // 操作方法
    preloadModel,
    cancelPreload,
    clearModelCache,
    preloadAllModels,
    clearAllModelCache,
    
    // 工具方法
    getModelStatus,
    isModelOperating,
    
    // 刷新方法
    refresh: () => Promise.all([refreshModelInfo(), refreshPreloadStatus()]),
  };
}

/**
 * 单个模型管理 Hook
 */
export function useModelStatus(modelKey: string) {
  const { getModelStatus, isModelOperating, preloadModel, cancelPreload, clearModelCache } = useModelManagement();
  
  const status = getModelStatus(modelKey);
  const isOperating = isModelOperating(modelKey);
  
  return {
    status,
    isOperating,
    preload: (force?: boolean) => preloadModel(modelKey, force),
    cancel: () => cancelPreload(modelKey),
    clearCache: () => clearModelCache(modelKey),
  };
}
