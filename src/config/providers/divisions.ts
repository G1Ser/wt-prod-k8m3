import { handleDivisionsSearch } from "@/handlers/divisions";
import { DAY } from "../constants";
const DIVISIONS_ROUTES_MAP = {
  "/divisions/search": handleDivisionsSearch,
};
const DIVISIONS_CACHE_CONFIG = {
  search: {
    kv: 365 * 68 * DAY,
    browser: 365 * 34 * DAY,
  },
};
export { DIVISIONS_ROUTES_MAP, DIVISIONS_CACHE_CONFIG };
