/**
 * @openapi
 * /ip:
 *   get:
 *     summary: 获取客户端 IP 地理定位信息
 *     tags: [IP]
 *     parameters:
 *       - in: query
 *         name: lon
 *         schema:
 *           type: string
 *           example: "116.6517"
 *         description: 查询的经度
 *       - in: query
 *         name: lat
 *         schema:
 *           type: string
 *           example: "39.9069"
 *         description: 查询的维度
 *     responses:
 *       200:
 *         description: 成功返回 IP 定位数据
 *       403:
 *         description: 请求来源不在白名单
 */
