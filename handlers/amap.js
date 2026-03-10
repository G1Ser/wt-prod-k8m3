/**
 * @openapi
 * /amap/weather:
 *   get:
 *     summary: 高德地图天气查询
 *     tags: [Amap]
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *           example: "110101"
 *         description: 城市编码（adcode），如 110101 代表北京市东城区
 *       - in: query
 *         name: extensions
 *         schema:
 *           type: string
 *           enum: [base, all]
 *           default: base
 *         description: base=返回实况天气；all=返回预报天气
 *     responses:
 *       200:
 *         description: 成功返回天气数据
 *       403:
 *         description: 请求来源不在白名单
 */
