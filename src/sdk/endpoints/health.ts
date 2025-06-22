import type { ChatlogAnalyserClient } from '../client';
import { HealthResponseSchema, type HealthResponse } from '../types';
import { validateResponse } from '../utils/validation';

/**
 * 健康检查相关 API
 */
export class HealthApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取服务健康状态
   * @returns 健康检查响应
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return validateResponse(response.data, HealthResponseSchema, 'getHealth');
  }

  /**
   * 检查服务是否健康
   * @returns 是否健康
   */
  async isHealthy(): Promise<boolean> {
    try {
      const health = await this.getHealth();
      return health.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * 检查特定服务是否可用
   * @param serviceName 服务名称
   * @returns 服务是否可用
   */
  async isServiceAvailable(
    serviceName: keyof HealthResponse['services']
  ): Promise<boolean> {
    try {
      const health = await this.getHealth();
      return health.services?.[serviceName] === true;
    } catch {
      return false;
    }
  }

  /**
   * 获取所有不可用的服务列表
   * @returns 不可用的服务名称数组
   */
  async getUnavailableServices(): Promise<string[]> {
    try {
      const health = await this.getHealth();
      if (!health.services) {
        return [];
      }
      return Object.entries(health.services)
        .filter(([, available]) => !available)
        .map(([serviceName]) => serviceName);
    } catch {
      return [];
    }
  }
}
