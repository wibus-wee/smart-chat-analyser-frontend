import type { ChatlogAnalyserClient } from '../client';
import {
  AnalyzersResponseSchema,
  type AnalyzersResponse,
  type AnalyzerType,
  type AnalyzerInfo,
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
  async getAnalyzerInfo(analyzerName: AnalyzerType): Promise<any> {
    const response = await this.client.get(`/analyzers/${analyzerName}`);
    return response.data;
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
  async getAnalyzerInfoMap(): Promise<Record<string, AnalyzerInfo>> {
    const analyzers = await this.getAnalyzers();
    return analyzers.analyzer_info;
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
   * 根据描述搜索分析器
   * @param keyword 搜索关键词
   * @returns 匹配的分析器名称数组
   */
  async searchAnalyzers(keyword: string): Promise<string[]> {
    const analyzers = await this.getAnalyzers();
    const lowerKeyword = keyword.toLowerCase();

    return Object.entries(analyzers.analyzer_info)
      .filter(([, info]) =>
        info.name.toLowerCase().includes(lowerKeyword) ||
        info.metadata.description.toLowerCase().includes(lowerKeyword)
      )
      .map(([name]) => name);
  }

  /**
   * 获取推荐的分析器组合
   * @returns 推荐的分析器数组
   */
  async getRecommendedAnalyzers(): Promise<AnalyzerType[]> {
    // 返回常用的分析器组合
    return ['word_frequency', 'sentiment', 'time_pattern'];
  }
}
