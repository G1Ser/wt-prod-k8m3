import { Env } from "@/types/env";
import { AMAP_BASE_URL, AMAP_CACHE_TTL } from "@/config/providers/amap";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
export const handleGeocodeQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  if (!env.AMAP_KEY) {
    return createErrorResponse("Configuration Error", "AMAP_KEY is not set");
  }
  const url = new URL(request.url);
  const address = url.searchParams.get("address") || "";
  const cacheKey = `amap_geocode:${address}`;
  const cacheTtl = AMAP_CACHE_TTL.GEOCODE;
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${AMAP_BASE_URL}/geocode/geo?address=${encodeURIComponent(address)}&key=${
      env.AMAP_KEY
    }`,
  );
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
export const handleWeatherQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  if (!env.AMAP_KEY) {
    return createErrorResponse("Configuration Error", "AMAP_KEY is not set");
  }
  const url = new URL(request.url);
  const city = url.searchParams.get("city") || "";
  const extensions = url.searchParams.get("extensions") || "base";
  const cacheKey = `amap_weather:${city}:${extensions}`;
  const cacheTtl = AMAP_CACHE_TTL.WEATHER;
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${AMAP_BASE_URL}/weather/weatherInfo?city=${city}&extensions=${extensions}&key=${env.AMAP_KEY}`,
  );
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
