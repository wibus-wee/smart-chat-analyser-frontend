import { useEffect, useState, useCallback, useRef } from 'react';
import { websocketManager, type TaskProgressEvent, type TaskCompletedEvent } from '../lib/websocket-manager';

/**
 * WebSocket 连接状态 Hook
 */
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setError(null);

    try {
      await websocketManager.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err as Error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected]);

  const disconnect = useCallback(() => {
    websocketManager.disconnect();
    setIsConnected(false);
    setError(null);
  }, []);

  useEffect(() => {
    // 监听连接状态变化
    const unsubscribe = websocketManager.onConnectionChange((connected) => {
      setIsConnected(connected);
      if (!connected) {
        setError(new Error('WebSocket 连接断开'));
      } else {
        setError(null);
      }
    });

    // 初始连接状态
    setIsConnected(websocketManager.isConnected);

    return unsubscribe;
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
}

/**
 * 任务实时监控 Hook
 */
export function useTaskMonitor(taskId: string | null) {
  const [progress, setProgress] = useState<TaskProgressEvent | null>(null);
  const [completed, setCompleted] = useState<TaskCompletedEvent | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const taskIdRef = useRef<string | null>(null);

  // 订阅任务
  const subscribe = useCallback(() => {
    if (!taskId || !websocketManager.isConnected) {
      console.log('无法订阅任务:', { taskId, connected: websocketManager.isConnected });
      return;
    }

    console.log('开始订阅任务:', taskId);

    // 设置进度监听器
    websocketManager.onTaskProgress(taskId, (event) => {
      console.log('useTaskMonitor 收到进度更新:', event);
      setProgress(event);
    });

    // 设置完成监听器
    websocketManager.onTaskCompleted(taskId, (event) => {
      console.log('useTaskMonitor 收到完成通知:', event);
      setCompleted(event);
      setIsSubscribed(false);
    });

    // 订阅任务
    websocketManager.subscribeToTask(taskId);
    setIsSubscribed(true);
    taskIdRef.current = taskId;
    console.log('任务订阅完成:', taskId);
  }, [taskId]);

  // 取消订阅任务
  const unsubscribe = useCallback(() => {
    if (taskIdRef.current) {
      websocketManager.unsubscribeFromTask(taskIdRef.current);
      setIsSubscribed(false);
      taskIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (taskId && websocketManager.isConnected) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [taskId, subscribe, unsubscribe]);

  // 监听连接状态变化，连接成功后自动订阅
  useEffect(() => {
    const unsubscribeConnection = websocketManager.onConnectionChange((connected) => {
      if (connected && taskId && !isSubscribed) {
        subscribe();
      }
    });

    return unsubscribeConnection;
  }, [taskId, isSubscribed, subscribe]);

  return {
    progress,
    completed,
    isSubscribed,
    subscribe,
    unsubscribe,
  };
}

/**
 * 自动连接 WebSocket Hook
 */
export function useAutoWebSocketConnection() {
  const { isConnected, isConnecting, error, connect } = useWebSocketConnection();

  useEffect(() => {
    // 自动连接
    if (!isConnected && !isConnecting && !error) {
      connect();
    }
  }, [isConnected, isConnecting, error, connect]);

  // 连接失败时自动重试
  useEffect(() => {
    if (error && !isConnecting) {
      const timer = setTimeout(() => {
        connect();
      }, 5000); // 5秒后重试

      return () => clearTimeout(timer);
    }
  }, [error, isConnecting, connect]);

  return {
    isConnected,
    isConnecting,
    error,
  };
}
