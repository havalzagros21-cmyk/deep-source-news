'use client'

import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { translateText } from '../lib/translate'
import { FaCalendar, FaPlay } from 'react-icons/fa'
import '../lib/i18n'

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image: string
  slug: string
  views: number
  video_url?: string
  video_type?: string
  description?: string
  created_at: string
}

function getYouTubeId(url: string | undefined): string {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : ''
}

export default function NewsCard({ news }: { news: NewsItem }) {
  const { t, i18n } = useTranslation()
  const [translatedTitle, setTranslatedTitle] = useState(news.title)
  const [translatedCategory, setTranslatedCategory] = useState(news.category || t('news'))
  const [translatedDescription, setTranslatedDescription] = useState(news.description || news.content || t('noDescription'))
  const [mounted, setMounted] = useState(false)

  const currentLocale = i18n.language
  const date = new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')
  const hasVideo = news.video_url && news.video_url !== '' && news.video_type !== 'none'
  const fullText = news.description || news.content || ''

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const translateCard = async () => {
      if (currentLocale === 'ar') {
        setTranslatedTitle(news.title)
        setTranslatedCategory(news.category || t('news'))
        setTranslatedDescription(fullText || t('noDescription'))
      } else {
        const [title, category, description] = await Promise.all([
          translateText(news.title, currentLocale),
          translateText(news.category || t('news'), currentLocale),
          translateText(fullText || t('noDescription'), currentLocale),
        ])
        setTranslatedTitle(title)
        setTranslatedCategory(category)
        setTranslatedDescription(description)
      }
    }
    
    translateCard()
  }, [currentLocale, news.title, news.category, fullText, t])

  if (!mounted) {
    return (
      <Link href={`/news/${encodeURIComponent(news.slug)}`} className="block h-full group perspective-1000">
        <div className="h-full flex flex-col overflow-hidden transition-all duration-300">
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
          <div className="pt-3 flex-1 flex flex-col">
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="w-full h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/news/${encodeURIComponent(news.slug)}`} className="block h-full group perspective-1000">
      <div className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:scale-[1.02]">
        
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-video">
          {hasVideo && news.video_type === 'upload' ? (
            <video 
              src={news.video_url}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          ) : hasVideo && news.video_type === 'youtube' && news.video_url ? (
            <img 
              src={`https://img.youtube.com/vi/${getYouTubeId(news.video_url)}/mqdefault.jpg`}
              alt={translatedTitle}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = news.image || 'https://placehold.co/600x400/d1d5db/9ca3af?text=صورة'
              }}
            />
          ) : (
            <img 
              src={news.image || 'https://placehold.co/600x400/d1d5db/9ca3af?text=صورة'} 
              alt={translatedTitle} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          
          {hasVideo && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 flex items-center gap-1">
              <FaPlay size={8} /> {t('video')}
            </div>
          )}
        </div>
        
        <div className="pt-3 flex-1 flex flex-col">
          <span className="text-red-600 dark:text-red-500 text-xs font-semibold uppercase tracking-wide mb-1">
            {translatedCategory}
          </span>
          
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors duration-200 leading-tight">
            {translatedTitle}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed line-clamp-3">
            {translatedDescription}
          </p>
          
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-500">
            <FaCalendar size={10} />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}