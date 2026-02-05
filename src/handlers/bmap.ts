import { Env } from "@/types/env";
import { BMAP_BASE_URL, BMAP_CACHE_TTL } from "@/config/providers/bmap";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
export const handleWeatherQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  if (!env.BMAP_KEY) {
    return createErrorResponse("Configuration Error", "BMAP_KEY is not set");
  }
  const url = new URL(request.url);
  const country = url.searchParams.get("country") || "CN";
  const lon = url.searchParams.get("lon") || "";
  const lat = url.searchParams.get("lat") || "";
  if (!lon || !lat) {
    return createErrorResponse(
      "Missing Parameters",
      "Both 'lon' and 'lat' parameters are required.",
      400,
    );
  }
  const cacheKey = `bmap_weather:${lon}:${lat}`;
  const cacheTtl = BMAP_CACHE_TTL.WEATHER;
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  let response;
  if (country === "CN") {
    response = await fetch(
      `${BMAP_BASE_URL}/weather/v1/?location=${lon},${lat}&data_type=all&ak=${env.BMAP_KEY}`,
    );
  } else {
    response = await fetch(
      `${BMAP_BASE_URL}/weather_abroad/v1/?location=${lon},${lat}&data_type=all&ak=${env.BMAP_KEY}`,
    );
  }
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
};
