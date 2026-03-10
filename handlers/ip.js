/**
 * @openapi
 * /ip:
 *   get:
 *     summary: 获取客户端 IP 地理定位信息
 *     tags: [IP]
 *     responses:
 *       200:
 *         description: 成功返回 IP 定位数据
 *       403:
 *         description: 请求来源不在白名单
 */
