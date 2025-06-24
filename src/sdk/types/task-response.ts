import * as z from "zod";

export const AnalysisResultsMetadataSchema = z.object({
    "analysis_completed_at": z.coerce.date(),
    "analyzers_used": z.array(z.string()),
    "data_count": z.number(),
    "processing_method": z.string(),
});
export type AnalysisResultsMetadata = z.infer<typeof AnalysisResultsMetadataSchema>;

export const ConfidenceHistogramSchema = z.object({
    "bins": z.array(z.string()),
    "counts": z.array(z.number()),
});
export type ConfidenceHistogram = z.infer<typeof ConfidenceHistogramSchema>;

export const SentimentPieSchema = z.object({
    "colors": z.array(z.string()),
    "labels": z.array(z.string()),
    "values": z.array(z.number()),
});
export type SentimentPie = z.infer<typeof SentimentPieSchema>;

export const SentimentRangeSchema = z.object({
    "max": z.number(),
    "min": z.number(),
});
export type SentimentRange = z.infer<typeof SentimentRangeSchema>;

export const TimeSeriesSchema = z.object({
    "confidence": z.array(z.number()),
    "sentiment": z.array(z.number()),
    "x": z.array(z.number()),
});
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

export const DetailedResultSchema = z.object({
    "confidence": z.number(),
    "content": z.string(),
    "method": z.string(), // Was TypeSchema
    "score": z.number(),
    "sentiment": z.string(), // Was SentimentEnumSchema
    "time": z.coerce.date(),
});
export type DetailedResult = z.infer<typeof DetailedResultSchema>;

export const ExecutionInfoSchema = z.object({
    "analyzer_name": z.string(),
    "data_count": z.number(),
    "end_time": z.coerce.date(),
    "execution_time_seconds": z.number(),
    "start_time": z.coerce.date(),
});
export type ExecutionInfo = z.infer<typeof ExecutionInfoSchema>;

const ModelInfoSchema = z.object({
    "model_name": z.string(),
    "type": z.string(), // Was TypeSchema
});

export const SentimentSchema = z.object({
    "negative": z.number(),
    "neutral": z.number(),
    "positive": z.number(),
});
export type Sentiment = z.infer<typeof SentimentSchema>;

export const SentimentTrendSchema = z.object({
    "change_rate": z.number(),
    "confidence_change": z.number(),
    "confidence_trend": z.string(),
    "first_half_avg": z.number(),
    "first_half_confidence": z.number(),
    "second_half_avg": z.number(),
    "second_half_confidence": z.number(),
    "trend": z.string(),
});
export type SentimentTrend = z.infer<typeof SentimentTrendSchema>;

export const CentralityMetricsSchema = z.object({
    "betweenness_centrality": z.record(z.string(), z.number()),
    "closeness_centrality": z.record(z.string(), z.number()),
    "degree_centrality": z.record(z.string(), z.number()),
    "eigenvector_centrality": z.record(z.string(), z.number()),
    "in_degree_centrality": z.record(z.string(), z.number()),
    "out_degree_centrality": z.record(z.string(), z.number()),
    "pagerank": z.record(z.string(), z.number()),
    "top_betweenness": z.array(z.tuple([z.string(), z.number()])),
    "top_closeness": z.array(z.tuple([z.string(), z.number()])),
    "top_degree": z.array(z.tuple([z.string(), z.number()])),
    "top_pagerank": z.array(z.tuple([z.string(), z.number()])),
});
export type CentralityMetrics = z.infer<typeof CentralityMetricsSchema>;

export const CommunitySchema = z.object({
    "message_count": z.number(),
    "user_id": z.string(), // Was UserIdSchema
    "user_name": z.string(),
});
export type Community = z.infer<typeof CommunitySchema>;

export const StrongestInteractionSchema = z.object({
    "from": z.string(), // Was UserNameSchema
    "interaction_count": z.number(),
    "mention_count": z.number(),
    "reply_count": z.number(),
    "to": z.string(),
    "weight": z.number(),
});
export type StrongestInteraction = z.infer<typeof StrongestInteractionSchema>;

export const BridgePlayerSchema = z.object({
    "score": z.number(),
    "user_id": z.string(), // Was UserIdSchema
    "user_name": z.string(), // Was UserNameSchema
});
export type BridgePlayer = z.infer<typeof BridgePlayerSchema>;

