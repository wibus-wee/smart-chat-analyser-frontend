import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Square,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useTaskStatus, useTaskResult } from '../../hooks/useAnalysisTask';
import { useTaskMonitor, useAutoWebSocketConnection } from '../../hooks/useWebSocket';
import { AnalysisResults } from './AnalysisResults';

import sdkClient from '../../lib/sdk-client';
import type { TaskStatus } from '../../sdk';

interface TaskMonitorProps {
  taskId: string;
  onBack?: () => void;
}

export function TaskMonitor({ taskId, onBack }: TaskMonitorProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // WebSocket 连接状态
  const { isConnected: wsConnected, isConnecting: wsConnecting, error: wsError } = useAutoWebSocketConnection();
  
  // 任务状态和结果
  const { taskStatus, isLoading: statusLoading, error: statusError, refresh: refreshStatus } = useTaskStatus(taskId);
  const { taskResult, isLoading: resultLoading, error: resultError } = useTaskResult(
    taskStatus?.status === 'completed' ? taskId : null
  );

  // WebSocket 实时监控
  const { progress: wsProgress, completed: wsCompleted, isSubscribed } = useTaskMonitor(taskId);

  // 使用 WebSocket 数据或 API 数据
  const currentStatus = wsProgress?.status || taskStatus?.status || 'pending';
  const currentProgress = wsProgress?.progress ?? taskStatus?.progress ?? 0;
  const currentMessage = wsProgress?.message || taskStatus?.message || '';

  // 取消任务
  const handleCancelTask = async () => {
    setIsCancelling(true);
    setCancelError(null);

    try {
      await sdkClient.tasks.cancelTask(taskId);
      refreshStatus();
    } catch (error) {
      setCancelError(error instanceof Error ? error.message : '取消任务失败');
    } finally {
      setIsCancelling(false);
    }
  };

  // 任务完成后刷新状态
  useEffect(() => {
    if (wsCompleted) {
      refreshStatus();
    }
  }, [wsCompleted, refreshStatus]);

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <Square className="h-5 w-5 text-gray-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'running':
        return '运行中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      case 'cancelled':
        return '已取消';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'running':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'cancelled':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (statusLoading && !taskStatus) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">加载任务信息中...</p>
        </div>
      </div>
    );
  }

  if (statusError && !taskStatus) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            加载任务失败: {statusError.message}
          </AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={() => refreshStatus()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              返回
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* WebSocket 连接状态 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="text-sm text-muted-foreground">
            {wsConnecting ? '连接中...' : wsConnected ? '实时连接' : '离线模式'}
          </span>
          {isSubscribed && (
            <Badge variant="outline" className="text-xs">
              已订阅
            </Badge>
          )}
        </div>
        
        {onBack && (
          <Button onClick={onBack} variant="outline" size="sm">
            返回
          </Button>
        )}
      </div>

      {/* 任务状态卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-lg border bg-background space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(currentStatus)}
            <div>
              <h3 className="font-semibold">任务 {taskId.slice(-8)}</h3>
              <Badge variant={getStatusColor(currentStatus)}>
                {getStatusText(currentStatus)}
              </Badge>
            </div>
          </div>
          
          {(currentStatus === 'pending' || currentStatus === 'running') && (
            <Button
              onClick={handleCancelTask}
              disabled={isCancelling}
              variant="outline"
              size="sm"
            >
              {isCancelling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              取消任务
            </Button>
          )}
        </div>

        {/* 进度条 */}
        {(currentStatus === 'pending' || currentStatus === 'running') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>进度</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
        )}

        {/* 状态消息 */}
        {currentMessage && (
          <p className="text-sm text-muted-foreground">{currentMessage}</p>
        )}

        {/* 时间信息 */}
        {taskStatus && (
          <div className="text-xs text-muted-foreground space-y-1">
            {taskStatus.started_at && (
              <div>开始时间: {new Date(taskStatus.started_at).toLocaleString()}</div>
            )}
            {taskStatus.completed_at && (
              <div>完成时间: {new Date(taskStatus.completed_at).toLocaleString()}</div>
            )}
          </div>
        )}

        {/* 错误信息 */}
        {cancelError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{cancelError}</AlertDescription>
          </Alert>
        )}
      </motion.div>

      {/* WebSocket 错误提示 */}
      {wsError && !wsConnected && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            实时连接失败，将使用轮询模式获取任务状态。错误: {wsError.message}
          </AlertDescription>
        </Alert>
      )}

      {/* 分析结果 */}
      <AnimatePresence>
        {currentStatus === 'completed' && taskResult && taskResult.result && (
          <AnalysisResults taskResult={taskResult.result} />
        )}
        
        {currentStatus === 'completed' && resultLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">加载分析结果中...</p>
            </div>
          </motion.div>
        )}
        
        {currentStatus === 'completed' && resultError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                加载分析结果失败: {resultError.message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
