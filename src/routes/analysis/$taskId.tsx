import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AnalysisDetailPage } from '../../components/pages/AnalysisDetailPage'

const analysisDetailParamsSchema = z.object({
  taskId: z.string(),
})

export const Route = createFileRoute('/analysis/$taskId')({
  component: AnalysisDetailPage,
  parseParams: analysisDetailParamsSchema.parse,
})
