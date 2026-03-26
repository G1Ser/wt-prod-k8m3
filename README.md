# 天气预报后端项目（已归档 2026/3/26）

### 项目目录结构

```
src/
├── config/
│   ├── constants.ts           # 常量配置（缓存时间、路由映射）
│   ├── router.ts              # 全量后端接口路由
│   └── providers/             # API 提供商的基础配置
├── geojson/
│   └── map.json               # 中国行政边界数据
├── handlers/
│   ├── amap.ts                # 高度地图API
│   ├── bmap.ts                # 百度地图API
│   ├── geo.ts                 # 地理编码API（Neon数据库）
│   ├── ip.ts                  # 定位API（Neon数据库）
│   ├── qweather.ts            # 和风天气API
│   └── openweather.ts         # OpenWeatherAPI
├── types/
│   ├── env.ts                 # 环境变量类型
│   └── geo.ts                 # 地理编码类型
└── utils/
    ├── cors.ts                # CORS 处理工具
    ├── cache.ts               # 缓存工具函数
    ├── neon.ts                # 数据库函数
    └── response.ts            # 响应工具函数
```

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

1. 在 `handlers/` 目录下添加新文件
2. 在 `config/providers/` 目录下添加新文件

### 4. **专注核心功能**

- 隐藏 API key
- 增加缓存
- CORS 处理
