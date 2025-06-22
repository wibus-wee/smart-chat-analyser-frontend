import { z } from 'zod';

// 模型清除请求 - 匹配 OpenAPI ModelClearRequest
export const ModelClearRequestSchema = z.object({
  model_key: z.string().optional().describe('要清除的模型键名'),
});
export type ModelClearRequest = z.infer<typeof ModelClearRequestSchema>;

// 模型预加载请求 - 匹配 OpenAPI ModelPreloadRequest
export const ModelPreloadRequestSchema = z.object({
  model_key: z.string().optional().describe('要预加载的模型键名'),
  force: z.boolean().default(false).describe('是否强制重新加载'),
});
export type ModelPreloadRequest = z.infer<typeof ModelPreloadRequestSchema>;

// 预加载状态
export const PreloadStatusSchema = z.object({
  model_name: z.string().describe('模型名称'),
  status: z.enum(['not_started', 'in_progress', 'completed', 'failed']).describe('预加载状态'),
  progress: z.number().describe('预加载进度'),
  error: z.string().nullable().describe('错误信息'),
  is_loaded: z.boolean().describe('是否已加载'),
  priority: z.number().optional().describe('优先级'),
});
export type PreloadStatus = z.infer<typeof PreloadStatusSchema>;

// 内存使用信息
export const MemoryUsageSchema = z.object({
  rss: z.string().describe('常驻内存大小'),
  vms: z.string().describe('虚拟内存大小'),
});
export type MemoryUsage = z.infer<typeof MemoryUsageSchema>;

// 模型信息 - 匹配实际 API 响应
export const ModelInfoSchema = z.object({
  loaded_models: z.array(z.string()).describe('已加载的模型'),
  model_count: z.number().describe('模型数量'),
  memory_usage: MemoryUsageSchema.optional().describe('内存使用情况'),
  available_models: z.array(z.string()).describe('可用的模型'),
  preload_status: z.record(z.string(), PreloadStatusSchema).optional().describe('预加载状态'),
});
export type ModelInfo = z.infer<typeof ModelInfoSchema>;

// 预加载模型响应
export const PreloadModelResponseSchema = z.object({
  message: z.string().describe('响应消息'),
  model_key: z.string().optional().describe('模型键名'),
  results: z.record(z.string(), z.boolean()).optional().describe('批量操作结果'),
  timestamp: z.string().describe('时间戳'),
});
export type PreloadModelResponse = z.infer<typeof PreloadModelResponseSchema>;

// 取消预加载响应
export const CancelPreloadResponseSchema = z.object({
  message: z.string().describe('响应消息'),
  timestamp: z.string().describe('时间戳'),
});
export type CancelPreloadResponse = z.infer<typeof CancelPreloadResponseSchema>;

// 清除模型响应
export const ClearModelResponseSchema = z.object({
  message: z.string().describe('响应消息'),
  timestamp: z.string().describe('时间戳'),
});
export type ClearModelResponse = z.infer<typeof ClearModelResponseSchema>;

// 预加载状态响应
export const PreloadStatusResponseSchema = z.object({
  status: z.record(z.string(), PreloadStatusSchema).describe('预加载状态'),
  timestamp: z.string().describe('时间戳'),
});
export type PreloadStatusResponse = z.infer<typeof PreloadStatusResponseSchema>;
