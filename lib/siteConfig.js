import { supabase } from './supabase'

// ============================================
// دوال الشريط المتحرك (Ticker)
// ============================================

// جلب عناصر الشريط النشطة للعرض في الموقع
export async function getTickerItems() {
    const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
    
    if (error) return []
    return data
}

// جلب جميع عناصر الشريط (للوحة التحكم)
export async function getAllTickerItems() {
    const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .order('order_index', { ascending: true })
    
    if (error) return []
    return data
}

// إضافة عنصر جديد إلى الشريط (يدوي بالكامل)
export async function addCustomTickerItem(text, linkUrl = '', linkText = '', isExternal = false) {
    // الحصول على أكبر order_index
    const { data: maxOrder } = await supabase
        .from('ticker_items')
        .select('order_index')
        .order('order_index', { ascending: false })
        .limit(1)
    
    const newOrder = (maxOrder?.[0]?.order_index || 0) + 1
    
    const { data, error } = await supabase
        .from('ticker_items')
        .insert([{
            text_content: text,
            link_url: linkUrl,
            link_text: linkText,
            is_external: isExternal,
            order_index: newOrder,
            is_active: true
        }])
    
    return { data, error }
}

// تحديث عنصر في الشريط
export async function updateTickerItem(id, updates) {
    const { error } = await supabase
        .from('ticker_items')
        .update(updates)
        .eq('id', id)
    
    return { error }
}

// حذف عنصر من الشريط
export async function deleteTickerItem(id) {
    const { error } = await supabase
        .from('ticker_items')
        .delete()
        .eq('id', id)
    
    return { error }
}

// تحديث ترتيب العناصر
export async function updateTickerOrder(items) {
    for (const item of items) {
        await supabase
            .from('ticker_items')
            .update({ order_index: item.order_index })
            .eq('id', item.id)
    }
    return { success: true }
}

// تفعيل/تعطيل عنصر
export async function toggleTickerItem(id, isActive) {
    const { error } = await supabase
        .from('ticker_items')
        .update({ is_active: isActive })
        .eq('id', id)
    
    return { error }
}

// ============================================
// دوال البانر العلوي (Hero Section)
// ============================================

// جلب البانر العلوي
export async function getHeroSection() {
    const { data, error } = await supabase
        .from('hero_section')
        .select('*')
        .single()
    
    if (error || !data) {
        return {
            title: 'آخر الأخبار العميقة',
            subtitle: 'تحليلات لا تجدها في أي مكان آخر',
            background_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920',
            overlay_opacity: 20,
            button_text: 'استكشف الأخبار',
            button_link: '/news',
            is_enabled: true,
        }
    }
    return data
}

// تحديث البانر العلوي
export async function updateHeroSection(settings) {
    const { data: existing } = await supabase
        .from('hero_section')
        .select('id')
        .maybeSingle()
    
    let result
    if (existing) {
        result = await supabase
            .from('hero_section')
            .update({ 
                ...settings, 
                updated_at: new Date().toISOString() 
            })
            .eq('id', existing.id)
    } else {
        result = await supabase
            .from('hero_section')
            .insert([settings])
    }
    
    return result
}

// رفع صورة
export async function uploadThemeImage(file, folder) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder}-${Date.now()}.${fileExt}`
    const filePath = `theme/${fileName}`
    
    const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        })
    
    if (uploadError) throw uploadError
    
    const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)
    
    return publicUrlData.publicUrl
}

// ============================================
// دوال إعدادات الموقع
// ============================================

// جلب إعدادات الموقع
export async function getSiteSettings() {
    const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single()
    
    if (error) {
        return {
            site_name: 'ديب سورس نيوز',
            telegram_url: 'https://t.me/deepsourc',
            primary_color: '#dc2626',
            ticker_speed: 4000,
        }
    }
    return data
}