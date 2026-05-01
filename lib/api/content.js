import { supabase } from '../supabase';

export async function fetchContentByCourse(courseId) {
  const { data, error } = await supabase
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data || [];
}

export async function createContent(contentData) {
  const { data, error } = await supabase
    .from('course_content')
    .insert(contentData)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateContent(id, updates) {
  const { data, error } = await supabase
    .from('course_content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteContent(id) {
  const { error } = await supabase.from('course_content').delete().eq('id', id);
  if (error) throw error;
}

// Transform flat content rows into modules/lessons shape the frontend expects
export function contentToModules(contentRows) {
  if (!contentRows || contentRows.length === 0) return [];
  return [
    {
      id: 'main',
      title: 'Course Content',
      lessons: contentRows.map((row) => ({
        id: row.id,
        title: row.title,
        type: row.content_type,
        url: row.content_url || '',
        duration: null,
      })),
    },
  ];
}