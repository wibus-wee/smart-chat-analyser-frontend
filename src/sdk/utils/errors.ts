import { ApiError } from '../types';

/**
 * 处理 API 响应错误
 */
export function handleApiError(error: any): never {
  if (error.response) {
    // 服务器返回了错误响应
    const status = error.response.status;
    const message = error.response.data?.error || error.response.statusText || 'Unknown error';
    throw new ApiError(message, status, error.response.data);
  } else if (error.request) {
    // 请求发送了但没有收到响应
    throw new ApiError('Network error: No response received', 0);
  } else {
    // 其他错误
    throw new ApiError(error.message || 'Unknown error occurred', 0);
  }
}

/**
 * 检查响应状态是否成功
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

/**
 * 创建标准化的错误消息
 */
export function createErrorMessage(operation: string, error: unknown): string {
  if (error instanceof ApiError) {
    return `${operation} failed: ${error.message}`;
  }
  if (error instanceof Error) {
    return `${operation} failed: ${error.message}`;
  }
  return `${operation} failed: Unknown error`;
}
