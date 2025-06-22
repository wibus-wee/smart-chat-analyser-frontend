import { motion } from 'framer-motion';
import { useRouter } from '@tanstack/react-router';
import {
  ArrowRight,
  Activity,
  Brain,
  BarChart3,
  Clock,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  Target,
  Lightbulb,
  BookOpen,
  Play
} from 'lucide-react';
import { Button } from '../ui/button';
import { TaskCreator } from '../analysis/TaskCreator';
import { useSystemHealth } from '../../hooks/useSystemHealth';

export function HomePage() {
  const router = useRouter();
  const { isHealthy } = useSystemHealth();

  const handleTaskCreated = (taskId: string) => {
    router.navigate({ to: '/analysis', search: { taskId } });
  };

  // 分析器特性数据
  const analyzerFeatures = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "词频分析",
      description: "发现聊天中最常使用的词汇和短语，了解沟通重点",
      category: "基础分析"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "情感分析",
      description: "分析消息的情感倾向，追踪情绪变化趋势",
      category: "深度洞察"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "时间模式",
      description: "识别活跃时间规律，了解沟通习惯",
      category: "行为分析"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "社交网络",
      description: "分析群聊中的互动关系，发现核心成员",
      category: "关系分析"
    }
  ];

  // 使用场景数据
  const useCases = [
    {
      icon: <Target className="h-5 w-5" />,
      title: "个人关系分析",
      description: "深入了解与朋友、家人的沟通模式，改善关系质量"
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "工作沟通优化",
      description: "分析团队沟通效率，发现协作中的改进点"
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "学习习惯研究",
      description: "追踪学习群聊的活跃度，优化学习计划"
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">
              Smart Chat Analyzer
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            深度分析你的聊天记录，发现隐藏的模式和洞察，
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
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

        {!isHealthy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200"
          >
            <Activity className="h-4 w-4" />
            <span className="text-sm">系统正在启动中，请稍候...</span>
          </motion.div>
        )}
      </motion.section>

      {/* 核心特性展示 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
              transition={{ delay: 0.1 + index * 0.1 }}
              className="group p-6 rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <span className="text-xs text-muted-foreground">{feature.category}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

    </div>
  );
}
