import { useState } from 'react';
import { motion } from 'framer-motion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Combobox, type ComboboxOption } from '../ui/combobox';
import { Plus, Loader2, Users, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { useAnalysisTask } from '../../hooks/useAnalysisTask';
import { useAnalyzers } from '../../hooks/useAnalyzers';
import { useChatTargets, useRecentChatTargets, useChatlogConnection } from '../../hooks/useChatlogApi';
import type { TaskData, AnalyzerType } from '../../sdk';

interface TaskCreatorProps {
  onTaskCreated?: (taskId: string) => void;
  onCancel?: () => void;
}

export function TaskCreator({ onTaskCreated, onCancel }: TaskCreatorProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TaskData>({
    talker: '',
    days: 30,
    limit: undefined,
    analyzers: [],
  });

  const { createTask, isCreating } = useAnalysisTask();
  const { analyzers, isLoading: isLoadingAnalyzers, error: analyzersError } = useAnalyzers();

  // 聊天记录 API 相关 hooks
  const { isConnected } = useChatlogConnection();
  const { targets, isLoading: isLoadingTargets } = useChatTargets();
  const { recentTargets, isLoading: isLoadingRecent } = useRecentChatTargets(100);

  // 准备聊天对象选项
  const chatTargetOptions: ComboboxOption[] = [
    // 最近聊天对象组
    ...recentTargets.map(target => ({
      value: target.id,
      label: `${target.displayName}`,
      description: target.lastContent ? `最后消息: ${target.lastContent.substring(0, 50)}...` : undefined,
      group: '最近聊天',
    })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.talker?.trim()) {
      return;
    }

    try {
      const result = await createTask(formData);
      onTaskCreated?.(result.task_id);
      setOpen(false);
      // 重置表单
      setFormData({
        talker: '',
        days: 30,
        limit: undefined,
        analyzers: [],
      });
    } catch (error) {
      console.error('创建任务失败:', error);
    }
  };

  // 检查表单是否有效
  const isFormValid = formData.talker?.trim() &&
                     formData.analyzers &&
                     formData.analyzers.length > 0 &&
                     !isLoadingAnalyzers;

  const handleAnalyzerChange = (analyzer: AnalyzerType, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      analyzers: checked
        ? [...(prev.analyzers || []), analyzer]
        : (prev.analyzers || []).filter(a => a !== analyzer)
    }));
  };

  // 将下划线分隔的字符串转换为标题格式
  const formatAnalyzerLabel = (label: string): string => {
    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // 从 API 获取的分析器数据转换为组件需要的格式
  const availableAnalyzers: {
    value: AnalyzerType;
    label: string;
    description: string;
    category: string;
    doc: string;
  }[] = analyzers?.analyzers?.map(analyzerName => {
    const analyzerInfo = analyzers.analyzer_info[analyzerName];
    return {
      value: analyzerName as AnalyzerType,
      label: formatAnalyzerLabel(analyzerInfo?.name || analyzerName),
      description: analyzerInfo?.metadata?.description || '暂无描述',
      category: analyzerInfo?.metadata?.category || 'general',
      doc: analyzerInfo?.class_info?.doc || ''
    };
  }) || [];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          新建分析任务
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>创建新的分析任务</DrawerTitle>
        </DrawerHeader>
        
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto relative"
        >
          <div className="space-y-2">
            <Label htmlFor="talker">聊天对象</Label>
            <div className="space-y-2">
              <Combobox
                options={chatTargetOptions}
                value={formData.talker}
                onValueChange={(value) => setFormData(prev => ({ ...prev, talker: value }))}
                placeholder={
                  isConnected === false
                    ? "聊天记录服务未连接"
                    : isLoadingTargets || isLoadingRecent
                    ? "加载聊天对象中..."
                    : "选择聊天对象..."
                }
                searchPlaceholder="搜索聊天对象..."
                emptyText="未找到匹配的聊天对象"
                disabled={isConnected === false}
                loading={isLoadingTargets || isLoadingRecent}
                className="w-full"
              />
              {isConnected === false && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>无法连接到聊天记录服务，请检查服务是否运行</span>
                </div>
              )}
              {isConnected && chatTargetOptions.length === 0 && !isLoadingTargets && !isLoadingRecent && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>暂无可用的聊天对象</span>
                </div>
              )}
              {formData.talker && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <Badge variant="outline" className="text-xs">
                    {targets.find(t => t.id === formData.talker)?.type === 'contact' ? (
                      <>
                        <Users className="h-3 w-3 mr-1" />
                        联系人
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        群聊
                      </>
                    )}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    已选择: {targets.find(t => t.id === formData.talker)?.displayName || formData.talker}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">分析天数</Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                value={formData.days}
                onChange={(e) => setFormData(prev => ({ ...prev, days: parseInt(e.target.value) || 30 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="limit">消息限制 (可选)</Label>
              <Input
                id="limit"
                type="number"
                min="1"
                placeholder="不限制"
                value={formData.limit || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  limit: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>选择分析器</Label>
            {isLoadingAnalyzers ? (
              <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>加载分析器中...</span>
              </div>
            ) : analyzersError ? (
              <div className="flex items-center gap-2 p-4 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>加载分析器失败，请稍后重试</span>
              </div>
            ) : availableAnalyzers.length === 0 ? (
              <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>暂无可用的分析器</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {availableAnalyzers.map((analyzer) => (
                  <div key={analyzer.value} className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    <Checkbox
                      id={analyzer.value}
                      checked={formData.analyzers?.includes(analyzer.value) || false}
                      onCheckedChange={(checked) =>
                        handleAnalyzerChange(analyzer.value, checked as boolean)
                      }
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={analyzer.value} className="text-sm font-medium">
                          {analyzer.label}
                        </Label>
                        <Badge variant="secondary" className="text-xs">
                          {analyzer.category.replace('_', ' ')}
                        </Badge>
                      </div>

                      {analyzer.doc && (
                        <p className="text-xs text-muted-foreground">
                          {analyzer.doc}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !isFormValid || isLoadingAnalyzers || !!analyzersError}
              className="flex-1 gap-2"
            >
              {isCreating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isCreating ? '创建中...' : '开始分析'}
            </Button>
          </div>
        </motion.form>
      </DrawerContent>
    </Drawer>
  );
}
