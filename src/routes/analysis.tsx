import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { AnalysisPage } from '../components/pages/AnalysisPage'

const analysisSearchSchema = z.object({
  taskId: z.string().optional(),
})

export const Route = createFileRoute('/analysis')({
  component: AnalysisPage,
  validateSearch: analysisSearchSchema,
})
