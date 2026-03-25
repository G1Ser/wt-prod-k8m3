/**
 * @openapi
 * /geo/adcode:
 *   get:
 *     summary: 地址位置搜索（返回adcode，仅限中国区域）
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

/**
 * @openapi
 * /geo/coordinate:
 *   get:
 *     summary: 地址位置搜索（优先检索数据库数据，再匹配openstreetmap数据）
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
