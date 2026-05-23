// components/TemplateSection.tsx
import ImageSlider from './ImageSlider'
import NewsCard from './NewsCard'

interface NewsItem {
  id: string
  title: string
  slug: string
  image: string
  category: string
  created_at: string
  views?: number
}

interface TemplateSectionProps {
  rightNews: NewsItem[]
  leftNews: NewsItem[]
  rightTitle: string
  leftTitle: string
  rightIcon?: React.ReactNode
  leftIcon?: React.ReactNode
  rightColor?: string
  leftColor?: string
  smallNews: NewsItem[]
  largeNews: NewsItem[]
  bgColor?: string
}

export default function TemplateSection({
  rightNews,
  leftNews,
  rightTitle,
  leftTitle,
  rightIcon,
  leftIcon,
  rightColor = "text-red-600",
  leftColor = "text-red-600",
  smallNews,
  largeNews,
  bgColor = ""
}: TemplateSectionProps) {
  return (
    <div className={bgColor}>
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* القائمة اليمنى */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 h-full flex flex-col rounded-xl">
              <h3 className={`${rightColor} font-bold text-lg mb-3 border-r-2 border-current pr-2 flex items-center gap-2`}>
                {rightIcon} {rightTitle}
              </h3>
              <div className="space-y-3 flex-1">
                {rightNews.map((news, idx) => (
                  <a key={news.id} href={`/news/${news.slug}`} className="block group hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-all duration-200">
                    <div className="flex gap-2">
                      <span className={`${rightColor} font-bold text-sm min-w-[24px]`}>{idx + 1}.</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-600 transition-colors">{news.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                          {news.views !== undefined && (
                            <span className="text-red-400 text-xs">{news.views} مشاهدة</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* السلايدر + أخبار تحته */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <ImageSlider />
            
            {/* 3 أخبار صغيرة تحت السلايدر */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {smallNews.map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-3 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 rounded-lg">
                  <a href={`/news/${news.slug}`} className="block">
                    <div className="flex gap-3">
                      {news.image && (
                        <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded" />
                      )}
                      <div className="flex-1">
                        <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                        <h4 className="font-bold text-sm line-clamp-2 mt-1 group-hover:text-red-600 transition-colors">{news.title}</h4>
                        <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            
            {/* 3 أخبار كبيرة تحت الصغيرة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {largeNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </div>

          {/* القائمة اليسرى */}
          <div className="lg:col-span-3 order-3">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 h-full flex flex-col rounded-xl">
              <h3 className={`${leftColor} font-bold text-lg mb-3 border-r-2 border-current pr-2 flex items-center gap-2`}>
                {leftIcon} {leftTitle}
              </h3>
              <div className="space-y-3 flex-1">
                {leftNews.map((news, idx) => (
                  <a key={news.id} href={`/news/${news.slug}`} className="block group hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition-all duration-200">
                    <div className="flex gap-2">
                      <span className={`${leftColor} font-bold text-sm min-w-[24px]`}>{idx + 1}.</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-600 transition-colors">{news.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                          {news.views !== undefined && (
                            <span className="text-red-400 text-xs">{news.views} مشاهدة</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}