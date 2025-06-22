import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { TaskCreator } from '../analysis/TaskCreator';
import { TaskMonitor } from '../analysis/TaskMonitor';
import { TaskList } from '../analysis/TaskList';

type ViewMode = 'list' | 'create' | 'monitor';

export function AnalysisPage() {
  const search = useSearch({ from: '/analysis' });
  const [viewMode, setViewMode] = useState<ViewMode>(search.taskId ? 'monitor' : 'list');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(search.taskId || null);

  const handleTaskCreated = (taskId: string) => {
    setCurrentTaskId(taskId);
    setViewMode('monitor');
  };

  const handleTaskSelect = (taskId: string) => {
    setCurrentTaskId(taskId);
    setViewMode('monitor');
  };

  const handleBackToList = () => {
    setCurrentTaskId(null);
    setViewMode('list');
  };

  const handleShowCreator = () => {
    setViewMode('create');
  };

  const handleBackToListFromCreator = () => {
    setViewMode('list');
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">分析中心</h1>
        <p className="text-muted-foreground">
          {viewMode === 'list' && '管理和监控您的分析任务'}
          {viewMode === 'create' && '创建新的分析任务'}
          {viewMode === 'monitor' && '监控任务进度和查看分析结果'}
        </p>
      </motion.div>

      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskList
            onTaskSelect={handleTaskSelect}
            onTaskCreate={handleShowCreator}
          />
        </motion.div>
      )}

      {viewMode === 'create' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          <TaskCreator
            onTaskCreated={handleTaskCreated}
            onCancel={handleBackToListFromCreator}
          />
        </motion.div>
      )}

      {viewMode === 'monitor' && currentTaskId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskMonitor
            taskId={currentTaskId}
            onBack={handleBackToList}
          />
        </motion.div>
      )}
    </div>
  );
}
