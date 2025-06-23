import { useState, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ExpandableChartProps<T> {
  /** 图表标题 */
  title: string;
  /** 完整数据 */
  fullData: T[];
  /** 紧凑视图显示的数据量限制 */
  compactLimit?: number;
  /** 图表渲染函数 */
  renderChart: (data: T[], isExpanded: boolean) => ReactNode;
  /** 容器的额外样式类名 */
  className?: string;
  /** 紧凑视图的高度 */
  compactHeight?: string;
  /** 完整视图的高度 */
  fullHeight?: string;
  /** 是否禁用展开功能 */
  disabled?: boolean;
}

// 解析高度值
function parseHeightValue(heightClass: string): number {
  const match = heightClass.match(/h-\[(\d+)px\]/) || heightClass.match(/h-\[(\d+)\]/);
  return match ? parseInt(match[1]) : 400;
}

// 计算展开图表的最佳位置和尺寸
function calculateExpandedBounds(originalRect: DOMRect, fullHeight: string, scaleX = 1.4) {
  const padding = 20;
  const maxWidth = window.innerWidth - padding * 2;
  const maxHeight = window.innerHeight - padding * 2;

  // 解析目标高度
  const desiredHeight = parseHeightValue(fullHeight);
  const headerFooterHeight = 100; // 标题、按钮、指示器等的高度

  // 计算目标尺寸
  const targetWidth = Math.min(maxWidth, Math.max(500, originalRect.width * scaleX));
  const targetHeight = Math.min(maxHeight, desiredHeight + headerFooterHeight);

  // 计算理想位置（居中显示）
  const idealLeft = (window.innerWidth - targetWidth) / 2;
  const idealTop = (window.innerHeight - targetHeight) / 2;

  // 确保不超出边界，优先居中显示
  const left = Math.max(padding, Math.min(idealLeft, window.innerWidth - targetWidth - padding));
  const top = Math.max(padding, Math.min(idealTop, window.innerHeight - targetHeight - padding));

  return { left, top, width: targetWidth, height: targetHeight };
}

export function ExpandableChart<T>({
  title,
  fullData,
  compactLimit = 10,
  renderChart,
  className,
  compactHeight = "h-[220px]",
  fullHeight = "h-[500px]",
  disabled = false
}: ExpandableChartProps<T>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartRect, setChartRect] = useState<DOMRect | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // 根据展开状态决定显示的数据
  const compactData = fullData ?
    (compactLimit < 0 ? fullData.slice(compactLimit) : fullData.slice(0, compactLimit)) :
    [];

  const handleToggle = () => {
    if (!disabled) {
      if (!isExpanded && chartRef.current) {
        // 展开时计算当前位置
        const rect = chartRef.current.getBoundingClientRect();
        setChartRect(rect);
      }
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {/* 原始图表容器 - 保持布局位置 */}
      <div
        ref={chartRef}
        className={cn(
          "relative p-4 rounded-lg border bg-muted/50",
          isExpanded && "invisible", // 展开时隐藏原始容器
          className
        )}
      >
        {/* 标题和展开按钮 */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-sm">{title}</h4>
          {!disabled && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggle}
                className="h-6 w-6 p-0 hover:bg-muted"
                aria-label="展开图表"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* 紧凑图表内容 */}
        <div className={compactHeight}>
          {renderChart(compactData, false)}
        </div>
      </div>

      {/* 展开的图表 - 绝对定位覆盖 */}
      <AnimatePresence>
        {isExpanded && chartRect && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={handleToggle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />

            {/* 展开的图表容器 */}
            <motion.div
              className="fixed z-50 p-4 rounded-lg border bg-accent shadow-2xl"
              initial={{
                opacity: 1,
                left: chartRect.left,
                top: chartRect.top,
                width: chartRect.width,
                height: chartRect.height,
              }}
              animate={calculateExpandedBounds(chartRect, fullHeight)}
              exit={{
                left: chartRect.left,
                top: chartRect.top,
                width: chartRect.width,
                height: chartRect.height,
                opacity: 0,
                scale: 0.95
              }}
              transition={{ duration: 0.3,  type: "spring" }}
            >
              {/* 标题和收起按钮 */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm">{title}</h4>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className="h-6 w-6 p-0 hover:bg-muted"
                    aria-label="收起图表"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              </div>

              {/* 展开的图表内容 */}
              <motion.div
                className={fullHeight}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {renderChart(fullData, true)}
              </motion.div>

              {/* 展开状态指示器 */}
              <motion.div
                className="mt-2 text-xs text-muted-foreground text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                显示全部 {fullData.length} 项数据
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExpandableChart;
