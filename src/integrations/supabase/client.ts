// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tmghxzpvhctagrupghru.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtZ2h4enB2aGN0YWdydXBnaHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjE1MDAsImV4cCI6MjA2MDUzNzUwMH0.Yruz8JQflQgr_BKl8_SAYQMZIT_B-drpvPuNpoMKUgw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);