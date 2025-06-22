import type { ChatlogAnalyserClient } from '../client';
import {
  ModelInfoSchema,
  ModelClearRequestSchema,
  ModelPreloadRequestSchema,
  type ModelInfo,
  type ModelClearRequest,
  type ModelPreloadRequest,
} from '../types';
import { validateRequest, validateResponse } from '../utils/validation';

/**
 * 模型管理相关 API
 */
export class ModelsApi {
  constructor(private client: ChatlogAnalyserClient) {}

  /**
   * 获取模型信息
   * @returns 模型信息响应
   */
  async getModelInfo(): Promise<ModelInfo> {
    const response = await this.client.get<ModelInfo>('/models/info');
    return validateResponse(response.data, ModelInfoSchema, 'getModelInfo');
  }

  /**
   * 清除模型缓存
   * @param modelKey 可选的模型键名，不提供则清除全部
   * @returns 清除操作响应
   */
  async clearModelCache(modelKey?: string): Promise<{ message: string; timestamp: string }> {
    const request: ModelClearRequest = modelKey ? { model_key: modelKey } : {};
    const validatedRequest = validateRequest(request, ModelClearRequestSchema, 'clearModelCache');

    const response = await this.client.post<{ message: string; timestamp: string }>('/models/clear', validatedRequest);
    return response.data;
  }

  /**
   * 获取已加载的模型列表
   * @returns 已加载模型的键名数组
   */
  async getLoadedModels(): Promise<string[]> {
    const modelInfo = await this.getModelInfo();
    return modelInfo.loaded_models || [];
  }

  /**
   * 检查特定模型是否已加载
   * @param modelKey 模型键名
   * @returns 是否已加载
   */
  async isModelLoaded(modelKey: string): Promise<boolean> {
    try {
      const loadedModels = await this.getLoadedModels();
      return loadedModels.includes(modelKey);
    } catch {
      return false;
    }
  }

  /**
   * 清除所有模型缓存
   * @returns 清除操作响应
   */
  async clearAllModelCache(): Promise<{ message: string; timestamp: string }> {
    return this.clearModelCache();
  }

  /**
   * 预加载模型
   * @param modelKey 可选的模型键名，不提供则预加载所有模型
   * @param force 是否强制重新加载已加载的模型
   * @returns 预加载操作响应
   */
  async preloadModel(modelKey?: string, force: boolean = false): Promise<{ message: string; timestamp: string }> {
    const request: ModelPreloadRequest = {
      force,
      ...(modelKey && { model_key: modelKey })
    };

    const validatedRequest = validateRequest(request, ModelPreloadRequestSchema, 'preloadModel');

    const response = await this.client.post<{ message: string; timestamp: string }>('/models/preload', validatedRequest);
    return response.data;
  }

  /**
   * 获取预加载状态
   * @param modelKey 可选的模型键名，不提供则返回所有模型状态
   * @returns 预加载状态响应
   */
  async getPreloadStatus(modelKey?: string): Promise<any> {
    const params = modelKey ? { model_key: modelKey } : {};
    const response = await this.client.get<any>('/models/preload/status', { params });
    return response.data;
  }

  /**
   * 取消预加载
   * @param modelKey 模型键名
   * @returns 取消操作响应
   */
  async cancelPreload(modelKey: string): Promise<{ message: string; timestamp: string }> {
    const request: ModelPreloadRequest = {
      model_key: modelKey,
      force: false
    };
    const validatedRequest = validateRequest(request, ModelPreloadRequestSchema, 'cancelPreload');

    const response = await this.client.post<{ message: string; timestamp: string }>('/models/preload/cancel', validatedRequest);
    return response.data;
  }

  /**
   * 预加载所有模型
   * @param force 是否强制重新加载已加载的模型
   * @returns 预加载操作响应
   */
  async preloadAllModels(force: boolean = false): Promise<{ message: string; timestamp: string }> {
    return this.preloadModel(undefined, force);
  }
}
