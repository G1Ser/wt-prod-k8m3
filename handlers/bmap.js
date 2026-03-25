/**
 * @openapi
 * /bmap/weather:
 *   get:
 *     summary: 百度地图天气查询
 *     tags: [Bmap]
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *           example: 116.404
 *         description: 经度
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           example: 39.915
 *         description: 纬度
 *     responses:
 *       200:
 *         description: 成功返回天气数据
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */
