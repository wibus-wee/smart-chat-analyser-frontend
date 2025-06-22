import type { ChatlogAnalyserClient } from '../client';
import {
  UserCacheStatusResponseSchema,
  UserCacheReloadResponseSchema,
  UserSearchResponseSchema,
  ValidateMentionRequestSchema,
  ValidateMentionResponseSchema,
  UserCacheSearchParamsSchema,
  type UserCacheStatusResponse,
  type UserCacheReloadResponse,
  type UserSearchResponse,
  type ValidateMentionRequest,
  type ValidateMentionResponse,
  type UserCacheSearchParams,
} from '../types';
import { validateRequest, validateResponse } from '../utils/validation';

/**
 * 用户缓存管理相关 API
 */
export class UserCacheApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取用户缓存状态
   * @returns 用户缓存状态响应
   */
  async getCacheStatus(): Promise<UserCacheStatusResponse> {
    const response = await this.client.get<UserCacheStatusResponse>('/user-cache/status');
    return validateResponse(response.data, UserCacheStatusResponseSchema, 'getCacheStatus');
  }

  /**
   * 重新加载用户缓存
   * @returns 用户缓存重新加载响应
   */
  async reloadCache(): Promise<UserCacheReloadResponse> {
    const response = await this.client.post<UserCacheReloadResponse>('/user-cache/reload', {});
    return validateResponse(response.data, UserCacheReloadResponseSchema, 'reloadCache');
  }

  /**
   * 搜索用户
   * @param params 搜索参数
   * @returns 用户搜索响应
   */
  async searchUsers(params: UserCacheSearchParams): Promise<UserSearchResponse> {
    const validatedParams = validateRequest(params, UserCacheSearchParamsSchema, 'searchUsers');
    const response = await this.client.get<UserSearchResponse>('/user-cache/search', { 
      query: validatedParams 
    });
    return validateResponse(response.data, UserSearchResponseSchema, 'searchUsers');
  }

  /**
   * 根据关键词搜索用户
   * @param query 搜索关键词
   * @param limit 返回结果数量限制，默认10
   * @returns 用户搜索响应
   */
  async searchUsersByQuery(query: string, limit: number = 10): Promise<UserSearchResponse> {
    return this.searchUsers({ q: query, limit });
  }

  /**
   * 验证@艾特是否有效
   * @param request 验证请求
   * @returns 验证响应
   */
  async validateMention(request: ValidateMentionRequest): Promise<ValidateMentionResponse> {
    const validatedRequest = validateRequest(request, ValidateMentionRequestSchema, 'validateMention');
    const response = await this.client.post<ValidateMentionResponse>('/user-cache/validate-mention', validatedRequest);
    return validateResponse(response.data, ValidateMentionResponseSchema, 'validateMention');
  }

  /**
   * 验证@艾特是否有效（简化版本）
   * @param mentionName 被@的名称
   * @param chatroomId 群聊ID（可选）
   * @returns 验证响应
   */
  async validateMentionByName(mentionName: string, chatroomId?: string): Promise<ValidateMentionResponse> {
    return this.validateMention({ mention_name: mentionName, chatroom_id: chatroomId });
  }

  /**
   * 检查缓存是否已加载
   * @returns 是否已加载
   */
  async isCacheLoaded(): Promise<boolean> {
    const status = await this.getCacheStatus();
    return status.cache_status.is_loaded;
  }

  /**
   * 检查缓存是否正在加载
   * @returns 是否正在加载
   */
  async isCacheLoading(): Promise<boolean> {
    const status = await this.getCacheStatus();
    return status.cache_status.is_loading;
  }

  /**
   * 获取缓存统计信息
   * @returns 缓存统计信息
   */
  async getCacheStats(): Promise<{
    contactsCount: number;
    chatroomsCount: number;
    totalNames: number;
    lastUpdate: string | null;
  }> {
    const status = await this.getCacheStatus();
    return {
      contactsCount: status.cache_status.contacts_count,
      chatroomsCount: status.cache_status.chatrooms_count,
      totalNames: status.cache_status.total_names,
      lastUpdate: status.cache_status.last_update,
    };
  }
}
