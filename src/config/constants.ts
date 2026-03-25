// 时间单位常量
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
// CORS 白名单
const CORS_ORIGINS = [
  "https://weatherv1.chauncey.work",
  "https://weatherv2.chauncey.work",
  "https://weatherv3.chauncey.work",
  "https://weatherv4.chauncey.work",
  "https://weather-api.chauncey.work",
];
// n8n 接口网址
const N8N_BASE_URL = "https://n8n.chauncey.work/webhook";
export { MINUTE, HOUR, DAY, CORS_ORIGINS, N8N_BASE_URL };
