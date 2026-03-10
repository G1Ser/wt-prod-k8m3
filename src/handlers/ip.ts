import type { Env } from "@/types/env";
import { IP_BASE_URL, IP_CACHE_TTL } from "@/config/providers/ip";
import { getResponseData } from "@/utils/cache";
import { createErrorResponse } from "@/utils/response";

export const handleIPQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  if (!env.IP_KEY) {
    return createErrorResponse("Configuration Error", "IP_KEY is not set");
  }
  const real_ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const cacheKey = `ip:${real_ip}`;
  const cacheTtl = IP_CACHE_TTL.IP;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () => fetch(`${IP_BASE_URL}?apiKey=${env.IP_KEY}&ip=${real_ip}`),
    origin,
  );
};
