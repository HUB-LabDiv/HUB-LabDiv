import { localDb } from './localDb';
import { createBrowserClient } from '@supabase/ssr';

// --- FUNÇÕES CRUD OFFLINE (Somente Leitura e Escrita Local) ---

export const offlineCrud = {
  // Salva o perfil do usuário no cache local
  async saveUserProfile(profile: any) {
    await localDb.userProfile.put({
      ...profile,
      last_sync: Date.now(),
    });
  },

  // Lê o perfil do cache local (rápido, sem rede)
  async getUserProfile(id: string) {
    return await localDb.userProfile.get(id);
  },

  // Salva permissões em cache
  async savePermissions(permissions: any[]) {
    await localDb.permissions.bulkPut(permissions);
  },

  // Busca as permissões cacheadas
  async getPermissions() {
    return await localDb.permissions.toArray();
  },

  // Adiciona uma ação à Fila Durável (Durable Queue)
  async enqueueMutation(mutation: Omit<import('./localDb').LocalMutation, 'id' | 'timestamp' | 'status' | 'retryCount'>) {
    const id = crypto.randomUUID();
    await localDb.mutationsQueue.add({
      ...mutation,
      id,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    });
    return id;
  }
};

// --- ESTRATÉGIA DE WARM-UP (Passo 3.1) ---

export async function warmUpOfflineDatabase() {
  try {
    // 1. Instanciar o cliente do Supabase
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 2. Verificar quem está logado
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return; // Se não estiver logado, aborta o warm-up

    const userId = session.user.id;

    // 3. Checar se já fizemos sync recentemente (ex: a cada 1 hora para economizar requests)
    const localProfile = await offlineCrud.getUserProfile(userId);
    const ONE_HOUR = 1000 * 60 * 60;
    
    if (localProfile && (Date.now() - localProfile.last_sync < ONE_HOUR)) {
      console.log('Antigravity: Warm-up ignorado (dados ainda frescos no Dexie.js)');
      return; 
    }

    console.log('Antigravity: Iniciando Warm-up do Dexie.js...');

    // 4. Baixar os dados vitais (Perfil)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, role')
      .eq('id', userId)
      .single();

    if (profile) {
      await offlineCrud.saveUserProfile({
        id: profile.id,
        name: profile.full_name || profile.username || 'Usuário',
        email: session.user.email || '',
        avatar_url: profile.avatar_url,
        role: profile.role || 'user',
      });
    }

    // (Opcional) 5. Baixar Permissões e Grades
    // ... Aqui entram as consultas para carregar grades, etc.

    console.log('Antigravity: Warm-up concluído com sucesso!');
  } catch (error) {
    console.warn('Antigravity: Falha no Warm-up (Você está offline ou houve timeout):', error);
  }
}

// --- DRENAGEM DA FILA DURÁVEL (FLUSH ENGINE) ---
export async function flushDurableQueue() {
  if (typeof window === 'undefined' || !navigator.onLine) return;

  try {
    const pendingMutations = await localDb.mutationsQueue.where('status').equals('pending').toArray();
    if (pendingMutations.length === 0) return;

    console.log(`[Antigravity Sync] Sincronizando ${pendingMutations.length} item(s) retidos na fila offline...`);

    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pendingMutations.map(m => ({
        id: m.id,
        endpoint: m.endpoint,
        payload: m.payload,
        method: m.method
      })))
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        const idsToRemove = pendingMutations.map(m => m.id);
        await localDb.mutationsQueue.bulkDelete(idsToRemove);
        console.log('[Antigravity Sync] Fila de mutações sincronizada e limpa com sucesso!');
      }
    }
  } catch (err) {
    console.warn('[Antigravity Sync] Erro ao sincronizar a fila offline com o servidor:', err);
  }
}
