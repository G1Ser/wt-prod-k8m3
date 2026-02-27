/**
 * @openapi
 * /bmap/weather:
 *   get:
 *     summary: 百度地图天气查询
 *     tags: [百度地图]
 *     parameters:
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: string
 *           example: "116.404"
 *         description: 经度
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: string
 *           example: "39.915"
 *         description: 纬度
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           default: CN
 *           example: CN
 *         description: 国家代码，CN=中国（使用国内接口），其他=海外接口
 *     responses:
 *       200:
 *         description: 成功返回天气数据
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */
