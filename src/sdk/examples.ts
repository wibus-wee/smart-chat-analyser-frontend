import ChatlogAnalyserSDK from './index';

/**
 * SDK 使用示例
 */

// 创建 SDK 实例
const sdk = new ChatlogAnalyserSDK({
  baseUrl: 'http://localhost:6142/api/v1',
  timeout: 30000,
});

/**
 * 示例 1: 基础健康检查
 */
export async function exampleHealthCheck() {
  try {
    // 简单检查
    const isHealthy = await sdk.health.isHealthy();
    console.log('Service is healthy:', isHealthy);

    // 详细健康信息
    const health = await sdk.health.getHealth();
    console.log('Health details:', health);

    // 检查特定服务
    const taskQueueAvailable = await sdk.health.isServiceAvailable('task_queue');
    console.log('Task queue available:', taskQueueAvailable);

  } catch (error) {
    console.error('Health check failed:', error);
  }
}

/**
 * 示例 2: 提交分析任务
 */
export async function exampleCreateTask() {
  try {
    // 创建任务
    const task = await sdk.tasks.createTask({
      talker: 'friend_name',
      days: 30,
      analyzers: ['word_frequency', 'sentiment', 'time_pattern'],
    });

    console.log('Task created:', task);
    return task.task_id;

  } catch (error) {
    console.error('Task creation failed:', error);
    throw error;
  }
}

/**
 * 示例 3: 监控任务进度
 */
export async function exampleMonitorTask(taskId: string) {
  try {
    // 获取任务状态
    const status = await sdk.tasks.getTaskStatus(taskId);
    console.log('Task status:', status);

    // 获取进度
    const progress = await sdk.tasks.getTaskProgress(taskId);
    console.log('Task progress:', `${progress}%`);

    // 检查是否完成
    const isCompleted = await sdk.tasks.isTaskCompleted(taskId);
    console.log('Task completed:', isCompleted);

  } catch (error) {
    console.error('Task monitoring failed:', error);
  }
}

/**
 * 示例 4: 等待任务完成并获取结果
 */
export async function exampleWaitForResult(taskId: string) {
  try {
    // 等待任务完成
    const result = await sdk.tasks.waitForTaskCompletion(taskId, 2000, 300000);
    console.log('Task result:', result);
    return result;

  } catch (error) {
    console.error('Waiting for task failed:', error);
    throw error;
  }
}

/**
 * 示例 5: 完整的分析流程
 */
export async function exampleFullAnalysis() {
  try {
    // 1. 检查服务健康状态
    const isHealthy = await sdk.health.isHealthy();
    if (!isHealthy) {
      throw new Error('Service is not healthy');
    }

    // 2. 获取可用分析器
    const analyzers = await sdk.analyzers.getAnalyzers();
    console.log('Available analyzers:', analyzers);

    // 3. 提交任务
    const taskResponse = await sdk.tasks.createTask({
      talker: 'friend_name',
      days: 7,
      analyzers: ['word_frequency', 'sentiment'],
    });

    // 4. 等待任务完成
    const result = await sdk.tasks.waitForTaskCompletion(taskResponse.task_id);

    console.log('Analysis completed:', result);
    return result;

  } catch (error) {
    console.error('Full analysis failed:', error);
    throw error;
  }
}

/**
 * 示例 6: 分析器管理
 */
export async function exampleAnalyzerManagement() {
  try {
    // 获取所有分析器信息
    const analyzersInfo = await sdk.analyzers.getAnalyzers();
    console.log('Analyzers info:', analyzersInfo);

    // 搜索分析器
    const sentimentAnalyzers = await sdk.analyzers.searchAnalyzers('sentiment');
    console.log('Sentiment analyzers:', sentimentAnalyzers);

    // 获取推荐分析器
    const recommended = await sdk.analyzers.getRecommendedAnalyzers();
    console.log('Recommended analyzers:', recommended);

  } catch (error) {
    console.error('Analyzer management failed:', error);
  }
}

/**
 * 示例 7: 模型管理
 */
export async function exampleModelManagement() {
  try {
    // 获取模型信息
    const modelInfo = await sdk.models.getModelInfo();
    console.log('Model info:', modelInfo);

    // 获取已加载模型
    const loadedModels = await sdk.models.getLoadedModels();
    console.log('Loaded models:', loadedModels);

    // 获取内存使用情况
    const memoryUsage = await sdk.models.getMemoryUsage();
    console.log('Memory usage:', memoryUsage);

    // 获取模型数量
    const modelCount = await sdk.models.getModelCount();
    console.log('Model count:', modelCount);

    // 获取模型统计信息
    const modelStats = await sdk.models.getModelStats();
    console.log('Model stats:', modelStats);

    // 清除特定模型缓存
    if (loadedModels.length > 0) {
      const clearResult = await sdk.models.clearModelCache(loadedModels[0]);
      console.log('Cache clear result:', clearResult);
    }

  } catch (error) {
    console.error('Model management failed:', error);
  }
}

/**
 * 示例 8: 系统状态概览
 */
export async function exampleSystemOverview() {
  try {
    const overview = await sdk.system.getFullSystemStatus();
    console.log('System overview:', overview);

  } catch (error) {
    console.error('System overview failed:', error);
  }
}

/**
 * 示例 9: 错误处理
 */
export async function exampleErrorHandling() {
  try {
    // 尝试获取不存在的任务
    await sdk.tasks.getTaskStatus('non-existent-task-id');

  } catch (error) {
    if (error instanceof Error) {
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      
      // 检查是否是 API 错误
      if ('status' in error) {
        console.log('HTTP status:', (error as any).status);
      }
    }
  }
}
