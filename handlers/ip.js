/**
 * @openapi
 * /ip:
 *   get:
 *     summary: 获取客户端 IP 地理定位信息
 *     tags: [IP]
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           default: zh-CN
 *           example: zh-CN
 *         description: 返回数据的语言（zh-CN / en）
 *     responses:
 *       200:
 *         description: 成功返回 IP 定位数据
 *       403:
 *         description: 请求来源不在白名单
 */
