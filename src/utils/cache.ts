import { Env } from "@/types/env";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
interface CacheTtlType {
  kv: number;
  browser: number;
}
export const getResponseData = async (
  env: Env,
  cacheKey: string,
  cacheTtl: CacheTtlType,
  fetchFn: () => Promise<Response>,
  origin: string,
  contentType?: string,
) => {
  // 检查是否有缓存
  const cacheData = contentType
    ? await env.CACHE.get(cacheKey, "arrayBuffer")
    : await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
      ...(contentType && { "Content-Type": contentType }),
    });
  }
  // 获取数据
  const response = await fetchFn();
  if (!response.ok) {
    const error = await response.text();
    return createErrorResponse("Failed to fetch data", error, response.status);
  }
  // 存储数据
  const data = contentType
    ? await response.arrayBuffer()
    : await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    ...(contentType && { "Content-Type": contentType }),
  });
};
