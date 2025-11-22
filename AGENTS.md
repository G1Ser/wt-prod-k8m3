# 天气项目架构设计文档

### 文件目录结构

```
src/
├── index.ts                    # 主入口文件，Worker 的 fetch 处理器
├── config/
│   ├── constants.ts           # 常量配置（缓存时间等）
│   ├── routes.ts              # 路由映射配置
│   └── providers.ts           # API 提供商的基础配置（URL、key等）
├── handlers/
│   ├── index.ts               # 导出所有处理器
│   ├── ip.ts                  # IP 定位处理函数
│   ├── geocode.ts             # 地理编码处理函数
│   └── weather.ts             # 天气查询处理函数
├── providers/                  # API 提供商调用
│   ├── amap.ts                # 高德地图 API 调用
│   ├── baidu.ts               # 百度地图 API 调用
│   ├── qweather.ts            # 和风天气 API 调用
│   └── openweather.ts         # OpenWeather API 调用
├── utils/
│   ├── cors.ts                # CORS 处理工具
│   ├── cache.ts               # 缓存工具函数
│   └── response.ts            # 响应工具函数
└── types/
    ├── env.ts                 # 环境变量类型定义
    └── index.ts               # 导出所有类型
```

### 各模块职责

#### 1. **config/** - 配置管理

- **constants.ts**: 存放缓存时间、CORS 白名单等常量配置
- **routes.ts**: 路由映射配置，方便添加新的 API 路由
- **providers.ts**: 各个 API 提供商的基础信息（URL、默认参数等）

#### 2. **handlers/** - 请求处理层

- **ip.ts**: 处理 IP 定位请求，包括参数验证、缓存检查、调用对应的 provider
- **geocode.ts**: 处理地理编码请求
- **weather.ts**: 处理天气查询请求
- **index.ts**: 统一导出所有处理器

#### 3. **providers/** - API 调用层

- **amap.ts**: 高德地图 API 调用封装
- **baidu.ts**: 百度地图 API 调用封装
- **qweather.ts**: 和风天气 API 调用封装
- **openweather.ts**: OpenWeather API 调用封装

每个 provider 文件只负责：

- 构造请求 URL
- 调用第三方 API
- 返回原始数据（**不修改数据格式**）

#### 4. **utils/** - 工具函数

- **cors.ts**: CORS 相关的工具函数
- **cache.ts**: 缓存相关的工具函数（KV 存储操作）
- **response.ts**: 响应构造的工具函数

#### 5. **types/** - TypeScript 类型定义

- **env.ts**: 环境变量的类型定义
- **index.ts**: 导出所有类型定义

## 设计原则

### 1. **简单直接**

- 不引入复杂的抽象层和中间件
- 每个模块职责单一，逻辑清晰

### 2. **保持原始**

- **不修改第三方 API 的返回格式**
- 前端可以直接参考第三方 API 的官方文档
- 只做 key 隐藏和缓存，不做数据转换

### 3. **易于扩展**

要添加新的 API 提供商时，只需要：

1. 在 `providers/` 目录下添加新文件
2. 在 `config/providers.ts` 中添加配置
3. 在对应的 handler 中调用新的 provider

### 4. **专注核心功能**

- **隐藏 API key**: 在 `providers/` 中处理
- **增加缓存**: 在 `utils/cache.ts` 中统一处理
- **CORS 处理**: 在 `utils/cors.ts` 中统一处理

## 支持的 API 提供商

### 当前支持

- **高德地图**: IP 定位、地理编码、天气查询

### 计划支持

- **百度地图**: IP 定位、地理编码、天气查询
- **和风天气**: 天气查询
- **OpenWeather**: 天气查询

## 缓存策略

### 缓存时间配置

- **IP 定位**: KV 缓存 24 小时，浏览器缓存 1 小时
- **地理编码**: KV 缓存 30 天，浏览器缓存 1 天
- **天气查询**: KV 缓存 60 分钟，浏览器缓存 30 分钟

### 缓存键规则

- IP 定位: `ip:{IP地址}`
- 地理编码: `geocode:{地址}`
- 天气查询: `weather:{城市}:{扩展参数}`

## 环境变量

### 必需的环境变量

- `AMAP_KEY`: 高德地图 API Key
- `BAIDU_KEY`: 百度地图 API Key（计划）
- `QWEATHER_KEY`: 和风天气 API Key（计划）
- `OPENWEATHER_KEY`: OpenWeather API Key（计划）

### 可选的环境变量

- `CACHE`: Cloudflare KV 命名空间绑定

## API 路由

### 当前路由

- `GET /ip` - IP 定位查询
- `GET /geocode/geo` - 地理编码查询
- `GET /weather/weatherInfo` - 天气信息查询

### CORS 配置

- 允许的域名白名单在 `config/constants.ts` 中配置
- 支持 `GET` 和 `OPTIONS` 方法
