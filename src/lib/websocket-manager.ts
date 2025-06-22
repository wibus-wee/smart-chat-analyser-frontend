import { io, Socket } from 'socket.io-client';

/**
 * WebSocket 事件类型定义
 */
export interface TaskProgressEvent {
  task_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  message: string;
  timestamp: string;
}

export interface TaskCompletedEvent {
  task_id: string;
  status: 'completed' | 'failed' | 'cancelled';
  message: string;
  timestamp: string;
}

/**
 * WebSocket 连接管理器
 */
export class WebSocketManager {
  private socket: Socket | null = null;
  private baseUrl: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscribedTasks = new Set<string>();

  // 事件监听器
  private progressListeners = new Map<string, (event: TaskProgressEvent) => void>();
  private completedListeners = new Map<string, (event: TaskCompletedEvent) => void>();
  private connectionListeners = new Set<(connected: boolean) => void>();

  constructor(baseUrl: string = 'http://localhost:6142') {
    this.baseUrl = baseUrl;
  }

  /**
   * 连接到 WebSocket 服务器
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.baseUrl, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      // 连接成功
      this.socket.on('connect', () => {
        console.log('WebSocket 连接成功');
        this.reconnectAttempts = 0;
        this.notifyConnectionListeners(true);
        
        // 重新订阅之前的任务
        this.subscribedTasks.forEach(taskId => {
          this.subscribeToTask(taskId);
        });
        
        resolve();
      });

      // 连接失败
      this.socket.on('connect_error', (error) => {
        console.error('WebSocket 连接失败:', error);
        this.notifyConnectionListeners(false);
        reject(error);
      });

      // 断开连接
      this.socket.on('disconnect', (reason) => {
        console.log('WebSocket 连接断开:', reason);
        this.notifyConnectionListeners(false);
      });

      // 任务进度更新
      this.socket.on('task_progress', (data: TaskProgressEvent) => {
        console.log('收到任务进度更新:', data);
        const listener = this.progressListeners.get(data.task_id);
        if (listener) {
          listener(data);
        }
      });

      // 任务完成通知
      this.socket.on('task_completed', (data: TaskCompletedEvent) => {
        console.log('收到任务完成通知:', data);
        const listener = this.completedListeners.get(data.task_id);
        if (listener) {
          listener(data);
        }
        // 任务完成后自动取消订阅
        this.unsubscribeFromTask(data.task_id);
      });

      // 重连事件
      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`WebSocket 重连成功 (尝试 ${attemptNumber})`);
        this.reconnectAttempts = 0;
        this.notifyConnectionListeners(true);
      });

      this.socket.on('reconnect_error', (error) => {
        this.reconnectAttempts++;
        console.error(`WebSocket 重连失败 (尝试 ${this.reconnectAttempts}):`, error);
      });
    });
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.subscribedTasks.clear();
    this.progressListeners.clear();
    this.completedListeners.clear();
    this.notifyConnectionListeners(false);
  }

  /**
   * 订阅任务进度更新
   */
  subscribeToTask(taskId: string): void {
    if (!this.socket?.connected) {
      console.warn('WebSocket 未连接，无法订阅任务');
      return;
    }

    this.socket.emit('subscribe_task', { task_id: taskId });
    this.subscribedTasks.add(taskId);
    console.log(`已订阅任务: ${taskId}`);
  }

  /**
   * 取消订阅任务
   */
  unsubscribeFromTask(taskId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit('unsubscribe_task', { task_id: taskId });
    this.subscribedTasks.delete(taskId);
    this.progressListeners.delete(taskId);
    this.completedListeners.delete(taskId);
    console.log(`已取消订阅任务: ${taskId}`);
  }

  /**
   * 监听任务进度更新
   */
  onTaskProgress(taskId: string, listener: (event: TaskProgressEvent) => void): void {
    this.progressListeners.set(taskId, listener);
  }

  /**
   * 监听任务完成
   */
  onTaskCompleted(taskId: string, listener: (event: TaskCompletedEvent) => void): void {
    this.completedListeners.set(taskId, listener);
  }

  /**
   * 监听连接状态变化
   */
  onConnectionChange(listener: (connected: boolean) => void): () => void {
    this.connectionListeners.add(listener);
    
    // 返回取消监听的函数
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  /**
   * 获取连接状态
   */
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * 通知连接状态监听器
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error) {
        console.error('连接状态监听器执行失败:', error);
      }
    });
  }
}

// 创建全局 WebSocket 管理器实例
export const websocketManager = new WebSocketManager();

// 导出默认实例
export default websocketManager;
