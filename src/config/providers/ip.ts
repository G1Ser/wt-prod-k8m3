import { handleIPQuery } from "@/handlers/ip";
const IP_BASE_URL = "http://ip-api.com/json";
const IP_ROUTES_MAP = {
  "/ip": handleIPQuery,
};
export { IP_BASE_URL, IP_ROUTES_MAP };
