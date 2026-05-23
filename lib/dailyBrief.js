import { supabase } from './supabase'

// جلب عناصر الجريدة اليومية
export async function getDailyBrief() {
    const { data, error } = await supabase
        .from('daily_brief')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    
    if (error) return []
    return data
}

// جلب جميع العناصر (للوحة التحكم)
export async function getAllDailyBrief() {
    const { data, error } = await supabase
        .from('daily_brief')
        .select('*')
        .order('order_index', { ascending: true })
    
    if (error) return []
    return data
}

// إضافة عنصر جديد
export async function addDailyBriefItem(section_title, title, description, link_url = '', section_icon = '📰') {
    const { data: maxOrder } = await supabase
        .from('daily_brief')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
    
    const newOrder = (maxOrder?.[0]?.order_index || 0) + 1
    
    const { data, error } = await supabase
        .from('daily_brief')
        .insert([{
            section_title,
            section_icon,
            title,
            description,
            link_url,
            order_index: newOrder,
            is_active: true
        }])
    
    return { data, error }
}

// تحديث عنصر
export async function updateDailyBriefItem(id, updates) {
    const { error } = await supabase
        .from('daily_brief')
        .update(updates)
        .eq('id', id)
    
    return { error }
}

// حذف عنصر
export async function deleteDailyBriefItem(id) {
    const { error } = await supabase
        .from('daily_brief')
        .delete()
        .eq('id', id)
    
    return { error }
}

// تحديث الترتيب
export async function updateDailyBriefOrder(items) {
    for (const item of items) {
        await supabase
            .from('daily_brief')
            .update({ order_index: item.order_index })
            .eq('id', item.id)
    }
    return { success: true }
}

// تفعيل/تعطيل عنصر
export async function toggleDailyBriefItem(id, isActive) {
    const { error } = await supabase
        .from('daily_brief')
        .update({ is_active: isActive })
        .eq('id', id)
    
    return { error }
}