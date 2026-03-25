export interface IPLocation {
  id: number;
  name: string;
  name_zh: string;
  adcode: string;
  lon: number;
  lat: number;
}
export interface GeoLocation {
  id: number;
  lat: number | null;
  lon: number | null;
  name: string;
  name_zh: string;
  display: string;
  display_zh: string;
  adcode?: string | null;
}

export interface GeoType extends Omit<GeoLocation, "display" | "display_zh"> {
  level: string;
  adm0_id: number;
  adm1_id: number;
  main_id: number;
  importance: number;
  country_code: string;
}
