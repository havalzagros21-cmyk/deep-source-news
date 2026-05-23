import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'
import NewsTicker from '../components/NewsTicker'
import ImageSlider from '../components/ImageSlider'
import { 
  FaNewspaper, FaCalendarAlt, FaChartLine, FaGlobe, FaUsers, FaFire, 
  FaChartBar, FaEye, FaStar, FaDollarSign, FaEuroSign, FaTrophy, FaOilCan, 
  FaPoundSign, FaYenSign, FaArrowUp, FaArrowDown, FaMinus, FaBitcoin
} from 'react-icons/fa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// ============================================================
// مكونات الأسعار العالمية
// ============================================================
function PriceItem({ name, code, value, unit, trend, icon }: any) {
  const getTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp className="text-green-500 text-[10px] animate-bounce" />
    if (trend === 'down') return <FaArrowDown className="text-red-500 text-[10px] animate-pulse" />
    return <FaMinus className="text-gray-400 text-[10px]" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-[10px]">{icon}</span>}
        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{name}</span>
        <span className="text-[9px] text-gray-400">({code})</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`font-bold text-[11px] ${getTrendColor()}`}>{value}</span>
        <span className="text-[9px] text-gray-500">{unit}</span>
        {getTrendIcon()}
      </div>
    </div>
  )
}

function PriceSection({ title, icon, children, color = "blue" }: any) {
  const colorClasses: any = {
    green: "border-green-500", blue: "border-blue-500", purple: "border-purple-500",
    yellow: "border-yellow-500", gray: "border-gray-500", red: "border-red-500"
  }
  return (
    <div className="mb-3">
      <div className={`flex items-center gap-1.5 mb-1.5 border-r-2 ${colorClasses[color]} pr-2`}>
        {icon}
        <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{title}</h4>
      </div>
      <div className="space-y-0">{children}</div>
    </div>
  )
}

