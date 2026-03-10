import { HOUR } from "../constants";
import { handleIPQuery } from "@/handlers/ip";
const IP_BASE_URL = "https://api.ipgeolocation.io/v3/ipgeo";
const IP_ROUTES_MAP = {
  "/ip": handleIPQuery,
};
const IP_CACHE_TTL = {
  IP: {
    kv: 24 * HOUR,
    browser: 1 * HOUR,
  },
};
export { IP_BASE_URL, IP_ROUTES_MAP, IP_CACHE_TTL };
