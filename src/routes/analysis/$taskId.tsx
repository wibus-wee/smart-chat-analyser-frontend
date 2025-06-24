import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AnalysisDetailPage } from '../../components/pages/AnalysisDetailPage'

const analysisDetailParamsSchema = z.object({
  taskId: z.string(),
})

export const Route = createFileRoute('/analysis/$taskId')({
  head: ({ params }) => ({
    meta: [
      {
        title: `分析详情 - 任务 ${params.taskId.slice(-8)} - Smart Chat Analyzer`,
      },
      {
        name: 'description',
        content: '监控分析任务进度和查看详细的分析结果，包括实时进度更新和结果可视化。',
      },
    ],
  }),
  component: AnalysisDetailPage,
  parseParams: analysisDetailParamsSchema.parse,
})
