import { supabase } from '../supabase';

export async function fetchAllTokens() {
  const { data, error } = await supabase
    .from('access_tokens')
    .select('*, courses(title, slug)')
    .order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function createToken(tokenData) {
  const { data, error } = await supabase
    .from('access_tokens')
    .insert({
      ...tokenData,
      token: tokenData.token.toUpperCase(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateToken(id, updates) {
  const payload = { ...updates };
  if (payload.token) payload.token = payload.token.toUpperCase();
  const { data, error } = await supabase
    .from('access_tokens')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteToken(id) {
  const { error } = await supabase.from('access_tokens').delete().eq('id', id);
  if (error) throw error;
}

export async function verifyToken(courseSlug, tokenValue) {
  // Find course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single();
  if (courseErr || !course) return { success: false, message: 'Course not found' };

  // Find token
  const { data: token, error: tokenErr } = await supabase
    .from('access_tokens')
    .select('*')
    .eq('token', tokenValue.toUpperCase())
    .eq('course_id', course.id)
    .single();

  if (tokenErr || !token) return { success: false, message: 'Invalid token' };
  if (!token.active) return { success: false, message: 'Token is disabled' };
  if (token.expires_at && new Date(token.expires_at) < new Date()) {
    return { success: false, message: 'Token has expired' };
  }
  if (token.usage_count >= token.usage_limit) {
    return { success: false, message: 'Token usage limit reached' };
  }

  // Increment usage count
  await supabase
    .from('access_tokens')
    .update({ usage_count: token.usage_count + 1 })
    .eq('id', token.id);

  // Create session record
  const sessionKey = `${courseSlug}-${Date.now()}`;
  await supabase.from('token_sessions').insert({
    course_id: course.id,
    token_id: token.id,
    session_key: sessionKey,
  });

  // Store access in sessionStorage
  const accessKey = `course_access_${courseSlug}`;
  sessionStorage.setItem(accessKey, sessionKey);

  return { success: true, sessionKey };
}

export function hasCourseAccess(courseSlug) {
  return !!sessionStorage.getItem(`course_access_${courseSlug}`);
}