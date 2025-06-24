import { createRootRoute, Outlet, HeadContent } from '@tanstack/react-router'
import { AppLayout } from '../components/layout/AppLayout'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'description',
        content: '聊天记录智能分析工具，深度分析你的聊天记录，发现隐藏的模式和洞察',
      },
      {
        name: 'keywords',
        content: '聊天记录分析,智能分析,数据分析,情感分析,词频分析,社交网络分析',
      },
      {
        title: 'Smart Chat Analyzer',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  ),
})
