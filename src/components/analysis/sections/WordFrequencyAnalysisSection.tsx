import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '../../ui/chart';
import { ExpandableChart } from '../../ui/expandable-chart';
import { MessageSquare, Hash, Type, BookOpen } from 'lucide-react';
import type { AnalysisResultsWordFrequency } from '../../../sdk/types/task-response';

interface WordFrequencyAnalysisSectionProps {
  wordFrequencyData: AnalysisResultsWordFrequency;
  icon: React.ReactNode;
}

export function WordFrequencyAnalysisSection({ wordFrequencyData, icon }: WordFrequencyAnalysisSectionProps) {
  // 高频词数据 - 取前20个
  const topWordsData = wordFrequencyData.top_words.slice(0, 20).map(([word, count]) => ({
    word,
    count
  }));

  // 高频短语数据 - 取前15个
  const topPhrasesData = wordFrequencyData.top_phrases.slice(0, 15).map(([phrase, count]) => ({
    phrase: phrase.length > 15 ? phrase.substring(0, 15) + '...' : phrase,
    count
  }));

  // 按类型分类的词汇数据
  const wordTypeData = [
    { type: '短词', count: wordFrequencyData.word_by_type.short_words.length },
    { type: '中等词', count: wordFrequencyData.word_by_type.medium_words.length },
    { type: '长词', count: wordFrequencyData.word_by_type.long_words.length },
    { type: '英文词', count: wordFrequencyData.word_by_type.english.length }
  ];

  // 高频短词数据
  const shortWordsData = wordFrequencyData.word_by_type.short_words.slice(0, 10).map(([word, count]) => ({
    word,
    count
  }));

  // 高频长词数据
  const longWordsData = wordFrequencyData.word_by_type.long_words.slice(0, 10).map(([word, count]) => ({
    word,
    count
  }));

  const chartConfig = {
    count: {
      label: "频次",
      color: "var(--chart-1)",
    },
    word: {
      label: "词汇",
      color: "var(--chart-1)",
    },
    phrase: {
      label: "短语",
      color: "var(--chart-2)",
    },
    type: {
      label: "类型",
      color: "var(--chart-3)",
    }
  } satisfies ChartConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">词频分析</h3>
      </div>

      {/* 紧凑的图表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 词频概览统计卡片 - 垂直布局优化 */}
        <div className="p-4 rounded-lg border bg-muted/30 flex flex-col justify-between">
          <h4 className="font-medium mb-4 text-sm">词频概览</h4>

          {/* 主要统计指标 - 2x2 网格布局 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">总词数</div>
                <div className="font-semibold text-lg">{wordFrequencyData.total_words.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Type className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">独特词汇</div>
                <div className="font-semibold text-lg">{wordFrequencyData.unique_words.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-purple-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">高频短语</div>
                <div className="font-semibold text-lg">{wordFrequencyData.top_phrases.length}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">词汇多样性</div>
                <div className="font-semibold text-lg">
                  {((wordFrequencyData.unique_words / wordFrequencyData.total_words) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-border/50 my-3"></div>

          {/* 词汇类型分布 - 垂直列表布局 */}
          <div>
            <div className="text-xs text-muted-foreground mb-3">词汇类型分布</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">短词</span>
                </div>
                <span className="font-medium">{wordFrequencyData.word_by_type.short_words.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">中等词</span>
                </div>
                <span className="font-medium">{wordFrequencyData.word_by_type.medium_words.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">长词</span>
                </div>
                <span className="font-medium">{wordFrequencyData.word_by_type.long_words.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">英文词</span>
                </div>
                <span className="font-medium">{wordFrequencyData.word_by_type.english.length}</span>
              </div>
            </div>
          </div>
        </div>
        {/* 高频词汇 - 可展开版 */}
        <ExpandableChart
          title="高频词汇 (Top 10)"
          className="bg-muted/30"
          compactHeight="h-[300px]"
          fullHeight="h-[580px]"
          fullData={topWordsData}
          compactLimit={10}
          renderChart={(data, isExpanded) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  dataKey="word"
                  type="category"
                  width={isExpanded ? 80 : 50}
                  fontSize={12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `词汇: ${value}`}
                  formatter={(value) => [value, '频次']}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />
        {/* 高频短语 - 可展开版 */}
        <ExpandableChart
          title="高频短语 (Top 10)"
          className="bg-muted/30"
          compactHeight="h-[300px]"
          fullHeight="h-[450px]"
          fullData={topPhrasesData}
          compactLimit={10}
          renderChart={(data, isExpanded) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  dataKey="phrase"
                  type="category"
                  width={isExpanded ? 120 : 80}
                  fontSize={12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => `短语: ${value}`}
                  formatter={(value) => [value, '频次']}
                />
                <Bar dataKey="count" fill="var(--chart-2)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />
        {/* 词汇类型分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <h4 className="font-medium mb-3 text-sm">词汇类型分布</h4>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={wordTypeData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="type" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [value, '词汇数量']}
              />
              <Bar dataKey="count" fill="var(--chart-3)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
        {/* 高频短词 - 可展开版 */}
        <ExpandableChart
          title="高频短词 (Top 8)"
          className="bg-muted/30"
          compactHeight="h-[220px]"
          fullHeight="h-[400px]"
          fullData={shortWordsData}
          compactLimit={8}
          renderChart={(data) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="word" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [value, '频次']}
                />
                <Bar dataKey="count" fill="var(--chart-1)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />
        {/* 高频长词 - 可展开版 */}
        <ExpandableChart
          title="高频长词 (Top 8)"
          className="bg-muted/30"
          compactHeight="h-[220px]"
          fullHeight="h-[400px]"
          fullData={longWordsData}
          compactLimit={8}
          renderChart={(data) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="word" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [value, '频次']}
                />
                <Bar dataKey="count" fill="var(--chart-2)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />
      </div>
    </motion.div>
  );
}
