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

// ===== 新增的 Schema 定义 =====

// 用户缓存相关 Schema
export const UserCacheStatusResponseSchema = z.object({
  cache_status: z.object({
    is_loaded: z.boolean().describe('缓存是否已加载'),
    last_update: z.string().datetime().nullable().describe('最后更新时间'),
    load_error: z.string().nullable().describe('加载错误信息'),
    contacts_count: z.number().int().describe('联系人数量'),
    chatrooms_count: z.number().int().describe('群聊数量'),
    total_names: z.number().int().describe('总名称数量'),
    is_loading: z.boolean().describe('是否正在加载'),
  }),
  preload_status: z.object({
    status: z.enum(['not_started', 'loading', 'completed', 'failed']).describe('预加载状态'),
    error: z.string().nullable().describe('错误信息'),
    duration: z.number().nullable().describe('加载耗时（秒）'),
  }),
  timestamp: z.string().datetime(),
});

export const UserCacheReloadResponseSchema = z.object({
  message: z.string().describe('操作消息'),
  result: z.object({
    success: z.boolean().describe('是否成功'),
    message: z.string().describe('结果消息'),
    stats: z.record(z.union([z.string(), z.number(), z.boolean()])).optional().describe('缓存统计信息'),
    error: z.string().nullable().describe('错误信息'),
  }),
  timestamp: z.string().datetime(),
});

export const UserSearchResultSchema = z.object({
  userName: z.string().describe('用户名'),
  nickName: z.string().describe('昵称'),
  alias: z.string().describe('别名'),
  remark: z.string().describe('备注'),
  match_type: z.enum(['userName', 'name']).describe('匹配类型'),
  matched_name: z.string().optional().describe('匹配的名称'),
});

export const UserSearchResponseSchema = z.object({
  query: z.string().describe('搜索关键词'),
  results: z.array(UserSearchResultSchema),
  total: z.number().int().describe('结果总数'),
  limit: z.number().int().describe('限制数量'),
  timestamp: z.string().datetime(),
});

export const ValidateMentionRequestSchema = z.object({
  mention_name: z.string().min(1).describe('被@的名称'),
  chatroom_id: z.string().optional().describe('群聊ID（可选）'),
});

export const ValidateMentionResponseSchema = z.object({
  mention_name: z.string().describe('被@的名称'),
  chatroom_id: z.string().nullable().describe('群聊ID'),
  is_valid: z.boolean().describe('是否为有效的@艾特'),
  timestamp: z.string().datetime(),
});

// 预加载相关 Schema
export const PreloadStatusItemSchema = z.object({
  status: z.enum(['not_started', 'loading', 'completed', 'failed']).describe('预加载状态'),
  error: z.string().nullable().describe('错误信息'),
  duration: z.number().nullable().describe('加载耗时（秒）'),
});

export const GeneralPreloadStatusResponseSchema = z.object({
  preload_status: z.record(PreloadStatusItemSchema),
  timestamp: z.string().datetime(),
});

export const PreloadReloadResponseSchema = z.object({
  message: z.string().describe('操作消息'),
  result: z.object({
    success: z.boolean().describe('是否成功'),
    total_time: z.number().describe('总耗时（秒）'),
    results: z.record(z.object({
      success: z.boolean(),
      duration: z.number().optional(),
      error: z.string().optional(),
    })).describe('各个资源的加载结果'),
  }),
  timestamp: z.string().datetime(),
});

// 增强的任务相关 Schema
export const TaskInfoSchema = z.object({
  task_id: z.string(),
  task_type: z.string(),
  status: TaskStatusSchema,
  progress: z.number().min(0).max(100),
  message: z.string(),
  created_at: z.string().datetime(),
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable(),
  result: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export const EnhancedTaskListResponseSchema = z.object({
  tasks: z.array(TaskInfoSchema),
  pagination: z.object({
    total: z.number().int(),
    limit: z.number().int(),
    offset: z.number().int(),
    has_more: z.boolean(),
  }),
  filters: z.object({
    status: z.string().nullable(),
  }),
  timestamp: z.string().datetime(),
});

export const SubmitTaskRequestSchema = z.object({
  task_type: z.string().default('chatlog_analysis'),
  task_data: z.object({
    talker: z.string().optional(),
    days: z.number().int().positive().default(30),
    limit: z.number().int().positive().optional(),
    analyzers: z.array(z.string()).default(['word_frequency', 'sentiment', 'time_pattern', 'social_network']),
  }),
});

export const SubmitTaskResponseSchema = z.object({
  task_id: z.string(),
  status: z.string(),
  message: z.string(),
  task_type: z.string(),
  submitted_at: z.string().datetime(),
});

// 查询参数 Schema
export const UserCacheSearchParamsSchema = z.object({
  q: z.string().min(1).describe('搜索关键词'),
  limit: z.coerce.number().int().min(1).max(50).default(10).describe('返回结果数量限制'),
});

export const TaskListParamsSchema = z.object({
  status: z.enum(['pending', 'running', 'completed', 'failed', 'cancelled']).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// 增强的模型管理相关 Schema
export const EnhancedModelInfoResponseSchema = z.object({
  models: z.record(z.object({
    status: z.enum(['not_loaded', 'loading', 'loaded', 'failed']),
    load_time: z.number().nullable(),
    memory_usage: z.number().nullable(),
    last_used: z.string().datetime().nullable(),
    error: z.string().nullable(),
  })),
  total_models: z.number().int(),
  loaded_models: z.number().int(),
  total_memory: z.number(),
  timestamp: z.string().datetime(),
});

export const ModelOperationRequestSchema = z.object({
  model_key: z.string().optional(),
  force: z.boolean().default(false),
});

export const ModelOperationResponseSchema = z.object({
  message: z.string(),
  model_key: z.string().optional(),
  results: z.record(z.boolean()).optional(),
  timestamp: z.string().datetime(),
});

// 系统统计相关 Schema
export const QueueStatsSchema = z.object({
  total_tasks: z.number().int(),
  pending_tasks: z.number().int(),
  running_tasks: z.number().int(),
  completed_tasks: z.number().int(),
  failed_tasks: z.number().int(),
  cancelled_tasks: z.number().int(),
  worker_status: z.boolean(),
});

export const SystemStatsResponseSchema = z.object({
  task_queue: QueueStatsSchema,
  model_manager: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
  analysis_service: z.record(z.union([z.string(), z.number(), z.boolean()])),
  preprocessing_service: z.record(z.union([z.string(), z.number(), z.boolean()])),
  visualization_service: z.record(z.union([z.string(), z.number(), z.boolean()])),
  timestamp: z.string().datetime(),
});

// 增强的分析器相关 Schema
export const EnhancedAnalyzerInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  status: z.enum(['available', 'unavailable', 'error']),
  dependencies: z.array(z.string()),
  parameters: z.record(z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.object({
      type: z.string(),
      default: z.union([z.string(), z.number(), z.boolean()]).optional(),
      description: z.string().optional(),
    }),
  ])),
});

