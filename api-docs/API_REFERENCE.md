# API 快速参考

## 基础信息
- **Base URL**: `http://localhost:6142/api/v1`
- **Content-Type**: `application/json`

## 接口列表

### 系统状态
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/system/stats` | 系统统计 |
| GET | `/queue/stats` | 队列统计 |

### 任务管理
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/tasks` | 提交任务 |
| GET | `/tasks/{task_id}` | 查询任务状态 |
| GET | `/tasks/{task_id}/result` | 获取任务结果 |
| POST | `/tasks/{task_id}/cancel` | 取消任务 |

### 分析器管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/analyzers` | 获取分析器列表 |
| GET | `/analyzers/{name}` | 获取分析器信息 |

### 模型管理
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/models/info` | 获取模型信息 |
| POST | `/models/clear` | 清除模型缓存 |

## 快速示例

### 1. 提交分析任务
```bash
curl -X POST http://localhost:6142/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "chatlog_analysis",
    "task_data": {
      "limit": 100,
      "analyzers": ["word_frequency", "sentiment"]
    }
  }'
```

### 2. 查询任务状态
```bash
curl http://localhost:6142/api/v1/tasks/{task_id}
```

### 3. 获取分析结果
```bash
curl http://localhost:6142/api/v1/tasks/{task_id}/result
```

## 任务参数说明

### 基础参数
- `task_type`: 固定为 `"chatlog_analysis"`
- `task_data`: 任务配置对象

### task_data 参数
- `talker`: 聊天对象标识（与limit二选一）
- `days`: 分析天数，默认30天
- `limit`: 记录数量限制（与talker二选一）
- `analyzers`: 分析器列表，可选值：
  - `"word_frequency"`: 词频分析
  - `"sentiment"`: 情感分析  
  - `"time_pattern"`: 时间模式分析
  - `"social_network"`: 社交网络分析

## 任务状态
- `pending`: 等待中
- `running`: 运行中
- `completed`: 已完成
- `failed`: 失败
- `cancelled`: 已取消

## 错误码
- `400`: 请求参数错误
- `404`: 资源不存在
- `500`: 服务器内部错误

## WebSocket 事件
- **连接**: `ws://localhost:6142/socket.io/`
- **订阅任务**: `subscribe_task`
- **取消订阅**: `unsubscribe_task`
- **进度更新**: `task_progress`
- **任务完成**: `task_completed`

## Python 客户端示例
```python
import requests

# 提交任务
response = requests.post('http://localhost:6142/api/v1/tasks', json={
    'task_type': 'chatlog_analysis',
    'task_data': {
        'limit': 100,
        'analyzers': ['word_frequency', 'sentiment']
    }
})
task_id = response.json()['task_id']

# 查询状态
status = requests.get(f'http://localhost:6142/api/v1/tasks/{task_id}').json()

# 获取结果（任务完成后）
result = requests.get(f'http://localhost:6142/api/v1/tasks/{task_id}/result').json()
```
