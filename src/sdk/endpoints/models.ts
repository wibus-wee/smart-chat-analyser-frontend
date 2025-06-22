import type { ChatlogAnalyserClient } from '../client';
import {
  ModelInfoResponseSchema,
  EnhancedModelInfoResponseSchema,
  ClearModelRequestSchema,
  ClearModelResponseSchema,
  PreloadModelRequestSchema,
  PreloadModelResponseSchema,
  PreloadStatusResponseSchema,
  CancelPreloadRequestSchema,
  CancelPreloadResponseSchema,
  ModelOperationRequestSchema,
  ModelOperationResponseSchema,
  type ModelInfoResponse,
  type EnhancedModelInfoResponse,
  type ClearModelRequest,
  type ClearModelResponse,
  type PreloadModelRequest,
  type PreloadModelResponse,
  type PreloadStatusResponse,
  type CancelPreloadRequest,
  type CancelPreloadResponse,
  type ModelOperationRequest,
  type ModelOperationResponse,
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
  async getModelInfo(): Promise<ModelInfoResponse> {
    const response = await this.client.get<ModelInfoResponse>('/models/info');
    return validateResponse(response.data, ModelInfoResponseSchema, 'getModelInfo');
  }

  /**
   * 清除模型缓存
   * @param modelKey 可选的模型键名，不提供则清除全部
   * @returns 清除操作响应
   */
  async clearModelCache(modelKey?: string): Promise<ClearModelResponse> {
    const request: ClearModelRequest = modelKey ? { model_key: modelKey } : {};
    const validatedRequest = validateRequest(request, ClearModelRequestSchema, 'clearModelCache');
    
    const response = await this.client.post<ClearModelResponse>('/models/clear', validatedRequest);
    return validateResponse(response.data, ClearModelResponseSchema, 'clearModelCache');
  }

  /**
   * 获取已加载的模型列表
   * @returns 已加载模型的键名数组
   */
  async getLoadedModels(): Promise<string[]> {
    const modelInfo = await this.getModelInfo();
    return modelInfo.loaded_models;
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
   * 获取内存使用情况
   * @returns 内存使用情况对象
   */
  async getMemoryUsage(): Promise<{ rss: string; vms: string }> {
    const modelInfo = await this.getModelInfo();
    return modelInfo.memory_usage;
  }

  /**
   * 获取已加载模型数量
   * @returns 已加载模型数量
   */
  async getModelCount(): Promise<number> {
    const modelInfo = await this.getModelInfo();
    return modelInfo.model_count;
  }

  /**
   * 清除所有模型缓存
   * @returns 清除操作响应
   */
  async clearAllModelCache(): Promise<ClearModelResponse> {
    return this.clearModelCache();
  }

  /**
   * 获取模型统计信息
   * @returns 模型统计信息
   */
  async getModelStats(): Promise<{
    loadedCount: number;
    memoryUsage: { rss: string; vms: string };
    modelKeys: string[];
  }> {
    const modelInfo = await this.getModelInfo();

    return {
      loadedCount: modelInfo.model_count,
      memoryUsage: modelInfo.memory_usage,
      modelKeys: modelInfo.loaded_models,
    };
  }

  /**
   * 预加载模型
   * @param modelKey 可选的模型键名，不提供则预加载所有模型
   * @param force 是否强制重新加载已加载的模型
   * @returns 预加载操作响应
   */
  async preloadModel(modelKey?: string, force?: boolean): Promise<PreloadModelResponse> {
    const request: PreloadModelRequest = {};
    if (modelKey) request.model_key = modelKey;
    if (force !== undefined) request.force = force;

    const validatedRequest = validateRequest(request, PreloadModelRequestSchema, 'preloadModel');

    const response = await this.client.post<PreloadModelResponse>('/models/preload', validatedRequest);
    return validateResponse(response.data, PreloadModelResponseSchema, 'preloadModel');
  }

  /**
   * 获取预加载状态
   * @param modelKey 可选的模型键名，不提供则返回所有模型状态
   * @returns 预加载状态响应
   */
  async getPreloadStatus(modelKey?: string): Promise<PreloadStatusResponse> {
    const params = modelKey ? { model_key: modelKey } : {};
    const response = await this.client.get<PreloadStatusResponse>('/models/preload/status', { params });
    return validateResponse(response.data, PreloadStatusResponseSchema, 'getPreloadStatus');
  }

  /**
   * 取消预加载
   * @param modelKey 模型键名
   * @returns 取消操作响应
   */
  async cancelPreload(modelKey: string): Promise<CancelPreloadResponse> {
    const request: CancelPreloadRequest = { model_key: modelKey };
    const validatedRequest = validateRequest(request, CancelPreloadRequestSchema, 'cancelPreload');

    const response = await this.client.post<CancelPreloadResponse>('/models/preload/cancel', validatedRequest);
    return validateResponse(response.data, CancelPreloadResponseSchema, 'cancelPreload');
  }

  /**
   * 预加载所有模型
   * @param force 是否强制重新加载已加载的模型
   * @returns 预加载操作响应
   */
  async preloadAllModels(force?: boolean): Promise<PreloadModelResponse> {
    return this.preloadModel(undefined, force);
  }

  /**
   * 获取可用模型列表
   * @returns 可用模型键名数组
   */
  async getAvailableModels(): Promise<string[]> {
    const modelInfo = await this.getModelInfo();
    return modelInfo.available_models || [];
  }

  /**
   * 检查模型是否正在预加载
   * @param modelKey 模型键名
   * @returns 是否正在预加载
   */
  async isModelPreloading(modelKey: string): Promise<boolean> {
    try {
      const statusResponse = await this.getPreloadStatus(modelKey);
      const status = statusResponse.status;

      if (typeof status === 'object' && 'status' in status) {
        return status.status === 'in_progress';
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * 获取增强的模型信息（包含详细状态）
   * @returns 增强的模型信息响应
   */
  async getEnhancedModelInfo(): Promise<EnhancedModelInfoResponse> {
    const response = await this.client.get<EnhancedModelInfoResponse>('/models/info');
    return validateResponse(response.data, EnhancedModelInfoResponseSchema, 'getEnhancedModelInfo');
  }

  /**
   * 执行模型操作（清除/预加载）
   * @param operation 操作类型
   * @param modelKey 可选的模型键名
   * @param force 是否强制执行
   * @returns 操作响应
   */
  async executeModelOperation(
    operation: 'clear' | 'preload',
    modelKey?: string,
    force?: boolean
  ): Promise<ModelOperationResponse> {
    const request: ModelOperationRequest = {
      force: force ?? false,
    };
    if (modelKey) request.model_key = modelKey;

    const validatedRequest = validateRequest(request, ModelOperationRequestSchema, 'executeModelOperation');

    const endpoint = operation === 'clear' ? '/models/clear' : '/models/preload';
    const response = await this.client.post<ModelOperationResponse>(endpoint, validatedRequest);
    return validateResponse(response.data, ModelOperationResponseSchema, 'executeModelOperation');
  }

  /**
   * 获取模型详细状态信息
   * @returns 模型状态详情
   */
  async getModelStatusDetails(): Promise<{
    totalModels: number;
    loadedModels: number;
    totalMemory: number;
    modelDetails: Record<string, {
      status: string;
      loadTime: number | null;
      memoryUsage: number | null;
      lastUsed: string | null;
      error: string | null;
    }>;
  }> {
    try {
      const enhancedInfo = await this.getEnhancedModelInfo();
      return {
        totalModels: enhancedInfo.total_models,
        loadedModels: enhancedInfo.loaded_models,
        totalMemory: enhancedInfo.total_memory,
        modelDetails: Object.fromEntries(
          Object.entries(enhancedInfo.models).map(([key, model]) => [
            key,
            {
              status: model.status,
              loadTime: model.load_time,
              memoryUsage: model.memory_usage,
              lastUsed: model.last_used,
              error: model.error,
            },
          ])
        ),
      };
    } catch {
      // 如果增强API不可用，回退到基础API
      const basicInfo = await this.getModelInfo();
      return {
        totalModels: basicInfo.model_count,
        loadedModels: basicInfo.model_count,
        totalMemory: 0,
        modelDetails: Object.fromEntries(
          basicInfo.loaded_models.map(model => [
            model,
            {
              status: 'loaded',
              loadTime: null,
              memoryUsage: null,
              lastUsed: null,
              error: null,
            },
          ])
        ),
      };
    }
  }
}
