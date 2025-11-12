import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { join } from "path";

dotenv.config({ path: join(__dirname, "../../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL environment variable is not defined");
}

if (!supabaseAnonKey) {
  throw new Error("SUPABASE_ANON_KEY environment variable is not defined");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE environment variable is not defined");
}

const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabaseClient, supabaseAdmin };
