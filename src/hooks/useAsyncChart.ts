import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseAsyncChartOptions {
  /** 数据点数量阈值，超过此值将启用异步渲染 */
  threshold?: number;
  /** 每次渲染的数据块大小 */
  chunkSize?: number;
  /** 渲染间隔（毫秒） */
  renderInterval?: number;
  /** 是否自动开始渲染 */
  autoStart?: boolean;
}

interface UseAsyncChartReturn<T> {
  /** 当前渲染的数据 */
  renderedData: T[];
  /** 是否正在渲染 */
  isRendering: boolean;
  /** 渲染进度 (0-1) */
  progress: number;
  /** 开始渲染 */
  startRendering: () => void;
  /** 暂停渲染 */
  pauseRendering: () => void;
  /** 重置渲染 */
  resetRendering: () => void;
  /** 是否需要异步渲染 */
  needsAsyncRendering: boolean;
  /** 总数据量 */
  totalDataPoints: number;
  /** 当前渲染的数据量 */
  renderedDataPoints: number;
}

/**
 * 异步图表渲染Hook
 * 用于处理大量数据的图表渲染，避免阻塞UI
 */
export function useAsyncChart<T>(
  data: T[],
  options: UseAsyncChartOptions = {}
): UseAsyncChartReturn<T> {
  const {
    threshold = 1000,
    chunkSize = 100,
    renderInterval = 50,
    autoStart = false
  } = options;

  const [renderedData, setRenderedData] = useState<T[]>([]);
  const [isRendering, setIsRendering] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 判断是否需要异步渲染
  const needsAsyncRendering = useMemo(() => {
    return data.length > threshold;
  }, [data.length, threshold]);

  // 计算进度
  const progress = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.min(currentIndex / data.length, 1);
  }, [currentIndex, data.length]);

  // 开始渲染
  const startRendering = useCallback(() => {
    if (!needsAsyncRendering) {
      setRenderedData(data);
      return;
    }
    setIsRendering(true);
  }, [needsAsyncRendering, data]);

  // 暂停渲染
  const pauseRendering = useCallback(() => {
    setIsRendering(false);
  }, []);

  // 重置渲染
  const resetRendering = useCallback(() => {
    setIsRendering(false);
    setCurrentIndex(0);
    setRenderedData([]);
  }, []);

  // 异步渲染逻辑
  useEffect(() => {
    if (!isRendering || !needsAsyncRendering) return;

    const timer = setTimeout(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = Math.min(prevIndex + chunkSize, data.length);
        const newData = data.slice(0, nextIndex);
        setRenderedData(newData);

        if (nextIndex >= data.length) {
          setIsRendering(false);
        }

        return nextIndex;
      });
    }, renderInterval);

    return () => clearTimeout(timer);
  }, [isRendering, currentIndex, data, chunkSize, renderInterval, needsAsyncRendering]);

  // 数据变化时重置
  useEffect(() => {
    if (!needsAsyncRendering) {
      setRenderedData(data);
      setCurrentIndex(data.length);
      setIsRendering(false);
    } else {
      resetRendering();
      if (autoStart) {
        startRendering();
      }
    }
  }, [data, needsAsyncRendering, autoStart, resetRendering, startRendering]);

  return {
    renderedData,
    isRendering,
    progress,
    startRendering,
    pauseRendering,
    resetRendering,
    needsAsyncRendering,
    totalDataPoints: data.length,
    renderedDataPoints: renderedData.length
  };
}

/**
 * 数据采样Hook
 * 用于减少数据点数量以提高渲染性能
 */
export function useDataSampling<T>(
  data: T[],
  maxPoints: number = 1000
): T[] {
  return useMemo(() => {
    if (data.length <= maxPoints) return data;
    
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, index) => index % step === 0);
  }, [data, maxPoints]);
}

/**
 * 数据分块Hook
 * 用于将大数据集分成小块进行处理
 */
export function useDataChunking<T>(
  data: T[],
  chunkSize: number = 500
): T[][] {
  return useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }, [data, chunkSize]);
}
