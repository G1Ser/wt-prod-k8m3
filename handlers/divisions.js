/**
 * @openapi
 * /divisions/search:
 *   get:
 *     summary: 地址位置搜索
 *     tags: [Geo]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example: "北京"
 *         description: 查询的地址关键词，支持模糊搜索
 *     responses:
 *       200:
 *         description: 成功返回地址位置信息
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */
