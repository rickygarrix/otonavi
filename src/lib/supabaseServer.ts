import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing")
}

if (!serviceRoleKey) {
  throw new Error("SERVICE_ROLE_KEY is missing")
}

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})