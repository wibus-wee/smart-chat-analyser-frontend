import { z } from 'zod';

// 分析器初始化参数
export const AnalyzerInitParamSchema = z.object({
  type: z.string().describe('参数类型'),
  default: z.any().optional().describe('默认值'),
  required: z.boolean().describe('是否必需'),
});
export type AnalyzerInitParam = z.infer<typeof AnalyzerInitParamSchema>;

// 分析器类信息
export const AnalyzerClassInfoSchema = z.object({
  class_name: z.string().describe('类名'),
  module: z.string().describe('模块名'),
  doc: z.string().describe('文档说明'),
});
export type AnalyzerClassInfo = z.infer<typeof AnalyzerClassInfoSchema>;

// 分析器元数据
export const AnalyzerMetadataSchema = z.object({
  category: z.string().describe('分析器类别'),
  description: z.string().describe('分析器描述'),
  builtin: z.boolean().describe('是否内置'),
});
export type AnalyzerMetadata = z.infer<typeof AnalyzerMetadataSchema>;

// 分析器详细信息 - 匹配实际 API 响应
export const AnalyzerInfoSchema = z.object({
  name: z.string().describe('分析器名称'),
  class_info: AnalyzerClassInfoSchema.describe('类信息'),
  init_params: z.record(AnalyzerInitParamSchema).describe('初始化参数'),
  metadata: AnalyzerMetadataSchema.describe('元数据'),
  is_registered: z.boolean().describe('是否已注册'),
});
export type AnalyzerInfo = z.infer<typeof AnalyzerInfoSchema>;

// 简化的分析器信息 - 用于单个分析器查询
export const SimpleAnalyzerInfoSchema = z.object({
  name: z.string().optional().describe('分析器名称'),
  description: z.string().optional().describe('分析器描述'),
  version: z.string().optional().describe('版本号'),
  parameters: z.object({}).optional().describe('参数信息'),
});
export type SimpleAnalyzerInfo = z.infer<typeof SimpleAnalyzerInfoSchema>;

// 分析器列表响应 - 匹配 OpenAPI AnalyzersResponse
export const AnalyzersResponseSchema = z.object({
  analyzers: z.array(z.string()).describe('可用分析器列表'),
  analyzer_info: z.record(AnalyzerInfoSchema).describe('分析器详细信息'),
  total_count: z.number().int().describe('分析器总数'),
});
export type AnalyzersResponse = z.infer<typeof AnalyzersResponseSchema>;
