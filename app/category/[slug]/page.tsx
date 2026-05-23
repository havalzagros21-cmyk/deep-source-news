import { supabase } from '../../../lib/supabase'
import NewsCard from '../../../components/NewsCard'
import { notFound } from 'next/navigation'
import { FaFolderOpen } from 'react-icons/fa'

// تعريف نوع البيانات
interface Category {
  id: number
  name: string
  slug: string
}

interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image: string
  slug: string
  views: number
  created_at: string
}

// جلب بيانات التصنيف باستخدام slug
async function getCategoryBySlug(slug: string): Promise<Category | null> {
  // خريطة التصنيفات (جميع التصنيفات)
  const categoryMap: Record<string, { name: string; slug: string }> = {
    'politics': { name: 'سياسة', slug: 'politics' },
    'economy': { name: 'اقتصاد', slug: 'economy' },
    'tech': { name: 'تكنولوجيا', slug: 'tech' },
    'culture': { name: 'ثقافة', slug: 'culture' },
    'opinions': { name: 'آراء', slug: 'opinions' },
    'zodiac': { name: 'أبراج الفلك', slug: 'zodiac' },
    'misc': { name: 'منوعات', slug: 'misc' },
  }

  const category = categoryMap[slug]
  if (!category) return null

  return { id: 0, name: category.name, slug: category.slug }
}

// جلب الأخبار حسب التصنيف
async function getNewsByCategory(categoryName: string): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', categoryName)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching news by category:', error)
    return []
  }

  return data as NewsItem[]
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  // استخراج slug من params
  const resolvedParams = await params
  const slug = resolvedParams.slug

  // جلب بيانات التصنيف
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  // جلب الأخبار المرتبطة بهذا التصنيف
  const news = await getNewsByCategory(category.name)

  return (
    <div className="container-custom py-12">
      {/* عنوان التصنيف */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
          <FaFolderOpen className="text-red-600" />
          {category.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          آخر الأخبار والتحليلات في قسم {category.name}
        </p>
      </div>

      {/* عرض الأخبار */}
      {news.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">لا توجد أخبار في هذا التصنيف بعد</p>
          <p className="text-gray-400 mt-2">سيتم إضافة محتوى قريباً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  )
}