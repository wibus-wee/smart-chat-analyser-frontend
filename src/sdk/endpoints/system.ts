import type { ChatlogAnalyserClient } from '../client';
import {
  QueueStatsResponseSchema,
  type QueueStatsResponse,
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
  async getSystemStats(): Promise<any> {
    const response = await this.client.get<any>('/system/stats');
    return response.data;
  }

  /**
   * 获取队列统计信息
   * @returns 队列统计信息
   */
  async getQueueStats(): Promise<QueueStatsResponse> {
    const response = await this.client.get<QueueStatsResponse>('/queue/stats');
    return validateResponse(response.data, QueueStatsResponseSchema, 'getQueueStats');
  }
}
