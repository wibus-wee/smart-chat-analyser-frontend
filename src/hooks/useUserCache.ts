import { useState, useCallback } from 'react';
import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';
import type {
  UserSearchResponse,
  MentionValidateResponse,
  UserSearchQuery,
  MentionValidateRequest,
} from '../sdk';

/**
 * 用户缓存管理 Hook
 */
export function useUserCache() {
  const [isOperating, setIsOperating] = useState(false);

  // 获取用户缓存状态
  const { data: cacheStatus, error: cacheStatusError, isLoading: cacheStatusLoading, mutate: refreshCacheStatus } = useSWR(
    'user-cache-status',
    () => sdkClient.userCache.getCacheStatus(),
    {
      refreshInterval: 30000, // 每30秒刷新一次
      revalidateOnFocus: true,
    }
  );

  // 重新加载用户缓存
  const reloadCache = useCallback(async () => {
    setIsOperating(true);
    try {
      const result = await sdkClient.userCache.reloadCache();
      // 刷新缓存状态
      await refreshCacheStatus();
      return result;
    } finally {
      setIsOperating(false);
    }
  }, [refreshCacheStatus]);

  // 搜索用户
  const searchUsers = useCallback(async (params: UserSearchQuery): Promise<UserSearchResponse> => {
    return sdkClient.userCache.searchUsers(params);
  }, []);

  // 根据关键词搜索用户
  const searchUsersByQuery = useCallback(async (query: string, limit: number = 10): Promise<UserSearchResponse> => {
    return sdkClient.userCache.searchUsersByQuery(query, limit);
  }, []);

  // 验证@艾特是否有效
  const validateMention = useCallback(async (request: MentionValidateRequest): Promise<MentionValidateResponse> => {
    return sdkClient.userCache.validateMention(request);
  }, []);

  // 验证@艾特是否有效（简化版本）
  const validateMentionByName = useCallback(async (mentionName: string, chatroomId?: string): Promise<MentionValidateResponse> => {
    return sdkClient.userCache.validateMentionByName(mentionName, chatroomId);
  }, []);

  return {
    // 数据
    cacheStatus,
    
    // 加载状态
    isLoading: cacheStatusLoading,
    isOperating,
    
    // 错误状态
    error: cacheStatusError,
    
    // 操作方法
    reloadCache,
    searchUsers,
    searchUsersByQuery,
    validateMention,
    validateMentionByName,
    
    // 刷新方法
    refresh: refreshCacheStatus,
  };
}