export const EnhancedAnalyzersResponseSchema = z.object({
  analyzers: z.array(z.string()),
  analyzer_info: z.record(EnhancedAnalyzerInfoSchema),
  total_count: z.number().int(),
});

// API 端点常量
export const API_ENDPOINTS = {
  // 健康检查
  HEALTH: '/api/v1/health',

  // 用户缓存管理
  USER_CACHE_STATUS: '/api/v1/user-cache/status',
  USER_CACHE_RELOAD: '/api/v1/user-cache/reload',
  USER_CACHE_SEARCH: '/api/v1/user-cache/search',
  USER_CACHE_VALIDATE_MENTION: '/api/v1/user-cache/validate-mention',

  // 预加载管理
  PRELOAD_STATUS: '/api/v1/preload/status',
  PRELOAD_RELOAD_ALL: '/api/v1/preload/reload-all',

  // 任务管理
  TASKS: '/api/v1/tasks',
  TASK_STATUS: (taskId: string) => `/api/v1/tasks/${taskId}`,
  TASK_RESULT: (taskId: string) => `/api/v1/tasks/${taskId}/result`,
  TASK_CANCEL: (taskId: string) => `/api/v1/tasks/${taskId}/cancel`,

  // 系统状态
  QUEUE_STATS: '/api/v1/queue/stats',
  SYSTEM_STATS: '/api/v1/system/stats',

  // 分析器管理
  ANALYZERS: '/api/v1/analyzers',
  ANALYZER_INFO: (analyzerName: string) => `/api/v1/analyzers/${analyzerName}`,

  // 模型管理
  MODEL_INFO: '/api/v1/models/info',
  MODEL_CLEAR: '/api/v1/models/clear',
  MODEL_PRELOAD: '/api/v1/models/preload',
  MODEL_PRELOAD_STATUS: '/api/v1/models/preload/status',
  MODEL_PRELOAD_CANCEL: '/api/v1/models/preload/cancel',

  // 聊天记录代理
  CHATLOG_PROXY: (path: string) => `/api/v1/chatlog/${path}`,
} as const;

// ===== 新增类型导出 =====

// 用户缓存相关类型
export type UserCacheStatusResponse = z.infer<typeof UserCacheStatusResponseSchema>;
export type UserCacheReloadResponse = z.infer<typeof UserCacheReloadResponseSchema>;
export type UserSearchResult = z.infer<typeof UserSearchResultSchema>;
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;
export type ValidateMentionRequest = z.infer<typeof ValidateMentionRequestSchema>;
export type ValidateMentionResponse = z.infer<typeof ValidateMentionResponseSchema>;

// 预加载相关类型
export type PreloadStatusItem = z.infer<typeof PreloadStatusItemSchema>;
export type GeneralPreloadStatusResponse = z.infer<typeof GeneralPreloadStatusResponseSchema>;
export type PreloadReloadResponse = z.infer<typeof PreloadReloadResponseSchema>;

// 增强的任务相关类型
export type TaskInfo = z.infer<typeof TaskInfoSchema>;
export type EnhancedTaskListResponse = z.infer<typeof EnhancedTaskListResponseSchema>;
export type SubmitTaskRequest = z.infer<typeof SubmitTaskRequestSchema>;
export type SubmitTaskResponse = z.infer<typeof SubmitTaskResponseSchema>;

// 查询参数类型
export type UserCacheSearchParams = z.infer<typeof UserCacheSearchParamsSchema>;
export type TaskListParams = z.infer<typeof TaskListParamsSchema>;

// 增强的模型管理类型
export type EnhancedModelInfoResponse = z.infer<typeof EnhancedModelInfoResponseSchema>;
export type ModelOperationRequest = z.infer<typeof ModelOperationRequestSchema>;
export type ModelOperationResponse = z.infer<typeof ModelOperationResponseSchema>;

// 系统统计类型
export type QueueStats = z.infer<typeof QueueStatsSchema>;
export type SystemStatsResponse = z.infer<typeof SystemStatsResponseSchema>;

// 增强的分析器类型
export type EnhancedAnalyzerInfo = z.infer<typeof EnhancedAnalyzerInfoSchema>;
export type EnhancedAnalyzersResponse = z.infer<typeof EnhancedAnalyzersResponseSchema>;