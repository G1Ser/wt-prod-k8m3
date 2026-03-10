import { MINUTE } from "../constants";
import { handleWeatherQuery } from "@/handlers/amap";
const AMAP_BASE_URL = "https://restapi.amap.com/v3";
const AMAP_ROUTES_MAP = {
  "/amap/weather": handleWeatherQuery,
};
const AMAP_CACHE_TTL = {
  WEATHER: {
    kv: 60 * MINUTE,
    browser: 30 * MINUTE,
  },
};
export { AMAP_BASE_URL, AMAP_ROUTES_MAP, AMAP_CACHE_TTL };
