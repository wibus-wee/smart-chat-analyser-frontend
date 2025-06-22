# 聊天记录分析器 API 文档

## 基础信息

- **服务地址**: `http://localhost:6142`
- **API版本**: `v1`
- **基础路径**: `/api/v1`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证

当前版本无需认证，所有接口均为公开访问。

## 通用响应格式

### 成功响应
```json
{
  "status": "success",
  "data": {...},
  "timestamp": "2025-06-21T23:39:34.171637"
}
```

### 错误响应
```json
{
  "error": "错误描述",
  "timestamp": "2025-06-21T23:39:34.171637"
}
```

## API 接口列表

### 1. 系统状态

#### 1.1 健康检查
- **路径**: `GET /api/v1/health`
- **描述**: 检查服务健康状态
- **参数**: 无
- **响应示例**:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-21T23:39:34.171637",
  "version": "1.0.0",
  "services": {
    "task_queue": true,
    "model_manager": true,
    "preprocessing_service": true,
    "analysis_service": true,
    "visualization_service": true
  }
}
```

#### 1.2 系统统计信息
- **路径**: `GET /api/v1/system/stats`
- **描述**: 获取系统各服务的统计信息
- **参数**: 无
- **响应示例**:
```json
{
  "task_queue": {
    "pending_tasks": 0,
    "running_tasks": 0,
    "completed_tasks": 5,
    "failed_tasks": 0
  },
  "model_manager": {
    "loaded_models": ["sentiment_model"],
    "memory_usage": "256MB"
  },
  "analysis_service": {...},
  "preprocessing_service": {...},
  "visualization_service": {...},
  "timestamp": "2025-06-21T23:39:34.171637"
}
```

#### 1.3 队列统计信息
- **路径**: `GET /api/v1/queue/stats`
- **描述**: 获取任务队列和模型的统计信息
- **参数**: 无
- **响应示例**:
```json
{
  "queue": {
    "pending_tasks": 0,
    "running_tasks": 1,
    "completed_tasks": 10
  },
  "models": {
    "loaded_models": ["sentiment_model"],
    "cache_size": "512MB"
  },
  "timestamp": "2025-06-21T23:39:34.171637"
}
```

### 2. 任务管理

#### 2.1 提交分析任务
- **路径**: `POST /api/v1/tasks`
- **描述**: 提交聊天记录分析任务
- **请求体**:
```json
{
  "task_type": "chatlog_analysis",
  "task_data": {
    "talker": "某个聊天对象",
    "days": 30,
    "limit": 1000,
    "analyzers": ["word_frequency", "sentiment", "time_pattern", "social_network"]
  }
}
```

**参数说明**:
- `task_type`: 任务类型，目前支持 `chatlog_analysis`
- `task_data.talker`: 聊天对象标识（可选，与limit二选一）
- `task_data.days`: 分析天数，默认30天（可选）
- `task_data.limit`: 记录数量限制（可选，与talker二选一）
- `task_data.analyzers`: 分析器列表（可选，默认全部）

**响应示例**:
```json
{
  "task_id": "task_12345678-1234-1234-1234-123456789abc",
  "status": "submitted",
  "message": "任务已提交",
  "task_type": "chatlog_analysis",
  "submitted_at": "2025-06-21T23:39:34.171637"
}
```

#### 2.2 获取任务状态
- **路径**: `GET /api/v1/tasks/{task_id}`
- **描述**: 获取指定任务的状态信息
- **路径参数**:
  - `task_id`: 任务ID
- **响应示例**:
```json
{
  "task_id": "task_12345678-1234-1234-1234-123456789abc",
  "status": "running",
  "progress": 65,
  "message": "正在进行情感分析...",
  "submitted_at": "2025-06-21T23:39:34.171637",
  "started_at": "2025-06-21T23:39:35.171637",
  "completed_at": null,
  "task_type": "chatlog_analysis",
  "task_data": {...}
}
```

**状态值说明**:
- `pending`: 等待中
- `running`: 运行中
- `completed`: 已完成
- `failed`: 失败
- `cancelled`: 已取消

#### 2.3 获取任务结果
- **路径**: `GET /api/v1/tasks/{task_id}/result`
- **描述**: 获取已完成任务的分析结果
- **路径参数**:
  - `task_id`: 任务ID
- **响应示例**:
```json
{
  "task_id": "task_12345678-1234-1234-1234-123456789abc",
  "status": "completed",
  "result": {
    "word_frequency": {
      "chart_data": {...},
      "summary": {...}
    },
    "sentiment": {
      "chart_data": {...},
      "summary": {...}
    },
    "time_pattern": {
      "chart_data": {...},
      "summary": {...}
    },
    "social_network": {
      "chart_data": {...},
      "summary": {...}
    }
  },
  "completed_at": "2025-06-21T23:45:34.171637"
}
```

#### 2.4 取消任务
- **路径**: `POST /api/v1/tasks/{task_id}/cancel`
- **描述**: 取消指定的任务
- **路径参数**:
  - `task_id`: 任务ID
- **响应示例**:
```json
{
  "task_id": "task_12345678-1234-1234-1234-123456789abc",
  "status": "cancelled",
  "message": "任务已取消"
}
```

### 3. 分析器管理

#### 3.1 获取可用分析器列表
- **路径**: `GET /api/v1/analyzers`
- **描述**: 获取所有可用的分析器
- **参数**: 无
- **响应示例**:
```json
{
  "analyzers": ["word_frequency", "sentiment", "time_pattern", "social_network"],
  "analyzer_info": {
    "word_frequency": {
      "name": "词频分析",
      "description": "分析聊天记录中的词频分布",
      "version": "1.0.0"
    },
    "sentiment": {
      "name": "情感分析", 
      "description": "分析聊天记录的情感倾向",
      "version": "1.0.0"
    },
    "time_pattern": {
      "name": "时间模式分析",
      "description": "分析聊天的时间分布模式",
      "version": "1.0.0"
    },
    "social_network": {
      "name": "社交网络分析",
      "description": "分析聊天中的社交关系",
      "version": "1.0.0"
    }
  },
  "total_count": 4
}
```

#### 3.2 获取特定分析器信息
- **路径**: `GET /api/v1/analyzers/{analyzer_name}`
- **描述**: 获取指定分析器的详细信息
- **路径参数**:
  - `analyzer_name`: 分析器名称
- **响应示例**:
```json
{
  "name": "词频分析",
  "description": "分析聊天记录中的词频分布，支持中文分词和停用词过滤",
  "version": "1.0.0",
  "parameters": {
    "top_k": "返回前K个高频词，默认50",
    "min_freq": "最小词频阈值，默认2"
  },
  "output_format": {
    "chart_data": "图表数据格式",
    "summary": "分析摘要"
  }
}
```

### 4. 模型管理

#### 4.1 获取模型信息
- **路径**: `GET /api/v1/models/info`
- **描述**: 获取当前加载的模型信息
- **参数**: 无
- **响应示例**:
```json
{
  "loaded_models": [],
  "memory_usage": {
    "rss": "24.72 MB",
    "vms": "402446.58 MB"
  },
  "model_count": 0
}
```

#### 4.2 清除模型缓存
- **路径**: `POST /api/v1/models/clear`
- **描述**: 清除指定或全部模型缓存
- **请求体**:
```json
{
  "model_key": "sentiment_model"
}
```

**参数说明**:
- `model_key`: 要清除的模型键名（可选，不提供则清除全部）

**响应示例**:
```json
{
  "message": "已清除模型: sentiment_model",
  "timestamp": "2025-06-21T23:39:34.171637"
}
```

## WebSocket 实时通信

### 连接地址
`ws://localhost:6142/socket.io/`