export const NetworkStructureSchema = z.object({
    "avg_degree": z.number(),
    "avg_path_length": z.number(),
    "clustering_coefficient": z.number(),
    "degree_distribution": z.array(z.number()),
    "density": z.number(),
    "is_connected": z.boolean(),
    "largest_component_size": z.number(),
    "max_degree": z.number(),
    "min_degree": z.number(),
    "num_components": z.number(),
    "num_edges": z.number(),
    "num_nodes": z.number(),
});
export type NetworkStructure = z.infer<typeof NetworkStructureSchema>;

export const UserStatSchema = z.object({
    "avg_message_length": z.number(),
    "in_degree": z.number(),
    "message_count": z.number(),
    "out_degree": z.number(),
    "total_degree": z.number(),
});
export type UserStat = z.infer<typeof UserStatSchema>;

export const VisualizationDataCommunitiesSchema = z.any().optional().describe("Flexible schema for community visualization data");
export type VisualizationDataCommunities = z.infer<typeof VisualizationDataCommunitiesSchema>;

export const EdgeSchema = z.object({
    "interaction_count": z.number(),
    "source": z.string(), // Was UserIdSchema
    "target": z.string(), // Was UserIdSchema
    "weight": z.number(),
    "width": z.number(),
});
export type Edge = z.infer<typeof EdgeSchema>;

export const VisualizationEdgeSchema = z.object({
    "source": z.string(),
    "target": z.string(),
    "weight": z.number(),
    "interaction_count": z.number(),
    "width": z.number(),
    // 新增字段
    "reply_count": z.number(),
    "mention_count": z.number(),
    "mentioned_users": z.array(z.string()),
    "has_mentions": z.boolean(),
});
export type VisualizationEdge = z.infer<typeof VisualizationEdgeSchema>;

export const LayoutSuggestionsSchema = z.object({
    "circular": z.string(),
    "kamada_kawai": z.string(),
    "spring": z.string(),
});
export type LayoutSuggestions = z.infer<typeof LayoutSuggestionsSchema>;

export const NodeSchema = z.object({
    "id": z.string(), // Was UserIdSchema
    "in_degree": z.number(),
    "message_count": z.number(),
    "name": z.string(),
    "out_degree": z.number(),
    "size": z.number(),
});
export type Node = z.infer<typeof NodeSchema>;

export const VisualizationNodeSchema = z.object({
    "id": z.string(),
    "in_degree": z.number(),
    "message_count": z.number(),
    "name": z.string(),
    "out_degree": z.number(),
    "size": z.number(),
});
export type VisualizationNode = z.infer<typeof VisualizationNodeSchema>;

export const MentionNetworkSchema = z.object({
    "has_mentions": z.boolean(),
    "total_mentions": z.number(),
    "unique_mentioned_users": z.number(),
    "top_mentioned_users": z.array(z.tuple([z.string(), z.number()])),
    "mention_edges": z.array(z.object({
        "from": z.string(),
        "to": z.string(),
        "mentioned_users": z.array(z.string()),
        "mention_count": z.number(),
    })),
    "mention_patterns": z.object({
        "top_mentioners": z.array(z.tuple([z.string(), z.number()])),
        "mention_reciprocity_rate": z.number(),
        "total_mention_relationships": z.number(),
        "mutual_mention_relationships": z.number(),
    }),
    "mention_graph_stats": z.object({
        "nodes": z.number(),
        "edges": z.number(),
        "density": z.number(),
    }),
});
export type MentionNetwork = z.infer<typeof MentionNetworkSchema>;

export const PeriodDistributionSchema = z.object({
    "上午": z.number(),
    "下午": z.number(),
    "凌晨": z.number(),
    "晚上": z.number(),
});
export type PeriodDistribution = z.infer<typeof PeriodDistributionSchema>;

export const ActivityIntensitySchema = z.object({
    "active_hours_total": z.number(),
    "activity_concentration_gini": z.number(),
    "activity_ratio": z.number(),
    "burst_periods_count": z.number(),
    "hourly_average": z.number(),
    "hourly_std": z.number(),
    "intensity_level": z.string(),
    "max_hourly_messages": z.number(),
    "min_hourly_messages": z.number(),
});
export type ActivityIntensity = z.infer<typeof ActivityIntensitySchema>;

