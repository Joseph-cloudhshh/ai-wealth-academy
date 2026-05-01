import { supabase } from './supabase';

const SESSION_KEY = 'admin_session';

async function sha256(text) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (session.expiresAt && Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function createAdminSession() {
  const session = { loggedIn: true, expiresAt: Date.now() + 1000 * 60 * 60 * 8 };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function destroyAdminSession() {
  localStorage.removeItem(SESSION_KEY);
}

export async function verifyAdminPin(pin) {
  const defaultPin = import.meta.env.VITE_ADMIN_DEFAULT_PIN;
  if (!defaultPin) throw new Error("VITE_ADMIN_DEFAULT_PIN env var is not set.");

  // Try fetching stored hash from DB
  const { data, error } = await supabase
    .from('admin_settings')
    .select('admin_pin_hash, id')
    .limit(1)
    .single();

  if (error || !data || !data.admin_pin_hash) {
    // No settings row or no hash yet — compare against default PIN
    if (pin === defaultPin) {
      // Try to upsert a settings row with a hash
      const hash = await sha256(pin);
      await supabase.from('admin_settings').upsert({ admin_pin_hash: hash }, { onConflict: 'id' });
      return true;
    }
    return false;
  }

  const inputHash = await sha256(pin);
  if (inputHash === data.admin_pin_hash) return true;

  // Legacy: plain pin stored (first time after migration)
  if (pin === defaultPin && data.admin_pin_hash === '') return true;

  return false;
}

export async function changeAdminPin(currentPin, newPin) {
  const valid = await verifyAdminPin(currentPin);
  if (!valid) throw new Error('Current PIN is incorrect');
  const hash = await sha256(newPin);
  const { error } = await supabase
    .from('admin_settings')
    .update({ admin_pin_hash: hash, updated_at: new Date().toISOString() })
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}