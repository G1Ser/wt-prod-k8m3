import { DAY } from "../constants";
import { handleGeoCodeQuery } from "@/handlers/googlemap";
const GoogleMap_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const GoogleMap_ROUTES_MAP = {
  "/googlemap/geocode": handleGeoCodeQuery,
};
const GoogleMap_CACHE_TTL = {
  GEOCODE: {
    kv: 365 * 68 * DAY,
    browser: 365 * 34 * DAY,
  },
};
export { GoogleMap_BASE_URL, GoogleMap_ROUTES_MAP, GoogleMap_CACHE_TTL };
