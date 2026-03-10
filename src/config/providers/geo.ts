import { handleGeoSearch } from "@/handlers/geo";
import { DAY } from "../constants";
const GEO_ROUTES_MAP = {
  "/geo/search": handleGeoSearch,
};
const GEO_CACHE_CONFIG = {
  search: {
    kv: 365 * 68 * DAY,
    browser: 365 * 34 * DAY,
  },
};
export { GEO_ROUTES_MAP, GEO_CACHE_CONFIG };
