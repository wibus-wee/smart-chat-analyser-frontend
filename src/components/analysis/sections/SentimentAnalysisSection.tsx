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
    positive: {
      label: "积极",
      color: "var(--chart-1)",
    },
    neutral: {
      label: "中性", 
      color: "var(--chart-2)",
    },
    negative: {
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

      {/* 紧凑的概览统计 */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0"></div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">平均情感分数</div>
              <div className="font-semibold">{sentimentData.average_sentiment.toFixed(3)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">平均置信度</div>
              <div className="font-semibold">{sentimentData.average_confidence.toFixed(3)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500 flex-shrink-0"></div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">总消息数</div>
              <div className="font-semibold">{sentimentData.total_messages.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">情感趋势</div>
              <div className="font-semibold">{sentimentData.sentiment_trend.trend}</div>
            </div>
          </div>
        </div>

        {/* 情感分布百分比 */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-2">情感分布</div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>积极 {sentimentData.sentiment_percentage.positive.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-gray-500"></div>
              <span>中性 {sentimentData.sentiment_percentage.neutral.toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>消极 {sentimentData.sentiment_percentage.negative.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 图表网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 情感分布饼图 */}
        <div className="p-6 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-4">情感分布</h4>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={sentimentPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>

        {/* 置信度分布 */}
        <div className="p-6 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-4">置信度分布</h4>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={confidenceHistogramData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="bin" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>

      {/* 时间序列图 */}
      <div className="p-6 rounded-lg border bg-gradient-to-br from-background to-muted/20">
        <h4 className="font-medium mb-4">情感时间序列</h4>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
