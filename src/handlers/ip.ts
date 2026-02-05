import type { Env } from "@/types/env";
import { IP_BASE_URL, IP_CACHE_TTL } from "@/config/providers/ip";
import { createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
export const handleIPQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const IP = request.headers.get("CF-Connecting-IP");
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "zh-CN";
  const cacheKey = `ip:${IP}:${lang}`;
  const cacheTtl = IP_CACHE_TTL.IP;
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(`${IP_BASE_URL}?lang=${lang}&ip=${IP}`);
  const data = await response.text();
  // 存储进缓存
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
};
