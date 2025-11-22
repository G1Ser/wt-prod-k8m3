/**
 * 主入口文件，Worker 的 fetch 处理器
 */

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    // 获取用户IP并打印
    const ip = request.headers.get("CF-Connecting-IP");
    console.log("用户IP:", ip);

    // 简单的响应，用于测试IP获取
    return new Response(
      JSON.stringify({
        message: "IP获取测试",
        ip: ip,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  },
};
