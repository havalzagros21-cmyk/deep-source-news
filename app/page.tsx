'use client'

export const dynamic = 'force-dynamic'

import { supabase } from '../lib/supabase'
import NewsCard from '../components/NewsCard'
import NewsTicker from '../components/NewsTicker'
import ImageSlider from '../components/ImageSlider'
import { useTranslation } from 'react-i18next'
import { useEffect, useState, useCallback, useRef } from 'react'
import { translateText, translateNewsList, translateSingleNews } from '../lib/translate'
import { getAllSiteTexts } from '../lib/siteConfig'
import '../lib/i18n'
import Link from 'next/link'
import { 
  FaNewspaper, FaCalendarAlt, FaChartLine, FaGlobe, FaUsers, FaFire, 
  FaChartBar, FaEye, FaStar, FaDollarSign, FaEuroSign, FaTrophy, FaOilCan, 
  FaPoundSign, FaYenSign, FaArrowUp, FaArrowDown, FaMinus, FaBitcoin,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa'

// ============================================================
// مكونات الأسعار العالمية
// ============================================================
function PriceItem({ nameKey, code, value, unit, trend, icon }: any) {
  const { t } = useTranslation()
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
        <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">{t(nameKey)}</span>
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

function PriceSection({ titleKey, icon, children, color = "blue" }: any) {
  const { t } = useTranslation()
  const colorClasses: any = {
    green: "border-green-500", blue: "border-blue-500", purple: "border-purple-500",
    yellow: "border-yellow-500", gray: "border-gray-500", red: "border-red-500"
  }
  return (
    <div className="mb-3">
      <div className={`flex items-center gap-1.5 mb-1.5 border-r-2 ${colorClasses[color]} pr-2`}>
        {icon}
        <h4 className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{t(titleKey)}</h4>
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

async function getAllNewsByPosition() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
  return data || []
}

async function getBreakingNews() {
  const { data } = await supabase.from('news').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(4)
  return data || []
}

async function getMainNews() {
  const { data } = await supabase.from('news').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(1)
  return data?.[0] || null
}

async function getSideNews() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(4)
  return data || []
}

async function getSmallNews() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(9)
  return data || []
}

async function getLargeNews() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(9)
  return data || []
}

async function getRegularNews() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(12)
  return data || []
}

async function getExtraNews() {
  const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3)
  return data || []
}

async function getSliderNews() {
  const { data } = await supabase.from('news').select('id, title, description, image, slug, category').order('created_at', { ascending: false }).limit(5)
  return data || []
}

