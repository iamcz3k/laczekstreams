// Browser Supabase client. Falls back to a no-op stub when env vars are missing.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseClient() {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env.SUPABASE_URL : undefined);
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || (typeof process !== 'undefined' ? process.env.SUPABASE_PUBLISHABLE_KEY : undefined);

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    if (typeof window !== 'undefined') console.warn('[Supabase] Not configured — using no-op stub.');
    return createStub();
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== 'undefined' ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

function createStub(): any {
  const queryBuilder: any = new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === 'then') return (resolve: any) => resolve({ data: [], error: null });
      if (prop === 'single' || prop === 'maybeSingle') return () => Promise.resolve({ data: null, error: null });
      return () => queryBuilder;
    },
    apply() {
      return queryBuilder;
    },
  });

  return {
    from: () => queryBuilder,
    rpc: () => Promise.resolve({ data: null, error: null }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: async () => ({ data: { provider: null, url: null }, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        download: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        list: async () => ({ data: [], error: null }),
        remove: async () => ({ data: [], error: null }),
      }),
    },
    channel: () => ({
      on: function () { return this; },
      subscribe: () => ({ unsubscribe: () => {} }),
      send: async () => ({}),
      unsubscribe: () => {},
    }),
    removeChannel: () => {},
    functions: { invoke: async () => ({ data: null, error: { message: 'Supabase not configured' } }) },
  };
}

let _supabase: any;
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
