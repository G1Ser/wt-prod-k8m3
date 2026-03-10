import { HOUR } from "../constants";
import { handleIPQuery, handleIPQuery2 } from "@/handlers/ip";
const IP_BASE_URL = "https://api.ipgeolocation.io/v3/ipgeo";
const IP_BASE_URL2 = "http://ip-api.com/json";
const IP_ROUTES_MAP = {
  "/ip": handleIPQuery,
  // deprecated, will be removed in the future
  "/ip2": handleIPQuery2,
};
const IP_CACHE_TTL = {
  IP: {
    kv: 24 * HOUR,
    browser: 1 * HOUR,
  },
};
export { IP_BASE_URL, IP_BASE_URL2, IP_ROUTES_MAP, IP_CACHE_TTL };
