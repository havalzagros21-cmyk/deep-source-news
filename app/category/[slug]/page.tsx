'use client'

import { supabase } from '../../../lib/supabase'
import NewsCard from '../../../components/NewsCard'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { translateNewsList } from '../../../lib/translate'
import { FaNewspaper } from 'react-icons/fa'
import '../../../lib/i18n'

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image: string
  slug: string
  views: number
  description?: string
  created_at: string
}

async function getNewsByCategory(category: string): Promise<NewsItem[]> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  return data || []
}

// ترجمة أسماء التصنيفات
const categoryNames: Record<string, Record<string, string>> = {
  ar: {
    politics: 'سياسة',
    economy: 'اقتصاد',
    tech: 'تكنولوجيا',
    sports: 'رياضة',
    opinions: 'آراء',
    zodiac: 'أبراج الفلك',
    misc: 'منوعات',
  },
  en: {
    politics: 'Politics',
    economy: 'Economy',
    tech: 'Technology',
    sports: 'Sports',
    opinions: 'Opinions',
    zodiac: 'Zodiac',
    misc: 'Misc',
  },
  ku: {
    politics: 'Siyaset',
    economy: 'Aborî',
    tech: 'Teknolojî',
    sports: 'Werzîş',
    opinions: 'Raman',
    zodiac: 'Astrolojî',
    misc: 'Cûrbecûr',
  },
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t, i18n } = useTranslation()
  const [news, setNews] = useState<NewsItem[]>([])
  const [translatedNews, setTranslatedNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [categorySlug, setCategorySlug] = useState<string>('')

  const currentLocale = i18n.language

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const resolvedParams = await params
      const slug = resolvedParams.slug
      setCategorySlug(slug)
      
      const newsData = await getNewsByCategory(slug)
      setNews(newsData)
      setLoading(false)
    }
    
    fetchData()
  }, [params])

  useEffect(() => {
    const translateData = async () => {
      if (news.length === 0) {
        setTranslatedNews([])
        return
      }
      
      if (currentLocale === 'ar') {
        setTranslatedNews(news)
      } else {
        const translated = await translateNewsList(news, currentLocale)
        setTranslatedNews(translated)
      }
    }
    
    if (!loading && news) {
      translateData()
    }
  }, [currentLocale, loading, news])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const categoryName = categoryNames[currentLocale]?.[categorySlug] || categorySlug

  return (
    <div className="container-custom py-8">
      {/* عنوان التصنيف */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-red-500 rounded-full"></div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {categoryName}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('latestNews')} {categoryName}
        </p>
      </div>

      {/* قائمة الأخبار */}
      {translatedNews.length === 0 ? (
        <div className="text-center py-20">
          <FaNewspaper className="text-gray-300 dark:text-gray-700 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
            {t('noResults')}
          </h3>
          <p className="text-gray-400 dark:text-gray-500 mt-2">
            لا توجد أخبار في هذا التصنيف حالياً
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translatedNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  )
}