/**
 * @openapi
 * /googlemap/geocode:
 *   get:
 *     summary: Google Map 地理编码查询
 *     tags: [GoogleMap]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           example: "北京市"
 *         description: 需要查询的地址
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *           enum: [en, zh-CN]
 *           default: "zh-CN"
 *         description: 需要返回的语言
 *     responses:
 *       200:
 *         description: 成功返回地理编码数据
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */
