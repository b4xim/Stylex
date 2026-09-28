/**
 * Robust LocalStorage Wrapper with QuotaExceeded Protection & Auto-Purge
 */

export function cleanObsoleteStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;

      // Purge legacy version keys that consume valuable quota
      if (
        k.includes('_v1_') ||
        k.includes('_v2_') ||
        k.includes('_v3_') ||
        k.includes('_v4_') ||
        k.includes('_v5_') ||
        k.includes('_v6_appointments') ||
        k.startsWith('stylex_mock_') ||
        k.startsWith('stylex_test_') ||
        k.startsWith('temp_') ||
        k.startsWith('scratch_')
      ) {
        keysToRemove.push(k);
      }
    }

    keysToRemove.forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {}
    });
  } catch {}
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (err: any) {
    console.warn(`[StyleX Storage] Storage error for "${key}":`, err?.message || err);

    // If quota exceeded, clean up old keys and retry
    try {
      cleanObsoleteStorage();

      // For large appointment lists, trim down to avoid hitting quota
      if (key.includes('appointments')) {
        try {
          const arr = JSON.parse(value);
          if (Array.isArray(arr)) {
            // Keep recent 40 items and strip base64 avatars
            const trimmed = arr.slice(0, 40).map((apt: any) => ({
              ...apt,
              stylistAvatar: apt.stylistAvatar?.startsWith('data:') ? '' : apt.stylistAvatar,
            }));
            localStorage.setItem(key, JSON.stringify(trimmed));
            return;
          }
        } catch {}
      }

      // Retry standard write
      localStorage.setItem(key, value);
    } catch (retryErr) {
      console.warn(`[StyleX Storage] Failed to persist "${key}" after quota cleanup. Skipping local cache.`);
      // Never re-throw, so React component never crashes
    }
  }
}

export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw || raw === 'undefined' || raw === 'null') return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch {
    return fallback;
  }
}
