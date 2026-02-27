/**
 * @openapi
 * components:
 *   parameters:
 *     Lon:
 *       in: query
 *       name: lon
 *       required: true
 *       schema:
 *         type: string
 *         example: "116.404"
 *       description: 经度
 *     Lat:
 *       in: query
 *       name: lat
 *       required: true
 *       schema:
 *         type: string
 *         example: "39.915"
 *       description: 纬度
 *     Lang:
 *       in: query
 *       name: lang
 *       schema:
 *         type: string
 *         default: zh_cn
 *         example: zh_cn
 *       description: 返回语言（zh_cn / en / ...）
 *     Units:
 *       in: query
 *       name: units
 *       schema:
 *         type: string
 *         enum: [standard, metric, imperial]
 *         default: standard
 *       description: 单位制，standard=开尔文，metric=摄氏度，imperial=华氏度
 */

/**
 * @openapi
 * /openweather/weather:
 *   get:
 *     summary: OpenWeather 当前天气
 *     tags: [OpenWeather]
 *     parameters:
 *       - $ref: '#/components/parameters/Lon'
 *       - $ref: '#/components/parameters/Lat'
 *       - $ref: '#/components/parameters/Lang'
 *       - $ref: '#/components/parameters/Units'
 *     responses:
 *       200:
 *         description: 成功返回当前天气数据
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /openweather/forecast:
 *   get:
 *     summary: OpenWeather 5 天 / 3 小时天气预报
 *     tags: [OpenWeather]
 *     parameters:
 *       - $ref: '#/components/parameters/Lon'
 *       - $ref: '#/components/parameters/Lat'
 *       - $ref: '#/components/parameters/Lang'
 *       - $ref: '#/components/parameters/Units'
 *     responses:
 *       200:
 *         description: 成功返回预报数据（每 3 小时一条）
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /openweather/air:
 *   get:
 *     summary: OpenWeather 空气污染数据
 *     tags: [OpenWeather]
 *     parameters:
 *       - $ref: '#/components/parameters/Lon'
 *       - $ref: '#/components/parameters/Lat'
 *     responses:
 *       200:
 *         description: 成功返回空气质量指数（AQI、CO、NO2、PM2.5 等）
 *       400:
 *         description: 缺少必要参数（lon / lat）
 *       403:
 *         description: 请求来源不在白名单
 */

/**
 * @openapi
 * /openweather/map:
 *   get:
 *     summary: OpenWeather 地图瓦片（PNG 图片）
 *     tags: [OpenWeather]
 *     parameters:
 *       - in: query
 *         name: layer
 *         required: true
 *         schema:
 *           type: string
 *           enum: [clouds_new, precipitation_new, pressure_new, wind_new, temp_new]
 *           example: temp_new
 *         description: 地图图层类型
 *       - in: query
 *         name: z
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: 缩放级别
 *       - in: query
 *         name: x
 *         required: true
 *         schema:
 *           type: integer
 *           example: 6
 *         description: 瓦片 X 坐标
 *       - in: query
 *         name: y
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: 瓦片 Y 坐标
 *     responses:
 *       200:
 *         description: 成功返回 PNG 地图瓦片
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 缺少必要参数
 *       403:
 *         description: 请求来源不在白名单
 */