### 事件列表

#### 客户端发送事件
- `subscribe_task`: 订阅任务进度更新
  ```json
  {"task_id": "task_12345678-1234-1234-1234-123456789abc"}
  ```

- `unsubscribe_task`: 取消订阅任务
  ```json
  {"task_id": "task_12345678-1234-1234-1234-123456789abc"}
  ```

#### 服务端推送事件
- `connected`: 连接成功
- `task_progress`: 任务进度更新
- `task_completed`: 任务完成通知

## 错误码说明

| HTTP状态码 | 错误类型 | 说明 |
|-----------|---------|------|
| 400 | Bad Request | 请求参数错误 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

## 使用示例

### Python 客户端示例
```python
import requests

# 1. 健康检查
response = requests.get('http://localhost:6142/api/v1/health')
print(response.json())

# 2. 提交任务
task_data = {
    'task_type': 'chatlog_analysis',
    'task_data': {
        'limit': 100,
        'analyzers': ['word_frequency', 'sentiment']
    }
}
response = requests.post('http://localhost:6142/api/v1/tasks', json=task_data)
task_id = response.json()['task_id']

# 3. 查询任务状态
response = requests.get(f'http://localhost:6142/api/v1/tasks/{task_id}')
print(response.json())

# 4. 获取结果
response = requests.get(f'http://localhost:6142/api/v1/tasks/{task_id}/result')
print(response.json())
```

