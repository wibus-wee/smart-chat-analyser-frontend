import { createFileRoute } from '@tanstack/react-router'
import { HistoryPage } from '../components/pages/HistoryPage'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})
