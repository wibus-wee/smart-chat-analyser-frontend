import { z } from 'zod';

// 用户搜索结果 - 匹配 OpenAPI UserSearchResult
export const UserSearchResultSchema = z.object({
  user_id: z.string().optional().describe('用户ID'),
  display_name: z.string().optional().describe('显示名称'),
  mention_name: z.string().optional().describe('@艾特名称'),
  chatroom_ids: z.array(z.string()).optional().describe('所在聊天室ID列表'),
});
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;

// 用户搜索响应 - 匹配 OpenAPI UserSearchResponse
export const UserSearchResponseSchema = z.object({
  query: z.string().describe('搜索关键词'),
  results: z.array(UserSearchResultSchema).optional().describe('搜索结果'),
  total: z.number().int().describe('结果总数'),
  limit: z.number().int().describe('限制数量'),
  timestamp: z.string().describe('搜索时间'),
});
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;

// @艾特验证请求 - 匹配 OpenAPI MentionValidateRequest
export const MentionValidateRequestSchema = z.object({
  mention_name: z.string().describe('@艾特名称'),
  chatroom_id: z.string().optional().describe('聊天室ID'),
});
export type MentionValidateRequest = z.infer<typeof MentionValidateRequestSchema>;

// @艾特验证响应 - 匹配 OpenAPI MentionValidateResponse
export const MentionValidateResponseSchema = z.object({
  mention_name: z.string().describe('@艾特名称'),
  chatroom_id: z.string().optional().describe('聊天室ID'),
  is_valid: z.boolean().describe('是否有效'),
  timestamp: z.string().describe('验证时间'),
});
export type MentionValidateResponse = z.infer<typeof MentionValidateResponseSchema>;

// 用户搜索查询参数
export const UserSearchQuerySchema = z.object({
  q: z.string().min(1).describe('搜索关键词'),
  limit: z.number().int().min(1).max(50).default(10).describe('返回数量限制'),
});
export type UserSearchQuery = z.infer<typeof UserSearchQuerySchema>;
