import type { Env } from "@/types/env";
import { IP_BASE_URL } from "@/config/providers/ip";
import { createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
export const handleIPQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const IP =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For");
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") || "zh-CN";
  const response = await fetch(`${IP_BASE_URL}?lang=${lang}&ip=${IP}`);
  const data = await response.text();
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
  });
};