export const IqrBoundsSchema = z.object({
    "lower": z.number(),
    "upper": z.number(),
});
export type IqrBounds = z.infer<typeof IqrBoundsSchema>;

export const IntervalStatsSchema = z.object({
    "average_interval": z.number(),
    "max_interval": z.number(),
    "median_interval": z.number(),
    "min_interval": z.number(),
});
export type IntervalStats = z.infer<typeof IntervalStatsSchema>;

export const MinuteAnalysisSchema = z.object({
    "minute_distribution": z.record(z.string(), z.number()),
    "minute_variation_coefficient": z.number(),
    "round_minute_preference": z.boolean(),
    "round_minute_ratio": z.number(),
    "top_minutes": z.array(z.array(z.number())),
    "total_unique_minutes": z.number(),
});
export type MinuteAnalysis = z.infer<typeof MinuteAnalysisSchema>;

export const DecompositionSchema = z.object({
    "residual_strength": z.number(),
    "seasonal_strength": z.number(),
    "trend_strength": z.number(),
});
export type Decomposition = z.infer<typeof DecompositionSchema>;

export const StatisticalAnalysisSchema = z.object({
    "chi2_p_value": z.number(),
    "coefficient_of_variation": z.number(),
    "concentration_ratio": z.number(),
    "distribution_type": z.string(),
    "entropy": z.number(),
    "is_uniform": z.boolean(),
    "kurtosis": z.number(),
    "normalized_entropy": z.number(),
    "shapiro_p_value": z.number(),
    "skewness": z.number(),
    "variance": z.number(),
});
export type StatisticalAnalysis = z.infer<typeof StatisticalAnalysisSchema>;

export const TimeSpanSchema = z.object({
    "duration_days": z.number(),
    "end": z.coerce.date(),
    "start": z.coerce.date(),
});
export type TimeSpan = z.infer<typeof TimeSpanSchema>;

export const TrendAnalysisSchema = z.object({
    "change_rate_percent": z.number(),
    "correlation": z.number(),
    "daily_average": z.number(),
    "daily_std": z.number(),
    "p_value": z.number(),
    "slope": z.number(),
    "trend": z.string(),
});
export type TrendAnalysis = z.infer<typeof TrendAnalysisSchema>;

export const WeeklyDistributionSchema = z.object({
    "周一": z.number().optional(),
    "周三": z.number().optional(),
    "周二": z.number().optional(),
    "周五": z.number().optional(),
    "周六": z.number().optional(),
    "周四": z.number().optional(),
    "周日": z.number().optional(),
});
export type WeeklyDistribution = z.infer<typeof WeeklyDistributionSchema>;

export const WordByTypeSchema = z.object({
    "english": z.array(z.tuple([z.string(), z.number()])),
    "long_words": z.array(z.tuple([z.string(), z.number()])),
    "medium_words": z.array(z.tuple([z.string(), z.number()])),
    "numbers": z.array(z.any()).optional(),
    "short_words": z.array(z.tuple([z.string(), z.number()])),
});
export type WordByType = z.infer<typeof WordByTypeSchema>;

export const ColorsSchema = z.object({
    "中性": z.string(),
    "消极": z.string(),
    "积极": z.string(),
});
export type Colors = z.infer<typeof ColorsSchema>;

export const AxisSchema = z.object({
    "title": z.string(),
});
export type Axis = z.infer<typeof AxisSchema>;

export const SentimentDataSchema = z.object({
    "labels": z.array(z.string()).optional(),
    "type": z.string(),
    "values": z.array(z.number()).optional(),
    "x": z.array(z.string()).optional(),
    "y": z.array(z.number()).optional(),
});
export type SentimentData = z.infer<typeof SentimentDataSchema>;

export const SentimentMetadataSchema = z.object({
    "chart_version": z.string(),
    "created_at": z.coerce.date(),
    "data_points": z.number(),
});
export type SentimentMetadata = z.infer<typeof SentimentMetadataSchema>;

