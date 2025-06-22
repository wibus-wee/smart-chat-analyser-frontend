import { ofetch, type FetchOptions } from 'ofetch';
import { 
  ChatlogApiError,
  type ChatlogApiConfig, 
  type ChatlogApiResponse,  
} from './types';


/**
 * 聊天记录 API 客户端
 */
export class ChatlogApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: ChatlogApiConfig = {}) {
    this.baseUrl = config.baseUrl || 'http://127.0.0.1:5030';
    this.timeout = config.timeout || 30000;
    this.defaultHeaders = {
      'User-Agent': 'ChatlogAnalyzer/1.0',
      'Accept': 'application/json',
      ...config.headers,
    };
  }

  /**
   * 处理 API 错误
   */
  private handleApiError(error: unknown): never {
    if (error instanceof Error) {
      // 检查是否是网络错误
      if (error.message.includes('fetch')) {
        throw new ChatlogApiError(
          `网络连接失败: ${error.message}`,
          0,
          error
        );
      }
      
      // 检查是否是 HTTP 错误
      const httpMatch = error.message.match(/HTTP (\d+)/);
      if (httpMatch) {
        const status = parseInt(httpMatch[1]);
        throw new ChatlogApiError(
          `HTTP ${status}: ${error.message}`,
          status,
          error
        );
      }
      
      throw new ChatlogApiError(error.message, 500, error);
    }
    
    throw new ChatlogApiError('未知错误', 500, error);
  }

  /**
   * 检查响应状态是否成功
   */
  private isSuccessStatus(status: number): boolean {
    return status >= 200 && status < 300;
  }

  /**
   * 发送 HTTP 请求
   */
  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<ChatlogApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // 确保返回 JSON 格式
      const params = options.query || {};
      if (typeof params === 'object') {
        params.format = 'json';
      }
      
      const response = await ofetch.raw<T>(url, {
        timeout: this.timeout,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
        query: params,
        responseType: 'json' as const,
      });

      if (!this.isSuccessStatus(response.status)) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // 处理响应数据，优先返回 items 字段
      let responseData = response._data as T;
      if (typeof responseData === 'object' && responseData !== null && 'items' in responseData) {
        responseData = (responseData as any).items;
      }

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ChatlogApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      query: params,
    });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any): Promise<ChatlogApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
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

  /**
   * 测试 API 连接
   */
  async testConnection(): Promise<boolean> {
    try {
      // 尝试获取会话列表来测试连接
      await this.get('/api/v1/session');
      return true;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return false;
    }
  }
}
