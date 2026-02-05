import { Env } from "@/types/env";
import {
  QWEATHER_BASE_URL,
  QWEATHER_CACHE_TTL,
} from "@/config/providers/qweather";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
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
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/v7/weather/now?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}$unit=${unit}`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
};

const handleWeatherForecastQuery = async (
  request: Request,
  env: Env,
  origin: string,
  query: string,
) => {
  const validation = validateQWeatherParams(request, env);
  if (!validation.success) {
    return validation.error;
  }
  const { lon, lat, lang, unit } = validation.data!;
  const cacheKey = `qweather_forecast:${query}:${lon}:${lat}:${lang}:${unit}`;
  const cacheTtl = QWEATHER_CACHE_TTL.FORECAST;
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/v7/weather/${query}?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}$unit=${unit}`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
};

export const handleWeatherDayQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const day = url.searchParams.get("day") || "7d";
  handleWeatherForecastQuery(request, env, origin, day);
};

export const handleWeatherHourQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const hour = url.searchParams.get("hour") || "24h";
  handleWeatherForecastQuery(request, env, origin, hour);
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
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/v7/indices/1d?location=${lon},${lat}&key=${env.QWEATHER_KEY}&lang=${lang}$type=0`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
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
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/v7/astronomy/${astronomy}?location=${lon},${lat}&key=${env.QWEATHER_KEY}$date=${date}`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
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
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/weatheralert/v1/current/${lat}/${lon}?key=${env.QWEATHER_KEY}&lang=${lang}`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
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
  // 检查是否有缓存
  const cacheData = await env.CACHE.get(cacheKey);
  if (cacheData) {
    return createSuccessResponse(cacheData, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  const response = await fetch(
    `${QWEATHER_BASE_URL}/airquality/v1/current/${lat}/${lon}?key=${env.QWEATHER_KEY}&lang=${lang}`,
  );
  const data = await response.text();
  await env.CACHE.put(cacheKey, data, {
    expirationTtl: cacheTtl.kv,
  });
  return createSuccessResponse(data, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${cacheTtl.browser}`,
  });
};
