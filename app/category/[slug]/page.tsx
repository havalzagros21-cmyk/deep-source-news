import { supabase } from '../../../lib/supabase'
import NewsCard from '../../../components/NewsCard'
import ShareButtons from '../../../components/ShareButtons'
import { FaCalendarAlt, FaEye } from 'react-icons/fa'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return null
  }

  // تحديث عدد المشاهدات (غير متزامن - لا ننتظر النتيجة)
  await supabase
    .from('news')
    .update({ views: (data.views || 0) + 1 })
    .eq('id', data.id)

  return data as NewsItem
}

async function getRelatedNews(category: string, currentId: string): Promise<NewsItem[]> {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .order('created_at', { ascending: false })
    .limit(4)  // زيادة عدد الأخبار ذات الصلة من 3 إلى 4

  return data || []
}

// الحصول على عنوان الموقع من متغيرات البيئة
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://deep-source-news-8ctc.vercel.app'

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const relatedNews = await getRelatedNews(news.category, news.id)

  return (
    <div className="container-custom py-8 md:py-12">
      
      {/* عنوان الخبر */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {news.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <FaCalendarAlt size={14} />
            <span>{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye size={14} />
            <span>{(news.views || 0).toLocaleString('ar-EG')} مشاهدة</span>
          </div>
          <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium">
            {news.category || 'أخبار'}
          </div>
        </div>
      </div>

      {/* صورة الخبر */}
      {news.image && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-auto max-h-[500px] object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      )}

      {/* محتوى الخبر - مع تحسين العرض */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {news.content}
        </div>
      </div>

      {/* أزرار المشاركة - استخدام المكون الجديد */}
      <div className="mb-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <ShareButtons 
          url={`${SITE_URL}/news/${news.slug}`}
          title={news.title}
          description={news.description || news.content.substring(0, 200)}
          image={news.image}
        />
      </div>

      {/* أخبار ذات صلة */}
      {relatedNews.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-6 w-1 bg-red-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              أخبار ذات صلة
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      )}

      {/* زر العودة إلى الأعلى (يظهر في الصفحة فقط) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="العودة إلى الأعلى"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </div>
  )
}