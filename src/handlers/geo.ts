import { neon } from "@neondatabase/serverless";
import { Env } from "@/types/env";
import { GEO_CACHE_CONFIG } from "@/config/providers/geo";
import type { GeoLocation } from "@/types/geo";
import { createErrorResponse, createSuccessResponse } from "@/utils/response";
import { getCORSHeaders } from "@/utils/cors";

const getDbClient = (env: Env) => neon(env.NEON_DB_URL);

type Sql = ReturnType<typeof getDbClient>;

const findByKeywordAndLevel = async (
  sql: Sql,
  keyword: string,
  level: string,
  limit: number,
) => {
  return (await sql`
    SELECT * FROM geo_divisions
    WHERE keywords ILIKE ${"%" + keyword + "%"} AND level = ${level}
    ORDER BY importance DESC
    LIMIT ${limit}
  `) as GeoLocation[];
};

const findByIds = async (sql: Sql, ids: number[]) => {
  if (ids.length === 0) return [];
  return (await sql`
    SELECT * FROM geo_divisions
    WHERE id = ANY(${ids})
  `) as GeoLocation[];
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
  return rows as GeoLocation[];
};

const indexById = (list: GeoLocation[]) => new Map(list.map((g) => [g.id, g]));

const toAdm0 = (g: GeoLocation) => ({
  id: g.id,
  name: g.name,
  name_zh: g.name_zh,
});

const toAdm1 = (g: GeoLocation) => ({
  id: g.id,
  name: g.name,
  name_zh: g.name_zh,
});

const toAdm2 = (g: GeoLocation) => ({
  id: g.id,
  name: g.name,
  name_zh: g.name_zh,
  adcode: g.adcode,
  lat: g.lat,
  lon: g.lon,
});

const searchDivisions = async (sql: Sql, keyword: string) => {
  const adm2Matches = await findByKeywordAndLevel(sql, keyword, "ADM2", 5);
  if (adm2Matches.length > 0) {
    const adm1Ids = [
      ...new Set(adm2Matches.map((g) => g.adm1_id).filter(Boolean) as number[]),
    ];
    const adm0Ids = [
      ...new Set(adm2Matches.map((g) => g.adm0_id).filter(Boolean) as number[]),
    ];
    const [adm1List, adm0List] = await Promise.all([
      findByIds(sql, adm1Ids),
      findByIds(sql, adm0Ids),
    ]);
    const adm1Map = indexById(adm1List);
    const adm0Map = indexById(adm0List);
    return adm2Matches.map((adm2) => ({
      adm0: adm2.adm0_id != null ? toAdm0(adm0Map.get(adm2.adm0_id)!) : null,
      adm1: adm2.adm1_id != null ? toAdm1(adm1Map.get(adm2.adm1_id)!) : null,
      adm2: toAdm2(adm2),
    }));
  }

  const adm1Matches = await findByKeywordAndLevel(sql, keyword, "ADM1", 1);
  if (adm1Matches.length > 0) {
    const adm1 = adm1Matches[0];
    const [adm2Children, adm0List] = await Promise.all([
      findChildrenByParent(sql, "adm1_id", adm1.id, "ADM2", 5),
      adm1.adm0_id != null
        ? findByIds(sql, [adm1.adm0_id])
        : Promise.resolve([]),
    ]);
    const adm0 = adm0List[0] ?? null;
    return adm2Children.map((adm2) => ({
      adm0: adm0 ? toAdm0(adm0) : null,
      adm1: toAdm1(adm1),
      adm2: toAdm2(adm2),
    }));
  }

  const adm0Matches = await findByKeywordAndLevel(sql, keyword, "ADM0", 1);
  if (adm0Matches.length > 0) {
    const adm0 = adm0Matches[0];
    const topAdm1s = await findChildrenByParent(
      sql,
      "adm0_id",
      adm0.id,
      "ADM1",
      5,
    );
    const mainIds = topAdm1s.map((a) => a.main_id).filter(Boolean) as number[];
    const mainCities = mainIds.length > 0 ? await findByIds(sql, mainIds) : [];
    const cityMap = indexById(mainCities);
    return topAdm1s
      .filter((adm1) => adm1.main_id != null && cityMap.has(adm1.main_id))
      .map((adm1) => ({
        adm0: toAdm0(adm0),
        adm1: toAdm1(adm1),
        adm2: toAdm2(cityMap.get(adm1.main_id!)!),
      }));
  }

  return [];
};

export const handleGeoSearch = async (
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

  const cacheKey = `divisions_search:${keyword.toLowerCase()}`;
  const cached = await env.CACHE.get(cacheKey);
  if (cached) {
    return createSuccessResponse(cached, {
      ...getCORSHeaders(origin),
      "X-Cache": "HIT",
      "Cache-Control": `public, max-age=${GEO_CACHE_CONFIG.search.browser}`,
    });
  }

  const sql = getDbClient(env);
  const results = await searchDivisions(sql, keyword);
  const json = JSON.stringify({ results });

  await env.CACHE.put(cacheKey, json, {
    expirationTtl: GEO_CACHE_CONFIG.search.kv,
  });

  return createSuccessResponse(json, {
    ...getCORSHeaders(origin),
    "X-Cache": "MISS",
    "Cache-Control": `public, max-age=${GEO_CACHE_CONFIG.search.browser}`,
  });
};
