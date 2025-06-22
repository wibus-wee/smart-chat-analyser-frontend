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

      {/* 统计信息与图表并排布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：紧凑的统计信息 */}
        <div className="lg:col-span-1">
          <div className="p-4 rounded-lg border bg-muted/30 h-fit">
            <h4 className="font-medium mb-3">统计概览</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">总词数</div>
                  <div className="font-semibold">{wordFrequencyData.total_words.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-green-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">独特词汇</div>
                  <div className="font-semibold">{wordFrequencyData.unique_words.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">高频短语</div>
                  <div className="font-semibold">{wordFrequencyData.top_phrases.length}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">词汇多样性</div>
                  <div className="font-semibold">
                    {((wordFrequencyData.unique_words / wordFrequencyData.total_words) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* 词汇类型分布 */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="text-xs text-muted-foreground mb-2">词汇类型分布</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">短词</span>
                  </div>
                  <span className="text-sm font-medium">{wordFrequencyData.word_by_type.short_words.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">中等词</span>
                  </div>
                  <span className="text-sm font-medium">{wordFrequencyData.word_by_type.medium_words.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                    <span className="text-sm">长词</span>
                  </div>
                  <span className="text-sm font-medium">{wordFrequencyData.word_by_type.long_words.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    <span className="text-sm">英文词</span>
                  </div>
                  <span className="text-sm font-medium">{wordFrequencyData.word_by_type.english.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：图表区域 */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-6">
            {/* 高频词汇 */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-4">高频词汇 (Top 20)</h4>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={topWordsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="word" type="category" width={60} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `词汇: ${value}`}
                    formatter={(value) => [value, '频次']}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* 高频短语 */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-4">高频短语 (Top 15)</h4>
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart data={topPhrasesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="phrase" type="category" width={100} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `短语: ${value}`}
                    formatter={(value) => [value, '频次']}
                  />
                  <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* 词汇类型分布 */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-4">词汇类型分布</h4>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={wordTypeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [value, '词汇数量']}
                  />
                  <Bar dataKey="count" fill="var(--chart-3)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* 高频短词 */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-4">高频短词 (Top 10)</h4>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={shortWordsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [value, '频次']}
                  />
                  <Bar dataKey="count" fill="var(--chart-1)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* 高频长词 */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium mb-4">高频长词 (Top 10)</h4>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={longWordsData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="word" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [value, '频次']}
                  />
                  <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
