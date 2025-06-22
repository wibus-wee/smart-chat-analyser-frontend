import { ofetch, type FetchOptions } from 'ofetch';
import type { ApiClientConfig, ApiResponse } from './types';
import { handleApiError, isSuccessStatus } from './utils/errors';

/**
 * 聊天记录分析器 API 客户端
 */
export class ChatlogAnalyserClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://localhost:6142/api/v1';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * 发送 HTTP 请求
   */
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await ofetch.raw<T>(url, {
        timeout: this.timeout,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
        responseType: 'json' as const,
      });

      if (!isSuccessStatus(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        data: response._data as T,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      query: params,
    });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
    });
  }

  /**
   * 获取基础 URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * 设置默认请求头
   */
  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * 移除默认请求头
   */
  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}
