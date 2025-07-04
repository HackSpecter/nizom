import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      submissions: {
        Row: {
          id: string;
          name: string;
          contact: string;
          instagram: string;
          expectations: string;
          status: 'pending' | 'approved' | 'rejected' | 'contacted';
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          contact: string;
          instagram: string;
          expectations: string;
          status?: 'pending' | 'approved' | 'rejected' | 'contacted';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          contact?: string;
          instagram?: string;
          expectations?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'contacted';
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};