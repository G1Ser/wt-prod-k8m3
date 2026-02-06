import type { Env } from "@/types/env";
import { IP_BASE_URL, IP_CACHE_TTL } from "@/config/providers/ip";
import { getResponseData } from "@/utils/cache";
export const handleIPQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const real_ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "";
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "zh-CN";
  const cacheKey = `ip:${real_ip}:${lang}`;
  const cacheTtl = IP_CACHE_TTL.IP;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () => fetch(`${IP_BASE_URL}/${real_ip}?lang=${lang}`),
    origin,
  );
};
