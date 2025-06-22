import type { ChatlogAnalyserClient } from '../client';

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
    const response = await this.client.get('/system/stats');
    return response.data;
  }

  /**
   * 获取队列统计信息
   * @returns 队列统计信息
   */
  async getQueueStats(): Promise<any> {
    const response = await this.client.get('/queue/stats');
    return response.data;
  }

  /**
   * 获取完整的系统状态
   * @returns 包含系统和队列统计的完整状态
   */
  async getFullSystemStatus(): Promise<{
    system: any;
    queue: any;
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
}
