import { Env } from "@/types/env";
import { GEO_CACHE_CONFIG } from "@/config/providers/geo";
import type { GeoType } from "@/types/geo";
import { getResponseData } from "@/utils/cache";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";
import { type Sql, getDbClient } from "@/utils/neon";
import { N8N_BASE_URL } from "@/config/constants";

const findByKeywordAndLevel = async (
  sql: Sql,
  keyword: string,
  level: string,
  limit: number,
  countryCode?: string,
) => {
  if (countryCode) {
    return (await sql`
    SELECT * FROM geo_divisions
    WHERE keywords ILIKE ${"%" + keyword + "%"} 
    AND level = ${level} 
    AND country_code = ${countryCode}
    ORDER BY importance DESC
    LIMIT ${limit}
  `) as GeoType[];
  }
  return (await sql`
    SELECT * FROM geo_divisions
    WHERE keywords ILIKE ${"%" + keyword + "%"} 
    AND level = ${level}
    ORDER BY importance DESC
    LIMIT ${limit}
  `) as GeoType[];
};

const findByIds = async (sql: Sql, ids: number[]) => {
  if (ids.length === 0) return [];
  return (await sql`
    SELECT * FROM geo_divisions
    WHERE id = ANY(${ids})
  `) as GeoType[];
};

const findChildrenByParent = async (
  sql: Sql,
  field: "adm0_id" | "adm1_id",
  id: number,
  level: string,
  limit: number,
) => {
  const rows =
    field === "adm0_id"
      ? await sql`
          SELECT * FROM geo_divisions
          WHERE adm0_id = ${id} AND level = ${level}
          ORDER BY importance DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT * FROM geo_divisions
          WHERE adm1_id = ${id} AND level = ${level}
          ORDER BY importance DESC
          LIMIT ${limit}
        `;
  return rows as GeoType[];
};

const indexById = (list: GeoType[]) => new Map(list.map((g) => [g.id, g]));

const joinDisplay = (...parts: Array<string>) => parts.join("，");

const formatJSON = (adm2: GeoType, adm1: GeoType, adm0: GeoType) => ({
  id: adm2.id,
  lat: adm2.lat,
  lon: adm2.lon,
  name: adm2.name,
  name_zh: adm2.name_zh,
  adcode: adm2.adcode,
  display: joinDisplay(adm0.name, adm1.name, adm2.name),
  display_zh: joinDisplay(adm0.name_zh, adm1.name_zh, adm2.name_zh),
});

const searchDivisions = async (
  sql: Sql,
  keyword: string,
  countryCode?: string,
) => {
  // 1) 命中 adm2：直接返回前 5 条
  const adm2Matches = await findByKeywordAndLevel(
    sql,
    keyword,
    "ADM2",
    5,
    countryCode,
  );
  if (adm2Matches.length > 0) {
    const adm1Ids = [...new Set(adm2Matches.map((g) => g.adm1_id))];
    const adm0Ids = [...new Set(adm2Matches.map((g) => g.adm0_id))];
    const [adm1List, adm0List] = await Promise.all([
      findByIds(sql, adm1Ids),
      findByIds(sql, adm0Ids),
    ]);
    const adm1Map = indexById(adm1List);
    const adm0Map = indexById(adm0List);
    return adm2Matches.map((adm2) =>
      formatJSON(adm2, adm1Map.get(adm2.adm1_id)!, adm0Map.get(adm2.adm0_id)!),
    );
  }
  // 2) 命中 adm1：查 adm0 + main_id 对应的 adm2
  const adm1Matches = await findByKeywordAndLevel(
    sql,
    keyword,
    "ADM1",
    1,
    countryCode,
  );
  if (adm1Matches.length > 0) {
    const adm1 = adm1Matches[0];
    const [adm2Children, adm0List] = await Promise.all([
      findChildrenByParent(sql, "adm1_id", adm1.id, "ADM2", 5),
      findByIds(sql, [adm1.adm0_id]),
    ]);
    const adm0 = adm0List[0];
    return adm2Children.map((adm2) => formatJSON(adm2, adm1, adm0));
  }
  // 3) 命中 adm0：查 importance 前 5 的 adm1，再查它们 main_id 对应的 adm2
  const adm0Matches = await findByKeywordAndLevel(
    sql,
    keyword,
    "ADM0",
    1,
    countryCode,
  );
  if (adm0Matches.length > 0) {
    const adm0 = adm0Matches[0];
    const adm1List = await findChildrenByParent(
      sql,
      "adm0_id",
      adm0.id,
      "ADM1",
      5,
    );
    const mainIds = adm1List.map((a) => a.main_id);
    const mainCities = mainIds.length > 0 ? await findByIds(sql, mainIds) : [];
    const cityMap = indexById(mainCities);
    return adm1List.map((adm1) =>
      formatJSON(cityMap.get(adm1.main_id)!, adm1, adm0),
    );
  }
  return [];
};

export const handleAdcodeSearch = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword")?.trim() ?? "";
  if (!keyword) {
    return createErrorResponse(
      "Missing Parameters",
      "'keyword' is required.",
      400,
    );
  }
  const cacheKey = `geo_adcode:${keyword.toLowerCase()}`;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return createSuccessResponse(cached, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${GEO_CACHE_CONFIG.ADCODE.browser}`,
    });
  }

  const sql = getDbClient(env);
  const results = await searchDivisions(sql, keyword, "CN");
  const json = JSON.stringify({ results });

  await env.CACHE.put(cacheKey, json, {
    expirationTtl: GEO_CACHE_CONFIG.ADCODE.kv,
  });

  return createSuccessResponse(json, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${GEO_CACHE_CONFIG.ADCODE.browser}`,
  });
};

export const handleCoordinateSearch = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword")?.trim() ?? "";
  if (!keyword) {
    return createErrorResponse(
      "Missing Parameters",
      "'keyword' is required.",
      400,
    );
  }
  const cacheKey = `geo_coordinate:${keyword.toLowerCase()}`;
  const cacheTtl = GEO_CACHE_CONFIG.COORDINATE;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return createSuccessResponse(cached, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }

  const sql = getDbClient(env);
  let results;
  results = await searchDivisions(sql, keyword);
  if (results.length > 0) {
    const json = JSON.stringify({ results });

    await env.CACHE.put(cacheKey, json, {
      expirationTtl: cacheTtl.kv,
    });

    return createSuccessResponse(json, {
      ...getCORSHeaders(origin),
      "X-Cache": "MISS",
      "Cache-Control": `public, max-age=${cacheTtl.browser}`,
    });
  }
  return getResponseData(
    env,
    cacheKey,
    cacheTtl,
    () => fetch(`${N8N_BASE_URL}/geo/search?q=${keyword}`),
    origin,
  );
};
