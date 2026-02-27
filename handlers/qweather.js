/**
 * @openapi
 * components:
 *   parameters:
 *     QWeatherLon:
 *       in: query
 *       name: lon
 *       required: true
 *       schema:
 *         type: string
 *         example: "116.404"
 *       description: 经度
 *     QWeatherLat:
 *       in: query
 *       name: lat
 *       required: true
 *       schema:
 *         type: string
 *         example: "39.915"
 *       description: 纬度
 *     QWeatherLang:
 *       in: query
 *       name: lang
 *       schema:
 *         type: string
 *         default: zh
 *         example: zh
 *       description: 返回语言（zh / en）
 *     QWeatherUnit:
 *       in: query
 *       name: unit
 *       schema:
 *         type: string
 *         enum: [m, i]
 *         default: m
 *       description: 单位，m=公制 i=英制
 */

/**
 * @openapi
 * /qweather/now:
 *   get:
 *     summary: 和风天气实况
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - $ref: '#/components/parameters/QWeatherLang'
 *       - $ref: '#/components/parameters/QWeatherUnit'
 *     responses:
 *       200:
 *         description: 成功返回实时天气数据
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /qweather/forecast:
 *   get:
 *     summary: 和风天气逐日预报
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - $ref: '#/components/parameters/QWeatherLang'
 *       - $ref: '#/components/parameters/QWeatherUnit'
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [3d, 7d, 10d, 15d, 30d]
 *           default: 7d
 *         description: 预报天数
 *     responses:
 *       200:
 *         description: 成功返回天气预报数据
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /qweather/indice:
 *   get:
 *     summary: 和风天气生活指数
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - $ref: '#/components/parameters/QWeatherLang'
 *     responses:
 *       200:
 *         description: 成功返回生活指数（运动、洗车、穿衣等）
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /qweather/astronomy:
 *   get:
 *     summary: 和风天气天文数据（日出日落 / 月出月落）
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - in: query
 *         name: astronomy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sun, moon]
 *           example: sun
 *         description: 天文类型，sun=日出日落，moon=月出月落
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: "20240101"
 *         description: 查询日期，格式 yyyyMMdd
 *     responses:
 *       200:
 *         description: 成功返回天文数据
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /qweather/alert:
 *   get:
 *     summary: 和风天气灾害预警
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - $ref: '#/components/parameters/QWeatherLang'
 *     responses:
 *       200:
 *         description: 成功返回灾害预警信息
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /qweather/air:
 *   get:
 *     summary: 和风天气空气质量
 *     tags: [和风天气]
 *     parameters:
 *       - $ref: '#/components/parameters/QWeatherLon'
 *       - $ref: '#/components/parameters/QWeatherLat'
 *       - $ref: '#/components/parameters/QWeatherLang'
 *     responses:
 *       200:
 *         description: 成功返回空气质量数据（AQI、PM2.5 等）
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */
