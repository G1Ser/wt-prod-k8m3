import { handleAdcodeSearch, handleCoordinateSearch } from "@/handlers/geo";
import { DAY } from "../constants";
const GEO_ROUTES_MAP = {
  "/geo/adcode": handleAdcodeSearch,
  "/geo/coordinate": handleCoordinateSearch,
};
const GEO_CACHE_CONFIG = {
  ADCODE: {
    kv: 365 * 68 * DAY,
    browser: 365 * 34 * DAY,
  },
  COORDINATE: {
    kv: 365 * 68 * DAY,
    browser: 365 * 34 * DAY,
  },
};
export { GEO_ROUTES_MAP, GEO_CACHE_CONFIG };
