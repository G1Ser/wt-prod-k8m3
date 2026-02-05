import { HOUR } from "../constants";
import { handleWeatherQuery } from "@/handlers/bmap";
const BMAP_BASE_URL = "https://api.map.baidu.com";
const BMAP_ROUTES_MAP = {
  "/bmap/weather": handleWeatherQuery,
};
const BMAP_CACHE_TTL = {
  WEATHER: {
    kv: 4 * HOUR,
    browser: 2 * HOUR,
  },
};
export { BMAP_BASE_URL, BMAP_ROUTES_MAP, BMAP_CACHE_TTL };
