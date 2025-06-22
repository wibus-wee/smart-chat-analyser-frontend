import type { ChatlogAnalyserClient } from '../client';
import {
  TaskRequestSchema,
  TaskSubmitResponseSchema,
  TaskInfoSchema,
  TaskResultResponseSchema,
  TaskCancelResponseSchema,
  TasksListResponseSchema,
  TaskListQuerySchema,
  type TaskRequest,
  type TaskSubmitResponse,
  type TaskInfo,
  type TaskResultResponse,
  type TaskCancelResponse,
  type TasksListResponse,
  type TaskListQuery,
  type TaskData,
  type TaskStatus,
} from '../types';
import { validateRequest, validateResponse } from '../utils/validation';

/**
 * 任务管理相关 API
 */
export class TasksApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取任务列表
   * @param query 查询参数
   * @returns 任务列表响应
   */
  async getTaskList(query: TaskListQuery = {}): Promise<TasksListResponse> {
    const validatedQuery = validateRequest(query, TaskListQuerySchema, 'getTaskList');
    const response = await this.client.get<TasksListResponse>('/tasks', { query: validatedQuery });
    return validateResponse(response.data, TasksListResponseSchema, 'getTaskList');
  }

  /**
   * 获取指定状态的任务列表
   * @param status 任务状态
   * @param limit 返回数量限制
   * @param offset 偏移量
   * @returns 任务列表响应
   */
  async getTasksByStatus(
    status: TaskStatus,
    limit: number = 20,
    offset: number = 0
  ): Promise<TasksListResponse> {
    return this.getTaskList({ status, limit, offset });
  }

  /**
   * 获取正在运行的任务列表
   * @param limit 返回数量限制
   * @returns 任务列表响应
   */
  async getRunningTasks(limit: number = 20): Promise<TasksListResponse> {
    return this.getTasksByStatus('running', limit);
  }

  /**
   * 获取已完成的任务列表
   * @param limit 返回数量限制
   * @param offset 偏移量
   * @returns 任务列表响应
   */
  async getCompletedTasks(limit: number = 20, offset: number = 0): Promise<TasksListResponse> {
    return this.getTasksByStatus('completed', limit, offset);
  }

  /**
   * 提交分析任务
   * @param taskData 任务数据
   * @returns 任务创建响应
   */
  async createTask(taskData: TaskData): Promise<TaskSubmitResponse> {
    const request: TaskRequest = {
      task_type: 'chatlog_analysis',
      task_data: taskData,
    };

    const validatedRequest = validateRequest(request, TaskRequestSchema, 'createTask');
    const response = await this.client.post<TaskSubmitResponse>('/tasks', validatedRequest);
    return validateResponse(response.data, TaskSubmitResponseSchema, 'createTask');
  }

  /**
   * 获取任务状态
   * @param taskId 任务ID
   * @returns 任务状态响应
   */
  async getTaskStatus(taskId: string): Promise<TaskInfo> {
    const response = await this.client.get<TaskInfo>(`/tasks/${taskId}`);
    return validateResponse(response.data, TaskInfoSchema, 'getTaskStatus');
  }

  /**
   * 获取任务结果
   * @param taskId 任务ID
   * @returns 任务结果响应
   */
  async getTaskResult(taskId: string): Promise<TaskResultResponse> {
    const response = await this.client.get<TaskResultResponse>(`/tasks/${taskId}/result`);
    return validateResponse(response.data, TaskResultResponseSchema, 'getTaskResult');
  }

  /**
   * 取消任务
   * @param taskId 任务ID
   * @returns 取消任务响应
   */
  async cancelTask(taskId: string): Promise<TaskCancelResponse> {
    const response = await this.client.post<TaskCancelResponse>(`/tasks/${taskId}/cancel`);
    return validateResponse(response.data, TaskCancelResponseSchema, 'cancelTask');
  }

  /**
   * 等待任务完成
   * @param taskId 任务ID
   * @param pollInterval 轮询间隔（毫秒）
   * @param timeout 超时时间（毫秒）
   * @returns 任务结果响应
   */
  async waitForTaskCompletion(
    taskId: string,
    pollInterval: number = 2000,
    timeout: number = 300000
  ): Promise<TaskResultResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const status = await this.getTaskStatus(taskId);

      if (status.status === 'completed') {
        return this.getTaskResult(taskId);
      }

      if (status.status === 'failed' || status.status === 'cancelled') {
        throw new Error(`Task ${taskId} ${status.status}: ${status.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error(`Task ${taskId} timed out after ${timeout}ms`);
  }

  /**
   * 检查任务是否完成
   * @param taskId 任务ID
   * @returns 是否完成
   */
  async isTaskCompleted(taskId: string): Promise<boolean> {
    try {
      const status = await this.getTaskStatus(taskId);
      return status.status === 'completed';
    } catch {
      return false;
    }
  }

  /**
   * 检查任务是否正在运行
   * @param taskId 任务ID
   * @returns 是否正在运行
   */
  async isTaskRunning(taskId: string): Promise<boolean> {
    try {
      const status = await this.getTaskStatus(taskId);
      return status.status === 'running' || status.status === 'pending';
    } catch {
      return false;
    }
  }

  /**
   * 获取任务进度
   * @param taskId 任务ID
   * @returns 进度百分比 (0-100)
   */
  async getTaskProgress(taskId: string): Promise<number> {
    const status = await this.getTaskStatus(taskId);
    return status.progress;
  }
}
