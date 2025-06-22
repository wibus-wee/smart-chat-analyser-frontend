import { z } from 'zod';

// 基础枚举类型
export const TaskStatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// 错误响应类型 - 匹配 OpenAPI ErrorResponse
export const ErrorResponseSchema = z.object({
  error: z.string().describe('错误信息'),
  timestamp: z.string().optional().describe('错误时间戳'),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// 分页信息 - 匹配 OpenAPI PaginationInfo
export const PaginationInfoSchema = z.object({
  total: z.number().int().describe('总数量'),
  limit: z.number().int().describe('每页限制'),
  offset: z.number().int().describe('偏移量'),
  has_more: z.boolean().describe('是否有更多数据'),
});
export type PaginationInfo = z.infer<typeof PaginationInfoSchema>;

// API 客户端配置
export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API 响应包装类型
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// API 错误类型
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// API 端点常量
export const API_ENDPOINTS = {
  // 健康检查
  HEALTH: '/api/v1/health',

  // 任务管理
  TASKS: '/api/v1/tasks',
  TASK_STATUS: (taskId: string) => `/api/v1/tasks/${taskId}`,
  TASK_RESULT: (taskId: string) => `/api/v1/tasks/${taskId}/result`,
  TASK_CANCEL: (taskId: string) => `/api/v1/tasks/${taskId}/cancel`,

  // 分析器管理
  ANALYZERS: '/api/v1/analyzers',
  ANALYZER_INFO: (analyzerName: string) => `/api/v1/analyzers/${analyzerName}`,

  // 模型管理
  MODEL_INFO: '/api/v1/models/info',
  MODEL_CLEAR: '/api/v1/models/clear',
  MODEL_PRELOAD: '/api/v1/models/preload',
  MODEL_PRELOAD_STATUS: '/api/v1/models/preload/status',
  MODEL_PRELOAD_CANCEL: '/api/v1/models/preload/cancel',

  // 预加载管理
  PRELOAD_STATUS: '/api/v1/preload/status',
  PRELOAD_RELOAD_ALL: '/api/v1/preload/reload-all',

  // 用户缓存管理
  USER_CACHE_STATUS: '/api/v1/user-cache/status',
  USER_CACHE_RELOAD: '/api/v1/user-cache/reload',
  USER_CACHE_SEARCH: '/api/v1/user-cache/search',
  USER_CACHE_VALIDATE_MENTION: '/api/v1/user-cache/validate-mention',

  // 系统状态
  QUEUE_STATS: '/api/v1/queue/stats',
  SYSTEM_STATS: '/api/v1/system/stats',

  // 聊天记录代理
  CHATLOG_PROXY: (path: string) => `/api/v1/chatlog/${path}`,
} as const;
