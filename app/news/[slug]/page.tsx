'use client'

import { supabase } from '../../../lib/supabase'
import { use } from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { translateText } from '../../../lib/translate'
import { FaCalendarAlt, FaEye } from 'react-icons/fa'
import { notFound } from 'next/navigation'
import '../../../lib/i18n'

// ============================================================
// مكون الفيديو (تمت الإضافة)
// ============================================================
function NewsVideo({ videoUrl, title, posterImage }: { videoUrl?: string, title: string, posterImage?: string }) {
  if (!videoUrl) return null;
  
  let embedUrl = videoUrl;
  if (videoUrl.includes('youtube.com/watch?v=')) {
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (videoUrl.includes('youtu.be/')) {
    const videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }
  
  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
      {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video 
          src={videoUrl} 
          className="w-full h-full object-cover" 
          controls 
          poster={posterImage || undefined}
        />
      )}
    </div>
  );
}
// ============================================================

async function getNewsBySlug(slug: string) {
  const decodedSlug = decodeURIComponent(slug)
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', decodedSlug)
    .single()

  if (error) {
    return null
  }
  return data
}

export default function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [translatedTitle, setTranslatedTitle] = useState('')
  const [translatedContent, setTranslatedContent] = useState('')
  const [translatedCategory, setTranslatedCategory] = useState('')

  const currentLocale = i18n.language

  // جلب البيانات
  useEffect(() => {
    getNewsBySlug(slug).then(data => {
      setNews(data)
      setLoading(false)
    })
  }, [slug])

  // ترجمة المحتوى عندما تتغير اللغة
  useEffect(() => {
    const translateNews = async () => {
      if (!news) return
      
      setTranslating(true)
      
      if (currentLocale === 'ar') {
        setTranslatedTitle(news.title)
        setTranslatedContent(news.content)
        setTranslatedCategory(news.category || t('news'))
      } else {
        const [title, content, category] = await Promise.all([
          translateText(news.title, currentLocale),
          translateText(news.content, currentLocale),
          translateText(news.category || t('news'), currentLocale),
        ])
        setTranslatedTitle(title)
        setTranslatedContent(content)
        setTranslatedCategory(category)
      }
      
      setTranslating(false)
    }
    
    if (!loading && news) {
      translateNews()
    }
  }, [currentLocale, loading, news, t])

  if (loading || translating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!news) {
    notFound()
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {translatedTitle}
      </h1>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b">
        <div className="flex items-center gap-1">
          <FaCalendarAlt size={14} />
          <span>{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaEye size={14} />
          <span>{(news.views || 0).toLocaleString()} {t('views')}</span>
        </div>
        <div className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
          {translatedCategory}
        </div>
      </div>

      {/* ========== عرض الفيديو إذا كان موجوداً، وإلا عرض الصورة ========== */}
      {news.video_url ? (
        <NewsVideo videoUrl={news.video_url} title={translatedTitle} posterImage={news.image} />
      ) : (
        news.image && <img src={news.image} alt={translatedTitle} className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-8" />
      )}
      {/* ================================================================ */}

      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {translatedContent}
      </div>
    </div>
  )
}