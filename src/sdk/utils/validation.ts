import { z } from 'zod';
import { ApiError } from '../types';

/**
 * 验证 API 响应数据
 */
export function validateResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  operation: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Response validation failed for ${operation}: ${error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ')}`;
      throw new ApiError(errorMessage, 422);
    }
    throw new ApiError(`Unexpected validation error for ${operation}`, 500);
  }
}

/**
 * 验证请求数据
 */
export function validateRequest<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  operation: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = `Request validation failed for ${operation}: ${error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join(', ')}`;
      throw new ApiError(errorMessage, 400);
    }
    throw new ApiError(`Unexpected validation error for ${operation}`, 400);
  }
}
