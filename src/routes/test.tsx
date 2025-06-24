import { createFileRoute } from '@tanstack/react-router'
import { ExpandableChartTest } from '../components/test/ExpandableChartTest'

export const Route = createFileRoute('/test')({
  head: () => ({
    meta: [
      {
        title: '功能测试 - Smart Chat Analyzer',
      },
      {
        name: 'description',
        content: '开发和测试功能页面，用于验证组件功能和用户界面。',
      },
    ],
  }),
  component: TestPage,
})

function TestPage() {
  return <ExpandableChartTest />
}