export const SocialNetworkConfigSchema = z.object({
    "edge_width_field": z.string().optional(),
    "layout": z.string().optional(),
    "node_size_field": z.string().optional(),
    "show_labels": z.boolean().optional(),
    "orientation": z.string().optional(),
    "xaxis": AxisSchema.optional(),
    "yaxis": AxisSchema.optional(),
});
export type SocialNetworkConfig = z.infer<typeof SocialNetworkConfigSchema>;

export const SocialNetworkDataSchema = z.object({
    "edges": z.array(EdgeSchema).optional(),
    "nodes": z.array(NodeSchema).optional(),
    "type": z.string(),
    "labels": z.array(z.string()).optional(), // Was array of UserIdSchema
    "values": z.array(z.number()).optional(),
});
export type SocialNetworkData = z.infer<typeof SocialNetworkDataSchema>;

export const WordFrequencyConfigSchema = z.object({
    "color_scheme": z.string().optional(),
    "xaxis": AxisSchema.optional(),
    "yaxis": AxisSchema.optional(),
    "font_family": z.string().optional(),
    "max_words": z.number().optional(),
    "hole": z.number().optional(),
    "show_legend": z.boolean().optional(),
});
export type WordFrequencyConfig = z.infer<typeof WordFrequencyConfigSchema>;

export const WordSchema = z.object({
    "size": z.number(),
    "text": z.string(),
});
export type Word = z.infer<typeof WordSchema>;

export const ResultMetadataSchema = z.object({
    "analyzers_used": z.array(z.string()),
    "completed_at": z.coerce.date(),
    "data_count": z.number(),
    "task_id": z.string(),
});
export type ResultMetadata = z.infer<typeof ResultMetadataSchema>;

export const SummaryStatsSchema = z.object({
    "avg_confidence": z.string(),
    "avg_sentiment": z.string(),
    "sentiment_range": SentimentRangeSchema,
    "total_messages": z.number(),
});
export type SummaryStats = z.infer<typeof SummaryStatsSchema>;

export const SocialNetworkCommunitiesSchema = z.object({
    "communities": z.record(z.string(), z.array(CommunitySchema)),
    "community_sizes": z.array(z.number()),
    "modularity": z.number(),
    "num_communities": z.number(),
    "partition": z.record(z.string(), z.number()),
    "sorted_communities": z.array(z.tuple([z.number(), z.array(CommunitySchema)])),
});
export type SocialNetworkCommunities = z.infer<typeof SocialNetworkCommunitiesSchema>;

export const InteractionAnalysisSchema = z.object({
    "avg_interaction_count": z.number(),
    "avg_interaction_strength": z.number(),
    "max_interaction_strength": z.number(),
    "min_interaction_strength": z.number(),
    "strongest_interactions": z.array(StrongestInteractionSchema),
    "total_interaction_count": z.number(),
});
export type InteractionAnalysis = z.infer<typeof InteractionAnalysisSchema>;

export const KeyPlayersSchema = z.object({
    "bridge_player": BridgePlayerSchema,
    "most_active_initiator": BridgePlayerSchema,
    "most_connected": BridgePlayerSchema,
    "most_influential": BridgePlayerSchema,
    "most_popular": BridgePlayerSchema,
});
export type KeyPlayers = z.infer<typeof KeyPlayersSchema>;

export const UserActivitySchema = z.object({
    "top_active_users": z.array(z.tuple([z.string(), UserStatSchema])), // First element was UserIdSchema
    "total_users": z.number(),
    "user_stats": z.record(z.string(), UserStatSchema),
});
export type UserActivity = z.infer<typeof UserActivitySchema>;

export const VisualizationDataSchema = z.object({
    "nodes": z.array(VisualizationNodeSchema),
    "edges": z.array(VisualizationEdgeSchema),
    "communities": z.object({}),
    // 新增@艾特网络可视化数据
    "mention_network": z.object({
        "has_data": z.boolean(),
        "nodes": z.array(z.object({
            "id": z.string(),
            "name": z.string(),
            "mentioned_count": z.number(),
            "mentioning_count": z.number(),
            "size": z.number(),
            "color": z.string(),
        })),
        "edges": z.array(z.object({
            "source": z.string(),
            "target": z.string(),
            "mention_count": z.number(),
            "mentioned_users": z.array(z.string()),
            "width": z.number(),
            "color": z.string(),
        })),
        "mention_matrix": z.record(z.number()),
        "total_mention_edges": z.number(),
        "total_mention_nodes": z.number(),
    }),
    "layout_suggestions": z.object({
        "spring": z.string(),
        "circular": z.string(),
        "kamada_kawai": z.string(),
    }),
});
export type VisualizationData = z.infer<typeof VisualizationDataSchema>;

