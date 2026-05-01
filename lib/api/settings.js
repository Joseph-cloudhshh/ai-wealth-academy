import { supabase } from '../supabase';

export async function fetchSettings() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('site_name, hero_title, hero_subtitle')
    .limit(1)
    .single();
  if (error) return null;
  return data;
}

export async function updateSettings(updates) {
  const { data: existing } = await supabase
    .from('admin_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { error } = await supabase
      .from('admin_settings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('admin_settings').insert(updates);
    if (error) throw error;
  }
}