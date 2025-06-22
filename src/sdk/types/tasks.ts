import { z } from 'zod';
import { TaskStatusSchema, PaginationInfoSchema } from './common';

// 任务数据 - 匹配 OpenAPI TaskData
export const TaskDataSchema = z.object({
  talker: z.string().optional().describe('分析的用户名'),
  limit: z.number().int().optional().describe('分析消息数量限制'),
  chatroom_id: z.string().optional().describe('聊天室ID'),
});
export type TaskData = z.infer<typeof TaskDataSchema>;

// 任务请求 - 匹配 OpenAPI TaskRequest
export const TaskRequestSchema = z.object({
  task_type: z.string().describe('任务类型'),
  task_data: TaskDataSchema.optional().describe('任务数据'),
});
export type TaskRequest = z.infer<typeof TaskRequestSchema>;

// 任务提交响应 - 匹配 OpenAPI TaskSubmitResponse
export const TaskSubmitResponseSchema = z.object({
  task_id: z.string().describe('任务ID'),
  status: z.string().describe('提交状态'),
  message: z.string().describe('提交消息'),
  task_type: z.string().describe('任务类型'),
  submitted_at: z.string().describe('提交时间'),
});
export type TaskSubmitResponse = z.infer<typeof TaskSubmitResponseSchema>;

// 任务信息 - 匹配 OpenAPI TaskInfo
export const TaskInfoSchema = z.object({
  task_id: z.string().describe('任务ID'),
  task_type: z.string().describe('任务类型'),
  status: TaskStatusSchema.describe('任务状态'),
  progress: z.number().min(0).max(1).optional().describe('任务进度 (0-1)'),
  message: z.string().optional().describe('任务消息'),
  created_at: z.string().optional().describe('创建时间'),
  started_at: z.string().optional().describe('开始时间'),
  completed_at: z.string().optional().describe('完成时间'),
});
export type TaskInfo = z.infer<typeof TaskInfoSchema>;

// 任务过滤器 - 匹配 OpenAPI TaskFilters
export const TaskFiltersSchema = z.object({
  status: z.string().optional().describe('状态过滤器'),
});
export type TaskFilters = z.infer<typeof TaskFiltersSchema>;

// 任务列表响应 - 匹配 OpenAPI TasksListResponse
export const TasksListResponseSchema = z.object({
  tasks: z.array(TaskInfoSchema).describe('任务列表'),
  pagination: PaginationInfoSchema.describe('分页信息'),
  filters: TaskFiltersSchema.optional().describe('过滤器信息'),
  timestamp: z.string().describe('响应时间'),
});
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

// 任务结果响应 - 匹配 OpenAPI TaskResultResponse
export const TaskResultResponseSchema = z.object({
  task_id: z.string().describe('任务ID'),
  status: z.string().describe('任务状态'),
  result: z.object({}).optional().describe('任务结果数据'),
  completed_at: z.string().optional().describe('完成时间'),
});
export type TaskResultResponse = z.infer<typeof TaskResultResponseSchema>;

// 任务取消响应 - 匹配 OpenAPI TaskCancelResponse
export const TaskCancelResponseSchema = z.object({
  task_id: z.string().describe('任务ID'),
  status: z.string().describe('取消状态'),
  message: z.string().describe('取消消息'),
});
export type TaskCancelResponse = z.infer<typeof TaskCancelResponseSchema>;

// 任务查询参数
export const TaskListQuerySchema = z.object({
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('返回数量限制'),
  status: TaskStatusSchema.optional().describe('状态过滤器'),
});
export type TaskListQuery = z.infer<typeof TaskListQuerySchema>;
