import { motion } from 'framer-motion';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowRight,
  BarChart3,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  Brain,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Play,
  MessageSquare,
  Database,
  Cpu,
  Network,
  Eye,
  Calendar,
  Target,
  Rocket,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { TaskCreator } from '../analysis/TaskCreator';
import { useSystemHealth } from '../../hooks/useSystemHealth';
import { useAnalyzers } from '../../hooks/useAnalyzers';
import { useRunningTasks, useTaskList } from '../../hooks/useAnalysisTask';
import { useSystemStats, useQueueStats } from '../../hooks/useSystemStats';
import { formatAnalyzerLabel } from '../../lib/utils';

export function HomePage() {
  const router = useRouter();
  const { health, isHealthy, isLoading: healthLoading } = useSystemHealth();
  const { analyzers, isLoading: analyzersLoading } = useAnalyzers();
  const { runningTasks, isLoading: runningTasksLoading } = useRunningTasks(5);
  const { taskList, isLoading: taskListLoading } = useTaskList({ offset: 0, limit: 5 });
  const { systemStats, isLoading: systemStatsLoading } = useSystemStats();
  const { queueStats, isLoading: queueStatsLoading } = useQueueStats();

  const handleTaskCreated = (taskId: string) => {
    router.navigate({ to: '/analysis', search: { taskId } });
  };

  // 系统状态指示器
  const getSystemStatusIndicator = () => {
    if (healthLoading) {
      return { icon: <Loader2 className="h-4 w-4 animate-spin" />, text: '检查中...', color: 'text-yellow-500' };
    }
    if (isHealthy) {
      return { icon: <CheckCircle className="h-4 w-4" />, text: '系统正常', color: 'text-green-500' };
    }
    return { icon: <AlertCircle className="h-4 w-4" />, text: '系统异常', color: 'text-red-500' };
  };

  const systemStatus = getSystemStatusIndicator();

  // 分析器特性数据（从API获取或使用默认）
  const analyzerFeatures = analyzers?.analyzers?.map(analyzerName => {
    const analyzerInfo = analyzers.analyzer_info[analyzerName];
    const getAnalyzerIcon = (name: string) => {
      if (name.includes('word') || name.includes('frequency')) return <BarChart3 className="h-6 w-6" />;
      if (name.includes('sentiment')) return <TrendingUp className="h-6 w-6" />;
      if (name.includes('time') || name.includes('pattern')) return <Clock className="h-6 w-6" />;
      if (name.includes('social') || name.includes('network')) return <Users className="h-6 w-6" />;
      return <Brain className="h-6 w-6" />;
    };

    return {
      icon: getAnalyzerIcon(analyzerName),
      title: formatAnalyzerLabel(analyzerInfo?.name || analyzerName),
      description: analyzerInfo?.metadata?.description || '智能分析聊天数据，提供深度洞察',
      category: analyzerInfo?.metadata?.category || 'general',
      isRegistered: analyzerInfo?.is_registered || false
    };
  }) || [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "词频分析",
      description: "发现聊天中最常使用的词汇和短语，了解沟通重点",
      category: "基础分析",
      isRegistered: true
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "情感分析",
      description: "分析消息的情感倾向，追踪情绪变化趋势",
      category: "深度洞察",
      isRegistered: true
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "时间模式",
      description: "识别活跃时间规律，了解沟通习惯",
      category: "行为分析",
      isRegistered: true
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "社交网络",
      description: "分析群聊中的互动关系，发现核心成员",
      category: "关系分析",
      isRegistered: true
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">
              Smart Chat Analyzer
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            深度分析你的聊天记录，发现隐藏的模式和洞察，让数据为你讲述故事
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <TaskCreator onTaskCreated={handleTaskCreated} />
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => router.navigate({ to: '/analysis' })}
          >
            查看分析中心
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 系统状态指示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50"
        >
          <div className={systemStatus.color}>
            {systemStatus.icon}
          </div>
          <span className="text-sm font-medium">{systemStatus.text}</span>
          {health?.version && (
            <Badge variant="secondary" className="text-xs">
              v{health.version}
            </Badge>
          )}
        </motion.div>
      </motion.section>

      {/* 系统概览 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">系统概览</h2>
          <p className="text-muted-foreground">实时监控系统状态和运行数据</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 任务队列状态 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg border bg-background/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm">任务队列</h3>
                <p className="text-xs text-muted-foreground">实时状态</p>
              </div>
            </div>
            {queueStatsLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : queueStats?.queue ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>运行中:</span>
                  <span className="text-blue-600 font-medium">{queueStats.queue.running || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>等待中:</span>
                  <span className="text-yellow-600 font-medium">{queueStats.queue.pending || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>已完成:</span>
                  <span className="text-green-600 font-medium">{queueStats.queue.completed || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">暂无数据</p>
            )}
          </motion.div>

          {/* 分析器状态 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="p-4 rounded-lg border bg-background/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm">分析器</h3>
                <p className="text-xs text-muted-foreground">可用状态</p>
              </div>
            </div>
            {analyzersLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : analyzers ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>总数:</span>
                  <span className="font-medium">{analyzers.total_count || 0}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>已注册:</span>
                  <span className="text-green-600 font-medium">
                    {Object.values(analyzers.analyzer_info || {}).filter((info: any) => info.is_registered).length}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">暂无数据</p>
            )}
          </motion.div>

          {/* 系统资源 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg border bg-background/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm">系统资源</h3>
                <p className="text-xs text-muted-foreground">使用情况</p>
              </div>
            </div>
            {systemStatsLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : systemStats?.model_manager ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>已加载模型:</span>
                  <span className="font-medium">{systemStats.model_manager.loaded_models?.length || 0}</span>
                </div>
                {systemStats.model_manager.memory_usage && (
                  <div className="flex justify-between text-xs">
                    <span>内存使用:</span>
                    <span className="font-medium text-xs">
                      {typeof systemStats.model_manager.memory_usage === 'string'
                        ? systemStats.model_manager.memory_usage
                        : systemStats.model_manager.memory_usage.rss || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">暂无数据</p>
            )}
          </motion.div>

          {/* 运行中任务 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-lg border bg-background/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <Play className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-sm">活跃任务</h3>
                <p className="text-xs text-muted-foreground">正在运行</p>
              </div>
            </div>
            {runningTasksLoading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>加载中...</span>
              </div>
            ) : runningTasks && runningTasks.tasks && runningTasks.tasks.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>运行中:</span>
                  <span className="text-orange-600 font-medium">{runningTasks.tasks.length}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  最新: {runningTasks.tasks[0]?.task_id?.slice(-8) || '未知'}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">暂无运行任务</p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* 最近活动 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">最近活动</h2>
            <p className="text-muted-foreground">查看最新的分析任务和结果</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => router.navigate({ to: '/analysis' })}
          >
            查看全部
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近任务 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">最近任务</h3>
            </div>

            {taskListLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border bg-background/50 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : taskList && taskList.tasks && taskList.tasks.length > 0 ? (
              <div className="space-y-3">
                {taskList.tasks.slice(0, 3).map((task, index) => (
                  <motion.div
                    key={task.task_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                    onClick={() => router.navigate({ to: '/analysis/$taskId', params: { taskId: task.task_id } })}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            task.status === 'completed' ? 'default' :
                            task.status === 'running' ? 'secondary' :
                            task.status === 'failed' ? 'destructive' : 'outline'
                          }
                          className="text-xs"
                        >
                          {task.status === 'completed' ? '已完成' :
                           task.status === 'running' ? '运行中' :
                           task.status === 'failed' ? '失败' :
                           task.status === 'pending' ? '等待中' : '已取消'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {task.task_id.slice(-8)}
                        </span>
                      </div>
                      {task.progress !== undefined && task.status === 'running' && (
                        <span className="text-xs text-muted-foreground">{Math.round(task.progress * 100)}%</span>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">分析对象: </span>
                      <span className="text-muted-foreground">{task.task_id.slice(0, 20)}...</span>
                    </div>
                    {task.created_at && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(task.created_at).toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">暂无最近任务</p>
                <p className="text-xs mt-1">创建你的第一个分析任务开始探索</p>
              </div>
            )}
          </motion.div>

          {/* 快速开始 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">快速开始</h3>
            </div>

            <div className="p-6 rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">开始你的第一次分析</h4>
                    <p className="text-sm text-muted-foreground">选择聊天对象，配置分析器，获得深度洞察</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">1</div>
                    <span>选择要分析的聊天对象</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">2</div>
                    <span>配置分析参数和时间范围</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">3</div>
                    <span>选择需要的分析器类型</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">4</div>
                    <span>等待分析完成并查看结果</span>
                  </div>
                </div>

                <div className="pt-2">
                  <TaskCreator onTaskCreated={handleTaskCreated} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 分析器展示 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">强大的分析能力</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            多种专业的分析器，从不同维度深入解读你的聊天数据
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyzerFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group p-6 rounded-lg border hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{feature.title}</h3>
                      {feature.isRegistered ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {feature.category.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {feature.isRegistered ? '可用' : '未注册'}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {analyzersLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">正在加载分析器信息...</p>
          </div>
        )}
      </motion.section>

      {/* 功能亮点 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">为什么选择 Smart Chat Analyzer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            专业的聊天数据分析工具，让你的数据产生价值
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-500 w-16 h-16 mx-auto flex items-center justify-center">
              <Eye className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">深度洞察</h3>
            <p className="text-muted-foreground leading-relaxed">
              通过多维度分析，发现聊天数据中隐藏的模式和趋势，获得前所未有的洞察力
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-green-500/10 text-green-500 w-16 h-16 mx-auto flex items-center justify-center">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">实时处理</h3>
            <p className="text-muted-foreground leading-relaxed">
              高效的分析引擎，支持大规模数据处理，实时监控任务进度，快速获得分析结果
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="p-4 rounded-full bg-purple-500/10 text-purple-500 w-16 h-16 mx-auto flex items-center justify-center">
              <Network className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold">智能分析</h3>
            <p className="text-muted-foreground leading-relaxed">
              基于先进的机器学习算法，提供情感分析、社交网络分析等智能化功能
            </p>
          </motion.div>
        </div>
      </motion.section>

    </div>
  );
}
