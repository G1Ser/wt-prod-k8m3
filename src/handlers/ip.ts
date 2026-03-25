import { IP_CACHE_TTL } from "@/config/providers/ip";
import { getCORSHeaders } from "@/utils/cors";
import { createSuccessResponse } from "@/utils/response";
import { type Sql, getDbClient } from "@/utils/neon";
import type { Env } from "@/types/env";
import type { IPLocation } from "@/types/geo";

const findDivisionByPoint = async (sql: Sql, lon: number, lat: number) => {
  return (await sql`
    SELECT id, name, name_zh, adcode, lon, lat
    FROM geo_divisions
    WHERE ST_Intersects(
      geom,
      ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)
    )
    ORDER BY importance DESC
    LIMIT 1
  `) as IPLocation[];
};

export const handleIPQuery = async (
  request: Request,
  env: Env,
  origin: string,
) => {
  const url = new URL(request.url);
  const cf = request.cf;
  const latitude = cf?.latitude;
  const longitude = cf?.longitude;
  const lat = Number(url.searchParams.get("lat") || latitude);
  const lon = Number(url.searchParams.get("lon") || longitude);

  const sql = getDbClient(env);
  const rows = await findDivisionByPoint(sql, lon, lat);
  const result = rows[0] ?? {
    id: 205591541,
    name: "Tongzhou District",
    name_zh: "通州区",
    adcode: "110112",
    lon: 116.6516918,
    lat: 39.9069176,
  };

  return createSuccessResponse(JSON.stringify(result), {
    ...getCORSHeaders(origin),
    "Cache-Control": `public, max-age=${IP_CACHE_TTL.IP.browser}`,
  });
};
