/**
 * 主入口文件，Worker 的 fetch 处理器
 */
import type { Env } from "@/types/env";
import { isAllowedOrigin, handleCORS } from "@/utils/cors";
import { API_ROUTES_MAP } from "@/config/router";
import { createErrorResponse } from "@/utils/response";

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";

    // 检查是否在白名单中
    if (!isAllowedOrigin(origin)) {
      return createErrorResponse("Forbidden", "Origin not allowed", 403);
    }

    if (request.method === "OPTIONS") {
      return handleCORS(origin);
    }
    // 获取路由处理函数
    const handler = API_ROUTES_MAP[url.pathname as keyof typeof API_ROUTES_MAP];
    if (!handler) {
      return createErrorResponse("Not found", "Route not found", 404);
    }
    try {
      return await handler(request, env, origin);
    } catch (error) {
      return createErrorResponse(
        "Internal Server Error",
        "An error occurred",
        500
      );
    }
  },
};
