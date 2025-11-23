import { IP_ROUTES_MAP, IP_CACHE_TTL } from "./providers/ip";
import { AMAP_ROUTES_MAP, AMAP_CACHE_TTL } from "./providers/amap";
export const API_ROUTES_MAP = {
  ...IP_ROUTES_MAP,
  ...AMAP_ROUTES_MAP,
};
export const API_CACHE_TTL = {
  ...IP_CACHE_TTL,
  ...AMAP_CACHE_TTL,
};
