import { createFileRoute } from '@tanstack/react-router'
import { ExpandableChartTest } from '../components/test/ExpandableChartTest'

export const Route = createFileRoute('/test')({
  component: TestPage,
})

function TestPage() {
  return <ExpandableChartTest />
}
