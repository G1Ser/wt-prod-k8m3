/**
 * 环境变量类型定义
 */

export interface Env {
  // API Keys
  IP_KEY: string;
  AMAP_KEY: string;
  BMAP_KEY: string;
  QWEATHER_KEY: string;
  OPENWEATHER_KEY: string;
  // Neon 数据库连接字符串
  NEON_DB_URL: string;
  // Cloudflare KV 存储
  CACHE: KVNamespace;
}
