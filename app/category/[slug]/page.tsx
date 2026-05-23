import { supabase } from '../../../lib/supabase'
import NewsCard from '../../../components/NewsCard'
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

  // تحديث عدد المشاهدات
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
    .limit(3)

  return data || []
}

export default async function NewsPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const news = await getNewsBySlug(slug)

  if (!news) {
    notFound()
  }

  const relatedNews = await getRelatedNews(news.category, news.id)

  return (
    <div className="container-custom py-12">
      {/* عنوان الخبر */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {news.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <FaCalendarAlt size={14} />
            <span>{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaEye size={14} />
            <span>{news.views || 0} مشاهدة</span>
          </div>
          <div className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs">
            {news.category || 'أخبار'}
          </div>
        </div>
      </div>

      {/* صورة الخبر */}
      {news.image && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* محتوى الخبر */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {news.content}
        </p>
      </div>

      {/* أزرار المشاركة */}
      <div className="mb-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold mb-4">شارك الخبر</h3>
        <div className="flex flex-wrap gap-3">
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://deep-source-news-8ctc.vercel.app/news/${news.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
          >
            فيسبوك
          </a>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(`https://deep-source-news-8ctc.vercel.app/news/${news.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
          >
            تويتر
          </a>
          <a 
            href={`https://wa.me/?text=${encodeURIComponent(`${news.title} - https://deep-source-news-8ctc.vercel.app/news/${news.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
          >
            واتساب
          </a>
          <a 
            href={`https://t.me/share/url?url=${encodeURIComponent(`https://deep-source-news-8ctc.vercel.app/news/${news.slug}`)}&text=${encodeURIComponent(news.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
          >
            تلغرام
          </a>
        </div>
      </div>

      {/* أخبار ذات صلة */}
      {relatedNews.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-6 border-r-4 border-red-600 pr-3">أخبار ذات صلة</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}