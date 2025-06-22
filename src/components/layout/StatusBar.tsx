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
  Square} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useSystemHealth, useSystemOverview } from '../../hooks/useSystemHealth';
import { useModelManagement } from '../../hooks/useModelManagement';
import { toast } from 'sonner';
import { TopNavigation } from './TopNavigation';

export function StatusBar() {
  const { health, isHealthy, isLoading: healthLoading } = useSystemHealth();
  const { overview, isLoading: overviewLoading } = useSystemOverview();
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
          <PopoverContent className="w-80" align="end">
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
                  {overview.queue && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>队列状态: 正常运行</span>
                    </div>
                  )}
                </div>
              )}

              {(overviewLoading || modelsWithStatus.length > 0) && (
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



                  {/* 批量操作 */}
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreloadAll}
                      disabled={isOperating}
                      className="flex-1 h-7 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      预加载全部
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      disabled={isOperating}
                      className="flex-1 h-7 text-xs"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
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
                </div>
              )}
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
