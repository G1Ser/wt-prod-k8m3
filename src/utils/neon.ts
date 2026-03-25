import { neon } from "@neondatabase/serverless";
import { Env } from "@/types/env";
export const getDbClient = (env: Env) => neon(env.NEON_DB_URL);
export type Sql = ReturnType<typeof getDbClient>;
