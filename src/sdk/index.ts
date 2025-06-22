// 导出所有类型
export * from './types';

// 导出工具函数
export * from './utils/errors';
export * from './utils/validation';

// 导出客户端
export { ChatlogAnalyserClient } from './client';

// 导出各个 API 端点
export { HealthApi } from './endpoints/health';
export { TasksApi } from './endpoints/tasks';
export { AnalyzersApi } from './endpoints/analyzers';
export { ModelsApi } from './endpoints/models';
export { SystemApi } from './endpoints/system';

// 主要的 SDK 类
import { ChatlogAnalyserClient } from './client';
import { HealthApi } from './endpoints/health';
import { TasksApi } from './endpoints/tasks';
import { AnalyzersApi } from './endpoints/analyzers';
import { ModelsApi } from './endpoints/models';
import { SystemApi } from './endpoints/system';
import type { ApiClientConfig } from './types';

/**
 * 聊天记录分析器 SDK 主类
 * 
 * @example
 * ```typescript
 * import { ChatlogAnalyserSDK } from './sdk';
 * 
 * const sdk = new ChatlogAnalyserSDK({
 *   baseUrl: 'http://localhost:6142/api/v1'
 * });
 * 
 * // 检查健康状态
 * const health = await sdk.health.getHealth();
 * 
 * // 提交分析任务
 * const task = await sdk.tasks.createTask({
 *   talker: 'friend_name',
 *   days: 30,
 *   analyzers: ['word_frequency', 'sentiment']
 * });
 * 
 * // 等待任务完成并获取结果
 * const result = await sdk.tasks.waitForTaskCompletion(task.task_id);
 * ```
 */
export class ChatlogAnalyserSDK {
  private readonly client: ChatlogAnalyserClient;

  // API 端点实例
  public readonly health: HealthApi;
  public readonly tasks: TasksApi;
  public readonly analyzers: AnalyzersApi;
  public readonly models: ModelsApi;
  public readonly system: SystemApi;

  constructor(config: ApiClientConfig = {}) {
    this.client = new ChatlogAnalyserClient(config);

    // 初始化各个 API 端点
    this.health = new HealthApi(this.client);
    this.tasks = new TasksApi(this.client);
    this.analyzers = new AnalyzersApi(this.client);
    this.models = new ModelsApi(this.client);
    this.system = new SystemApi(this.client);
  }

  /**
   * 获取底层客户端实例（用于高级用法）
   */
  getClient(): ChatlogAnalyserClient {
    return this.client;
  }

  /**
   * 快速健康检查
   * @returns 服务是否健康
   */
  async isHealthy(): Promise<boolean> {
    return this.health.isHealthy();
  }

  /**
   * 快速提交分析任务并等待完成
   * @param taskData 任务数据
   * @param pollInterval 轮询间隔（毫秒）
   * @param timeout 超时时间（毫秒）
   * @returns 任务结果
   */
  async analyzeAndWait(
    taskData: Parameters<TasksApi['createTask']>[0],
    pollInterval?: number,
    timeout?: number
  ) {
    const task = await this.tasks.createTask(taskData);
    return this.tasks.waitForTaskCompletion(task.task_id, pollInterval, timeout);
  }

  /**
   * 获取完整的系统状态概览
   * @returns 系统状态概览
   */
  async getSystemOverview() {
    const [health, systemStats, queueStats, modelInfo] = await Promise.all([
      this.health.getHealth().catch(() => null),
      this.system.getSystemStats().catch(() => null),
      this.system.getQueueStats().catch(() => null),
      this.models.getModelInfo().catch(() => null),
    ]);

    return {
      health,
      system: systemStats,
      queue: queueStats,
      models: modelInfo,
      timestamp: new Date().toISOString(),
    };
  }
}

// 默认导出
export default ChatlogAnalyserSDK;
