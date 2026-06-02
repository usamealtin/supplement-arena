// Cloudflare KV ile senkronize storage
// Tarayıcı localStorage'ı yedek olarak kullanır, 
// Cloudflare Pages Functions API ile kalıcı bulut depolama sağlar

const API_URL = '/api/data';
const SYNC_KEY = 'last_synced_at';

interface SyncResult {
  success: boolean;
  error?: string;
}

// Progress callback tipi
type ProgressCallback = (status: string) => void;

// Veriyi localStorage'dan KV'ye yükle (cloud'a push)
export async function pushToCloud(
  data: any,
  onProgress?: ProgressCallback
): Promise<SyncResult> {
  try {
    onProgress?.('Buluta kaydediliyor...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Cloud save failed');
    }

    localStorage.setItem(SYNC_KEY, new Date().toISOString());
    onProgress?.('✅ Buluta kaydedildi');
    return { success: true };
  } catch (error: any) {
    console.error('Cloud push error:', error);
    onProgress?.('⚠️ Bulut kaydı başarısız, yerel kaydedildi');
    return { success: false, error: error.message };
  }
}

// Veriyi KV'den al (cloud'dan pull)
export async function pullFromCloud(
  onProgress?: ProgressCallback
): Promise<{ data: any; success: boolean }> {
  try {
    onProgress?.('Buluttan yükleniyor...');

    const response = await fetch(API_URL, { method: 'GET' });

    if (response.status === 404) {
      onProgress?.('Bulutta veri bulunamadı, yerel veri kullanılıyor');
      return { success: false, data: null };
    }

    if (!response.ok) {
      throw new Error('Cloud fetch failed');
    }

    const data = await response.json();
    localStorage.setItem(SYNC_KEY, new Date().toISOString());
    onProgress?.('✅ Buluttan yüklendi');
    return { success: true, data };
  } catch (error: any) {
    console.error('Cloud pull error:', error);
    return { success: false, data: null };
  }
}

// Son senkronizasyon zamanını kontrol et
export function getLastSyncTime(): string | null {
  return localStorage.getItem(SYNC_KEY);
}

// Verinin cloud'da olup olmadığını kontrol et
export async function hasCloudData(): Promise<boolean> {
  try {
    const response = await fetch(API_URL, { method: 'GET' });
    return response.ok;
  } catch {
    return false;
  }
}
