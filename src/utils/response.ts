/**
 * 响应工具函数
 */

// 标准 JSON 响应头
const JSON_HEADERS = {
  "Content-Type": "application/json",
};

// 创建 JSON 错误响应
export function createErrorResponse(
  error: string,
  message: string,
  status: number = 500
): Response {
  return new Response(JSON.stringify({ error, message }), {
    status,
    headers: JSON_HEADERS,
  });
}

// 创建 JSON 成功响应
export function createSuccessResponse(
  data: any,
  additionalHeaders?: Record<string, string>
): Response {
  return new Response(data, {
    status: 200,
    headers: {
      ...JSON_HEADERS,
      ...additionalHeaders,
    },
  });
}