export const ActivePeriodsSchema = z.object({
    "most_active_period": z.tuple([z.string(), z.number()]),
    "period_distribution": PeriodDistributionSchema,
});
export type ActivePeriods = z.infer<typeof ActivePeriodsSchema>;

export const AnomalyDetectionSchema = z.object({
    "anomalies_detected": z.boolean(),
    "anomaly_count": z.number(),
    "anomaly_timestamps": z.array(z.string()),
    "consecutive_high_periods": z.array(z.number()),
    "consecutive_low_periods": z.array(z.number()),
    "iqr_bounds": IqrBoundsSchema,
    "z_score_anomaly_count": z.number(),
});
export type AnomalyDetection = z.infer<typeof AnomalyDetectionSchema>;

export const PeriodicityAnalysisSchema = z.object({
    "daily_pattern_p_value": z.number(),
    "daily_variation_coefficient": z.number(),
    "decomposition": DecompositionSchema,
    "has_daily_pattern": z.boolean(),
    "has_weekly_pattern": z.boolean(),
    "hourly_peak_hours": z.array(z.number()),
    "weekly_pattern_p_value": z.number(),
    "weekly_peak_days": z.array(z.number()),
    "weekly_variation_coefficient": z.number(),
});
export type PeriodicityAnalysis = z.infer<typeof PeriodicityAnalysisSchema>;

export const AnalysisResultsWordFrequencySchema = z.object({
    "execution_info": ExecutionInfoSchema,
    "top_phrases": z.array(z.tuple([z.string(), z.number()])),
    "top_words": z.array(z.tuple([z.string(), z.number()])),
    "total_words": z.number(),
    "unique_words": z.number(),
    "word_by_type": WordByTypeSchema,
    "word_frequency_distribution": z.record(z.string(), z.number()),
});
export type AnalysisResultsWordFrequency = z.infer<typeof AnalysisResultsWordFrequencySchema>;

export const SentimentConfigSchema = z.object({
    "colors": ColorsSchema.optional(),
    "show_legend": z.boolean().optional(),
    "line_color": z.string().optional(),
    "xaxis": AxisSchema.optional(),
    "yaxis": AxisSchema.optional(),
});
export type SentimentConfig = z.infer<typeof SentimentConfigSchema>;

export const SocialNetworkElementSchema = z.object({
    "chart_id": z.string(),
    "chart_type": z.string(),
    "config": SocialNetworkConfigSchema,
    "data": SocialNetworkDataSchema,
    "metadata": SentimentMetadataSchema,
    "title": z.string(),
});
export type SocialNetworkElement = z.infer<typeof SocialNetworkElementSchema>;

export const WordFrequencyDataSchema = z.object({
    "labels": z.array(z.string()).optional(),
    "type": z.string(),
    "values": z.array(z.number()).optional(),
    "words": z.array(WordSchema).optional(),
});
export type WordFrequencyData = z.infer<typeof WordFrequencyDataSchema>;

export const SentimentChartDataSchema = z.object({
    "confidence_histogram": ConfidenceHistogramSchema,
    "sentiment_pie": SentimentPieSchema,
    "summary_stats": SummaryStatsSchema,
    "time_series": TimeSeriesSchema,
});
export type SentimentChartData = z.infer<typeof SentimentChartDataSchema>;

export const AnalysisResultsSocialNetworkSchema = z.object({
    "centrality_metrics": CentralityMetricsSchema,
    "communities": SocialNetworkCommunitiesSchema,
    "execution_info": ExecutionInfoSchema,
    "interaction_analysis": InteractionAnalysisSchema,
    "key_players": KeyPlayersSchema,
    "network_structure": NetworkStructureSchema,
    "total_interactions": z.number(),
    "total_messages": z.number(),
    "total_users": z.number(),
    "user_activity": UserActivitySchema,
    "visualization_data": VisualizationDataSchema,
    "mention_network": MentionNetworkSchema,  // 新增字段
});
export type AnalysisResultsSocialNetwork = z.infer<typeof AnalysisResultsSocialNetworkSchema>;

