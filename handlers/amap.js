/**
 * @openapi
 * /amap/geocode:
 *   get:
 *     summary: 高德地图地理编码（地址转经纬度）
 *     tags: [高德地图]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: 北京市朝阳区阜通东大街6号
 *         description: 待解析的地址字符串
 *     responses:
 *       200:
 *         description: 成功返回经纬度坐标
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /amap/weather:
 *   get:
 *     summary: 高德地图天气查询
 *     tags: [高德地图]
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
