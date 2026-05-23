import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'
import NewsTicker from '../components/NewsTicker'
import ImageSlider from '../components/ImageSlider'
import { FaNewspaper, FaCalendarAlt, FaChartLine, FaGlobe, FaUsers, FaFire, FaChartBar, FaEye, FaStar, FaDollarSign, FaEuroSign, FaTrophy, FaOilCan, FaPoundSign, FaYenSign, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function PriceItem({ name, code, value, unit, trend, icon }: any) {
  const getTrendIcon = () => {
    if (trend === 'up') return <FaArrowUp className="text-green-500 text-xs animate-bounce" />
    if (trend === 'down') return <FaArrowDown className="text-red-500 text-xs animate-pulse" />
    return <FaMinus className="text-gray-400 text-xs" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group">
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <div>
          <span className="text-sm font-medium">{name}</span>
          <span className="text-xs text-gray-400 mr-1">({code})</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-bold ${getTrendColor()}`}>{value}</span>
        <span className="text-xs text-gray-500">{unit}</span>
        {getTrendIcon()}
      </div>
    </div>
  )
}

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

async function getExchangeRates() {
  const { data, error } = await supabase
    .from('exchange_rates_config')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (error || !data || data.length === 0) {
    return {
      sar: 3.75, aed: 1.02, kwd: 12.25, qar: 1.03,
      usd: 3.75, eur: 4.05, gbp: 4.75, jpy: 0.025,
      gold: 2350, silver: 28.50, oil: 85.20,
    }
  }
  
  // تحويل المصفوفة إلى كائن
  const rates: any = {}
  data.forEach((item: any) => {
    rates[item.code.toLowerCase()] = item.value
  })
  return rates
}

const economicAnalysisText = `هنا يمكنك كتابة التحليلات الاقتصادية التي تريدها. يمكنك كتابة فقرات طويلة، 
إضافة أخبار، تحليلات، آراء، أي شيء تريد. هذا النص سيظهر في مكان "التحليلات الاقتصادية".`

const ourVisionText = `هنا يمكنك كتابة رؤيتك وأهداف منصتك. تحدث عن رسالتك، قيمك، وما الذي تقدمه لقرائك. 
هذا النص حر بالكامل، يمكنك كتابة أي شيء تريد.`

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

export default async function Home() {
  const [hero, breakingNews, mainNews, sideNews, smallNews, largeNews, regularNews, extraNews, sliderNews, exchangeRates] = await Promise.all([
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
    <div className="space-y-3">
      {items.map((news: any, idx: number) => (
        <a key={news.id} href={`/news/${news.slug}`} className="flex gap-3 group hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition">
          {news.image && <img src={news.image} alt={news.title} className="w-12 h-12 object-cover rounded" />}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`${color} font-bold text-sm min-w-[24px]`}>{idx + 1}.</span>
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-600">{news.title}</h4>
            </div>
            <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
        </a>
      ))}
    </div>
  )

  const RegularListWithImage = ({ items }: any) => (
    <div className="space-y-3">
      {items.map((news: any) => (
        <a key={news.id} href={`/news/${news.slug}`} className="flex gap-3 group hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition">
          {news.image && <img src={news.image} alt={news.title} className="w-12 h-12 object-cover rounded" />}
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-600">{news.title}</h4>
            <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
        </a>
      ))}
    </div>
  )

  const SmallListWithImage = ({ items }: any) => (
    <div className="space-y-2 mt-2">
      {items.map((news: any) => (
        <a key={news.id} href={`/news/${news.slug}`} className="flex gap-2 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1 rounded-lg transition">
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
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h4 className={`${color} font-bold text-base mb-4 flex items-center gap-2`}>
        {icon} {title}
      </h4>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  )

  return (
    <>
      {showHero && (
        <section 
          className="relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${hero.background_image})` }}
        >
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity / 100})` }}
          ></div>
          <div className="relative z-10 container-custom text-center py-20 md:py-28">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
            {hero.button_text && hero.button_link && (
              <a 
                href={hero.button_link}
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105"
              >
                {hero.button_text}
              </a>
            )}
          </div>
        </section>
      )}

      <NewsTicker />

      {/* ======================================== */}
      {/* القالب الأول */}
      {/* ======================================== */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
              <h3 className="text-red-600 font-bold text-lg mb-4 pb-2 border-b border-red-200 dark:border-red-800 flex items-center gap-2">
                <FaFire /> أخبار عاجلة
              </h3>
              <NumberedListWithImage items={breakingGroup} color="text-red-500" />
              <FreeTextBlock 
                title="التحليلات الاقتصادية" 
                icon={<FaChartBar />} 
                content={economicAnalysisText}
                color="text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <ImageSlider slides={sliderNews} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {smallGroups[0].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${news.slug}`} className="flex gap-3">
                    {news.image && <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded" />}
                    <div className="flex-1">
                      <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                      <h4 className="font-bold text-sm line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                      <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {largeGroups[0].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${news.slug}`}>
                    {news.image && <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />}
                    <div className="p-4">
                      <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                      <h3 className="font-bold text-lg mt-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">{news.description || news.content?.substring(0, 100)}...</p>
                      <span className="text-gray-400 text-xs mt-2 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 order-3">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
              <h3 className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                <FaNewspaper /> أخبار جانبية
              </h3>
              <NumberedListWithImage items={sideGroup} color="text-gray-500" />
              <FreeTextBlock 
                title="رؤيتنا" 
                icon={<FaEye />} 
                content={ourVisionText}
                color="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* القالب الثاني */}
      {/* ======================================== */}
      <div className="bg-gray-100 dark:bg-gray-900/30 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl h-full">
                <h3 className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-4 pb-2 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                  <FaChartBar /> تحليلات سياسية
                </h3>
                <RegularListWithImage items={regularGroup1} />
                
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-amber-600 dark:text-amber-400 font-bold text-lg mb-4 flex items-center gap-2">
                    <FaStar /> أبراج اليوم
                  </h3>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                      {zodiacTodayText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              {mainNews && (
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${mainNews.slug}`}>
                    {mainNews.image && <img src={mainNews.image} alt={mainNews.title} className="w-full h-80 object-cover" />}
                    <div className="p-5">
                      <span className="text-red-500 text-xs font-bold">{mainNews.category || 'أخبار'}</span>
                      <h2 className="font-bold text-2xl mt-2 line-clamp-2 group-hover:text-red-600">{mainNews.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainNews.description || mainNews.content?.substring(0, 150)}...</p>
                      <span className="text-gray-400 text-xs mt-3 block">{new Date(mainNews.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {smallGroups[1].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`} className="flex gap-3">
                      {news.image && <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded" />}
                      <div className="flex-1">
                        <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                        <h4 className="font-bold text-sm line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                        <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {largeGroups[1].map((news) => (
                  <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                    <a href={`/news/${news.slug}`}>
                      {news.image && <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />}
                      <div className="p-4">
                        <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                        <h3 className="font-bold text-lg mt-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">{news.description || news.content?.substring(0, 100)}...</p>
                        <span className="text-gray-400 text-xs mt-2 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 order-3">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl h-full">
                <h3 className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4 pb-2 border-b border-indigo-200 dark:border-indigo-800 flex items-center gap-2">
                  <FaNewspaper /> أخبار
                </h3>
                <RegularListWithImage items={regularGroup2} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* القالب الثالث - الأسعار العالمية */}
      {/* ======================================== */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl h-full">
              <h3 className="text-green-600 dark:text-green-400 font-bold text-lg mb-4 pb-2 border-b border-green-200 dark:border-green-800 flex items-center gap-2">
                <FaGlobe /> الأسعار العالمية
              </h3>
              
              <div className="mb-3">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 border-r-2 border-green-500 pr-2">🇸🇦 العملات العربية</h4>
                <div className="space-y-1">
                  <PriceItem name="الريال السعودي" code="SAR" value={exchangeRates?.sar || '3.75'} unit="ر.س" trend="up" />
                  <PriceItem name="الدرهم الإماراتي" code="AED" value={exchangeRates?.aed || '1.02'} unit="د.إ" trend="stable" />
                  <PriceItem name="الدينار الكويتي" code="KWD" value={exchangeRates?.kwd || '12.25'} unit="د.ك" trend="up" />
                  <PriceItem name="الريال القطري" code="QAR" value={exchangeRates?.qar || '1.03'} unit="ر.ق" trend="down" />
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 border-r-2 border-blue-500 pr-2">🌍 العملات الأجنبية</h4>
                <div className="space-y-1">
                  <PriceItem name="الدولار الأمريكي" code="USD" value={exchangeRates?.usd || '3.75'} unit="ج.م" trend="up" icon={<FaDollarSign className="text-yellow-500" />} />
                  <PriceItem name="اليورو" code="EUR" value={exchangeRates?.eur || '4.05'} unit="ج.م" trend="down" icon={<FaEuroSign className="text-blue-500" />} />
                  <PriceItem name="الجنيه الإسترليني" code="GBP" value={exchangeRates?.gbp || '4.75'} unit="ج.م" trend="up" icon={<FaPoundSign className="text-purple-500" />} />
                  <PriceItem name="الين الياباني" code="JPY" value={exchangeRates?.jpy || '0.025'} unit="ج.م" trend="stable" icon={<FaYenSign className="text-red-500" />} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 border-r-2 border-yellow-500 pr-2">🏆 المعادن والطاقة</h4>
                <div className="space-y-1">
                  <PriceItem name="الذهب" code="XAU" value={exchangeRates?.gold || '2,350'} unit="$" trend="up" icon={<FaTrophy className="text-yellow-600" />} />
                  <PriceItem name="الفضة" code="XAG" value={exchangeRates?.silver || '28.50'} unit="$" trend="down" />
                  <PriceItem name="خام برنت" code="BRT" value={exchangeRates?.oil || '85.20'} unit="$" trend="down" icon={<FaOilCan className="text-gray-600" />} />
                </div>
              </div>
              
              <div className="mt-4 pt-3 text-center border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-400">
                  آخر تحديث: {new Date().toLocaleTimeString('ar-EG')}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            {mainNews && (
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                <a href={`/news/${mainNews.slug}`}>
                  {mainNews.image && <img src={mainNews.image} alt={mainNews.title} className="w-full h-80 object-cover" />}
                  <div className="p-5">
                    <span className="text-red-500 text-xs font-bold">{mainNews.category || 'أخبار'}</span>
                    <h2 className="font-bold text-2xl mt-2 line-clamp-2 group-hover:text-red-600">{mainNews.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainNews.description || mainNews.content?.substring(0, 150)}...</p>
                    <span className="text-gray-400 text-xs mt-3 block">{new Date(mainNews.created_at).toLocaleDateString('ar-EG')}</span>
                  </div>
                </a>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {smallGroups[2].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${news.slug}`} className="flex gap-3">
                    {news.image && <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded" />}
                    <div className="flex-1">
                      <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                      <h4 className="font-bold text-sm line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                      <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {largeGroups[2].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${news.slug}`}>
                    {news.image && <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />}
                    <div className="p-4">
                      <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                      <h3 className="font-bold text-lg mt-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">{news.description || news.content?.substring(0, 100)}...</p>
                      <span className="text-gray-400 text-xs mt-2 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 order-3">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl h-full">
              <h3 className="text-cyan-600 dark:text-cyan-400 font-bold text-lg mb-3 pb-2 border-b border-cyan-200 dark:border-cyan-800 flex items-center gap-2">
                <FaChartBar /> قوائم تقنية
              </h3>
              <SmallListWithImage items={regularGroup3} />
              
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-2">أخبار التقنية</h4>
                <SmallListWithImage items={extraGroup} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الجريدة اليومية والإحصائيات */}
      <div className="bg-gray-900 text-white mt-8">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-red-500 rounded-full"></div>
              <h3 className="text-white font-bold text-xl">📰 الجريدة اليومية</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('ar-EG')}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-gray-800/50 p-4 hover:bg-gray-800 transition rounded-lg cursor-pointer">
              <p className="text-orange-400 text-sm font-bold mb-2">العنوان الرئيسي</p>
              <p className="text-white text-sm">التطورات التكنولوجية في المنطقة العربية</p>
            </div>
            <div className="bg-gray-800/50 p-4 hover:bg-gray-800 transition rounded-lg cursor-pointer">
              <p className="text-blue-400 text-sm font-bold mb-2">الاقتصاد اليوم</p>
              <p className="text-white text-sm">أسعار النفط ترتفع وسط توقعات إيجابية</p>
            </div>
            <div className="bg-gray-800/50 p-4 hover:bg-gray-800 transition rounded-lg cursor-pointer">
              <p className="text-green-400 text-sm font-bold mb-2">التكنولوجيا</p>
              <p className="text-white text-sm">ثورة الذكاء الاصطناعي تشعل المنافسة</p>
            </div>
            <div className="bg-gray-800/50 p-4 hover:bg-gray-800 transition rounded-lg cursor-pointer">
              <p className="text-purple-400 text-sm font-bold mb-2">الرياضة</p>
              <p className="text-white text-sm">استعدادات مكثفة للمباراة النهائية</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800">
          <div className="container-custom py-6">
            <div className="flex justify-around items-center flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group cursor-pointer">
                  <stat.icon className="text-red-500 text-2xl mx-auto mb-2 group-hover:scale-110 transition" />
                  <div className="font-bold text-xl text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 0.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}