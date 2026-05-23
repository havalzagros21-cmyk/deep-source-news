'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { isAuthenticated } from '../../lib/auth'
import { uploadImage } from '../../lib/uploadImage'
import { FaSave, FaPlus, FaUpload, FaTrash, FaSpinner, FaImage, FaVideo, FaYoutube, FaVimeo, FaLock } from 'react-icons/fa'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // التحقق من صلاحية الدخول
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      if (!authenticated) {
        router.push('/login')
      } else {
        setIsAuthorized(true)
      }
      setLoadingAuth(false)
    }
    checkAuth()
  }, [router])

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    slug: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null)
  
  // حالات الفيديو
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoType, setVideoType] = useState('none')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoPreview, setVideoPreview] = useState('')

  // إذا كان لا يزال يتحقق من الصلاحية
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // إذا لم يكن مصرح له، لا يظهر شيء (سيتم التوجيه إلى login)
  if (!isAuthorized) {
    return null
  }

  // دالة لإنشاء slug تلقائياً من العنوان
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    setForm(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'title' ? generateSlug(value) : prev.slug
    }))
  }

  // دالة رفع الصورة
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setMessage('')

    try {
      const imageUrl = await uploadImage(file)
      setForm(prev => ({ ...prev, image: imageUrl }))
      setMessage('✅ تم رفع الصورة بنجاح!')
    } catch (error) {
      setMessage('❌ ' + error.message)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // حذف الصورة المرفوعة
  const handleRemoveImage = () => {
    setForm(prev => ({ ...prev, image: '' }))
    setMessage('🗑️ تم إزالة الصورة')
  }

  // ============================================================
  // دوال رفع الفيديو
  // ============================================================

  const uploadVideo = async (file) => {
    if (!file) return null
    
    if (file.size > 50 * 1024 * 1024) {
      setMessage('❌ حجم الفيديو يجب أن لا يتجاوز 50 ميجابايت')
      return null
    }
    
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setMessage('❌ صيغة الفيديو غير مدعومة. استخدم MP4, WebM, أو MOV')
      return null
    }
    
    setUploadingVideo(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `video-${Date.now()}.${fileExt}`
      const filePath = `videos/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        })
      
      if (uploadError) throw uploadError
      
      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)
      
      return publicUrlData.publicUrl
    } catch (error) {
      setMessage('❌ خطأ في رفع الفيديو: ' + error.message)
      return null
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setVideoFile(file)
    setVideoType('upload')
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
  }

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ''
  }

  const getVimeoId = (url) => {
    const regExp = /vimeo\.com\/(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : ''
  }

  const handleVideoUrlChange = (e) => {
    const url = e.target.value
    setVideoUrl(url)
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setVideoType('youtube')
      const videoId = getYouTubeId(url)
      setVideoPreview(`https://www.youtube.com/embed/${videoId}`)
    } else if (url.includes('vimeo.com')) {
      setVideoType('vimeo')
      const videoId = getVimeoId(url)
      setVideoPreview(`https://player.vimeo.com/video/${videoId}`)
    } else if (url) {
      setVideoType('upload')
      setVideoPreview(url)
    } else {
      setVideoType('none')
      setVideoPreview('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    let finalVideoUrl = ''
    let finalVideoType = 'none'

    if (videoType === 'upload' && videoFile) {
      const uploadedUrl = await uploadVideo(videoFile)
      if (uploadedUrl) {
        finalVideoUrl = uploadedUrl
        finalVideoType = 'upload'
      }
    } else if (videoType === 'youtube' || videoType === 'vimeo') {
      finalVideoUrl = videoUrl
      finalVideoType = videoType
    }

    const finalSlug = form.slug || generateSlug(form.title)

    const { error } = await supabase
      .from('news')
      .insert([{
        id: crypto.randomUUID(),
        title: form.title,
        description: form.description,
        content: form.content,
        category: form.category,
        slug: finalSlug,
        image: form.image,
        video_url: finalVideoUrl,
        video_type: finalVideoType,
        created_at: new Date().toISOString(),
        views: 0,
      }])

    if (error) {
      setMessage('❌ خطأ: ' + error.message)
    } else {
      setMessage('✅ تم نشر الخبر بنجاح!')
      setForm({
        title: '',
        description: '',
        content: '',
        category: '',
        slug: '',
        image: '',
      })
      setVideoFile(null)
      setVideoUrl('')
      setVideoType('none')
      setVideoPreview('')
    }
    setLoading(false)
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-cardBg rounded-2xl shadow-xl p-8">
        {/* شعار الحماية */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaPlus className="text-red-600" /> إضافة خبر جديد
          </h1>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm">
            <FaLock size={12} /> منطقة آمنة - للمالك فقط
          </div>
        </div>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-700' : message.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-2">العنوان *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">🖼️ الصورة الرئيسية</label>
            
            {form.image && (
              <div className="mb-4 relative inline-block">
                <img 
                  src={form.image} 
                  alt="Preview" 
                  className="w-40 h-40 object-cover rounded-lg border-2 border-red-500"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                {uploadingImage ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                {uploadingImage ? 'جاري الرفع...' : 'اختر صورة من جهازك'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.image && (
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <FaImage /> تم رفع الصورة
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mt-2">
              الحد الأقصى 5MB. الصيغ المدعومة: JPG, PNG, WEBP, GIF
            </p>
          </div>

          <div className="border-t pt-6 mt-4">
            <label className="block font-bold mb-4 text-lg">🎬 إضافة فيديو (اختياري)</label>
            
            <div className="flex gap-4 mb-4 flex-wrap">
              <label className="flex items-center gap-2">
                <input type="radio" name="videoType" checked={videoType === 'none'} onChange={() => {
                  setVideoType('none')
                  setVideoFile(null)
                  setVideoUrl('')
                  setVideoPreview('')
                }} />
                <span>بدون فيديو</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="videoType" checked={videoType === 'upload'} onChange={() => setVideoType('upload')} />
                <span><FaVideo className="inline ml-1" /> رفع فيديو من الجهاز</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="videoType" checked={videoType === 'youtube'} onChange={() => setVideoType('youtube')} />
                <span><FaYoutube className="inline ml-1 text-red-600" /> رابط YouTube</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="videoType" checked={videoType === 'vimeo'} onChange={() => setVideoType('vimeo')} />
                <span><FaVimeo className="inline ml-1 text-blue-500" /> رابط Vimeo</span>
              </label>
            </div>
            
            {videoType === 'upload' && (
              <div className="mb-4">
                <label className="block font-bold mb-2">اختر فيديو من جهازك</label>
                <input 
                  type="file" 
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="w-full p-3 rounded-lg border dark:bg-gray-900"
                />
                <p className="text-gray-500 text-sm mt-1">الصيغ المدعومة: MP4, WebM, MOV (الحد الأقصى 50MB)</p>
                
                {uploadingVideo && (
                  <div className="mt-2 flex items-center gap-2 text-blue-500">
                    <FaSpinner className="animate-spin" /> جاري رفع الفيديو...
                  </div>
                )}
              </div>
            )}
            
            {(videoType === 'youtube' || videoType === 'vimeo') && (
              <div className="mb-4">
                <label className="block font-bold mb-2">
                  {videoType === 'youtube' ? 'رابط YouTube' : 'رابط Vimeo'}
                </label>
                <input 
                  type="url" 
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                  placeholder={videoType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://vimeo.com/...'}
                  className="w-full p-3 rounded-lg border dark:bg-gray-900"
                />
              </div>
            )}
            
            {videoPreview && (videoType === 'upload' || videoType === 'youtube' || videoType === 'vimeo') && (
              <div className="mt-4">
                <label className="block font-bold mb-2">معاينة الفيديو</label>
                {videoType === 'upload' ? (
                  <video controls className="w-full max-h-64 rounded-lg">
                    <source src={videoPreview} />
                    متصفحك لا يدعم تشغيل الفيديو
                  </video>
                ) : (
                  <iframe 
                    src={videoPreview} 
                    className="w-full h-64 rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold mb-2">الوصف المختصر</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">التصنيف</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="مثال: سياسة, تكنولوجيا, اقتصاد"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">
              Slug (رابط مخصص)
              <span className="text-gray-500 text-sm mr-2">(اتركه فارغاً لينشأ تلقائياً)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">/news/</span>
              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="ai-is-changing-world"
                className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2">المحتوى * (HTML مسموح)</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={12}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 font-mono"
            />
            <p className="text-gray-500 text-sm mt-1">
              يمكنك استخدام HTML لتنسيق المحتوى: {'<p>'}، {'<h2>'}، {'<strong>'}، {'<ul>'}، {'<img>'}...
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImage || uploadingVideo}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {loading ? 'جاري النشر...' : 'نشر الخبر'}
          </button>
        </form>
      </div>
    </div>
  )
}