export const TimePatternSchema = z.object({
    "active_periods": ActivePeriodsSchema,
    "activity_intensity": ActivityIntensitySchema,
    "anomaly_detection": AnomalyDetectionSchema,
    "daily_distribution": z.record(z.string(), z.number()),
    "execution_info": ExecutionInfoSchema,
    "hourly_distribution": z.record(z.string(), z.number()),
    "interval_stats": IntervalStatsSchema,
    "minute_analysis": MinuteAnalysisSchema,
    "peak_days": z.array(z.tuple([z.string(), z.number()])),
    "peak_hours": z.array(z.array(z.number())),
    "periodicity_analysis": PeriodicityAnalysisSchema,
    "statistical_analysis": StatisticalAnalysisSchema,
    "time_span": TimeSpanSchema,
    "total_messages": z.number(),
    "trend_analysis": TrendAnalysisSchema,
    "weekly_distribution": WeeklyDistributionSchema,
});
export type TimePattern = z.infer<typeof TimePatternSchema>;

export const SentimentElementSchema = z.object({
    "chart_id": z.string(),
    "chart_type": z.string(),
    "config": SentimentConfigSchema,
    "data": SentimentDataSchema,
    "metadata": SentimentMetadataSchema,
    "title": z.string(),
});
export type SentimentElement = z.infer<typeof SentimentElementSchema>;

export const WordFrequencyElementSchema = z.object({
    "chart_id": z.string(),
    "chart_type": z.string(),
    "config": WordFrequencyConfigSchema,
    "data": WordFrequencyDataSchema,
    "metadata": SentimentMetadataSchema,
    "title": z.string(),
});
export type WordFrequencyElement = z.infer<typeof WordFrequencyElementSchema>;

export const AnalysisResultsSentimentSchema = z.object({
    "average_confidence": z.number(),
    "average_sentiment": z.number(),
    "chart_data": SentimentChartDataSchema,
    "detailed_results": z.array(DetailedResultSchema),
    "execution_info": ExecutionInfoSchema,
    "model_info": ModelInfoSchema,
    "sentiment_distribution": SentimentSchema,
    "sentiment_percentage": SentimentSchema,
    "sentiment_trend": SentimentTrendSchema,
    "top_negative_messages": z.array(z.any()).optional(),
    "top_positive_messages": z.array(z.any()).optional(),
    "total_messages": z.number(),
});
export type AnalysisResultsSentiment = z.infer<typeof AnalysisResultsSentimentSchema>;

export const ResultChartDataSchema = z.object({
    "sentiment": z.array(SentimentElementSchema).optional(),
    "social_network": z.array(SocialNetworkElementSchema).optional(),
    "word_frequency": z.array(WordFrequencyElementSchema).optional(),
});
export type ResultChartData = z.infer<typeof ResultChartDataSchema>;

export const AnalysisResultsSchema = z.object({
    "metadata": AnalysisResultsMetadataSchema,
    "sentiment": AnalysisResultsSentimentSchema.optional(),
    "social_network": AnalysisResultsSocialNetworkSchema.optional(),
    "time_pattern": TimePatternSchema.optional(),
    "word_frequency": AnalysisResultsWordFrequencySchema.optional(),
});
export type AnalysisResults = z.infer<typeof AnalysisResultsSchema>;

export const ResultSchema = z.object({
    "analysis_results": AnalysisResultsSchema,
    "chart_data": ResultChartDataSchema,
    "metadata": ResultMetadataSchema,
});
export type Result = z.infer<typeof ResultSchema>;

export const WelcomeSchema = z.object({
    "completed_at": z.coerce.date(),
    "created_at": z.coerce.date(),
    "error": z.string().nullable().optional(),
    "message": z.string(),
    "progress": z.number(),
    "result": ResultSchema,
    "started_at": z.coerce.date(),
    "status": z.string(),
    "task_id": z.string(),
    "task_type": z.string(),
});
export type Welcome = z.infer<typeof WelcomeSchema>;