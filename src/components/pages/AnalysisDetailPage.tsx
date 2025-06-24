import { motion } from 'framer-motion';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { TaskMonitor } from '../analysis/TaskMonitor';

export function AnalysisDetailPage() {
  const { taskId } = useParams({ from: '/analysis/$taskId' });
  const navigate = useNavigate();

  const handleBackToList = () => {
    navigate({ to: '/analysis' });
  };

  return (
    <div className="space-y-8">
      {/* 页面头部 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={handleBackToList}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回分析中心
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">分析详情</h1>
          <p className="text-muted-foreground">
            监控任务进度和查看分析结果
          </p>
        </div>
      </motion.div>

      {/* 任务监控组件 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TaskMonitor
          taskId={taskId}
          onBack={handleBackToList}
        />
      </motion.div>
    </div>
  );
}
