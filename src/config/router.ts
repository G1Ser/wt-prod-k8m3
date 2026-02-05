import { IP_ROUTES_MAP } from "./providers/ip";
import { AMAP_ROUTES_MAP } from "./providers/amap";
import { BMAP_ROUTES_MAP } from "./providers/bmap";
import { QWEATHER_ROUTES_MAP } from "./providers/qweather";
export const API_ROUTES_MAP = {
  ...IP_ROUTES_MAP,
  ...AMAP_ROUTES_MAP,
  ...BMAP_ROUTES_MAP,
  ...QWEATHER_ROUTES_MAP,
};
