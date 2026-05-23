import { supabase } from './supabase'

/**
 * رفع صورة إلى Supabase Storage
 * @param {File} file - ملف الصورة من input
 * @returns {Promise<string>} - URL العامة للصورة
 */
export async function uploadImage(file) {
  // 1. التحقق من حجم الملف (الحد الأقصى 5 ميجابايت)
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت')
  }

  // 2. التحقق من نوع الملف
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('نوع الملف غير مدعوم. استخدم JPG, PNG, WEBP أو GIF')
  }

  // 3. إنشاء مسار فريد للملف (تجنب مشاكل الأسماء العربية) [citation:7]
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`
  const filePath = `news-images/${fileName}`

  // 4. رفع الملف إلى Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('news-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    throw new Error('فشل رفع الصورة: ' + uploadError.message)
  }

  // 5. الحصول على URL العامة للصورة
  const { data: publicUrlData } = supabase.storage
    .from('news-images')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}

/**
 * حذف صورة من Storage
 * @param {string} imageUrl - URL الصورة المراد حذفها
 */
export async function deleteImage(imageUrl) {
  if (!imageUrl) return

  // استخراج مسار الملف من URL
  const urlParts = imageUrl.split('/news-images/')
  if (urlParts.length < 2) return

  const filePath = `news-images/${urlParts[1]}`

  const { error } = await supabase.storage
    .from('news-images')
    .remove([filePath])

  if (error) {
    console.error('Delete error:', error)
  }
}