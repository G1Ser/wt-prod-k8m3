import { Env } from "@/types/env";
import { OPENWEATHER_BASE_URL, OPENWEATHER_MAP_URL, OPENWEATHER_CACHE_TTL } from "@/config/providers/openweather";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
const validateOpenWeatherParams = (request: Request, env: Env) => {
    if (!env.OPENWEATHER_KEY) {
        return {
            success: false,
            error: createErrorResponse(
                "Configuration Error",
                "OPENWEATHER_KEY is not set",
            ),
        };
    }
    const url = new URL(request.url);
    const lon = url.searchParams.get("lon") || "";
    const lat = url.searchParams.get("lat") || "";
    const lang = url.searchParams.get("lang") || "zh_cn";
    const units = url.searchParams.get("units") || "standard";
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
    return { success: true, data: { lon, lat, lang, units } };
};
export const handleWeatherQuery = async (
    request: Request,
    env: Env,
    origin: string,
) => {
    const validation = validateOpenWeatherParams(request, env);
    if (!validation.success) {
        return validation.error;
    }
    const { lon, lat, lang, units } = validation.data!;
    const cacheKey = `openweather_current:${lon}:${lat}:${lang}:${units}`;
    const cacheTtl = OPENWEATHER_CACHE_TTL.WEATHER;
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
        `${OPENWEATHER_BASE_URL}/weather?lon=${lon}&lat=${lat}&appid=${env.OPENWEATHER_KEY}&lang=${lang}&units=${units}`,
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

export const handleWeatherForecastQuery = async (
    request: Request,
    env: Env,
    origin: string,
) => {
    const url = new URL(request.url);
    const validation = validateOpenWeatherParams(request, env);
    if (!validation.success) {
        return validation.error;
    }
    const { lon, lat, lang, units } = validation.data!;
    const type = url.searchParams.get("type") || 'daily';
    const cnt = type === 'daily' ? 7 : 24;
    const cacheKey = `openweather_forecast:${lon}:${lat}:${type}:${lang}:${units}`;
    const cacheTtl = OPENWEATHER_CACHE_TTL.FORECAST;
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
        `${OPENWEATHER_BASE_URL}/forecast/${type}?lon=${lon}&lat=${lat}&appid=${env.OPENWEATHER_KEY}&lang=${lang}&units=${units}&cnt=${cnt}`,
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
    const validation = validateOpenWeatherParams(request, env);
    if (!validation.success) {
        return validation.error;
    }
    const { lon, lat } = validation.data!;
    const cacheKey = `openweather_air:${lon}:${lat}`;
    const cacheTtl = OPENWEATHER_CACHE_TTL.AIR;
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
        `${OPENWEATHER_BASE_URL}/air_pollution?lon=${lon}&lat=${lat}&appid=${env.OPENWEATHER_KEY}`,
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

export const handleWeatherMapQuery = async (
    request: Request,
    env: Env,
    origin: string,
) => {
    const url = new URL(request.url);
    const layer = url.searchParams.get("layer");
    const x = url.searchParams.get("x");
    const y = url.searchParams.get("y");
    const z = url.searchParams.get("z");
    if (!env.OPENWEATHER_KEY) {
        return createErrorResponse(
            "Configuration Error",
            "OPENWEATHER_KEY is not set",
        )
    }
    if (!layer || !x || !y || !z) {
        return createErrorResponse(
            "Invalid URL",
            "Invalid map tile URL format.",
            400
        )
    }
    const cacheKey = `openweather_map:${layer}:${z}:${x}:${y}`;
    const cacheTtl = OPENWEATHER_CACHE_TTL.MAP;
    // 检查是否有缓存
    const cacheTile = await env.CACHE.get(cacheKey, "arrayBuffer");
    if (cacheTile) {
        return createSuccessResponse(cacheTile, {
            ...getCORSHeaders(origin),
            "Content-Type": "image/png",
            "X-Cache": "HIT",
            "Cache-Control": `public, max-age=${cacheTtl.browser}`,
        });
    }
    const response = await fetch(
        `${OPENWEATHER_MAP_URL}/${layer}/${z}/${x}/${y}.png?appid=${env.OPENWEATHER_KEY}`,
    );
    const tile = await response.arrayBuffer();
    await env.CACHE.put(cacheKey, tile, {
        expirationTtl: cacheTtl.kv,
    });
    return createSuccessResponse(tile, {
        ...getCORSHeaders(origin),
        "Content-Type": "image/png",
        "X-Cache": "MISS",
        "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
};