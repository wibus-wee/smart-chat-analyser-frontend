import { z } from 'zod';

// 服务状态 - 匹配 OpenAPI ServiceStatus
export const ServiceStatusSchema = z.object({
  task_queue: z.boolean().optional().describe('任务队列状态'),
  model_manager: z.boolean().optional().describe('模型管理器状态'),
  preprocessing_service: z.boolean().optional().describe('预处理服务状态'),
  analysis_service: z.boolean().optional().describe('分析服务状态'),
  visualization_service: z.boolean().optional().describe('可视化服务状态'),
});
export type ServiceStatus = z.infer<typeof ServiceStatusSchema>;

// 健康检查响应 - 匹配 OpenAPI HealthResponse
export const HealthResponseSchema = z.object({
  status: z.string().describe('健康状态'),
  timestamp: z.string().describe('检查时间'),
  version: z.string().describe('版本号'),
  services: ServiceStatusSchema.optional().describe('服务状态'),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
