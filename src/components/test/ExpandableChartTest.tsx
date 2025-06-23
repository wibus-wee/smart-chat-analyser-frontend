import { ExpandableChart } from '../ui/expandable-chart';
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
} from '../ui/chart';

// 测试数据
const testData = Array.from({ length: 50 }, (_, i) => ({
  name: `项目 ${i + 1}`,
  value: Math.floor(Math.random() * 100) + 10
}));

const chartConfig = {
  value: {
    label: "数值",
    color: "var(--chart-1)",
  }
} satisfies ChartConfig;

export function ExpandableChartTest() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">ExpandableChart 组件测试</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 测试图表 1 */}
        <ExpandableChart
          title="测试图表 - Top 10"
          compactHeight="h-[300px]"
          fullHeight="h-[600px]"
          fullData={testData}
          compactLimit={10}
          renderChart={(data) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />

        {/* 测试图表 2 - 水平条形图 */}
        <ExpandableChart
          title="水平条形图测试 - Top 8"
          compactHeight="h-[280px]"
          fullHeight="h-[600px]"
          fullData={testData}
          compactLimit={8}
          renderChart={(data, isExpanded) => (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={isExpanded ? 100 : 60}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--chart-2)" radius={2} />
              </BarChart>
            </ChartContainer>
          )}
        />
      </div>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">测试说明 - 优化版展开效果</h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• 点击图表右上角的展开按钮测试展开功能</li>
          <li>• 图表使用绝对定位展开，不影响页面布局</li>
          <li>• 智能尺寸计算，根据 fullHeight 设置合适的展开尺寸</li>
          <li>• 展开后居中显示，确保不会超出屏幕边界</li>
          <li>• 平滑的关闭动画，包含缩放和淡出效果</li>
          <li>• 展开后显示完整的50个数据项，收起显示前10/8项</li>
          <li>• 所有动画使用 Framer Motion 实现，流畅无卡顿</li>
        </ul>
        <div className="mt-3 p-2 bg-purple-50 dark:bg-purple-950 rounded text-xs">
          <strong>最新改进：</strong> 修复了 fullHeight 超出问题和生硬的关闭动画，提供更好的用户体验
        </div>
      </div>
    </div>
  );
}

export default ExpandableChartTest;
