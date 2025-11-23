import { MINUTE, DAY } from "../constants";
import { handleGeocodeQuery, handleWeatherQuery } from "@/handlers/amap";
const AMAP_BASE_URL = "https://restapi.amap.com/v3";
const AMAP_ROUTES_MAP = {
  "/geocode/geo": handleGeocodeQuery,
  "/weather/weatherInfo": handleWeatherQuery,
};
const AMAP_CACHE_TTL = {
  GEOCODE: {
    kv: 30 * DAY,
    browser: 1 * DAY,
  },
  WEATHER: {
    kv: 60 * MINUTE,
    browser: 30 * MINUTE,
  },
};
export { AMAP_BASE_URL, AMAP_ROUTES_MAP, AMAP_CACHE_TTL };
