import { supabase } from '../../../lib/supabase'
import NewsCard from '../../../components/NewsCard'
import { FaFolderOpen } from 'react-icons/fa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// خريطة التصنيفات
const categories: Record<string, string> = {
  'politics': 'سياسة',
  'economy': 'اقتصاد',
  'tech': 'تكنولوجيا',
  'culture': 'ثقافة',
  'opinions': 'آراء',
  'zodiac': 'أبراج الفلك',
  'misc': 'منوعات',
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const categoryName = categories[slug]

  if (!categoryName) {
    return <div className="container-custom py-20 text-center">القسم غير موجود</div>
  }

  // جلب الأخبار
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false })

  console.log('التصنيف:', slug)
  console.log('عدد الأخبار:', news?.length)

  return (
    <div className="container-custom py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
          <FaFolderOpen className="text-red-600" />
          {categoryName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          آخر الأخبار والتحليلات في قسم {categoryName}
        </p>
      </div>

      {!news || news.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">لا توجد أخبار في هذا التصنيف بعد</p>
          <p className="text-gray-400 mt-2">سيتم إضافة محتوى قريباً</p>
          <p className="text-gray-400 text-sm mt-4">التصنيف المطلوب: {slug}</p>
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