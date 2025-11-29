/**
 * Supabase Configuration
 *
 * Configured with PostgreSQL database, JWT Auth, and Storage
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase credentials
const SUPABASE_URL = 'https://pcoirzokoirdonfpsxfv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjb2lyem9rb2lyZG9uZnBzeGZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMTc0MzYsImV4cCI6MjA3Nzc5MzQzNn0.xjeHCpqNikdeVUnAfUnMEThgdiKy74UkkLtmJeh7i5g';

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
