import { supabase } from '../supabase';

export async function fetchActiveReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchAllReviewsAdmin() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createReview(data) {
  const { data: created, error } = await supabase
    .from('reviews')
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return created;
}

export async function updateReview(id, updates) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}