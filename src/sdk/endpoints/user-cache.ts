import type { ChatlogAnalyserClient } from '../client';
import {
  UserSearchResponseSchema,
  MentionValidateRequestSchema,
  MentionValidateResponseSchema,
  UserSearchQuerySchema,
  type UserSearchResponse,
  type MentionValidateRequest,
  type MentionValidateResponse,
  type UserSearchQuery,
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
  async getCacheStatus(): Promise<any> {
    const response = await this.client.get<any>('/user-cache/status');
    return response.data;
  }

  /**
   * 重新加载用户缓存
   * @returns 用户缓存重新加载响应
   */
  async reloadCache(): Promise<any> {
    const response = await this.client.post<any>('/user-cache/reload', {});
    return response.data;
  }

  /**
   * 搜索用户
   * @param params 搜索参数
   * @returns 用户搜索响应
   */
  async searchUsers(params: UserSearchQuery): Promise<UserSearchResponse> {
    const validatedParams = validateRequest(params, UserSearchQuerySchema, 'searchUsers');
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
  async validateMention(request: MentionValidateRequest): Promise<MentionValidateResponse> {
    const validatedRequest = validateRequest(request, MentionValidateRequestSchema, 'validateMention');
    const response = await this.client.post<MentionValidateResponse>('/user-cache/validate-mention', validatedRequest);
    return validateResponse(response.data, MentionValidateResponseSchema, 'validateMention');
  }

  /**
   * 验证@艾特是否有效（简化版本）
   * @param mentionName 被@的名称
   * @param chatroomId 群聊ID（可选）
   * @returns 验证响应
   */
  async validateMentionByName(mentionName: string, chatroomId?: string): Promise<MentionValidateResponse> {
    return this.validateMention({ mention_name: mentionName, chatroom_id: chatroomId });
  }
}
