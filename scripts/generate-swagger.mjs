import swaggerJsdoc from "swagger-jsdoc";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "天气 API",
      version: "1.0.0",
      description:
        "天气数据聚合 API 代理服务，统一代理高德地图、百度地图、和风天气、OpenWeather 等服务，提供缓存加速与 API Key 隐藏。",
    },
    servers: [
      {
        url: "https://wt-prod-k8m3.chauncey.workers.dev",
        description: "生产环境",
      },
    ],
    tags: [
      { name: "IP", description: "IP 地理定位" },
      { name: "高德地图", description: "高德地图 API（地理编码、天气）" },
      { name: "百度地图", description: "百度地图 API（天气）" },
      {
        name: "和风天气",
        description: "和风天气 API（实况、预报、指数、天文、预警、空气质量）",
      },
      {
        name: "OpenWeather",
        description: "OpenWeather API（天气、预报、空气质量、地图瓦片）",
      },
    ],
  },
  apis: [join(__dirname, "../handlers/*.js")],
};

const spec = swaggerJsdoc(options);

// 生成本地预览用的静态 HTML（spec 内嵌，直接用浏览器打开）
const docsDir = join(__dirname, "../docs");
mkdirSync(docsDir, { recursive: true });

const htmlOutput = `<!doctype html>
<html>
  <head>
    <title>天气 API 文档</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script id="api-reference" type="application/json">
${JSON.stringify(spec, null, 2)}
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

writeFileSync(join(docsDir, "index.html"), htmlOutput);
