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

export interface DivisionItem {
  id: number;
  name: string;
  name_zh: string;
}

export interface DivisionAdm2Item extends DivisionItem {
  adcode: string | null;
  lat: number | null;
  lon: number | null;
}

export interface DivisionSearchResultItem {
  adm0: DivisionItem | null;
  adm1: DivisionItem | null;
  adm2: DivisionAdm2Item | null;
}
