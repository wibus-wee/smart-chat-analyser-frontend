import { motion } from 'framer-motion';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Server,
  Brain,
  MessageSquare,
  Zap,
  Timer,
  Tag,
  List,
  Download,
  Trash2,
  Play,
  Square,
  Users,
  RefreshCw,
  Database,
  BarChart3,
  Cpu} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useSystemHealth, useSystemOverview } from '../../hooks/useSystemHealth';
import { useModelManagement } from '../../hooks/useModelManagement';
import { useUserCache } from '../../hooks/useUserCache';
import { usePreload } from '../../hooks/usePreload';
import { useSystemStats, useQueueStats } from '../../hooks/useSystemStats';
import { toast } from 'sonner';
import { TopNavigation } from './TopNavigation';
import { formatAnalyzerLabel } from '@/lib/utils';

export function StatusBar() {
  const { health, isHealthy, isLoading: healthLoading } = useSystemHealth();
  const { overview, isLoading: overviewLoading } = useSystemOverview();
  console.log(overview?.analyzers);
  const {
    modelsWithStatus,
    isLoading: modelManagementLoading,
    isOperating,
    preloadModel,
    cancelPreload,
    clearModelCache,
    preloadAllModels,
    clearAllModelCache,
  } = useModelManagement();

  // 用户缓存管理
  const {
    cacheStatus,
    isLoading: userCacheLoading,
    isOperating: userCacheOperating,
    reloadCache,
  } = useUserCache();

  // 预加载管理
  const {
    preloadStatus,
    isLoading: preloadLoading,
    isOperating: preloadOperating,
    reloadAll: reloadAllPreload,
  } = usePreload();

  // 系统统计
  const { systemStats, isLoading: systemStatsLoading } = useSystemStats();
  const { queueStats, isLoading: queueStatsLoading } = useQueueStats();

  const getStatusIcon = () => {
    if (healthLoading) return <Clock className="h-4 w-4 animate-spin" />;
    if (isHealthy) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (healthLoading) return '检查中...';
    if (isHealthy) return '系统正常';
    return '系统异常';
  };

  // 模型操作处理函数
  const handlePreloadModel = async (modelKey: string) => {
    try {
      await preloadModel(modelKey);
      toast.success(`开始预加载模型: ${modelKey}`);
    } catch (error) {
      toast.error(`预加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleCancelPreload = async (modelKey: string) => {
    try {
      await cancelPreload(modelKey);
      toast.success(`已取消预加载: ${modelKey}`);
    } catch (error) {
      toast.error(`取消失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleClearCache = async (modelKey: string) => {
    try {
      await clearModelCache(modelKey);
      toast.success(`已清除模型缓存: ${modelKey}`);
    } catch (error) {
      toast.error(`清除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handlePreloadAll = async () => {
    try {
      await preloadAllModels();
      toast.success('开始预加载所有模型');
    } catch (error) {
      toast.error(`批量预加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllModelCache();
      toast.success('已清除所有模型缓存');
    } catch (error) {
      toast.error(`批量清除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 用户缓存操作处理函数
  const handleReloadUserCache = async () => {
    try {
      await reloadCache();
      toast.success('用户缓存重新加载成功');
    } catch (error) {
      toast.error(`用户缓存重新加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 预加载操作处理函数
  const handleReloadAllPreload = async () => {
    try {
      await reloadAllPreload();
      toast.success('预加载资源重新加载成功');
    } catch (error) {
      toast.error(`预加载资源重新加载失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Smart Chat Analyser</h1>
        </div>
      </div>

      <TopNavigation />

      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {getStatusIcon()}
              <span className="text-sm">{getStatusText()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-[95vh] overflow-y-auto " align="end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <h3 className="font-medium">系统状态</h3>
              </div>
              
              {health && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>服务状态</span>
                    </div>
                    <span className={isHealthy ? 'text-green-600' : 'text-red-600'}>
                      {health.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>版本</span>
                    </div>
                    <span className="text-muted-foreground">{health.version}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      <span>更新时间</span>
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(health.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              {health?.services && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <List className="h-3 w-3" />
                    <h4 className="text-sm font-medium">服务组件</h4>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(health.services).map(([service, status]) => {
                      return (
                        <div key={service} className="flex justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="capitalize">{service.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {status ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <AlertCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span className={status ? 'text-green-600' : 'text-red-600'}>
                              {status ? '正常' : '异常'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {overview && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <h4 className="text-sm font-medium">系统概览</h4>
                  </div>
                  {overview.health && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>服务状态: 正常运行</span>
                    </div>
                  )}
                  {overview.analyzers && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>分析器: {overview.analyzers.total_count || 0} 个可用</span>
                      </div>
                      {overview.analyzers.analyzer_info && Object.keys(overview.analyzers.analyzer_info).length > 0 && (
                        <div className="space-y-2 mt-2">
                          <div className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            <h5 className="text-xs font-medium text-muted-foreground">分析器列表</h5>
                          </div>
                          <div className="space-y-1">
                            {Object.entries(overview.analyzers.analyzer_info).map(([key, analyzer]: [string, any]) => (
                              <div key={key} className="flex justify-between text-xs">
                                <div className="flex items-center gap-1">
                                  <span className="capitalize" title={analyzer.class_info?.doc || analyzer.metadata?.description}>
                                    {formatAnalyzerLabel(analyzer.name)} <span className="text-muted-foreground">
                                        ({analyzer.metadata?.description})
                                        </span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  {analyzer.is_registered ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className={analyzer.is_registered ? 'text-green-600' : 'text-red-600'}>
                                    {analyzer.is_registered ? '已挂载' : '未挂载'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(overviewLoading || modelManagementLoading || modelsWithStatus.length > 0) && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {overviewLoading || modelManagementLoading ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <Brain className="h-4 w-4" />
                      )}
                      <h4 className="text-sm font-medium">模型管理</h4>
                    </div>
                  </div>

                  {modelManagementLoading ? (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 animate-spin mx-auto mb-2" />
                      加载模型信息中...
                    </div>
                  ) : (
                    <>
                      {/* 批量操作 */}
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePreloadAll}
                          disabled={isOperating || modelManagementLoading}
                          className="flex-1 h-7 text-xs"
                        >
                          {isOperating ? (
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          预加载全部
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearAll}
                          disabled={isOperating || modelManagementLoading}
                          className="flex-1 h-7 text-xs"
                        >
                          {isOperating ? (
                            <Clock className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3 mr-1" />
                          )}
                          清除全部
                        </Button>
                      </div>

                      {/* 模型列表 */}
                      {modelsWithStatus.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            <h5 className="text-xs font-medium text-muted-foreground">模型列表</h5>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {modelsWithStatus.map((model) => (
                              <ModelStatusCard
                                key={model.key}
                                model={model}
                                onPreload={() => handlePreloadModel(model.key)}
                                onCancel={() => handleCancelPreload(model.key)}
                                onClearCache={() => handleClearCache(model.key)}
                                isOperating={isOperating}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {modelsWithStatus.length === 0 && !modelManagementLoading && (
                        <div className="text-center py-2 text-xs text-muted-foreground">
                          暂无可用模型
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* 系统统计模块 */}
              {(systemStatsLoading || queueStatsLoading || systemStats || queueStats) && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {systemStatsLoading || queueStatsLoading ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <BarChart3 className="h-4 w-4" />
                    )}
                    <h4 className="text-sm font-medium">系统统计</h4>
                  </div>

                  {systemStatsLoading || queueStatsLoading ? (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 animate-spin mx-auto mb-2" />
                      加载统计信息中...
                    </div>
                  ) : (
                    <>
                      {queueStats && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <List className="h-3 w-3" />
                            <h5 className="text-xs font-medium text-muted-foreground">任务队列</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {queueStats.queue?.pending !== undefined && (
                              <div className="flex justify-between">
                                <span>等待中:</span>
                                <span className="text-yellow-600">{queueStats.queue.pending}</span>
                              </div>
                            )}
                            {queueStats.queue?.running !== undefined && (
                              <div className="flex justify-between">
                                <span>运行中:</span>
                                <span className="text-blue-600">{queueStats.queue.running}</span>
                              </div>
                            )}
                            {queueStats.queue?.completed !== undefined && (
                              <div className="flex justify-between">
                                <span>已完成:</span>
                                <span className="text-green-600">{queueStats.queue.completed}</span>
                              </div>
                            )}
                            {queueStats.queue?.failed !== undefined && (
                              <div className="flex justify-between">
                                <span>失败:</span>
                                <span className="text-red-600">{queueStats.queue.failed}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {systemStats && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Cpu className="h-3 w-3" />
                            <h5 className="text-xs font-medium text-muted-foreground">系统资源</h5>
                          </div>
                          {systemStats.model_manager?.memory_usage && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>内存使用:</span>
                                <span>
                                  {typeof systemStats.model_manager.memory_usage === 'string'
                                    ? systemStats.model_manager.memory_usage
                                    : systemStats.model_manager.memory_usage.rss || 'N/A'}
                                </span>
                              </div>
                            </div>
                          )}
                          {systemStats.model_manager?.loaded_models && (
                            <div className="text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>已加载模型:</span>
                                <span>{systemStats.model_manager.loaded_models.length}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* 用户缓存管理模块 */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {userCacheLoading ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    <h4 className="text-sm font-medium">用户缓存</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReloadUserCache}
                    disabled={userCacheOperating || userCacheLoading}
                    className="h-6 w-6 p-0"
                    title="重新加载用户缓存"
                  >
                    <RefreshCw className={`h-3 w-3 ${userCacheOperating || userCacheLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {userCacheLoading ? (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin mx-auto mb-2" />
                    加载用户缓存信息中...
                  </div>
                ) : cacheStatus ? (
                  <div className="space-y-1 text-xs">
                    {cacheStatus.cache_status && (
                      <>
                        <div className="flex justify-between">
                          <span>加载状态:</span>
                          <span className={`${cacheStatus.cache_status.is_loaded ? 'text-green-600' : 'text-red-600'}`}>
                            {cacheStatus.cache_status.is_loaded ? '已加载' : '未加载'}
                          </span>
                        </div>
                        {cacheStatus.cache_status.contacts_count !== undefined && (
                          <div className="flex justify-between">
                            <span>联系人:</span>
                            <span className="text-muted-foreground">{cacheStatus.cache_status.contacts_count}</span>
                          </div>
                        )}
                        {cacheStatus.cache_status.chatrooms_count !== undefined && (
                          <div className="flex justify-between">
                            <span>群聊:</span>
                            <span className="text-muted-foreground">{cacheStatus.cache_status.chatrooms_count}</span>
                          </div>
                        )}
                        {cacheStatus.cache_status.total_names !== undefined && (
                          <div className="flex justify-between">
                            <span>总名称数:</span>
                            <span className="text-muted-foreground">{cacheStatus.cache_status.total_names}</span>
                          </div>
                        )}
                        {cacheStatus.cache_status.last_update && (
                          <div className="flex justify-between">
                            <span>更新时间:</span>
                            <span className="text-muted-foreground">
                              {new Date(cacheStatus.cache_status.last_update).toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                        {cacheStatus.cache_status.load_error && (
                          <div className="flex justify-between">
                            <span>错误:</span>
                            <span className="text-red-600 text-xs truncate" title={cacheStatus.cache_status.load_error}>
                              {cacheStatus.cache_status.load_error}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-muted-foreground">
                    暂无缓存信息
                  </div>
                )}
              </div>

              {/* 预加载管理模块 */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {preloadLoading ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    <h4 className="text-sm font-medium">预加载管理</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReloadAllPreload}
                    disabled={preloadOperating || preloadLoading}
                    className="h-6 w-6 p-0"
                    title="重新加载所有预加载资源"
                  >
                    <RefreshCw className={`h-3 w-3 ${preloadOperating || preloadLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {preloadLoading ? (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin mx-auto mb-2" />
                    加载预加载信息中...
                  </div>
                ) : preloadStatus ? (
                  <div className="space-y-1 text-xs">
                    {preloadStatus.preload_status && (
                      <>
                        <div className="flex justify-between">
                          <span>状态:</span>
                          <span className={`${
                            preloadStatus.preload_status.status === 'completed' ? 'text-green-600' :
                            preloadStatus.preload_status.status === 'failed' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {preloadStatus.preload_status.status === 'completed' ? '已完成' :
                             preloadStatus.preload_status.status === 'failed' ? '失败' :
                             preloadStatus.preload_status.status}
                          </span>
                        </div>
                        {preloadStatus.preload_status.duration !== undefined && (
                          <div className="flex justify-between">
                            <span>耗时:</span>
                            <span className="text-muted-foreground">
                              {(preloadStatus.preload_status.duration * 1000).toFixed(0)}ms
                            </span>
                          </div>
                        )}
                        {preloadStatus.preload_status.error && (
                          <div className="flex justify-between">
                            <span>错误:</span>
                            <span className="text-red-600 text-xs truncate" title={preloadStatus.preload_status.error}>
                              {preloadStatus.preload_status.error}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {preloadStatus.timestamp && (
                      <div className="flex justify-between">
                        <span>更新时间:</span>
                        <span className="text-muted-foreground">
                          {new Date(preloadStatus.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs text-muted-foreground">
                    暂无预加载信息
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </motion.div>
  );
}

// 模型状态卡片组件
interface ModelStatusCardProps {
  model: {
    key: string;
    name: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    error: string | null | undefined;
    isLoaded: boolean;
    priority?: number;
  };
  onPreload: () => void;
  onCancel: () => void;
  onClearCache: () => void;
  isOperating: boolean;
}

function ModelStatusCard({ model, onPreload, onCancel, onClearCache, isOperating }: ModelStatusCardProps) {
  const getStatusIcon = () => {
    if (model.isLoaded) return <CheckCircle className="h-3 w-3 text-green-500" />;

    switch (model.status) {
      case 'in_progress':
        return <Clock className="h-3 w-3 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Brain className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    if (model.isLoaded) return '已加载';

    switch (model.status) {
      case 'in_progress':
        return '预加载中';
      case 'completed':
        return '预加载完成';
      case 'failed':
        return '失败';
      default:
        return '未开始';
    }
  };

  const canPreload = model.status === 'not_started' || model.status === 'failed';
  const canCancel = model.status === 'in_progress';
  const canClearCache = model.isLoaded;

  return (
    <div className="p-2 border rounded text-xs">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {getStatusIcon()}
          <span className="font-medium truncate" title={model.name}>
            {model.name}
          </span>
          {model.priority && (
            <span className="text-xs px-1 py-0.5 bg-primary/10 text-primary rounded">
              P{model.priority}
            </span>
          )}
        </div>

        <div className="flex gap-0.5 ml-1">
          {canPreload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPreload}
              disabled={isOperating}
              className="h-5 w-5 p-0"
              title="预加载"
            >
              <Play className="h-2.5 w-2.5" />
            </Button>
          )}
          {canCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isOperating}
              className="h-5 w-5 p-0"
              title="取消"
            >
              <Square className="h-2.5 w-2.5" />
            </Button>
          )}
          {canClearCache && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCache}
              disabled={isOperating}
              className="h-5 w-5 p-0"
              title="清除缓存"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{getStatusText()}</span>
        {model.status === 'in_progress' && (
          <span>{Math.round(model.progress)}%</span>
        )}
      </div>

      {model.status === 'in_progress' && (
        <Progress value={model.progress} className="h-1 mt-1" />
      )}

      {model.error && (
        <div className="text-red-600 text-xs mt-1 truncate" title={model.error}>
          错误: {model.error}
        </div>
      )}
    </div>
  );
}
