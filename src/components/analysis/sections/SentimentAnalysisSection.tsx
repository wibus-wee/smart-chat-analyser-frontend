import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
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
import { Heart, TrendingUp, MessageSquare, Target } from 'lucide-react';
import type { AnalysisResultsSentiment } from '../../../sdk/types/task-response';

interface SentimentAnalysisSectionProps {
  sentimentData: AnalysisResultsSentiment;
  icon: React.ReactNode;
}

export function SentimentAnalysisSection({ sentimentData, icon }: SentimentAnalysisSectionProps) {
  // 情感分布饼图数据
  const sentimentPieData = [
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
  ];

  // 置信度直方图数据
  const confidenceHistogramData = sentimentData.chart_data.confidence_histogram.bins.map((bin, index) => ({
    bin,
    count: sentimentData.chart_data.confidence_histogram.counts[index]
  }));

  // 时间序列数据
  const timeSeriesData = sentimentData.chart_data.time_series.x.map((x, index) => ({
    time: x,
    sentiment: sentimentData.chart_data.time_series.sentiment[index],
    confidence: sentimentData.chart_data.time_series.confidence[index]
  }));

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

        {/* 时间序列图 - 跨列显示 */}
        <div className="md:col-span-2 xl:col-span-3 p-4 rounded-lg border bg-muted/30">
          <h4 className="font-medium mb-3 text-sm">情感时间序列</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="var(--chart-1)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="var(--chart-2)"
                strokeWidth={1.5}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </motion.div>
  );
}
