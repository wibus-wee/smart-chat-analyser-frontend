import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/pages/HomePage'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'Smart Chat Analyzer - 聊天记录智能分析',
      },
      {
        name: 'description',
        content: '深度分析你的聊天记录，发现隐藏的模式和洞察。支持词频分析、情感分析、时间模式分析和社交网络分析。',
      },
    ],
  }),
  component: HomePage,
})
