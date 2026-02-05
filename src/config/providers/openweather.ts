import { HOUR } from "../constants";
import { handleWeatherQuery, handleWeatherForecastQuery, handleWeatherAirQuery, handleWeatherMapQuery } from "@/handlers/openweather";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OPENWEATHER_MAP_URL = "https://tile.openweathermap.org/map"
const OPENWEATHER_ROUTES_MAP = {
    "/openweather/weather": handleWeatherQuery,
    "/openweather/forecast": handleWeatherForecastQuery,
    "/openweather/air": handleWeatherAirQuery,
    "/openweather/map": handleWeatherMapQuery,
};
const OPENWEATHER_CACHE_TTL = {
    WEATHER: {
        kv: 6 * HOUR,
        browser: 4 * HOUR,
    },
    FORECAST: {
        kv: 2 * HOUR,
        browser: 1 * HOUR,
    },
    AIR: {
        kv: 24 * HOUR,
        browser: 6 * HOUR,
    },
    MAP: {
        kv: 12 * HOUR,
        browser: 6 * HOUR,
    }
};
export { OPENWEATHER_BASE_URL, OPENWEATHER_MAP_URL, OPENWEATHER_ROUTES_MAP, OPENWEATHER_CACHE_TTL };
