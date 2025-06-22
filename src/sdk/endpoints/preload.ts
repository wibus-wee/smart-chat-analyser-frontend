import type { ChatlogAnalyserClient } from '../client';

/**
 * 预加载管理相关 API
 */
export class PreloadApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取预加载状态
   * @returns 预加载状态响应
   */
  async getPreloadStatus(): Promise<any> {
    const response = await this.client.get<any>('/preload/status');
    return response.data;
  }

  /**
   * 重新加载所有预加载资源
   * @returns 预加载重新加载响应
   */
  async reloadAll(): Promise<any> {
    const response = await this.client.post<any>('/preload/reload-all', {});
    return response.data;
  }
}
