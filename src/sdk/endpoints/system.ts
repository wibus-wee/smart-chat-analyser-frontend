import type { ChatlogAnalyserClient } from '../client';
import {
  SystemStatsResponseSchema,
  QueueStatsSchema,
  type SystemStatsResponse,
  type QueueStats,
} from '../types';
import { validateResponse } from '../utils/validation';

/**
 * 系统统计相关 API
 */
export class SystemApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取系统统计信息
   * @returns 系统统计信息
   */
  async getSystemStats(): Promise<SystemStatsResponse> {
    const response = await this.client.get<SystemStatsResponse>('/system/stats');
    return validateResponse(response.data, SystemStatsResponseSchema, 'getSystemStats');
  }

  /**
   * 获取队列统计信息
   * @returns 队列统计信息
   */
  async getQueueStats(): Promise<QueueStats> {
    const response = await this.client.get<QueueStats>('/queue/stats');
    return validateResponse(response.data, QueueStatsSchema, 'getQueueStats');
  }

  /**
   * 获取完整的系统状态
   * @returns 包含系统和队列统计的完整状态
   */
  async getFullSystemStatus(): Promise<{
    system: SystemStatsResponse;
    queue: QueueStats;
    timestamp: string;
  }> {
    const [systemStats, queueStats] = await Promise.all([
      this.getSystemStats(),
      this.getQueueStats(),
    ]);

    return {
      system: systemStats,
      queue: queueStats,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 获取任务队列状态摘要
   * @returns 任务队列状态摘要
   */
  async getTaskQueueSummary(): Promise<{
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    failedTasks: number;
    workerStatus: boolean;
  }> {
    const queueStats = await this.getQueueStats();
    return {
      totalTasks: queueStats.total_tasks,
      activeTasks: queueStats.pending_tasks + queueStats.running_tasks,
      completedTasks: queueStats.completed_tasks,
      failedTasks: queueStats.failed_tasks,
      workerStatus: queueStats.worker_status,
    };
  }

  /**
   * 检查系统是否健康
   * @returns 系统是否健康
   */
  async isSystemHealthy(): Promise<boolean> {
    try {
      const queueStats = await this.getQueueStats();
      return queueStats.worker_status;
    } catch {
      return false;
    }
  }
}
