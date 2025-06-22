import { z } from 'zod';
import { ResultSchema } from './types/task-response';

// 基础枚举类型
export const TaskStatusSchema = z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const AnalyzerTypeSchema = z.enum(['word_frequency', 'sentiment', 'time_pattern', 'social_network']);
export type AnalyzerType = z.infer<typeof AnalyzerTypeSchema>;

export const TaskTypeSchema = z.enum(['chatlog_analysis']);
export type TaskType = z.infer<typeof TaskTypeSchema>;

// 健康检查相关类型
export const HealthServicesSchema = z.object({
  task_queue: z.boolean(),
  model_manager: z.boolean(),
  preprocessing_service: z.boolean(),
  analysis_service: z.boolean(),
  visualization_service: z.boolean(),
});

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
  version: z.string(),
  services: HealthServicesSchema,
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

// 任务相关类型
export const TaskDataSchema = z.object({
  talker: z.string().optional(),
  days: z.number().int().default(30),
  limit: z.number().int().optional(),
  analyzers: z.array(AnalyzerTypeSchema).optional(),
})

export const CreateTaskRequestSchema = z.object({
  task_type: TaskTypeSchema.default('chatlog_analysis'),
  task_data: TaskDataSchema,
});

export const CreateTaskResponseSchema = z.object({
  task_id: z.string(),
  status: z.string(),
  message: z.string(),
  task_type: z.string(),
  created_at: z.string().optional(),
});

export const TaskStatusResponseSchema = z.object({
  task_id: z.string(),
  status: TaskStatusSchema,
  progress: z.number().min(0).max(100),
  message: z.string(),
  created_at: z.string(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  task_type: z.string(),
  error: z.string().nullable(),
});

export const TaskResultResponseSchema = z.object({
  task_id: z.string(),
  status: z.string(),
  result: ResultSchema.nullable(),
  completed_at: z.string(),
  error: z.string().nullable().optional(),
});

export const CancelTaskResponseSchema = z.object({
  task_id: z.string(),
  status: z.string(),
  message: z.string(),
});

// 任务列表相关类型
export const TaskListItemSchema = z.object({
  task_id: z.string(),
  task_type: z.string(),
  status: TaskStatusSchema,
  created_at: z.string(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  progress: z.number().min(0).max(100),
  message: z.string(),
  error: z.string().nullable(),
});

export const PaginationSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().min(1).max(100),
  offset: z.number().int().min(0),
  has_more: z.boolean(),
});

export const TaskListFiltersSchema = z.object({
  status: TaskStatusSchema.nullable(),
});

export const TaskListResponseSchema = z.object({
  tasks: z.array(TaskListItemSchema),
  pagination: PaginationSchema,
  filters: TaskListFiltersSchema,
  timestamp: z.string(),
});

export const TaskListQuerySchema = z.object({
  status: TaskStatusSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
}).partial();

export type TaskData = z.infer<typeof TaskDataSchema>;
export type CreateTaskRequest = z.infer<typeof CreateTaskRequestSchema>;
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;
export type TaskStatusResponse = z.infer<typeof TaskStatusResponseSchema>;
export type TaskResultResponse = z.infer<typeof TaskResultResponseSchema>;
export type CancelTaskResponse = z.infer<typeof CancelTaskResponseSchema>;
export type TaskListItem = z.infer<typeof TaskListItemSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type TaskListFilters = z.infer<typeof TaskListFiltersSchema>;
export type TaskListResponse = z.infer<typeof TaskListResponseSchema>;
export type TaskListQuery = z.infer<typeof TaskListQuerySchema>;

// 分析器相关类型
export const ClassInfoSchema = z.object({
  class_name: z.string(),
  doc: z.string(),
  module: z.string(),
});

export const InitParamSchema = z.object({
  default: z.unknown(),
  required: z.boolean(),
  type: z.string(),
});

export const MetadataSchema = z.object({
  builtin: z.boolean(),
  category: z.string(),
  description: z.string(),
});

export const AnalyzerInfoSchema = z.object({
  class_info: ClassInfoSchema,
  init_params: z.record(InitParamSchema),
  is_registered: z.boolean(),
  metadata: MetadataSchema,
  name: z.string(),
});

export const AnalyzersResponseSchema = z.object({
  analyzer_info: z.record(AnalyzerInfoSchema),
  analyzers: z.array(z.string()),
  total_count: z.number().int(),
});

export type ClassInfo = z.infer<typeof ClassInfoSchema>;
export type InitParam = z.infer<typeof InitParamSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;
export type AnalyzerInfo = z.infer<typeof AnalyzerInfoSchema>;
export type AnalyzersResponse = z.infer<typeof AnalyzersResponseSchema>;

// 模型相关类型
export const MemoryUsageSchema = z.object({
  rss: z.string(),
  vms: z.string(),
});

// 预加载状态类型
export const PreloadStatusSchema = z.object({
  model_name: z.string(),
  status: z.enum(['not_started', 'in_progress', 'completed', 'failed']),
  progress: z.number(),
  error: z.string().nullable(),
  is_loaded: z.boolean(),
  priority: z.number().optional(),
});

export const ModelInfoResponseSchema = z.object({
  loaded_models: z.array(z.string()),
  memory_usage: MemoryUsageSchema,
  model_count: z.number().int(),
  available_models: z.array(z.string()).optional(),
  preload_status: z.record(PreloadStatusSchema).optional(),
});

// 预加载请求和响应类型
export const PreloadModelRequestSchema = z.object({
  model_key: z.string().optional(),
  force: z.boolean().optional(),
});

export const PreloadModelResponseSchema = z.object({
  message: z.string(),
  model_key: z.string().optional(),
  results: z.record(z.boolean()).optional(),
  timestamp: z.string(),
});

// 预加载状态查询响应
export const PreloadStatusResponseSchema = z.object({
  status: z.union([
    PreloadStatusSchema,
    z.record(PreloadStatusSchema),
  ]),
  timestamp: z.string(),
});

// 取消预加载请求和响应
export const CancelPreloadRequestSchema = z.object({
  model_key: z.string(),
});

export const CancelPreloadResponseSchema = z.object({
  message: z.string(),
  model_key: z.string(),
  timestamp: z.string(),
});

export const ClearModelRequestSchema = z.object({
  model_key: z.string().optional(),
});

export const ClearModelResponseSchema = z.object({
  message: z.string(),
  timestamp: z.string(),
});

export type MemoryUsage = z.infer<typeof MemoryUsageSchema>;
export type PreloadStatus = z.infer<typeof PreloadStatusSchema>;
export type ModelInfoResponse = z.infer<typeof ModelInfoResponseSchema>;
export type PreloadModelRequest = z.infer<typeof PreloadModelRequestSchema>;
export type PreloadModelResponse = z.infer<typeof PreloadModelResponseSchema>;
export type PreloadStatusResponse = z.infer<typeof PreloadStatusResponseSchema>;
export type CancelPreloadRequest = z.infer<typeof CancelPreloadRequestSchema>;
export type CancelPreloadResponse = z.infer<typeof CancelPreloadResponseSchema>;
export type ClearModelRequest = z.infer<typeof ClearModelRequestSchema>;
export type ClearModelResponse = z.infer<typeof ClearModelResponseSchema>;

// 错误响应类型
export const ErrorResponseSchema = z.object({
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

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