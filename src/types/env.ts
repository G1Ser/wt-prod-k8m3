/**
 * 环境变量类型定义
 */

export interface Env {
  // API Keys
  AMAP_KEY: string;
  BMAP_KEY: string;
  // Cloudflare KV 存储
  CACHE: KVNamespace;
}
