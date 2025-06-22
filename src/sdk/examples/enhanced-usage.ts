/**
 * 增强 SDK 使用示例
 * 展示新增的用户缓存、预加载、增强系统统计等功能
 */

import { SDK } from '../index';

// 创建 SDK 实例
const sdk = new SDK({
  baseUrl: 'http://localhost:6142/api/v1',
  timeout: 30000,
});

/**
 * 用户缓存管理示例
 */
export async function userCacheExample() {
  console.log('=== 用户缓存管理示例 ===');

  try {
    // 获取缓存状态
    const cacheStatus = await sdk.userCache.getCacheStatus();
    console.log('缓存状态:', cacheStatus);

    // 检查缓存是否已加载
    const isLoaded = await sdk.userCache.isCacheLoaded();
    console.log('缓存是否已加载:', isLoaded);

    if (!isLoaded) {
      // 重新加载缓存
      console.log('正在重新加载用户缓存...');
      const reloadResult = await sdk.userCache.reloadCache();
      console.log('重新加载结果:', reloadResult);
    }

    // 搜索用户
    const searchResult = await sdk.userCache.searchUsersByQuery('张三', 5);
    console.log('搜索结果:', searchResult);

    // 验证@艾特
    const mentionValidation = await sdk.userCache.validateMentionByName('张三');
    console.log('@艾特验证:', mentionValidation);

    // 获取缓存统计
    const cacheStats = await sdk.userCache.getCacheStats();
    console.log('缓存统计:', cacheStats);

  } catch (error) {
    console.error('用户缓存操作失败:', error);
  }
}

/**
 * 预加载管理示例
 */
export async function preloadExample() {
  console.log('=== 预加载管理示例 ===');

  try {
    // 获取预加载状态
    const preloadStatus = await sdk.preload.getPreloadStatus();
    console.log('预加载状态:', preloadStatus);

    // 检查是否有资源正在加载
    const hasLoading = await sdk.preload.hasLoadingResources();
    console.log('是否有资源正在加载:', hasLoading);

    // 获取进度统计
    const progressStats = await sdk.preload.getProgressStats();
    console.log('进度统计:', progressStats);

    // 获取已完成的资源
    const completedResources = await sdk.preload.getCompletedResources();
    console.log('已完成的资源:', completedResources);

    // 获取失败的资源
    const failedResources = await sdk.preload.getFailedResources();
    console.log('失败的资源:', failedResources);

    if (failedResources.length > 0) {
      // 重新加载所有资源
      console.log('正在重新加载所有预加载资源...');
      const reloadResult = await sdk.preload.reloadAll();
      console.log('重新加载结果:', reloadResult);
    }

  } catch (error) {
    console.error('预加载操作失败:', error);
  }
}

/**
 * 增强系统统计示例
 */
export async function enhancedSystemStatsExample() {
  console.log('=== 增强系统统计示例 ===');

  try {
    // 获取详细的系统统计
    const systemStats = await sdk.system.getSystemStats();
    console.log('系统统计:', systemStats);

    // 获取队列统计
    const queueStats = await sdk.system.getQueueStats();
    console.log('队列统计:', queueStats);

    // 获取任务队列摘要
    const queueSummary = await sdk.system.getTaskQueueSummary();
    console.log('任务队列摘要:', queueSummary);

    // 检查系统是否健康
    const isHealthy = await sdk.system.isSystemHealthy();
    console.log('系统是否健康:', isHealthy);

    // 获取完整系统状态
    const fullStatus = await sdk.system.getFullSystemStatus();
    console.log('完整系统状态:', fullStatus);

  } catch (error) {
    console.error('系统统计操作失败:', error);
  }
}

/**
 * 增强分析器管理示例
 */
export async function enhancedAnalyzersExample() {
  console.log('=== 增强分析器管理示例 ===');

  try {
    // 获取增强的分析器列表
    const enhancedAnalyzers = await sdk.analyzers.getEnhancedAnalyzers();
    console.log('增强分析器列表:', enhancedAnalyzers);

    // 获取可用的分析器（带状态检查）
    const availableAnalyzers = await sdk.analyzers.getAvailableAnalyzersWithStatus();
    console.log('可用的分析器:', availableAnalyzers);

    // 获取不可用的分析器
    const unavailableAnalyzers = await sdk.analyzers.getUnavailableAnalyzers();
    console.log('不可用的分析器:', unavailableAnalyzers);

    // 检查特定分析器的依赖
    for (const analyzer of availableAnalyzers) {
      const dependenciesOk = await sdk.analyzers.checkAnalyzerDependencies(analyzer);
      console.log(`${analyzer} 依赖是否满足:`, dependenciesOk);

      // 获取分析器参数
      const parameters = await sdk.analyzers.getAnalyzerParameters(analyzer);
      console.log(`${analyzer} 参数配置:`, parameters);
    }

  } catch (error) {
    console.error('分析器操作失败:', error);
  }
}

/**
 * 增强模型管理示例
 */
export async function enhancedModelsExample() {
  console.log('=== 增强模型管理示例 ===');

  try {
    // 获取增强的模型信息
    const enhancedModelInfo = await sdk.models.getEnhancedModelInfo();
    console.log('增强模型信息:', enhancedModelInfo);

    // 获取模型详细状态
    const modelStatusDetails = await sdk.models.getModelStatusDetails();
    console.log('模型状态详情:', modelStatusDetails);

    // 执行模型操作
    console.log('正在预加载模型...');
    const preloadResult = await sdk.models.executeModelOperation('preload', undefined, false);
    console.log('预加载结果:', preloadResult);

  } catch (error) {
    console.error('模型操作失败:', error);
  }
}

/**
 * 服务初始化示例
 */
export async function serviceInitializationExample() {
  console.log('=== 服务初始化示例 ===');

  try {
    // 检查服务是否可用
    const isAvailable = await sdk.isServiceAvailable();
    console.log('服务是否可用:', isAvailable);

    if (isAvailable) {
      // 获取服务完整状态
      const serviceStatus = await sdk.getServiceStatus();
      console.log('服务完整状态:', serviceStatus);

      // 初始化服务
      console.log('正在初始化服务...');
      const initResult = await sdk.initializeService({
        preloadModels: true,
        reloadUserCache: true,
        reloadPreload: true,
      });
      console.log('初始化结果:', initResult);

      if (!initResult.success) {
        console.error('初始化失败，错误:', initResult.errors);
      }
    }

  } catch (error) {
    console.error('服务初始化失败:', error);
  }
}

/**
 * 运行所有示例
 */
export async function runAllExamples() {
  console.log('开始运行增强 SDK 功能示例...\n');

  await userCacheExample();
  console.log('\n');

  await preloadExample();
  console.log('\n');

  await enhancedSystemStatsExample();
  console.log('\n');

  await enhancedAnalyzersExample();
  console.log('\n');

  await enhancedModelsExample();
  console.log('\n');

  await serviceInitializationExample();
  console.log('\n');

  console.log('所有示例运行完成！');
}

// 如果直接运行此文件，则执行所有示例
if (require.main === module) {
  runAllExamples().catch(console.error);
}
