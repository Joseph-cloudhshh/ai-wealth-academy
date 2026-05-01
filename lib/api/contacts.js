import { supabase } from '../supabase';

export async function submitContactMessage({ name, email, message }) {
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, message });
  if (error) throw error;
}

export async function fetchContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchContactInfo() {
  const { data, error } = await supabase
    .from('admin_settings')
    .select('email, whatsapp, telegram, discord, tiktok, instagram, site_name')
    .limit(1)
    .single();
  if (error) return null;
  return data;
}