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
  SystemStatsResponse,
  QueueStats,
  UserCacheStatusResponse,
  GeneralPreloadStatusResponse,
  ModelInfoResponse,
  AnalyzersResponse,
  PreloadModelResponse,
  UserCacheReloadResponse,
  PreloadReloadResponse,
  ClearModelResponse,
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
    system: SystemStatsResponse | null;
    queue: QueueStats | null;
    userCache: UserCacheStatusResponse | null;
    preload: GeneralPreloadStatusResponse | null;
    models: ModelInfoResponse | null;
    analyzers: AnalyzersResponse | null;
  }> {
    const [
      health,
      systemStats,
      queueStats,
      userCacheStatus,
      preloadStatus,
      modelInfo,
      analyzers,
    ] = await Promise.allSettled([
      this.health.getHealth(),
      this.system.getSystemStats(),
      this.system.getQueueStats(),
      this.userCache.getCacheStatus(),
      this.preload.getPreloadStatus(),
      this.models.getModelInfo(),
      this.analyzers.getAnalyzers(),
    ]);

    return {
      health: health.status === 'fulfilled' ? health.value : null,
      system: systemStats.status === 'fulfilled' ? systemStats.value : null,
      queue: queueStats.status === 'fulfilled' ? queueStats.value : null,
      userCache: userCacheStatus.status === 'fulfilled' ? userCacheStatus.value : null,
      preload: preloadStatus.status === 'fulfilled' ? preloadStatus.value : null,
      models: modelInfo.status === 'fulfilled' ? modelInfo.value : null,
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
    reloadUserCache?: boolean;
    reloadPreload?: boolean;
  } = {}): Promise<{
    success: boolean;
    results: {
      models?: PreloadModelResponse;
      userCache?: UserCacheReloadResponse;
      preload?: PreloadReloadResponse;
    };
    errors: string[];
  }> {
    const results: {
      models?: PreloadModelResponse;
      userCache?: UserCacheReloadResponse;
      preload?: PreloadReloadResponse;
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

    // 重新加载用户缓存
    if (options.reloadUserCache) {
      try {
        results.userCache = await this.userCache.reloadCache();
      } catch (error) {
        errors.push(`用户缓存重新加载失败: ${error}`);
      }
    }

    // 重新加载预加载资源
    if (options.reloadPreload) {
      try {
        results.preload = await this.preload.reloadAll();
      } catch (error) {
        errors.push(`预加载资源重新加载失败: ${error}`);
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
      models?: ClearModelResponse;
    };
    errors: string[];
  }> {
    const results: {
      models?: ClearModelResponse;
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
