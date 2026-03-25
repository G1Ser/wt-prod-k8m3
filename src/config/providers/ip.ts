import { MINUTE } from "../constants";
import { handleIPQuery } from "@/handlers/ip";

const IP_ROUTES_MAP = {
  "/ip": handleIPQuery,
};

const IP_CACHE_TTL = {
  IP: {
    browser: 30 * MINUTE,
  },
};

export { IP_ROUTES_MAP, IP_CACHE_TTL };
