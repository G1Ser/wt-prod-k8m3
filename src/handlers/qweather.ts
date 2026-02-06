import { Env } from "@/types/env";
import {
  QWEATHER_BASE_URL,
  QWEATHER_CACHE_TTL,
} from "@/config/providers/qweather";
import { createErrorResponse } from "@/utils/response";
import { getResponseData } from "@/utils/cache";
const validateQWeatherParams = (request: Request, env: Env) => {
  if (!env.QWEATHER_KEY) {
    return {
      success: false,
      error: createErrorResponse(
        "Configuration Error",
        "QWEATHER_KEY is not set",
      ),
    };
  }
  const url = new URL(request.url);
  const lon = url.searchParams.get("lon") || "";
  const lat = url.searchParams.get("lat") || "";
  const lang = url.searchParams.get("lang") || "zh";
  const unit = url.searchParams.get("unit") || "m";
  if (!lon || !lat) {
    return {
      success: false,
      error: createErrorResponse(
        "Missing Parameters",
        "Both 'lon' and 'lat' parameters are required.",
        400,
      ),
    };
  }
  return { success: true, data: { lon, lat, lang, unit } };
};
export const handleWeatherNowQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang, unit } = validation.data!;
  const cacheKey = `qweather_now:${lon}:${lat}:${lang}:${unit}`;
  const cacheTtl = QWEATHER_CACHE_TTL.NOW;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/v7/weather/now?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}&unit=${unit}`,
      ),
    origin,
  );
};

export const handleWeatherForecastQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang, unit } = validation.data!;
  const period = url.searchParams.get("period") || "7d";
  const cacheKey = `qweather_forecast:${lon}:${lat}:${period}:${lang}:${unit}`;
  const cacheTtl = QWEATHER_CACHE_TTL.FORECAST;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/v7/weather/${period}?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}&unit=${unit}`,
      ),
    origin,
  );
};

export const handleWeatherIndiceQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang } = validation.data!;
  const cacheKey = `qweather_indice:${lon}:${lat}:${lang}`;
  const cacheTtl = QWEATHER_CACHE_TTL.INDICE;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/v7/indices/1d?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}&type=0`,
      ),
    origin,
  );
};

export const handleWeatherAstronomyQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat } = validation.data!;
  const astronomy = url.searchParams.get("astronomy") || "";
  const date = url.searchParams.get("date") || "";
  if (!astronomy || !date) {
    return createErrorResponse(
      "Missing Parameters",
      "Both 'astronomy' and 'date' parameters are required.",
      400,
    );
  }
  const cacheKey = `qweather_astronomy:${astronomy}:${lon}:${lat}`;
  const cacheTtl = QWEATHER_CACHE_TTL.ASTRONOMY;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/v7/astronomy/${astronomy}?location=${lon},${lat}&key=${env.QWEATHER_KEY}&date=${date}`,
      ),
    origin,
  );
};

export const handleWeatherAlertQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang } = validation.data!;
  const cacheKey = `qweather_alert:${lon}:${lat}:${lang}`;
  const cacheTtl = QWEATHER_CACHE_TTL.ALERT;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/weatheralert/v1/current/${lat}/${lon}?key=${env.QWEATHER_KEY}&lang=${lang}`,
      ),
    origin,
  );
};

export const handleWeatherAirQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang } = validation.data!;
  const cacheKey = `qweather_air:${lon}:${lat}:${lang}`;
  const cacheTtl = QWEATHER_CACHE_TTL.AIR;
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () =>
      fetch(
        `${QWEATHER_BASE_URL}/airquality/v1/current/${lat}/${lon}?key=${env.QWEATHER_KEY}&lang=${lang}`,
      ),
    origin,
  );
};
