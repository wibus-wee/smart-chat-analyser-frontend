import { z } from 'zod';
import { ModelInfoSchema } from './models';

// 队列统计 - 匹配 OpenAPI QueueStats
export const QueueStatsSchema = z.object({
  pending: z.number().int().optional().describe('等待中的任务数'),
  running: z.number().int().optional().describe('运行中的任务数'),
  completed: z.number().int().optional().describe('已完成的任务数'),
  failed: z.number().int().optional().describe('失败的任务数'),
  cancelled: z.number().int().optional().describe('已取消的任务数'),
});
export type QueueStats = z.infer<typeof QueueStatsSchema>;

// 队列统计响应 - 匹配 OpenAPI QueueStatsResponse
export const QueueStatsResponseSchema = z.object({
  queue: QueueStatsSchema.optional().describe('队列统计'),
  models: ModelInfoSchema.optional().describe('模型信息'),
  timestamp: z.string().describe('统计时间'),
});
export type QueueStatsResponse = z.infer<typeof QueueStatsResponseSchema>;
