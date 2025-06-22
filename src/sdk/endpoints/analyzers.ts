import type { ChatlogAnalyserClient } from '../client';
import {
  AnalyzersResponseSchema,
  SimpleAnalyzerInfoSchema,
  type AnalyzersResponse,
  type SimpleAnalyzerInfo,
} from '../types';
import { validateResponse } from '../utils/validation';

/**
 * 分析器相关 API
 */
export class AnalyzersApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取所有可用分析器
   * @returns 分析器列表响应
   */
  async getAnalyzers(): Promise<AnalyzersResponse> {
    const response = await this.client.get<AnalyzersResponse>('/analyzers');
    return validateResponse(response.data, AnalyzersResponseSchema, 'getAnalyzers');
  }

  /**
   * 获取特定分析器信息
   * @param analyzerName 分析器名称
   * @returns 分析器详细信息
   */
  async getAnalyzerInfo(analyzerName: string): Promise<SimpleAnalyzerInfo> {
    const response = await this.client.get<SimpleAnalyzerInfo>(`/analyzers/${analyzerName}`);
    return validateResponse(response.data, SimpleAnalyzerInfoSchema, 'getAnalyzerInfo');
  }

  /**
   * 获取可用分析器名称列表
   * @returns 分析器名称数组
   */
  async getAvailableAnalyzers(): Promise<string[]> {
    const analyzers = await this.getAnalyzers();
    return analyzers.analyzers;
  }

  /**
   * 检查分析器是否可用
   * @param analyzerName 分析器名称
   * @returns 是否可用
   */
  async isAnalyzerAvailable(analyzerName: string): Promise<boolean> {
    try {
      const analyzers = await this.getAvailableAnalyzers();
      return analyzers.includes(analyzerName);
    } catch {
      return false;
    }
  }

  /**
   * 获取分析器详细信息映射
   * @returns 分析器信息映射
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAnalyzerInfoMap(): Promise<Record<string, any>> {
    const analyzers = await this.getAnalyzers();
    return analyzers.analyzer_info || {};
  }

  /**
   * 获取分析器总数
   * @returns 分析器总数
   */
  async getAnalyzerCount(): Promise<number> {
    const analyzers = await this.getAnalyzers();
    return analyzers.total_count;
  }

  /**
   * 获取推荐的分析器组合
   * @returns 推荐的分析器数组
   */
  async getRecommendedAnalyzers(): Promise<string[]> {
    // 返回常用的分析器组合
    return ['word_frequency', 'sentiment', 'time_pattern', 'social_network'];
  }
}
