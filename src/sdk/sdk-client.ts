import { ChatlogAnalyserClient } from './client';
import { HealthApi } from './endpoints/health';
import { TasksApi } from './endpoints/tasks';
import { AnalyzersApi } from './endpoints/analyzers';
import { ModelsApi } from './endpoints/models';
import { SystemApi } from './endpoints/system';
import { UserCacheApi } from './endpoints/user-cache';
import { PreloadApi } from './endpoints/preload';
import type {
  ApiClientConfig,
  HealthResponse,
  AnalyzersResponse,
} from './types';

/**
 * 聊天记录分析器完整 SDK 客户端
 * 包含所有 API 端点的统一访问接口
 */
export class ChatlogAnalyserSDK {
  private readonly client: ChatlogAnalyserClient;

  // API 端点实例
  public readonly health: HealthApi;
  public readonly tasks: TasksApi;
  public readonly analyzers: AnalyzersApi;
  public readonly models: ModelsApi;
  public readonly system: SystemApi;
  public readonly userCache: UserCacheApi;
  public readonly preload: PreloadApi;

  constructor(config: ApiClientConfig = {}) {
    this.client = new ChatlogAnalyserClient(config);

    // 初始化所有 API 端点
    this.health = new HealthApi(this.client);
    this.tasks = new TasksApi(this.client);
    this.analyzers = new AnalyzersApi(this.client);
    this.models = new ModelsApi(this.client);
    this.system = new SystemApi(this.client);
    this.userCache = new UserCacheApi(this.client);
    this.preload = new PreloadApi(this.client);
  }

  /**
   * 获取底层 HTTP 客户端
   */
  getHttpClient(): ChatlogAnalyserClient {
    return this.client;
  }

  /**
   * 获取基础 URL
   */
  getBaseUrl(): string {
    return this.client.getBaseUrl();
  }

  /**
   * 设置请求头
   */
  setHeader(key: string, value: string): void {
    this.client.setHeader(key, value);
  }

  /**
   * 移除请求头
   */
  removeHeader(key: string): void {
    this.client.removeHeader(key);
  }

  /**
   * 检查服务是否可用
   * @returns 服务是否可用
   */
  async isServiceAvailable(): Promise<boolean> {
    try {
      const healthResponse = await this.health.getHealth();
      return healthResponse.status === 'healthy';
    } catch {
      return false;
    }
  }

  /**
   * 获取服务完整状态
   * @returns 服务完整状态信息
   */
  async getServiceStatus(): Promise<{
    health: HealthResponse | null;
    analyzers: AnalyzersResponse | null;
  }> {
    const [
      health,
      analyzers,
    ] = await Promise.allSettled([
      this.health.getHealth(),
      this.analyzers.getAnalyzers(),
    ]);

    return {
      health: health.status === 'fulfilled' ? health.value : null,
      analyzers: analyzers.status === 'fulfilled' ? analyzers.value : null,
    };
  }

  /**
   * 初始化服务（预加载模型和缓存）
   * @param options 初始化选项
   * @returns 初始化结果
   */
  async initializeService(options: {
    preloadModels?: boolean;
  } = {}): Promise<{
    success: boolean;
    results: {
      models?: any;
    };
    errors: string[];
  }> {
    const results: {
      models?: any;
    } = {};
    const errors: string[] = [];

    // 预加载模型
    if (options.preloadModels) {
      try {
        results.models = await this.models.preloadAllModels();
      } catch (error) {
        errors.push(`模型预加载失败: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors,
    };
  }

  /**
   * 清理服务资源
   * @returns 清理结果
   */
  async cleanupService(): Promise<{
    success: boolean;
    results: {
      models?: any;
    };
    errors: string[];
  }> {
    const results: {
      models?: any;
    } = {};
    const errors: string[] = [];

    // 清除模型缓存
    try {
      results.models = await this.models.clearAllModelCache();
    } catch (error) {
      errors.push(`模型缓存清除失败: ${error}`);
    }

    return {
      success: errors.length === 0,
      results,
      errors,
    };
  }
}

// 创建默认实例
export const defaultSDK = new ChatlogAnalyserSDK();

// 导出类型和常量
export * from './types';
export * from './utils/errors';
export * from './utils/validation';
