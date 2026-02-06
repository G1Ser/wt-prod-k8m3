import { Env } from "@/types/env";
import { AMAP_BASE_URL, AMAP_CACHE_TTL } from "@/config/providers/amap";
import { createErrorResponse } from "@/utils/response";
import { getResponseData } from "@/utils/cache";
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
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${AMAP_BASE_URL}/geocode/geo?address=${encodeURIComponent(address)}&key=${
          env.AMAP_KEY
        }`,
      ),
    origin,
  );
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
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${AMAP_BASE_URL}/weather/weatherInfo?city=${city}&extensions=${extensions}&key=${env.AMAP_KEY}`,
      ),
    origin,
  );
};
