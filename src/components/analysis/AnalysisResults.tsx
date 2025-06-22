import { motion } from "framer-motion";
import {
  BarChart3,
  Network,
  Clock,
  MessageSquare,
  TrendingUp,
  Brain,
  Activity,
} from "lucide-react";
import type { Result } from "../../sdk/types/task-response";
import { SentimentAnalysisSection } from "./sections/SentimentAnalysisSection";
import { SocialNetworkAnalysisSection } from "./sections/SocialNetworkAnalysisSection";
import { TimePatternAnalysisSection } from "./sections/TimePatternAnalysisSection";
import { WordFrequencyAnalysisSection } from "./sections/WordFrequencyAnalysisSection";

interface AnalysisResultsProps {
  taskResult: Result;
}

export function AnalysisResults({ taskResult }: AnalysisResultsProps) {
  // 检查结果是否存在
  if (!taskResult.analysis_results) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">分析结果不可用</p>
      </div>
    );
  }

  const analysisResults = taskResult.analysis_results;
  const metadata = taskResult.metadata;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* 分析概览 - 紧凑布局 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">分析结果</h2>
        </div>

        {/* 紧凑的统计信息网格 */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">总消息数</div>
                <div className="font-semibold">
                  {metadata.data_count?.toLocaleString() || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">分析器数量</div>
                <div className="font-semibold">
                  {metadata.analyzers_used?.length || 0}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">完成时间</div>
                <div className="text-sm font-medium">
                  {metadata.completed_at
                    ? new Date(metadata.completed_at).toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">任务ID</div>
                <div className="text-sm font-mono">
                  {metadata.task_id?.slice(-8) || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* 分析器详情 */}
          {metadata.analyzers_used && metadata.analyzers_used.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="text-xs text-muted-foreground mb-1">
                使用的分析器
              </div>
              <div className="flex flex-wrap gap-1">
                {metadata.analyzers_used.map((analyzer, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary"
                  >
                    {analyzer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 情感分析 */}
      {analysisResults.sentiment && (
        <SentimentAnalysisSection
          sentimentData={analysisResults.sentiment}
          icon={<Brain className="h-5 w-5 text-blue-500" />}
        />
      )}

      {/* 社交网络分析 */}
      {analysisResults.social_network && (
        <SocialNetworkAnalysisSection
          socialNetworkData={analysisResults.social_network}
          icon={<Network className="h-5 w-5 text-green-500" />}
        />
      )}

      {/* 时间模式分析 */}
      {analysisResults.time_pattern && (
        <TimePatternAnalysisSection
          timePatternData={analysisResults.time_pattern}
          icon={<Clock className="h-5 w-5 text-purple-500" />}
        />
      )}

      {/* 词频分析 */}
      {analysisResults.word_frequency && (
        <WordFrequencyAnalysisSection
          wordFrequencyData={analysisResults.word_frequency}
          icon={<MessageSquare className="h-5 w-5 text-orange-500" />}
        />
      )}
    </motion.div>
  );
}
