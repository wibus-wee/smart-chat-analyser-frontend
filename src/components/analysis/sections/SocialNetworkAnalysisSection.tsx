import { motion } from 'framer-motion';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from '../../ui/chart';
import { Crown, Users, MessageCircle, Network, AtSign, TrendingUp } from 'lucide-react';
import type { AnalysisResultsSocialNetwork } from '../../../sdk/types/task-response';

interface SocialNetworkAnalysisSectionProps {
  socialNetworkData: AnalysisResultsSocialNetwork;
  icon: React.ReactNode;
}

export function SocialNetworkAnalysisSection({ socialNetworkData, icon }: SocialNetworkAnalysisSectionProps) {
  // 中心性指标数据 - 取前10名
  const centralityData = socialNetworkData.centrality_metrics.top_pagerank.slice(0, 10).map(([name, score]) => ({
    name,
    pagerank: score,
    betweenness: socialNetworkData.centrality_metrics.betweenness_centrality[name] || 0,
    closeness: socialNetworkData.centrality_metrics.closeness_centrality[name] || 0
  }));

  // 社区规模数据
  const communityData = socialNetworkData.communities.community_sizes.map((size, index) => ({
    community: `社区 ${index + 1}`,
    size
  }));

  // 社区详情数据 - 使用sorted_communities获取按大小排序的社区
  const communityDetails = socialNetworkData.communities.sorted_communities.slice(0, 10).map(([communityId, members]) => ({
    id: communityId,
    name: `社区 ${communityId + 1}`,
    size: members.length,
    members: members.slice(0, 10), // 只显示前10个成员
    totalMembers: members.length,
    topMember: members.reduce((prev, current) =>
      (prev.message_count > current.message_count) ? prev : current
    )
  }));

  // 最活跃用户数据
  const topUsersData = socialNetworkData.user_activity.top_active_users.slice(0, 10).map(([userId, stats]) => ({
    user: userId.slice(-8), // 显示用户ID的后8位
    messages: stats.message_count,
    connections: stats.total_degree
  }));

  // @艾特网络数据
  const mentionNetwork = socialNetworkData.mention_network;
  const topMentionedData = mentionNetwork.top_mentioned_users.slice(0, 8).map(([user, count]) => ({
    user: user.slice(-8), // 显示用户ID的后8位
    mentions: count
  }));

  const topMentionersData = mentionNetwork.mention_patterns.top_mentioners.slice(0, 8).map(([user, count]) => ({
    user: user.slice(-8), // 显示用户ID的后8位
    mentions: count
  }));

  const chartConfig = {
    pagerank: {
      label: "PageRank",
      color: "var(--chart-1)",
    },
    betweenness: {
      label: "中介中心性",
      color: "var(--chart-2)",
    },
    closeness: {
      label: "接近中心性",
      color: "var(--chart-3)",
    },
    size: {
      label: "社区规模",
      color: "var(--chart-1)",
    },
    messages: {
      label: "消息数",
      color: "var(--chart-1)",
    },
    connections: {
      label: "连接数",
      color: "var(--chart-2)",
    },
    mentions: {
      label: "@艾特次数",
      color: "var(--chart-4)",
    }
  } satisfies ChartConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">社交网络分析</h3>
      </div>

      {/* 图表网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* 网络概览统计 - 作为第一个图表项 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-4 text-sm">网络概览统计</h4>

          {/* 基础网络统计 */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm">总用户数</span>
              </div>
              <span className="font-semibold">{socialNetworkData.total_users.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">总交互数</span>
              </div>
              <span className="font-semibold">{socialNetworkData.total_interactions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm">网络密度</span>
              </div>
              <span className="font-semibold">{socialNetworkData.network_structure.density.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <span className="text-sm">社区数量</span>
              </div>
              <span className="font-semibold">{socialNetworkData.communities.num_communities}</span>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-border/50 my-3"></div>

          {/* @艾特网络统计 */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <span className="text-sm">总@艾特数</span>
              </div>
              <span className="font-semibold">{mentionNetwork.total_mentions.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                <span className="text-sm">@艾特互动率</span>
              </div>
              <span className="font-semibold">{(mentionNetwork.mention_patterns.mention_reciprocity_rate * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* 分割线 */}
          <div className="border-t border-border/50 my-3"></div>

          {/* 关键人物信息 */}
          <div>
            <div className="text-xs text-muted-foreground mb-3">关键人物</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                  <span className="text-xs">最具影响力</span>
                </div>
                <span className="text-xs font-medium truncate max-w-[100px]">{socialNetworkData.key_players.most_influential.user_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />
                  <span className="text-xs">最受欢迎</span>
                </div>
                <span className="text-xs font-medium truncate max-w-[100px]">{socialNetworkData.key_players.most_popular.user_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-xs">桥梁作用</span>
                </div>
                <span className="text-xs font-medium truncate max-w-[100px]">{socialNetworkData.key_players.bridge_player.user_name}</span>
              </div>
            </div>
          </div>
        </div>

        
        {/* 社区详情面板 */}
        <div className="xl:col-span-1 p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">社区详情 (Top {Math.min(communityDetails.length, 5)})</h4>
          <div className="space-y-3 max-h-[350px] overflow-y-auto">
            {communityDetails.slice(0, 5).map((community) => (
              <div key={community.id} className="p-3 rounded-md bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-medium text-sm">{community.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{community.size} 人</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">最活跃成员:</span>
                    <span className="text-xs font-medium truncate max-w-[100px]">
                      {community.topMember.user_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">消息数:</span>
                    <span className="text-xs font-medium">
                      {community.topMember.message_count}
                    </span>
                  </div>
                </div>

                {/* 成员列表预览 */}
                <div className="mt-2 pt-2 border-t border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">成员预览:</div>
                  <div className="flex flex-wrap gap-1">
                    {community.members.slice(0, 3).map((member, idx) => (
                      <span key={idx} className="text-xs bg-background/50 px-1.5 py-0.5 rounded truncate">
                        {member.user_name}
                      </span>
                    ))}
                    {community.totalMembers > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{community.totalMembers - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 社区规模分布 - 增加高度 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">社区规模分布</h4>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={communityData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="community" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [value, '成员数量']}
              />
              <Bar dataKey="size" fill="var(--chart-2)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 最活跃用户 */}
        <div className="md:col-span-2 xl:col-span-2 p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">最活跃用户 (Top 10)</h4>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={topUsersData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="user" fontSize={12} />
              <YAxis fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  value,
                  name === 'messages' ? '消息数' : '连接数'
                ]}
              />
              <Bar dataKey="messages" fill="var(--chart-1)" radius={2} />
              <Bar dataKey="connections" fill="var(--chart-2)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* 中心性指标 - 增加高度 */}
        <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
          <h4 className="font-medium mb-3 text-sm">用户中心性指标 (Top 8)</h4>
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart data={centralityData.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={60} fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => `用户: ${value}`}
                formatter={(value) => [typeof value === 'number' ? value.toFixed(4) : value, 'PageRank分数']}
              />
              <Bar dataKey="pagerank" fill="var(--chart-1)" radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

      </div>

      {/* @艾特网络分析部分 */}
      {mentionNetwork.has_mentions && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AtSign className="h-5 w-5 text-pink-500" />
            <h4 className="text-lg font-semibold">@艾特网络分析</h4>
          </div>

          {/* @艾特网络统计概览 */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <AtSign className="h-4 w-4 text-pink-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">被@艾特用户数</div>
                  <div className="font-semibold">{mentionNetwork.unique_mentioned_users.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">@艾特关系数</div>
                  <div className="font-semibold">{mentionNetwork.mention_patterns.total_mention_relationships.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">互相@艾特关系</div>
                  <div className="font-semibold">{mentionNetwork.mention_patterns.mutual_mention_relationships.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-orange-500 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">@艾特网络密度</div>
                  <div className="font-semibold">{mentionNetwork.mention_graph_stats.density.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* @艾特网络图表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 最常被@艾特用户 */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
              <h5 className="font-medium mb-3 text-sm">最常被@艾特用户 (Top 8)</h5>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={topMentionedData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="user" type="category" width={60} fontSize={12} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `用户: ${value}`}
                    formatter={(value) => [value, '@艾特次数']}
                  />
                  <Bar dataKey="mentions" fill="var(--chart-4)" radius={2} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* 最爱@艾特别人的用户 */}
            <div className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
              <h5 className="font-medium mb-3 text-sm">最爱@艾特别人的用户 (Top 8)</h5>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={topMentionersData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="user" type="category" width={60} fontSize={12} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `用户: ${value}`}
                    formatter={(value) => [value, '@艾特次数']}
                  />
                  <Bar dataKey="mentions" fill="var(--chart-5)" radius={2} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
