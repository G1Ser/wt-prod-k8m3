import { Env } from "@/types/env";
import { BMAP_BASE_URL, BMAP_CACHE_TTL } from "@/config/providers/bmap";
import { createErrorResponse } from "@/utils/response";
import { getResponseData } from "@/utils/cache";
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
  let fn;
  if (country === "CN") {
    fn = fetch(
      `${BMAP_BASE_URL}/weather/v1/?location=${lon},${lat}&data_type=all&ak=${env.BMAP_KEY}`,
    );
  } else {
    fn = fetch(
      `${BMAP_BASE_URL}/weather_abroad/v1/?location=${lon},${lat}&data_type=all&ak=${env.BMAP_KEY}`,
    );
  }
  const cacheTtl = BMAP_CACHE_TTL.WEATHER;
  return getResponseData(env, cacheKey, cacheTtl, () => fn, origin);
};