async function getExchangeRates() {
  const { data, error } = await supabase.from('exchange_rates_config').select('*').order('order_index', { ascending: true })
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
// المكون الرئيسي
// ============================================================
export default function Home() {
  const { t, i18n } = useTranslation()
  const [hero, setHero] = useState<any>(null)
  const [exchangeRates, setExchangeRates] = useState<any>({})
  const [dailyBrief, setDailyBrief] = useState<any[]>([])
  const [translatedBrief, setTranslatedBrief] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [siteTexts, setSiteTexts] = useState<any>({})
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const animationRef = useRef<NodeJS.Timeout | null>(null)
  
  // إحصائيات الموقع (سيتم تحديثها فورياً عبر Realtime)
  const [stats, setStats] = useState([
    { icon: FaGlobe, value: '120+', labelKey: 'countries' },
    { icon: FaUsers, value: '50K+', labelKey: 'readers' },
    { icon: FaChartLine, value: '10K+', labelKey: 'articles' },
    { icon: FaCalendarAlt, value: t('since2024'), labelKey: 'launch' },
  ])
  
  const [rawData, setRawData] = useState({
    hero: null as any,
    breakingNews: [] as any[],
    mainNews: null as any,
    sideNews: [] as any[],
    smallNews: [] as any[],
    largeNews: [] as any[],
    regularNews: [] as any[],
    extraNews: [] as any[],
    sliderNews: [] as any[],
  })
  
  const [translatedData, setTranslatedData] = useState({
    hero: null as any,
    breakingNews: [] as any[],
    mainNews: null as any,
    sideNews: [] as any[],
    smallNews: [] as any[],
    largeNews: [] as any[],
    regularNews: [] as any[],
    extraNews: [] as any[],
    sliderNews: [] as any[],
  })

  const currentLocale = i18n.language

  // ============================================================
  // دالة جلب الإحصائيات من قاعدة البيانات
  // ============================================================
  const fetchStatsFromDB = useCallback(async () => {
    const { data } = await supabase.from('site_stats').select('*').order('order_index', { ascending: true })
    if (data && data.length > 0) {
      const iconMap: any = {
        FaGlobe: FaGlobe, FaUsers: FaUsers, FaChartLine: FaChartLine, FaCalendarAlt: FaCalendarAlt,
        FaNewspaper: FaNewspaper, FaFire: FaFire, FaEye: FaEye, FaStar: FaStar
      }
      const newStats = data.map((stat: any) => ({
        icon: iconMap[stat.icon] || FaGlobe,
        value: stat.value,
        labelKey: stat.label,
      }))
      setStats(newStats)
    }
  }, [])

  // حركة تلقائية للشريط
  useEffect(() => {
    if (isPlaying && marqueeRef.current) {
      const scrollMarqueeAuto = () => {
        if (marqueeRef.current) {
          if (marqueeRef.current.scrollLeft + marqueeRef.current.clientWidth >= marqueeRef.current.scrollWidth - 10) {
            marqueeRef.current.scrollLeft = 0
          } else {
            marqueeRef.current.scrollLeft += 1
          }
        }
      }
      animationRef.current = setInterval(scrollMarqueeAuto, 30)
    } else {
      if (animationRef.current) clearInterval(animationRef.current)
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [isPlaying])

  const scrollMarquee = (direction: 'left' | 'right') => {
    if (marqueeRef.current) {
      const scrollAmount = 350
      if (direction === 'left') {
        marqueeRef.current.scrollLeft -= scrollAmount
      } else {
        marqueeRef.current.scrollLeft += scrollAmount
      }
      setIsPlaying(false)
      setTimeout(() => setIsPlaying(true), 3000)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  // جلب النصوص القابلة للتعديل
  useEffect(() => {
    const fetchSiteTexts = async () => {
      const texts = await getAllSiteTexts()
      const textsMap: any = {}
      texts.forEach((text: any) => {
        textsMap[text.key_name] = text
      })
      setSiteTexts(textsMap)
    }
    fetchSiteTexts()
  }, [])

  const translateHero = useCallback(async (heroData: any, locale: string) => {
    if (!heroData) return heroData
    if (locale === 'ar') return heroData
    return {
      ...heroData,
      title: await translateText(heroData.title, locale),
      subtitle: await translateText(heroData.subtitle, locale),
      button_text: await translateText(heroData.button_text, locale),
    }
  }, [])

  const translateAllData = useCallback(async (locale: string) => {
    if (locale === 'ar') {
      setTranslatedData({
        hero: rawData.hero,
        breakingNews: rawData.breakingNews,
        mainNews: rawData.mainNews,
        sideNews: rawData.sideNews,
        smallNews: rawData.smallNews,
        largeNews: rawData.largeNews,
        regularNews: rawData.regularNews,
        extraNews: rawData.extraNews,
        sliderNews: rawData.sliderNews,
      })
    } else {
      const [translatedHero, translatedBreaking, translatedSide, translatedSmall, translatedLarge, translatedRegular, translatedExtra, translatedSlider, translatedMain] = await Promise.all([
        translateHero(rawData.hero, locale),
        translateNewsList(rawData.breakingNews, locale),
        translateNewsList(rawData.sideNews, locale),
        translateNewsList(rawData.smallNews, locale),
        translateNewsList(rawData.largeNews, locale),
        translateNewsList(rawData.regularNews, locale),
        translateNewsList(rawData.extraNews, locale),
        translateNewsList(rawData.sliderNews, locale),
        rawData.mainNews ? translateSingleNews(rawData.mainNews, locale) : Promise.resolve(null),
      ])
      setTranslatedData({
        hero: translatedHero,
        breakingNews: translatedBreaking,
        mainNews: translatedMain,
        sideNews: translatedSide,
        smallNews: translatedSmall,
        largeNews: translatedLarge,
        regularNews: translatedRegular,
        extraNews: translatedExtra,
        sliderNews: translatedSlider,
      })
    }
  }, [rawData, translateHero])

  // ترجمة الجريدة اليومية (معدل لدعم 3 لغات)
  useEffect(() => {
    const translateBrief = async () => {
      if (dailyBrief.length === 0) {
        setTranslatedBrief([])
        return
      }
      if (currentLocale === 'ar') {
        // للعربية: نستخدم الحقول العربية مباشرة
        const mappedBrief = dailyBrief.map((item: any) => ({
          ...item,
          section_title: item.section_title_ar,
          title: item.title_ar,
          description: item.description_ar,
        }))
        setTranslatedBrief(mappedBrief)
      } else if (currentLocale === 'en') {
        // للإنجليزية: نستخدم الحقول الإنجليزية أو العربية كبديل
        const mappedBrief = dailyBrief.map((item: any) => ({
          ...item,
          section_title: item.section_title_en || item.section_title_ar,
          title: item.title_en || item.title_ar,
          description: item.description_en || item.description_ar,
        }))
        setTranslatedBrief(mappedBrief)
      } else if (currentLocale === 'ku') {
        // للكردية: نستخدم الحقول الكردية أو العربية كبديل
        const mappedBrief = dailyBrief.map((item: any) => ({
          ...item,
          section_title: item.section_title_ku || item.section_title_ar,
          title: item.title_ku || item.title_ar,
          description: item.description_ku || item.description_ar,
        }))
        setTranslatedBrief(mappedBrief)
      } else {
        // لأي لغة أخرى: نستخدم العربية
        const mappedBrief = dailyBrief.map((item: any) => ({
          ...item,
          section_title: item.section_title_ar,
          title: item.title_ar,
          description: item.description_ar,
        }))
        setTranslatedBrief(mappedBrief)
      }
    }
    translateBrief()
  }, [currentLocale, dailyBrief])

  useEffect(() => {
    const fetchData = async () => {
      const [allNewsData, heroData, breakingData, mainData, sideData, smallData, largeData, regularData, extraData, sliderData, ratesData, briefData] = await Promise.all([
        getAllNewsByPosition(),
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
      
      setExchangeRates(ratesData)
      setDailyBrief(briefData)
      
      const featuredNews = allNewsData.filter((n: any) => n.is_featured === true)
      const sidePositionNews = allNewsData.filter((n: any) => n.position === 'side')
      const template1TopNews = allNewsData.filter((n: any) => n.position === 'template1_top')
      const template1BottomNews = allNewsData.filter((n: any) => n.position === 'template1_bottom')
      const template2News = allNewsData.filter((n: any) => n.position === 'template2')
      const template3News = allNewsData.filter((n: any) => n.position === 'template3')
      const autoNews = allNewsData.filter((n: any) => !n.position || n.position === 'auto')
      
      const finalSmallNews = template1TopNews.length > 0 ? template1TopNews : (autoNews.slice(0, 9))
      const finalLargeNews = template1BottomNews.length > 0 ? template1BottomNews : (autoNews.slice(9, 18))
      const finalRegularNews = template2News.length > 0 ? template2News : (autoNews.slice(0, 12))
      const finalExtraNews = template3News.length > 0 ? template3News : (autoNews.slice(12, 15))
      
      setRawData({
        hero: heroData,
        breakingNews: featuredNews.length > 0 ? featuredNews : breakingData,
        mainNews: featuredNews[0] || mainData,
        sideNews: sidePositionNews.length > 0 ? sidePositionNews : sideData,
        smallNews: finalSmallNews.slice(0, 9),
        largeNews: finalLargeNews.slice(0, 9),
        regularNews: finalRegularNews.slice(0, 12),
        extraNews: finalExtraNews.slice(0, 3),
        sliderNews: sliderData,
      })
      setLoading(false)
    }
    fetchData()
  }, [])

  // جلب الإحصائيات أول مرة + الاشتراك في التغييرات الفورية (Realtime)
  useEffect(() => {
    fetchStatsFromDB()
    
    // الاشتراك في تغييرات جدول الإحصائيات
    const statsChannel = supabase
      .channel('stats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_stats' },
        () => {
          console.log('✅ تم تغيير الإحصائيات - تحديث فوري')
          fetchStatsFromDB()
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(statsChannel)
    }
  }, [fetchStatsFromDB])

  useEffect(() => {
    if (!loading && rawData.hero) {
      translateAllData(currentLocale)
    }
  }, [currentLocale, loading, rawData, translateAllData])

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const showHero = translatedData.hero?.is_enabled !== false
  const heroData = translatedData.hero
  const breakingGroup = translatedData.breakingNews.slice(0, 4)
  const sideGroup = translatedData.sideNews.slice(0, 4)
  const mainNewsItem = translatedData.mainNews

  const smallGroups = [
    translatedData.smallNews.slice(0, 3),
    translatedData.smallNews.slice(3, 6),
    translatedData.smallNews.slice(6, 9),
  ]

  const largeGroups = [
    translatedData.largeNews.slice(0, 3),
    translatedData.largeNews.slice(3, 6),
    translatedData.largeNews.slice(6, 9),
  ]

  const regularGroup1 = translatedData.regularNews.slice(0, 4)

  const NumberedListWithImage = ({ items, color = "text-red-600" }: any) => (
    <div className="space-y-2">
      {items.map((news: any, idx: number) => (
        <a key={news.id} href={`/news/${encodeURIComponent(news.slug)}`} className="flex gap-2 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition">
          {news.image && <img src={news.image} alt={news.title} className="w-10 h-10 object-cover rounded" />}
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <span className={`${color} font-bold text-xs min-w-[20px]`}>{idx + 1}.</span>
              <h4 className="font-medium text-xs line-clamp-2 group-hover:text-red-600">{news.title}</h4>
            </div>
            <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
          </div>
        </a>
      ))}
    </div>
  )

  const RegularListWithImage = ({ items }: any) => (
    <div className="space-y-2">
      {items.map((news: any) => (
        <a key={news.id} href={`/news/${encodeURIComponent(news.slug)}`} className="flex gap-2 group hover:bg-red-50 dark:hover:bg-red-950/30 p-1.5 rounded-lg transition">
          {news.image && <img src={news.image} alt={news.title} className="w-10 h-10 object-cover rounded" />}
          <div className="flex-1">
            <h4 className="font-medium text-xs line-clamp-2 group-hover:text-red-600">{news.title}</h4>
            <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
          </div>
        </a>
      ))}
    </div>
  )

  // FreeTextBlock مع حد 1500 حرف
  const FreeTextBlock = ({ titleKey, icon, contentKey, color = "text-gray-700 dark:text-gray-300" }: any) => {
    const siteContent = siteTexts[contentKey]
    let content = ''
    if (siteContent) {
      if (currentLocale === 'ar') content = siteContent.value_ar
      else if (currentLocale === 'en') content = siteContent.value_en
      else content = siteContent.value_ku
    } else {
      content = t(contentKey)
    }
    if (content.length > 1500) {
      content = content.substring(0, 1500) + '...'
    }
    return (
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
        <h4 className={`${color} font-bold text-xs mb-1 flex items-center gap-1`}>
          {icon} {t(titleKey)}
        </h4>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {showHero && heroData && (
        <section className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroData.background_image})` }}>
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${heroData.overlay_opacity / 100})` }}></div>
          <div className="relative z-10 container-custom text-center py-16 md:py-24">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white">{heroData.title}</h1>
            <p className="text-lg text-gray-200 mb-5 max-w-2xl mx-auto">{heroData.subtitle}</p>
            {heroData.button_text && heroData.button_link && (
              <a href={heroData.button_link} className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 text-sm">{heroData.button_text}</a>
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
              <h3 className="text-red-600 font-bold text-sm mb-2 pb-2 border-b border-red-200 dark:border-red-800 flex items-center gap-1"><FaFire size={12} /> {t('breakingNews')}</h3>
              <NumberedListWithImage items={breakingGroup} color="text-red-500" />
              <FreeTextBlock titleKey="economicAnalysis" icon={<FaChartBar size={10} />} contentKey="economicAnalysis" color="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2">
            <ImageSlider slides={translatedData.sliderNews} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {smallGroups[0].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${encodeURIComponent(news.slug)}`} className="flex gap-2">
                    {news.image && <img src={news.image} alt={news.title} className="w-14 h-14 object-cover rounded" />}
                    <div className="flex-1">
                      <span className="text-red-500 text-[10px] font-bold">{news.category || t('news')}</span>
                      <h4 className="font-bold text-xs line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                      <span className="text-gray-400 text-[10px]">{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {largeGroups[0].map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
                  <a href={`/news/${encodeURIComponent(news.slug)}`}>
                    {news.image && <img src={news.image} alt={news.title} className="w-full h-36 object-cover" />}
                    <div className="p-3">
                      <span className="text-red-500 text-[10px] font-bold">{news.category || t('news')}</span>
                      <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-[11px] mt-1 line-clamp-2">{news.description || news.content?.substring(0, 80)}...</p>
                      <span className="text-gray-400 text-[10px] mt-1 block">{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 order-3">
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-xl">
              <h3 className="text-gray-700 dark:text-gray-300 font-bold text-sm mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-1"><FaNewspaper size={12} /> {t('sideNews')}</h3>
              <NumberedListWithImage items={sideGroup} color="text-gray-500" />
              <FreeTextBlock titleKey="ourVision" icon={<FaEye size={10} />} contentKey="ourVision" color="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* شريط الأخبار المتحرك (ماركيز) */}
      {/* ======================================== */}
      <div className="bg-transparent py-4 overflow-hidden">
        <div className="relative group container-custom">
          <button onClick={() => scrollMarquee('left')} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 z-20 transition-all duration-300 shadow-lg backdrop-blur-sm">
            <FaChevronRight size={18} />
          </button>
          <button onClick={() => scrollMarquee('right')} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 z-20 transition-all duration-300 shadow-lg backdrop-blur-sm">
            <FaChevronLeft size={18} />
          </button>
          <div ref={marqueeRef} className="marquee-container overflow-x-auto overflow-y-hidden scroll-smooth hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="inline-flex gap-5 py-3 px-10">
              {[...translatedData.sliderNews, ...translatedData.sliderNews, ...translatedData.sliderNews].map((news, idx) => (
                <a key={idx} href={`/news/${encodeURIComponent(news.slug)}`} className="inline-flex flex-col w-80 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl hover:bg-white/40 dark:hover:bg-black/40 transition-all duration-300 shadow-lg overflow-hidden border border-white/20 dark:border-white/10">
                  {news.image && <img src={news.image} alt={news.title} className="w-full h-40 object-cover" />}
                  <div className="p-4">
                    <h4 className="text-gray-900 dark:text-white font-bold text-base line-clamp-2 mb-2">{news.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 text-xs line-clamp-2">{news.description || news.content?.substring(0, 80)}</p>
                    <span className="text-gray-500 dark:text-gray-400 text-[10px] mt-2 block">📰 {news.category || t('news')}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .marquee-container {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
      `}</style>

      {/* ======================================== */}
      {/* القالب الثاني - تحليلات سياسية ممددة + أخبار */}
      {/* ======================================== */}
      <div className="bg-gray-100 dark:bg-gray-900/30 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* العمود الأيمن - تحليلات سياسية (نص حر - ممدد مكان أبراج الفلك) */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl h-full">
                <h3 className="text-blue-600 dark:text-blue-400 font-bold text-base mb-3 pb-2 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                  <FaChartBar size={14} /> {t('politicalAnalysis')}
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {(() => {
                      const siteContent = siteTexts['politicalAnalysisText']
                      let content = ''
                      if (siteContent) {
                        if (currentLocale === 'ar') content = siteContent.value_ar
                        else if (currentLocale === 'en') content = siteContent.value_en
                        else content = siteContent.value_ku
                      } else {
                        content = t('politicalAnalysisText')
                      }
                      if (content.length > 1500) content = content.substring(0, 1500) + '...'
                      return content
                    })()}
                  </p>
                </div>
              </div>
            </div>

            {/* العمود الأوسط - أخبار (خبر كبير + خبرين كبيرين) */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              
              {/* الخبر الكبير */}
              {mainNewsItem && (
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-xl transition-shadow mb-6">
                  <a href={`/news/${encodeURIComponent(mainNewsItem.slug)}`} className="block">
                    {mainNewsItem.image && <img src={mainNewsItem.image} alt={mainNewsItem.title} className="w-full h-80 object-cover" />}
                    <div className="p-5">
                      <span className="text-red-500 text-xs font-bold">{mainNewsItem.category || t('news')}</span>
                      <h2 className="font-bold text-2xl mt-2 line-clamp-2 hover:text-red-600 transition">{mainNewsItem.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainNewsItem.description || mainNewsItem.content?.substring(0, 150)}...</p>
                      <span className="text-gray-400 text-xs mt-2 block">{new Date(mainNewsItem.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                    </div>
                  </a>
                </div>
              )}

              {/* خبرين كبيرين جنباً إلى جنب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {translatedData.regularNews[4] && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group shadow-md flex flex-col h-full">
                    <a href={`/news/${encodeURIComponent(translatedData.regularNews[4].slug)}`} className="flex flex-col h-full">
                      {translatedData.regularNews[4].image && <img src={translatedData.regularNews[4].image} alt={translatedData.regularNews[4].title} className="w-full h-56 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="text-red-500 text-xs font-bold">{translatedData.regularNews[4].category || t('news')}</span>
                        <h3 className="font-bold text-xl mt-2 line-clamp-2 group-hover:text-red-600">{translatedData.regularNews[4].title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3 flex-1">{translatedData.regularNews[4].description || translatedData.regularNews[4].content?.substring(0, 120)}...</p>
                        <span className="text-gray-400 text-xs mt-3 block">{new Date(translatedData.regularNews[4].created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                )}
                {translatedData.regularNews[5] && (
                  <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group shadow-md flex flex-col h-full">
                    <a href={`/news/${encodeURIComponent(translatedData.regularNews[5].slug)}`} className="flex flex-col h-full">
                      {translatedData.regularNews[5].image && <img src={translatedData.regularNews[5].image} alt={translatedData.regularNews[5].title} className="w-full h-56 object-cover" />}
                      <div className="p-5 flex-1 flex flex-col">
                        <span className="text-red-500 text-xs font-bold">{translatedData.regularNews[5].category || t('news')}</span>
                        <h3 className="font-bold text-xl mt-2 line-clamp-2 group-hover:text-red-600">{translatedData.regularNews[5].title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3 flex-1">{translatedData.regularNews[5].description || translatedData.regularNews[5].content?.substring(0, 120)}...</p>
                        <span className="text-gray-400 text-xs mt-3 block">{new Date(translatedData.regularNews[5].created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* القالب الثالث - 4 أخبار + أسعار عالمية */}
      {/* ======================================== */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 order-1 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {translatedData.regularNews.slice(0, 4).map((news) => (
                <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group shadow-md flex flex-col h-full">
                  <a href={`/news/${encodeURIComponent(news.slug)}`} className="flex flex-col h-full">
                    {news.image && <img src={news.image} alt={news.title} className="w-full h-48 object-cover" />}
                    <div className="p-4 flex-1 flex flex-col">
                      <span className="text-red-500 text-[11px] font-bold">{news.category || t('news')}</span>
                      <h3 className="font-bold text-lg mt-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2 flex-1">{news.description || news.content?.substring(0, 100)}...</p>
                      <span className="text-gray-400 text-[11px] mt-3 block">{new Date(news.created_at).toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 order-2 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2">
                <h3 className="text-white font-bold text-sm flex items-center gap-2"><FaGlobe size={12} /> {t('globalPrices')}</h3>
              </div>
              <div className="p-2 max-h-[500px] overflow-y-auto">
                <PriceSection titleKey="arabCurrencies" icon="🇸🇦" color="green">
                  <PriceItem nameKey="sar" code="SAR" value={exchangeRates?.sar || '3.75'} unit="ر.س" trend="up" />
                  <PriceItem nameKey="aed" code="AED" value={exchangeRates?.aed || '1.02'} unit="د.إ" trend="stable" />
                  <PriceItem nameKey="kwd" code="KWD" value={exchangeRates?.kwd || '12.25'} unit="د.ك" trend="up" />
                  <PriceItem nameKey="qar" code="QAR" value={exchangeRates?.qar || '1.03'} unit="ر.ق" trend="down" />
                  <PriceItem nameKey="bhd" code="BHD" value={exchangeRates?.bhd || '9.95'} unit="د.ب" trend="up" />
                  <PriceItem nameKey="omr" code="OMR" value={exchangeRates?.omr || '9.74'} unit="ر.ع" trend="stable" />
                  <PriceItem nameKey="jod" code="JOD" value={exchangeRates?.jod || '5.29'} unit="د.ا" trend="up" />
                  <PriceItem nameKey="sdg" code="SDG" value={exchangeRates?.sdg || '0.062'} unit="ج.س" trend="down" />
                </PriceSection>
                <PriceSection titleKey="foreignCurrencies" icon="🌍" color="blue">
                  <PriceItem nameKey="usd" code="USD" value={exchangeRates?.usd || '3.75'} unit="ج.م" trend="up" icon={<FaDollarSign className="text-yellow-500" />} />
                  <PriceItem nameKey="eur" code="EUR" value={exchangeRates?.eur || '4.05'} unit="ج.م" trend="down" icon={<FaEuroSign className="text-blue-500" />} />
                  <PriceItem nameKey="gbp" code="GBP" value={exchangeRates?.gbp || '4.75'} unit="ج.م" trend="up" icon={<FaPoundSign className="text-purple-500" />} />
                  <PriceItem nameKey="chf" code="CHF" value={exchangeRates?.chf || '4.20'} unit="ج.م" trend="down" />
                  <PriceItem nameKey="cad" code="CAD" value={exchangeRates?.cad || '2.75'} unit="ج.م" trend="up" />
                  <PriceItem nameKey="aud" code="AUD" value={exchangeRates?.aud || '2.45'} unit="ج.م" trend="down" />
                  <PriceItem nameKey="jpy" code="JPY" value={exchangeRates?.jpy || '0.025'} unit="ج.م" trend="stable" icon={<FaYenSign className="text-red-500" />} />
                  <PriceItem nameKey="cny" code="CNY" value={exchangeRates?.cny || '0.52'} unit="ج.م" trend="up" />
                  <PriceItem nameKey="try" code="TRY" value={exchangeRates?.try || '0.11'} unit="ج.م" trend="down" />
                  <PriceItem nameKey="rub" code="RUB" value={exchangeRates?.rub || '0.041'} unit="ج.م" trend="down" />
                  <PriceItem nameKey="inr" code="INR" value={exchangeRates?.inr || '0.045'} unit="ج.م" trend="stable" />
                  <PriceItem nameKey="brl" code="BRL" value={exchangeRates?.brl || '0.68'} unit="ج.م" trend="up" />
                </PriceSection>
                <PriceSection titleKey="cryptoCurrencies" icon="💎" color="purple">
                  <PriceItem nameKey="btc" code="BTC" value={exchangeRates?.btc || '65,234'} unit="$" trend="up" icon={<FaBitcoin className="text-orange-500" />} />
                  <PriceItem nameKey="eth" code="ETH" value={exchangeRates?.eth || '3,456'} unit="$" trend="down" />
                  <PriceItem nameKey="xrp" code="XRP" value={exchangeRates?.xrp || '0.62'} unit="$" trend="up" />
                  <PriceItem nameKey="sol" code="SOL" value={exchangeRates?.sol || '145'} unit="$" trend="up" />
                  <PriceItem nameKey="ada" code="ADA" value={exchangeRates?.ada || '0.45'} unit="$" trend="down" />
                  <PriceItem nameKey="doge" code="DOGE" value={exchangeRates?.doge || '0.12'} unit="$" trend="up" />
                </PriceSection>
                <PriceSection titleKey="preciousMetals" icon="🏆" color="yellow">
                  <PriceItem nameKey="gold" code="XAU" value={exchangeRates?.gold || '2,350'} unit="$" trend="up" icon={<FaTrophy className="text-yellow-600" />} />
                  <PriceItem nameKey="silver" code="XAG" value={exchangeRates?.silver || '28.50'} unit="$" trend="down" />
                  <PriceItem nameKey="platinum" code="XPT" value={exchangeRates?.platinum || '920'} unit="$" trend="up" />
                  <PriceItem nameKey="copper" code="COP" value={exchangeRates?.copper || '4.15'} unit="$" trend="up" />
                </PriceSection>
                <PriceSection titleKey="energy" icon="⛽" color="gray">
                  <PriceItem nameKey="oil" code="BRT" value={exchangeRates?.oil || '85.20'} unit="$" trend="down" icon={<FaOilCan className="text-gray-600" />} />
                  <PriceItem nameKey="wti" code="WTI" value={exchangeRates?.wti || '80.50'} unit="$" trend="up" />
                  <PriceItem nameKey="ng" code="NG" value={exchangeRates?.ng || '2.85'} unit="$" trend="down" />
                </PriceSection>
                <PriceSection titleKey="indices" icon="📈" color="red">
                  <PriceItem nameKey="sp500" code="SPX" value={exchangeRates?.sp500 || '5,234'} unit="نقطة" trend="up" />
                  <PriceItem nameKey="nasdaq" code="IXIC" value={exchangeRates?.nasdaq || '18,450'} unit="نقطة" trend="up" />
                  <PriceItem nameKey="dowjones" code="DJI" value={exchangeRates?.dowjones || '39,870'} unit="نقطة" trend="down" />
                </PriceSection>
                <div className="mt-3 pt-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <p className="text-[9px] text-gray-400">{t('lastUpdate')}: {new Date().toLocaleTimeString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================== */}
      {/* الجريدة اليومية والإحصائيات (مع تحديث فوري للإحصائيات) */}
      {/* ======================================== */}
      <div className="bg-gray-900 text-white mt-6">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/daily-brief" className="flex items-center gap-2 group">
              <div className="w-1 h-5 bg-red-500 rounded-full"></div>
              <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition">📰 {t('dailyBrief')}</h3>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {translatedBrief.length > 0 ? translatedBrief.map((item, idx) => (
              <a key={idx} href={item.link_url || '#'} className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer">
                <p className="text-orange-400 text-xs font-bold mb-1">{item.section_title}</p>
                <p className="text-white text-xs">{item.title}</p>
                {item.description && <p className="text-gray-400 text-[10px] mt-1">{item.description}</p>}
              </a>
            )) : (
              <>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-orange-400 text-xs font-bold mb-1">{t('mainTitle')}</p><p className="text-white text-xs">{t('techDevelopments')}</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-blue-400 text-xs font-bold mb-1">{t('economyToday')}</p><p className="text-white text-xs">{t('oilPricesRise')}</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-green-400 text-xs font-bold mb-1">{t('technology')}</p><p className="text-white text-xs">{t('aiRevolution')}</p></div>
                <div className="bg-gray-800/50 p-3 hover:bg-gray-800 transition rounded-lg cursor-pointer"><p className="text-purple-400 text-xs font-bold mb-1">{t('sports')}</p><p className="text-white text-xs">{t('finalMatch')}</p></div>
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
                  <div className="text-[10px] text-gray-400">{stat.labelKey}</div>
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