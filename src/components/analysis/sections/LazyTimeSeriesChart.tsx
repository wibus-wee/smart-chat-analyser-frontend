import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from '../../ui/chart';
import { Button } from '../../ui/button';
import { Loader2, ZoomIn, ZoomOut, RotateCcw, Play, Pause } from 'lucide-react';
import { useAsyncChart, useDataSampling } from '../../../hooks/useAsyncChart';

interface LazyTimeSeriesChartProps {
  timeSeriesData: {
    x: number[];
    sentiment: number[];
    confidence: number[];
  };
  chartConfig: ChartConfig;
}

export default function LazyTimeSeriesChart({ timeSeriesData, chartConfig }: LazyTimeSeriesChartProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  // 处理原始数据
  const rawData = useMemo(() => {
    return timeSeriesData.x.map((x, index) => ({
      time: String(x),
      sentiment: timeSeriesData.sentiment[index],
      confidence: timeSeriesData.confidence[index]
    }));
  }, [timeSeriesData]);

  // 根据缩放级别采样数据
  const maxPoints = Math.floor(1000 / zoomLevel);
  const sampledData = useDataSampling(rawData, maxPoints);

  // 使用异步渲染Hook
  const {
    renderedData,
    isRendering,
    progress,
    startRendering,
    pauseRendering,
    resetRendering,
    needsAsyncRendering,
    totalDataPoints,
    renderedDataPoints
  } = useAsyncChart(sampledData, {
    threshold: 500,
    chunkSize: 50,
    renderInterval: 30,
    autoStart: false
  });

  // 控制函数
  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev * 2, 8));
    resetRendering();
  }, [resetRendering]);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev / 2, 0.25));
    resetRendering();
  }, [resetRendering]);

  const handleReset = useCallback(() => {
    setZoomLevel(1);
    resetRendering();
  }, [resetRendering]);

  const handleToggleRendering = useCallback(() => {
    if (isRendering) {
      pauseRendering();
    } else {
      startRendering();
    }
  }, [isRendering, pauseRendering, startRendering]);

  // 如果不需要异步渲染，直接显示所有数据
  const displayData = needsAsyncRendering ? renderedData : sampledData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* 控制面板 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.25}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 8}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            显示 {displayData.length} / {totalDataPoints} 个数据点
            {needsAsyncRendering && ` (${(progress * 100).toFixed(1)}%)`}
          </span>
          {needsAsyncRendering && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleRendering}
              className="gap-1"
            >
              {isRendering ? (
                <>
                  <Pause className="h-3 w-3" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  {renderedDataPoints === 0 ? '开始渲染' : '继续渲染'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 图表 */}
      <div className="relative">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="var(--chart-1)"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke="var(--chart-2)"
              strokeWidth={1.5}
              dot={false}
              connectNulls={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>

        {/* 渲染中的加载指示器 */}
        {isRendering && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-xs">渲染中...</span>
          </div>
        )}
      </div>

      {/* 进度指示器 */}
      {needsAsyncRendering && (
        <div className="space-y-1">
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>已渲染: {renderedDataPoints}</span>
            <span>总计: {totalDataPoints}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
