export interface GeoLocation {
  id: number;
  name: string;
  name_zh: string;
  keywords: string;
  country_code: string | null;
  level: "ADM0" | "ADM1" | "ADM2";
  adm0_id: number | null;
  adm1_id: number | null;
  main_id: number | null;
  lat: number | null;
  lon: number | null;
  adcode: string | null;
  importance: number;
}