// ============================================================
// دوال جلب البيانات
// ============================================================
async function getHeroSection() {
  const { data, error } = await supabase.from('hero_section').select('*').single()
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

async function getExchangeRates() {
  const { data, error } = await supabase
    .from('exchange_rates_config')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (error || !data || data.length === 0) {
    return { usd: 3.75, eur: 4.05, gbp: 4.75, sar: 3.75, kwd: 12.25, gold: 2350, oil: 85.20 }
  }
  
  const rates: any = {}
  data.forEach((item: any) => { rates[item.code.toLowerCase()] = item.value })
  return rates
}

async function getDailyBrief() {
  const { data } = await supabase.from('daily_brief').select('*').order('order_index', { ascending: true })
  return data || []
}

// ============================================================
// النصوص الثابتة
// ============================================================
const economicAnalysisText = `تحليلات اقتصادية حصرية يقدمها فريق ديب سورس نيوز.`
const ourVisionText = `نسعى لتقديم محتوى إخباري عميق ومستقل يعزز الوعي ويدعم المعرفة.`
const zodiacTodayText = `🍀 برج الحمل: يوم مليء بالطاقة الإيجابية والفرص الجديدة.
🍀 برج الثور: فرص مالية قادمة واستقرار في العلاقات.
🍀 برج الجوزاء: تواصل اجتماعي ناجح وفرص للسفر.
🍀 برج السرطان: اهتمام بالشؤون العائلية وتحسن في الأوضاع المالية.
🍀 برج الأسد: إنجازات مهنية جديدة وتقدير من المحيطين.
🍀 برج العذراء: صحة وتركيز ذهني ونجاح في المشاريع الشخصية.`

const stats = [
  { icon: FaGlobe, value: '120+', label: 'دولة' },
  { icon: FaUsers, value: '50K+', label: 'قارئ' },
  { icon: FaChartLine, value: '10K+', label: 'مقال' },
  { icon: FaCalendarAlt, value: 'منذ 2024', label: 'الانطلاق' },
]

// ============================================================
// المكون الرئيسي
// ============================================================
export default async function Home() {
  const [hero, breakingNews, mainNews, sideNews, smallNews, largeNews, regularNews, extraNews, sliderNews, exchangeRates, dailyBrief] = await Promise.all([
    getHeroSection(),
    getBreakingNews(),
    getMainNews(),
    getSideNews(),
    getSmallNews(),
    getLargeNews(),
    getRegularNews(),
    getExtraNews(),
    getSliderNews(),
    getExchangeRates(),
    getDailyBrief(),
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

  const SmallListWithImage = ({ items }: any) => (
    <div className="space-y-1 mt-1">
      {items.map((news: any) => (
        <a key={news.id} href={`/news/${news.slug}`} className="flex gap-1.5 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1 rounded-lg transition">
          {news.image && <img src={news.image} alt={news.title} className="w-8 h-8 object-cover rounded" />}
          <div className="flex-1">
            <h4 className="font-medium text-[10px] line-clamp-2 group-hover:text-red-600">{news.title}</h4>
            <span className="text-gray-400 text-[8px]">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
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

      {/* ======================================== */}
      {/* القالب الأول */}
      {/* ======================================== */}
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

      {/* ======================================== */}
      {/* القالب الثاني */}
      {/* ======================================== */}
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

      {/* ======================================== */}
      {/* القالب الثالث - الأسعار العالمية الكاملة */}
      {/* ======================================== */}
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

          {/* العمود الأيمن - الأسعار العالمية الكاملة */}
          <div className="lg:col-span-3 order-2 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-2"><FaGlobe size={12} /> الأسعار العالمية</h3>
              </div>
              <div className="p-3 max-h-[550px] overflow-y-auto">
                
                <PriceSection title="العملات العربية" icon="🇸🇦" color="green">
                  <PriceItem name="الريال السعودي" code="SAR" value={exchangeRates?.sar || '3.75'} unit="ر.س" trend="up" />
                  <PriceItem name="الدرهم الإماراتي" code="AED" value={exchangeRates?.aed || '1.02'} unit="د.إ" trend="stable" />
                  <PriceItem name="الدينار الكويتي" code="KWD" value={exchangeRates?.kwd || '12.25'} unit="د.ك" trend="up" />
                  <PriceItem name="الريال القطري" code="QAR" value={exchangeRates?.qar || '1.03'} unit="ر.ق" trend="down" />
                  <PriceItem name="الدينار البحريني" code="BHD" value={exchangeRates?.bhd || '9.95'} unit="د.ب" trend="up" />
                  <PriceItem name="الريال العماني" code="OMR" value={exchangeRates?.omr || '9.74'} unit="ر.ع" trend="stable" />
                  <PriceItem name="الدينار الأردني" code="JOD" value={exchangeRates?.jod || '5.29'} unit="د.ا" trend="up" />
                  <PriceItem name="الجنيه السوداني" code="SDG" value={exchangeRates?.sdg || '0.062'} unit="ج.س" trend="down" />
                </PriceSection>

                <PriceSection title="العملات الأجنبية" icon="🌍" color="blue">
                  <PriceItem name="الدولار الأمريكي" code="USD" value={exchangeRates?.usd || '3.75'} unit="ج.م" trend="up" icon={<FaDollarSign className="text-yellow-500" />} />
                  <PriceItem name="اليورو" code="EUR" value={exchangeRates?.eur || '4.05'} unit="ج.م" trend="down" icon={<FaEuroSign className="text-blue-500" />} />
                  <PriceItem name="الجنيه الإسترليني" code="GBP" value={exchangeRates?.gbp || '4.75'} unit="ج.م" trend="up" icon={<FaPoundSign className="text-purple-500" />} />
                  <PriceItem name="الفرنك السويسري" code="CHF" value={exchangeRates?.chf || '4.20'} unit="ج.م" trend="down" />
                  <PriceItem name="الدولار الكندي" code="CAD" value={exchangeRates?.cad || '2.75'} unit="ج.م" trend="up" />
                  <PriceItem name="الدولار الأسترالي" code="AUD" value={exchangeRates?.aud || '2.45'} unit="ج.م" trend="down" />
                  <PriceItem name="الين الياباني" code="JPY" value={exchangeRates?.jpy || '0.025'} unit="ج.م" trend="stable" icon={<FaYenSign className="text-red-500" />} />
                  <PriceItem name="اليوان الصيني" code="CNY" value={exchangeRates?.cny || '0.52'} unit="ج.م" trend="up" />
                  <PriceItem name="الليرة التركية" code="TRY" value={exchangeRates?.try || '0.11'} unit="ج.م" trend="down" />
                  <PriceItem name="الروبل الروسي" code="RUB" value={exchangeRates?.rub || '0.041'} unit="ج.م" trend="down" />
                  <PriceItem name="الروبية الهندية" code="INR" value={exchangeRates?.inr || '0.045'} unit="ج.م" trend="stable" />
                  <PriceItem name="الريال البرازيلي" code="BRL" value={exchangeRates?.brl || '0.68'} unit="ج.م" trend="up" />
                </PriceSection>

                <PriceSection title="العملات الرقمية" icon="💎" color="purple">
                  <PriceItem name="بتكوين" code="BTC" value={exchangeRates?.btc || '65,234'} unit="$" trend="up" icon={<FaBitcoin className="text-orange-500" />} />
                  <PriceItem name="إيثريوم" code="ETH" value={exchangeRates?.eth || '3,456'} unit="$" trend="down" />
                  <PriceItem name="ريبل" code="XRP" value={exchangeRates?.xrp || '0.62'} unit="$" trend="up" />
                  <PriceItem name="سولانا" code="SOL" value={exchangeRates?.sol || '145'} unit="$" trend="up" />
                  <PriceItem name="كاردانو" code="ADA" value={exchangeRates?.ada || '0.45'} unit="$" trend="down" />
                  <PriceItem name="دوجكوين" code="DOGE" value={exchangeRates?.doge || '0.12'} unit="$" trend="up" />
                </PriceSection>

                <PriceSection title="المعادن النفيسة" icon="🏆" color="yellow">
                  <PriceItem name="الذهب" code="XAU" value={exchangeRates?.gold || '2,350'} unit="$" trend="up" icon={<FaTrophy className="text-yellow-600" />} />
                  <PriceItem name="الفضة" code="XAG" value={exchangeRates?.silver || '28.50'} unit="$" trend="down" />
                  <PriceItem name="البلاتين" code="XPT" value={exchangeRates?.platinum || '920'} unit="$" trend="up" />
                  <PriceItem name="النحاس" code="COP" value={exchangeRates?.copper || '4.15'} unit="$" trend="up" />
                </PriceSection>

                <PriceSection title="الطاقة" icon="⛽" color="gray">
                  <PriceItem name="خام برنت" code="BRT" value={exchangeRates?.oil || '85.20'} unit="$" trend="down" icon={<FaOilCan className="text-gray-600" />} />
                  <PriceItem name="خام غرب تكساس" code="WTI" value={exchangeRates?.wti || '80.50'} unit="$" trend="up" />
                  <PriceItem name="الغاز الطبيعي" code="NG" value={exchangeRates?.ng || '2.85'} unit="$" trend="down" />
                </PriceSection>

                <PriceSection title="مؤشرات الأسهم" icon="📈" color="red">
                  <PriceItem name="S&P 500" code="SPX" value={exchangeRates?.sp500 || '5,234'} unit="نقطة" trend="up" />
                  <PriceItem name="Nasdaq" code="IXIC" value={exchangeRates?.nasdaq || '18,450'} unit="نقطة" trend="up" />
                  <PriceItem name="Dow Jones" code="DJI" value={exchangeRates?.dowjones || '39,870'} unit="نقطة" trend="down" />
                </PriceSection>

                <div className="mt-3 pt-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <p className="text-[9px] text-gray-400">آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}</p>
                </div>
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
            {dailyBrief.length > 0 ? dailyBrief.map((item, idx) => (
              <a key={idx} href={item.link_url || '#'} className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer">
                <p className="text-orange-400 text-xs font-bold mb-1">{item.section_title}</p>
                <p className="text-white text-xs">{item.title}</p>
              </a>
            )) : (
              <>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-orange-400 text-xs font-bold mb-1">العنوان الرئيسي</p><p className="text-white text-xs">التطورات التكنولوجية</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-blue-400 text-xs font-bold mb-1">الاقتصاد اليوم</p><p className="text-white text-xs">أسعار النفط ترتفع</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-green-400 text-xs font-bold mb-1">التكنولوجيا</p><p className="text-white text-xs">ثورة الذكاء الاصطناعي</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-purple-400 text-xs font-bold mb-1">الرياضة</p><p className="text-white text-xs">استعدادات المباراة النهائية</p></div>
              </>
            )}
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
}