### cURL 示例
```bash
# 健康检查
curl http://localhost:6142/api/v1/health

# 提交任务
curl -X POST http://localhost:6142/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "chatlog_analysis",
    "task_data": {
      "limit": 100,
      "analyzers": ["word_frequency", "sentiment"]
    }
  }'

# 查询任务状态
curl http://localhost:6142/api/v1/tasks/{task_id}

# 获取任务结果
curl http://localhost:6142/api/v1/tasks/{task_id}/result
```

## 分析器详细说明

### 1. 词频分析器 (word_frequency)
- **功能**: 分析聊天记录中的词频分布
- **特性**:
  - 中文分词支持
  - 停用词过滤
  - 词频统计和排序
- **输出**: 词云图数据、高频词列表

### 2. 情感分析器 (sentiment)
- **功能**: 分析聊天记录的情感倾向
- **模型**: RoBERTa中文情感分析模型
- **特性**:
  - 支持正面、负面、中性情感分类
  - 情感强度评分
- **输出**: 情感分布图、情感趋势图

### 3. 时间模式分析器 (time_pattern)
- **功能**: 分析聊天的时间分布模式
- **特性**:
  - 按小时、星期、月份统计
  - 活跃时段识别
- **输出**: 时间热力图、活跃度曲线

### 4. 社交网络分析器 (social_network)
- **功能**: 分析聊天中的社交关系
- **特性**:
  - 互动频率统计
  - 关系强度计算
- **输出**: 社交网络图、关系矩阵

## 数据格式说明

### 聊天记录格式
```json
{
  "id": "消息ID",
  "timestamp": "2025-06-21T23:39:34.171637",
  "talker": "发送者标识",
  "content": "消息内容",
  "type": "text",
  "metadata": {
    "platform": "微信/QQ等",
    "group_id": "群组ID（如果是群聊）"
  }
}
```

### 分析结果格式
```json
{
  "analyzer_name": {
    "chart_data": {
      "type": "图表类型",
      "data": "图表数据",
      "options": "图表配置"
    },
    "summary": {
      "total_messages": 1000,
      "date_range": "2025-05-22 ~ 2025-06-21",
      "key_insights": ["关键发现1", "关键发现2"]
    },
    "metadata": {
      "analyzer_version": "1.0.0",
      "processing_time": 5.2,
      "data_quality": "high"
    }
  }
}
```

## 配置说明

### 环境变量
- `DEBUG`: 调试模式 (true/false)
- `HOST`: 服务主机地址 (默认: 0.0.0.0)
- `PORT`: 服务端口 (默认: 6142)
- `REDIS_URL`: Redis连接地址 (默认: redis://localhost:6379/0)
- `CHATLOG_API_URL`: 聊天记录API地址 (默认: http://127.0.0.1:5030)
- `MODEL_CACHE_DIR`: 模型缓存目录 (默认: ./models)
- `CHARTS_OUTPUT_DIR`: 图表输出目录 (默认: ./charts)

### 性能配置
- `TASK_QUEUE_MAX_WORKERS`: 任务队列最大工作线程数 (默认: 4)
- `ANALYSIS_MAX_WORKERS`: 分析服务最大工作线程数 (默认: 4)
- `PREPROCESSING_MAX_WORKERS`: 预处理服务最大工作线程数 (默认: 4)

## 常见问题

### Q: 任务提交后一直处于pending状态？
A: 检查Redis服务是否正常运行，确保任务队列工作线程已启动。

### Q: 情感分析模型加载失败？
A: 确保网络连接正常，模型会自动从HuggingFace下载。首次使用需要较长时间。

### Q: 聊天记录API连接失败？
A: 检查CHATLOG_API_URL配置是否正确，确保聊天记录服务正在运行。

### Q: 内存使用过高？
A: 可以通过`POST /api/v1/models/clear`接口清除模型缓存，或调整工作线程数量。

## 更新日志

### v1.0.0 (2025-06-21)
- 初始版本发布
- 支持4种基础分析器
- 完整的REST API
- WebSocket实时通信
- 任务队列和模型管理
