import { motion } from 'framer-motion';
import { useState, useCallback, useMemo, Suspense, lazy } from 'react';
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from '../../ui/chart';
import { Button } from '../../ui/button';
import { Heart, TrendingUp, MessageSquare, Target, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { AnalysisResultsSentiment } from '../../../sdk/types/task-response';

// 懒加载时间序列图表组件
const LazyTimeSeriesChart = lazy(() => import('./LazyTimeSeriesChart'));

interface SentimentAnalysisSectionProps {
  sentimentData: AnalysisResultsSentiment;
  icon: React.ReactNode;
}

export function SentimentAnalysisSection({ sentimentData, icon }: SentimentAnalysisSectionProps) {
  const [showTimeSeriesChart, setShowTimeSeriesChart] = useState(false);

  // 情感分布饼图数据
  const sentimentPieData = useMemo(() => [
    {
      name: '积极',
      value: sentimentData.sentiment_percentage.positive,
      fill: 'var(--chart-1)'
    },
    {
      name: '中性',
      value: sentimentData.sentiment_percentage.neutral,
      fill: 'var(--chart-2)'
    },
    {
      name: '消极',
      value: sentimentData.sentiment_percentage.negative,
      fill: 'var(--chart-3)'
    }
  ], [sentimentData.sentiment_percentage]);

  // 置信度直方图数据
  const confidenceHistogramData = useMemo(() =>
    sentimentData.chart_data.confidence_histogram.bins.map((bin, index) => ({
      bin,
      count: sentimentData.chart_data.confidence_histogram.counts[index]
    })), [sentimentData.chart_data.confidence_histogram]
  );

  // 检查时间序列数据量
  const timeSeriesDataSize = sentimentData.chart_data.time_series.x.length;
  const isLargeDataset = timeSeriesDataSize > 1000;

  // 切换时间序列图表显示
  const toggleTimeSeriesChart = useCallback(() => {
    setShowTimeSeriesChart(prev => !prev);
  }, []);

  const chartConfig = {
    "积极": {
      label: "积极",
      color: "var(--chart-1)",
    },
    "中性": {
      label: "中性",
      color: "var(--chart-2)",
    },
    "消极": {
      label: "消极",
      color: "var(--chart-3)",
    },
    sentiment: {
      label: "情感分数",
      color: "var(--chart-1)",
    },
    confidence: {
      label: "置信度",
      color: "var(--chart-2)",
    },
    count: {
      label: "数量",
      color: "var(--chart-1)",
    }
  } satisfies ChartConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">情感分析</h3>
      </div>

      {/* 紧凑的图表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 情感分析概览统计卡片 - 垂直布局优化 */}
        <div className="p-4 rounded-lg border bg-muted/30 flex flex-col justify-between">
          <h4 className="font-medium mb-4 text-sm">情感分析概览</h4>

          {/* 主要统计指标 - 2x2 网格布局 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">平均情感</div>
                <div className="font-semibold text-lg">{sentimentData.average_sentiment.toFixed(3)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">平均置信度</div>
                <div className="font-semibold text-lg">{sentimentData.average_confidence.toFixed(3)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">总消息数</div>
                <div className="font-semibold text-lg">{sentimentData.total_messages.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">情感趋势</div>
                <div className="font-semibold text-lg">{sentimentData.sentiment_trend.trend}</div>
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-border/50 my-3"></div>

          {/* 情感分布 - 垂直列表布局 */}
          <div>
            <div className="text-xs text-muted-foreground mb-3">情感分布</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">积极</span>
                </div>
                <span className="font-medium">{sentimentData.sentiment_percentage.positive.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm">中性</span>
                </div>
                <span className="font-medium">{sentimentData.sentiment_percentage.neutral.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">消极</span>
                </div>
                <span className="font-medium">{sentimentData.sentiment_percentage.negative.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
        {/* 情感分布饼图 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="font-medium mb-3 text-sm">情感分布</h4>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={sentimentPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* 置信度分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="font-medium mb-3 text-sm">置信度分布</h4>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={confidenceHistogramData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="bin" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 时间序列图 - 跨列显示，支持异步渲染 */}
        <div className="md:col-span-2 xl:col-span-3 p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-sm">情感时间序列</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {timeSeriesDataSize.toLocaleString()} 个数据点
                {isLargeDataset && ' (大数据集)'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTimeSeriesChart}
                className="gap-1"
              >
                {showTimeSeriesChart ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    隐藏
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    {isLargeDataset ? '异步加载' : '显示'}
                  </>
                )}
              </Button>
            </div>
          </div>

          {showTimeSeriesChart ? (
            <Suspense fallback={
              <div className="flex items-center justify-center h-[180px]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  加载时间序列图表...
                </span>
              </div>
            }>
              <LazyTimeSeriesChart
                timeSeriesData={sentimentData.chart_data.time_series}
                chartConfig={chartConfig}
              />
            </Suspense>
          ) : (
            <div className="flex items-center justify-center h-[180px] border-2 border-dashed border-muted-foreground/20 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  点击"显示"按钮加载时间序列图表
                </p>
                {isLargeDataset && (
                  <p className="text-xs text-muted-foreground mt-1">
                    数据量较大，将使用异步渲染优化性能
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
