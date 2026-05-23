import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'
import NewsTicker from '../components/NewsTicker'
import ImageSlider from '../components/ImageSlider'
import { FaNewspaper, FaCalendarAlt, FaChartLine, FaGlobe, FaUsers, FaFire, FaChartBar, FaEye, FaStar } from 'react-icons/fa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHeroSection() {
  const { data, error } = await supabase
    .from('hero_section')
    .select('*')
    .single()
  
  if (error || !data) {
    return {
      title: 'آخر الأخبار العميقة',
      subtitle: 'تحليلات لا تجدها في أي مكان آخر',
      background_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920',
      overlay_opacity: 20,
      button_text: 'استكشف الأخبار',
      button_link: '/',
      is_enabled: true,
    }
  }
  return data
}

async function getBreakingNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

async function getMainNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
  return data?.[0] || null
}

async function getSideNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)
  return data || []
}

async function getSmallNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)
  return data || []
}

async function getLargeNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)
  return data || []
}

async function getRegularNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12)
  return data || []
}

async function getExtraNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)
  return data || []
}

async function getSliderNews() {
  const { data } = await supabase
    .from('news')
    .select('id, title, description, image, slug, category')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

const economicAnalysisText = `هنا يمكنك كتابة التحليلات الاقتصادية.`
const ourVisionText = `هنا يمكنك كتابة رؤيتك وأهداف منصتك.`
const zodiacTodayText = `🍀 برج الحمل: يوم مليء بالطاقة.`

const stats = [
  { icon: FaGlobe, value: '120+', label: 'دولة' },
  { icon: FaUsers, value: '50K+', label: 'قارئ' },
  { icon: FaChartLine, value: '10K+', label: 'مقال' },
  { icon: FaCalendarAlt, value: 'منذ 2024', label: 'الانطلاق' },
]

export default async function Home() {
  try {
    const [hero, breakingNews, mainNews, sideNews, smallNews, largeNews, regularNews, extraNews, sliderNews] = await Promise.all([
      getHeroSection(),
      getBreakingNews(),
      getMainNews(),
      getSideNews(),
      getSmallNews(),
      getLargeNews(),
      getRegularNews(),
      getExtraNews(),
      getSliderNews(),
    ])

    const showHero = hero.is_enabled !== false

    const breakingGroup = breakingNews.slice(0, 4)
    const sideGroup = sideNews.slice(0, 4)

    const smallGroups = [
      smallNews.slice(0, 3),
      smallNews.slice(3, 6),
      smallNews.slice(6, 9),
    ]

    const largeGroups = [
      largeNews.slice(0, 3),
      largeNews.slice(3, 6),
      largeNews.slice(6, 9),
    ]

    const regularGroup1 = regularNews.slice(0, 4)
    const regularGroup2 = regularNews.slice(4, 8)
    const regularGroup3 = regularNews.slice(8, 12)
    const extraGroup = extraNews.slice(0, 3)

    const NumberedListWithImage = ({ items, color = "text-red-600" }: any) => (
      <div className="space-y-2">
        {items.map((news: any, idx: number) => (
          <a key={news.id} href={`/news/${news.slug}`} className="flex gap-2 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition">
            {news.image && <img src={news.image} alt={news.title} className="w-10 h-10 object-cover rounded" />}
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className={`${color} font-bold text-xs min-w-[20px]`}>{idx + 1}.</span>
                <h4 className="font-medium text-xs line-clamp-2 group-hover:text-red-600">{news.title}</h4>
              </div>
              <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
          </a>
        ))}
      </div>
    )

    const RegularListWithImage = ({ items }: any) => (
      <div className="space-y-2">
        {items.map((news: any) => (
          <a key={news.id} href={`/news/${news.slug}`} className="flex gap-2 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition">
            {news.image && <img src={news.image} alt={news.title} className="w-10 h-10 object-cover rounded" />}
            <div className="flex-1">
              <h4 className="font-medium text-xs line-clamp-2 group-hover:text-red-600">{news.title}</h4>
              <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
          </a>
        ))}
      </div>
    )

    const FreeTextBlock = ({ title, icon, content, color = "text-gray-700 dark:text-gray-300" }: any) => (
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <h4 className={`${color} font-bold text-xs mb-1 flex items-center gap-1`}>
          {icon} {title}
        </h4>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
        </div>
      </div>
    )

    return (
      <>
        {showHero && (
          <section className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${hero.background_image})` }}>
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity / 100})` }}></div>
            <div className="relative z-10 container-custom text-center py-16 md:py-24">
              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">{hero.title}</h1>
              <p className="text-lg text-gray-200 mb-5 max-w-2xl mx-auto">{hero.subtitle}</p>
              {hero.button_text && hero.button_link && (
                <a href={hero.button_link} className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 text-sm">{hero.button_text}</a>
              )}
            </div>
          </section>
        )}

        <NewsTicker />

        {/* القالب الأول */}
        <div className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl">
                <h3 className="text-red-600 font-bold text-sm mb-2 pb-2 border-b border-red-200 dark:border-red-800 flex items-center gap-1"><FaFire size={12} /> أخبار عاجلة</h3>
                <NumberedListWithImage items={breakingGroup} color="text-red-500" />
                <FreeTextBlock title="التحليلات الاقتصادية" icon={<FaChartBar size={10} />} content={economicAnalysisText} color="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <ImageSlider slides={sliderNews} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                {smallGroups[0].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`} className="flex gap-2">
                      {news.image && <img src={news.image} alt={news.title} className="w-14 h-14 object-cover rounded" />}
                      <div className="flex-1">
                        <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                        <h4 className="font-bold text-xs line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                        <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {largeGroups[0].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`}>
                      {news.image && <img src={news.image} alt={news.title} className="w-full h-36 object-cover" />}
                      <div className="p-3">
                        <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                        <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-1 line-clamp-2">{news.description || news.content?.substring(0, 80)}...</p>
                        <span className="text-gray-400 text-[10px] mt-1 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 order-3">
              <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl">
                <h3 className="text-gray-700 dark:text-gray-300 font-bold text-sm mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1"><FaNewspaper size={12} /> أخبار جانبية</h3>
                <NumberedListWithImage items={sideGroup} color="text-gray-500" />
                <FreeTextBlock title="رؤيتنا" icon={<FaEye size={10} />} content={ourVisionText} color="text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* القالب الثاني */}
        <div className="bg-gray-100 dark:bg-gray-900/30 py-6">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl h-full">
                  <h3 className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2 pb-2 border-b border-blue-200 dark:border-blue-800 flex items-center gap-1"><FaChartBar size={12} /> تحليلات سياسية</h3>
                  <RegularListWithImage items={regularGroup1} />
                  <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-amber-600 dark:text-amber-400 font-bold text-sm mb-1 flex items-center gap-1"><FaStar size={10} /> أبراج اليوم</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none"><p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{zodiacTodayText}</p></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                {mainNews && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${mainNews.slug}`}>
                      {mainNews.image && <img src={mainNews.image} alt={mainNews.title} className="w-full h-72 object-cover" />}
                      <div className="p-4">
                        <span className="text-red-500 text-xs font-bold">{mainNews.category || 'أخبار'}</span>
                        <h2 className="font-bold text-xl mt-2 line-clamp-2 group-hover:text-red-600">{mainNews.title}</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainNews.description || mainNews.content?.substring(0, 120)}...</p>
                        <span className="text-gray-400 text-xs mt-2 block">{new Date(mainNews.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  {smallGroups[1].map((news) => (
                    <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                      <a href={`/news/${news.slug}`} className="flex gap-2">
                        {news.image && <img src={news.image} alt={news.title} className="w-14 h-14 object-cover rounded" />}
                        <div className="flex-1">
                          <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                          <h4 className="font-bold text-xs line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                          <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {largeGroups[1].map((news) => (
                    <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                      <a href={`/news/${news.slug}`}>
                        {news.image && <img src={news.image} alt={news.title} className="w-full h-36 object-cover" />}
                        <div className="p-3">
                          <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                          <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-1 line-clamp-2">{news.description || news.content?.substring(0, 80)}...</p>
                          <span className="text-gray-400 text-[10px] mt-1 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 order-3">
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl h-full">
                  <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-2 pb-2 border-b border-indigo-200 dark:border-indigo-800 flex items-center gap-1"><FaNewspaper size={12} /> أخبار</h3>
                  <RegularListWithImage items={regularGroup2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القالب الثالث */}
        <div className="container-custom py-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-9 order-1 lg:order-1">
              {mainNews && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${mainNews.slug}`}>
                    {mainNews.image && <img src={mainNews.image} alt={mainNews.title} className="w-full h-72 object-cover" />}
                    <div className="p-4">
                      <span className="text-red-500 text-xs font-bold">{mainNews.category || 'أخبار'}</span>
                      <h2 className="font-bold text-xl mt-2 line-clamp-2 group-hover:text-red-600">{mainNews.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainNews.description || mainNews.content?.substring(0, 120)}...</p>
                      <span className="text-gray-400 text-xs mt-2 block">{new Date(mainNews.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                {smallGroups[2].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`} className="flex gap-2">
                      {news.image && <img src={news.image} alt={news.title} className="w-14 h-14 object-cover rounded" />}
                      <div className="flex-1">
                        <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                        <h4 className="font-bold text-xs line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                        <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {largeGroups[2].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`}>
                      {news.image && <img src={news.image} alt={news.title} className="w-full h-36 object-cover" />}
                      <div className="p-3">
                        <span className="text-red-500 text-[10px] font-bold">{news.category || 'أخبار'}</span>
                        <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-1 line-clamp-2">{news.description || news.content?.substring(0, 80)}...</p>
                        <span className="text-gray-400 text-[10px] mt-1 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 order-2 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2"><FaGlobe size={12} /> الأسعار العالمية</h3>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500">سيتم إضافة الأسعار قريباً</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الجريدة اليومية والإحصائيات */}
        <div className="bg-gray-900 text-white mt-6">
          <div className="container-custom py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><div className="w-1 h-5 bg-red-500 rounded-full"></div><h3 className="text-white font-bold text-lg">📰 الجريدة اليومية</h3></div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><FaCalendarAlt /><span>{new Date().toLocaleDateString('ar-EG')}</span></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-orange-400 text-xs font-bold mb-1">العنوان الرئيسي</p><p className="text-white text-xs">التطورات التكنولوجية</p></div>
              <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-blue-400 text-xs font-bold mb-1">الاقتصاد اليوم</p><p className="text-white text-xs">أسعار النفط ترتفع</p></div>
              <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-green-400 text-xs font-bold mb-1">التكنولوجيا</p><p className="text-white text-xs">ثورة الذكاء الاصطناعي</p></div>
              <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-purple-400 text-xs font-bold mb-1">الرياضة</p><p className="text-white text-xs">استعدادات المباراة النهائية</p></div>
            </div>
          </div>
          <div className="border-t border-gray-800">
            <div className="container-custom py-4">
              <div className="flex justify-around items-center flex-wrap gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group cursor-pointer">
                    <stat.icon className="text-red-500 text-xl mx-auto mb-1 group-hover:scale-110 transition" />
                    <div className="font-bold text-lg text-white">{stat.value}</div>
                    <div className="text-[10px] text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
          .animate-bounce { animation: bounce 0.5s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .animate-pulse { animation: pulse 1s ease-in-out infinite; }
        `}</style>
      </>
    )
  } catch (error) {
    console.error('Error:', error)
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">عذراً، حدث خطأ</h1>
        <p className="text-gray-500">الرجاء المحاولة مرة أخرى لاحقاً</p>
      </div>
    )
  }
}