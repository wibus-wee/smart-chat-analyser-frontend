import { createFileRoute } from '@tanstack/react-router'
import { AnalysisPage } from '../../components/pages/AnalysisPage'

export const Route = createFileRoute('/analysis/')({
  head: () => ({
    meta: [
      {
        title: '分析中心 - Smart Chat Analyzer',
      },
      {
        name: 'description',
        content: '管理和监控您的聊天记录分析任务，查看任务状态和进度。',
      },
    ],
  }),
  component: AnalysisPage,
})
