import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock,
  Play,
  Square,
  RefreshCw,
  Eye,
  Trash2
} from 'lucide-react';
import { useTaskList, useAnalysisTask } from '../../hooks/useAnalysisTask';
import type { TaskStatus, TaskInfo } from '../../sdk';

interface TaskListProps {
  onTaskSelect?: (taskId: string) => void;
  onTaskCreate?: () => void;
}

export function TaskList({ onTaskSelect, onTaskCreate }: TaskListProps) {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const { taskList, isLoading, error, refresh } = useTaskList({
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: pageSize,
    offset: currentPage * pageSize,
  });

  const { cancelTask } = useAnalysisTask();

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Square className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
        return '未知';
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

  const handleCancelTask = async (taskId: string) => {
    try {
      await cancelTask(taskId);
      refresh();
    } catch (error) {
      console.error('取消任务失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading && !taskList) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">加载任务列表中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4 py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">加载失败</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={() => refresh()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
      </div>
    );
  }

  const tasks = taskList?.tasks || [];
  const pagination = taskList?.pagination;

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">任务列表</h2>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value as TaskStatus | 'all');
            setCurrentPage(0);
          }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="pending">等待中</SelectItem>
              <SelectItem value="running">运行中</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="failed">失败</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => refresh()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          {onTaskCreate && (
            <Button onClick={onTaskCreate} size="sm">
              <Play className="h-4 w-4 mr-2" />
              新建任务
            </Button>
          )}
        </div>
      </div>

      {/* 任务列表 */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">暂无任务</h3>
            <p className="text-muted-foreground">
              {statusFilter === 'all' ? '还没有创建任何任务' : `没有${getStatusText(statusFilter as TaskStatus)}的任务`}
            </p>
          </div>
          {onTaskCreate && (
            <Button onClick={onTaskCreate}>
              <Play className="h-4 w-4 mr-2" />
              创建第一个任务
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {tasks.map((task, index) => (
            <TaskListItem
              key={task.task_id}
              task={task}
              index={index}
              onSelect={() => onTaskSelect?.(task.task_id)}
              onCancel={() => handleCancelTask(task.task_id)}
              getStatusIcon={getStatusIcon}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      {/* 分页 */}
      {pagination && pagination.total > pageSize && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            显示 {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} 
            / 共 {pagination.total} 个任务
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!pagination.has_more}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TaskListItemProps {
  task: TaskInfo;
  index: number;
  onSelect: () => void;
  onCancel: () => void;
  getStatusIcon: (status: TaskStatus) => React.ReactNode;
  getStatusText: (status: TaskStatus) => string;
  getStatusColor: (status: TaskStatus) => string;
  formatDate: (date: string) => string;
}

function TaskListItem({ 
  task, 
  index, 
  onSelect, 
  onCancel, 
  getStatusIcon, 
  getStatusText, 
  getStatusColor, 
  formatDate 
}: TaskListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {getStatusIcon(task.status)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">
                任务 {task.task_id.slice(-8)}
              </h3>
              <Badge variant={getStatusColor(task.status) as any}>
                {getStatusText(task.status)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {task.message ? task.message.slice(0,55) + '...' : '暂无描述'}
            </p>
            <p className="text-xs text-muted-foreground">
              创建时间: {task.created_at ? formatDate(task.created_at) : '未知'}
            </p>
          </div>
        </div>

        {/* 进度条 */}
        {(task.status === 'pending' || task.status === 'running') && (
          <div className="w-24 mx-4">
            <Progress value={task.progress} className="h-2" />
            <p className="text-xs text-center mt-1">{task.progress}%</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 flex-col">
          <Button onClick={onSelect} variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            查看
          </Button>
          {(task.status === 'pending' || task.status === 'running') && (
            <Button onClick={onCancel} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              取消
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
