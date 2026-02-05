import { handleWeatherQuery } from "@/handlers/bmap";
const BMAP_BASE_URL = "https://api.map.baidu.com";
const BMAP_ROUTES_MAP = {
  "/weather/baidu": handleWeatherQuery,
};
export { BMAP_BASE_URL, BMAP_ROUTES_MAP };
