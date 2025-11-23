import { CORS_ORIGINS } from "@/config/constants";
// 验证来源是否在白名单中
export const isAllowedOrigin = (origin: string) => {
  return CORS_ORIGINS.includes(origin);
};
// 提取公共的 CORS 头生成函数
export const getCORSHeaders = (origin: string) => {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
};
// 封装CORS请求
export const handleCORS = (origin: string) => {
  return new Response(null, {
    status: 204,
    headers: {
      ...getCORSHeaders(origin),
    },
  });
};
