import type { ChatlogAnalyserClient } from '../client';
import {
  AnalyzersResponseSchema,
  EnhancedAnalyzersResponseSchema,
  EnhancedAnalyzerInfoSchema,
  type AnalyzersResponse,
  type EnhancedAnalyzersResponse,
  type AnalyzerType,
  type AnalyzerInfo,
  type EnhancedAnalyzerInfo,
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
  async getAnalyzerInfo(analyzerName: AnalyzerType): Promise<EnhancedAnalyzerInfo> {
    const response = await this.client.get<EnhancedAnalyzerInfo>(`/analyzers/${analyzerName}`);
    return validateResponse(response.data, EnhancedAnalyzerInfoSchema, 'getAnalyzerInfo');
  }

  /**
   * 获取增强的分析器列表（包含详细状态信息）
   * @returns 增强的分析器列表响应
   */
  async getEnhancedAnalyzers(): Promise<EnhancedAnalyzersResponse> {
    const response = await this.client.get<EnhancedAnalyzersResponse>('/analyzers');
    return validateResponse(response.data, EnhancedAnalyzersResponseSchema, 'getEnhancedAnalyzers');
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

  /**
   * 获取可用的分析器（状态为available）
   * @returns 可用的分析器名称数组
   */
  async getAvailableAnalyzersWithStatus(): Promise<string[]> {
    try {
      const analyzers = await this.getEnhancedAnalyzers();
      return Object.entries(analyzers.analyzer_info)
        .filter(([, info]) => info.status === 'available')
        .map(([name]) => name);
    } catch {
      // 如果增强API不可用，回退到基础API
      return this.getAvailableAnalyzers();
    }
  }

  /**
   * 获取不可用的分析器
   * @returns 不可用的分析器名称数组
   */
  async getUnavailableAnalyzers(): Promise<string[]> {
    try {
      const analyzers = await this.getEnhancedAnalyzers();
      return Object.entries(analyzers.analyzer_info)
        .filter(([, info]) => info.status !== 'available')
        .map(([name]) => name);
    } catch {
      return [];
    }
  }

  /**
   * 检查分析器依赖是否满足
   * @param analyzerName 分析器名称
   * @returns 依赖是否满足
   */
  async checkAnalyzerDependencies(analyzerName: string): Promise<boolean> {
    try {
      const info = await this.getAnalyzerInfo(analyzerName as AnalyzerType);
      return info.status === 'available';
    } catch {
      return false;
    }
  }

  /**
   * 获取分析器的参数配置
   * @param analyzerName 分析器名称
   * @returns 参数配置
   */
  async getAnalyzerParameters(analyzerName: string): Promise<Record<string, any>> {
    try {
      const info = await this.getAnalyzerInfo(analyzerName as AnalyzerType);
      return info.parameters;
    } catch {
      return {};
    }
  }
}
