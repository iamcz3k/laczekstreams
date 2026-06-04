// Server-side Supabase admin client. Falls back to a no-op stub when env vars
// are missing so the app can boot without Supabase configured.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[Supabase] Service role not configured — using no-op stub.');
    return createStub();
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

// Returns an object that responds to common Supabase calls with empty results
// instead of throwing. Enough to keep server fns from crashing.
function createStub(): any {
  const queryResult = Promise.resolve({ data: [], error: null, count: 0 });
  const singleResult = Promise.resolve({ data: null, error: null });

  const queryBuilder: any = new Proxy(function () {}, {
    get(_t, prop) {
      if (prop === 'then') return (resolve: any) => resolve({ data: [], error: null });
      if (prop === 'single' || prop === 'maybeSingle') return () => singleResult;
      if (prop === 'csv') return () => Promise.resolve({ data: '', error: null });
      return () => queryBuilder;
    },
    apply() {
      return queryBuilder;
    },
  });

  return {
    from: () => queryBuilder,
    rpc: () => queryResult,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      admin: { listUsers: async () => ({ data: { users: [] }, error: null }) },
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
  };
}

let _supabaseAdmin: any;
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
