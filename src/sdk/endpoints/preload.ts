import type { ChatlogAnalyserClient } from '../client';
import {
  GeneralPreloadStatusResponseSchema,
  PreloadReloadResponseSchema,
  type GeneralPreloadStatusResponse,
  type PreloadReloadResponse,
  type PreloadStatusItem,
} from '../types';
import { validateResponse } from '../utils/validation';

/**
 * 预加载管理相关 API
 */
export class PreloadApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取预加载状态
   * @returns 预加载状态响应
   */
  async getPreloadStatus(): Promise<GeneralPreloadStatusResponse> {
    const response = await this.client.get<GeneralPreloadStatusResponse>('/preload/status');
    return validateResponse(response.data, GeneralPreloadStatusResponseSchema, 'getPreloadStatus');
  }

  /**
   * 重新加载所有预加载资源
   * @returns 预加载重新加载响应
   */
  async reloadAll(): Promise<PreloadReloadResponse> {
    const response = await this.client.post<PreloadReloadResponse>('/preload/reload-all', {});
    return validateResponse(response.data, PreloadReloadResponseSchema, 'reloadAll');
  }

  /**
   * 获取特定资源的预加载状态
   * @param resourceKey 资源键名
   * @returns 预加载状态项，如果不存在则返回null
   */
  async getResourceStatus(resourceKey: string): Promise<PreloadStatusItem | null> {
    const status = await this.getPreloadStatus();
    return status.preload_status[resourceKey] || null;
  }

  /**
   * 检查是否有资源正在加载
   * @returns 是否有资源正在加载
   */
  async hasLoadingResources(): Promise<boolean> {
    const status = await this.getPreloadStatus();
    return Object.values(status.preload_status).some(
      (item: PreloadStatusItem) => item.status === 'loading'
    );
  }

  /**
   * 检查是否有资源加载失败
   * @returns 是否有资源加载失败
   */
  async hasFailedResources(): Promise<boolean> {
    const status = await this.getPreloadStatus();
    return Object.values(status.preload_status).some(
      (item: PreloadStatusItem) => item.status === 'failed'
    );
  }

  /**
   * 获取所有已完成的资源
   * @returns 已完成的资源键名列表
   */
  async getCompletedResources(): Promise<string[]> {
    const status = await this.getPreloadStatus();
    return Object.entries(status.preload_status)
      .filter(([, item]) => item.status === 'completed')
      .map(([key]) => key);
  }

  /**
   * 获取所有失败的资源
   * @returns 失败的资源键名列表
   */
  async getFailedResources(): Promise<string[]> {
    const status = await this.getPreloadStatus();
    return Object.entries(status.preload_status)
      .filter(([, item]) => item.status === 'failed')
      .map(([key]) => key);
  }

  /**
   * 获取预加载进度统计
   * @returns 预加载进度统计
   */
  async getProgressStats(): Promise<{
    total: number;
    completed: number;
    loading: number;
    failed: number;
    notStarted: number;
    completionRate: number;
  }> {
    const status = await this.getPreloadStatus();
    const items = Object.values(status.preload_status);
    
    const stats = {
      total: items.length,
      completed: items.filter(item => item.status === 'completed').length,
      loading: items.filter(item => item.status === 'loading').length,
      failed: items.filter(item => item.status === 'failed').length,
      notStarted: items.filter(item => item.status === 'not_started').length,
      completionRate: 0,
    };

    stats.completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
    
    return stats;
  }

  /**
   * 等待所有资源加载完成
   * @param maxWaitTime 最大等待时间（毫秒），默认30秒
   * @param checkInterval 检查间隔（毫秒），默认1秒
   * @returns 是否所有资源都加载完成
   */
  async waitForCompletion(maxWaitTime: number = 30000, checkInterval: number = 1000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const hasLoading = await this.hasLoadingResources();
      if (!hasLoading) {
        return true;
      }
      
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    return false;
  }
}
