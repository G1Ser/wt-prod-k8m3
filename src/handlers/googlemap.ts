import { Env } from "@/types/env";
import {
  GoogleMap_BASE_URL,
  GoogleMap_CACHE_TTL,
} from "@/config/providers/googlemap";
import { createErrorResponse } from "@/utils/response";
import { getResponseData } from "@/utils/cache";

export const handleGeoCodeQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  if (!env.Google_Map_Key) {
    return createErrorResponse(
      "Configuration Error",
      "Google_Map_Key is not set",
    );
  }
  const url = new URL(request.url);
  const address = url.searchParams.get("address") || "";
  const lang = url.searchParams.get("lang") || "zh-CN";
  if (!address) {
    return createErrorResponse(
      "Missing Parameters",
      "'address' parameters is required.",
      400,
    );
  }
  const cacheKey = `google_map_weather:${address}`;
  const fn = fetch(
    `${GoogleMap_BASE_URL}?address=${encodeURIComponent(address)}&language=${lang}&key=${env.Google_Map_Key}`,
  );
  const cacheTtl = GoogleMap_CACHE_TTL.GEOCODE;
  return getResponseData(env, cacheKey, cacheTtl, () => fn, origin);
};
