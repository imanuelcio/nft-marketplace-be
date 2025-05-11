import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import config from "../config/config";
dotenv.config();

if (!config.supabase_url || !config.supabase_key) {
  throw new Error("Missing Supabase environment variables");
}
const supabase = createClient(
  config.supabase_url as string,
  config.supabase_key as string
);

if (!supabase) throw new Error("Error connecting to database");
export default supabase;
