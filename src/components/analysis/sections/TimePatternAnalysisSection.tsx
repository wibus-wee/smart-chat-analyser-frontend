import { motion } from 'framer-motion';
import { 
  Bar, 
  BarChart, 
  Line,
  LineChart,
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
import { Clock, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import type { TimePattern } from '../../../sdk/types/task-response';

interface TimePatternAnalysisSectionProps {
  timePatternData: TimePattern;
  icon: React.ReactNode;
}

export function TimePatternAnalysisSection({ timePatternData, icon }: TimePatternAnalysisSectionProps) {
  // 小时分布数据
  const hourlyData = Object.entries(timePatternData.hourly_distribution).map(([hour, count]) => ({
    hour: `${hour}:00`,
    count
  }));

  // 每日分布数据
  const dailyData = Object.entries(timePatternData.daily_distribution).map(([date, count]) => ({
    date,
    count
  }));

  // 周分布数据
  const weeklyData = Object.entries(timePatternData.weekly_distribution).map(([day, count]) => ({
    day,
    count
  }));

  // 时段分布数据
  const periodData = Object.entries(timePatternData.active_periods.period_distribution).map(([period, count]) => ({
    period,
    count
  }));

  // 峰值时间数据 (暂时未使用，但保留以备后续扩展)
  // const peakHoursData = timePatternData.peak_hours.map((hourRange, index) => ({
  //   range: `${hourRange[0]}-${hourRange[1]}时`,
  //   index: index + 1
  // }));

  const chartConfig = {
    count: {
      label: "消息数量",
      color: "var(--chart-1)",
    },
    trend: {
      label: "趋势",
      color: "var(--chart-2)",
    }
  } satisfies ChartConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">时间模式分析</h3>
      </div>

      {/* 紧凑的时间模式概览统计 */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">分析时长</div>
              <div className="font-semibold">{timePatternData.time_span.duration_days} 天</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">活动趋势</div>
              <div className="font-semibold">{timePatternData.trend_analysis.trend}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">活跃时段</div>
              <div className="font-semibold">{timePatternData.active_periods.most_active_period[0]}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">异常检测</div>
              <div className="font-semibold">
                {timePatternData.anomaly_detection.anomalies_detected ? '发现异常' : '无异常'}
              </div>
            </div>
          </div>
        </div>

        {/* 活动强度分析 */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground mb-2">活动强度分析</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span>强度 {timePatternData.activity_intensity.intensity_level}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>活跃 {timePatternData.activity_intensity.active_hours_total}h</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <span>平均 {timePatternData.activity_intensity.hourly_average.toFixed(1)}/h</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span>比率 {(timePatternData.activity_intensity.activity_ratio * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 紧凑的图表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* 小时分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/50">
          <h4 className="font-medium mb-3 text-sm">24小时活动分布</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={hourlyData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 周分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/50">
          <h4 className="font-medium mb-3 text-sm">一周活动分布</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={weeklyData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 时段分布 - 紧凑版 */}
        <div className="p-4 rounded-lg border bg-muted/50">
          <h4 className="font-medium mb-3 text-sm">时段活动分布</h4>
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <BarChart data={periodData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="period" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--chart-3)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 异常检测结果 - 紧凑版 */}
        {timePatternData.anomaly_detection.anomalies_detected && (
          <div className="p-4 rounded-lg border bg-muted/50">
            <h4 className="font-medium mb-3 text-sm">异常检测结果</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">异常数量</span>
                <span className="text-sm font-medium">{timePatternData.anomaly_detection.anomaly_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">高峰期</span>
                <span className="text-sm font-medium">{timePatternData.anomaly_detection.consecutive_high_periods.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">低谷期</span>
                <span className="text-sm font-medium">{timePatternData.anomaly_detection.consecutive_low_periods.length}</span>
              </div>
            </div>
          </div>
        )}

        {/* 每日趋势 - 可展开版 */}
        <ExpandableChart
          title="每日活动趋势 (最近30天)"
          className="md:col-span-2 xl:col-span-4 bg-muted/50"
          compactHeight="h-[160px]"
          fullHeight="h-[330px]"
          fullData={dailyData}
          compactLimit={-30} // 负数表示从末尾开始取
          renderChart={(data) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--chart-1)"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          )}
        />
      </div>
    </motion.div>
  );
}
