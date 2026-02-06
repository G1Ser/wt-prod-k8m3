import { HOUR, DAY } from "../constants";
import {
  handleWeatherNowQuery,
  handleWeatherForecastQuery,
  handleWeatherIndiceQuery,
  handleWeatherAstronomyQuery,
  handleWeatherAlertQuery,
  handleWeatherAirQuery,
} from "@/handlers/qweather";
const QWEATHER_BASE_URL = "https://kp54e4p9fp.re.qweatherapi.com";
const QWEATHER_ROUTES_MAP = {
  "/qweather/now": handleWeatherNowQuery,
  "/qweather/forecast": handleWeatherForecastQuery,
  "/qweather/indice": handleWeatherIndiceQuery,
  "/qweather/astronomy": handleWeatherAstronomyQuery,
  "/qweather/alert": handleWeatherAlertQuery,
  "/qweather/air": handleWeatherAirQuery,
};
const QWEATHER_CACHE_TTL = {
  NOW: {
    kv: 12 * HOUR,
    browser: 6 * HOUR,
  },
  FORECAST: {
    kv: 6 * HOUR,
    browser: 3 * HOUR,
  },
  ALERT: {
    kv: 1 * DAY,
    browser: 12 * HOUR,
  },
  INDICE: {
    kv: 1 * DAY,
    browser: 12 * HOUR,
  },
  AIR: {
    kv: 1 * DAY,
    browser: 12 * HOUR,
  },
  ASTRONOMY: {
    kv: 1 * DAY,
    browser: 12 * HOUR,
  },
};
export { QWEATHER_BASE_URL, QWEATHER_ROUTES_MAP, QWEATHER_CACHE_TTL };
