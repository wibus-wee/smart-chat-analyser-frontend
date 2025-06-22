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

      {/* 紧凑的词频概览统计 */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-2">词汇类型分布</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>短词 {wordFrequencyData.word_by_type.short_words.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>中等词 {wordFrequencyData.word_by_type.medium_words.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>长词 {wordFrequencyData.word_by_type.long_words.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span>英文词 {wordFrequencyData.word_by_type.english.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 紧凑的图表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 高频词汇 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">高频词汇 (Top 10)</h4>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={topWordsData.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="word" type="category" width={50} fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `词汇: ${value}`}
                formatter={(value) => [value, '频次']}
              />
              <Bar dataKey="count" fill="var(--chart-1)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 高频短语 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">高频短语 (Top 10)</h4>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={topPhrasesData.slice(0, 10)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="phrase" type="category" width={80} fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `短语: ${value}`}
                formatter={(value) => [value, '频次']}
              />
              <Bar dataKey="count" fill="var(--chart-2)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 词汇类型分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
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

        {/* 高频短词 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">高频短词 (Top 8)</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={shortWordsData.slice(0, 8)}>
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
        </div>

        {/* 高频长词 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">高频长词 (Top 8)</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={longWordsData.slice(0, 8)}>
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
        </div>
      </div>
    </motion.div>
  );
}
