```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { isAuthenticated, logout, getCurrentAdmin } from '../../lib/auth'
import { 
  FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaPalette, 
  FaTelegram, FaSignOutAlt, FaSpinner, FaUpload, FaEye, 
  FaEyeSlash, FaLink, FaTextHeight, FaPaintBrush, FaPlus, 
  FaCommentDots, FaNewspaper, FaChartLine, FaCog, FaHome,
  FaDollarSign, FaEuroSign, FaTrophy, FaOilCan, FaArrowUp, FaArrowDown,
  FaUsers, FaGlobe, FaCalendarAlt, FaStar, FaPenFancy, FaChartBar,
  FaFire, FaUserPlus, FaUserMinus, FaKey, FaExchangeAlt, FaListUl,
  FaRulerCombined, FaFont, FaBorderAll, FaSlidersH, FaMapMarkerAlt,
  FaLanguage, FaCheck, FaCheckDouble, FaLayerGroup, FaEyeDropper,
  FaPhotoVideo, FaHeading, FaParagraph, FaImages, FaTh, FaThLarge
} from 'react-icons/fa'
import { getAllTickerItems, addCustomTickerItem, deleteTickerItem, updateTickerOrder, toggleTickerItem, getAllSiteTexts, updateSiteText } from '../../lib/siteConfig'

// ============================================================
// أنواع البيانات (Types)
// ============================================================
interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image: string
  created_at: string
  position?: string
  is_featured?: boolean
  slug?: string
}

interface Settings {
  siteName: string
  telegramUrl: string
  primaryColor: string
  tickerSpeed: number
}

interface HeroSection {
  id?: number
  title: string
  subtitle: string
  background_image: string
  overlay_opacity: number
  button_text: string
  button_link: string
  is_enabled: boolean
}

interface TickerItem {
  id: number
  text_key: string
  text_content_ar: string
  text_content_en: string
  text_content_ku: string
  link_url: string | null
  link_text: string | null
  order_index: number
  is_active: boolean
  is_external: boolean
}

interface Comment {
  id: string
  author_name: string
  content: string
  news_slug: string
  created_at: string
}

interface DailyBriefItem {
  id: number
  section_title: string
  title: string
  description: string
  link_url: string
  order_index: number
  is_active: boolean
}

interface ExchangeRate {
  id: number
  name: string
  code: string
  value: number
  unit: string
  category: 'arab' | 'foreign' | 'crypto' | 'metal' | 'energy' | 'index'
  trend: 'up' | 'down' | 'stable'
  order_index: number
  is_active: boolean
}

interface StatItem {
  id: number
  icon: string
  value: string
  label: string
  order_index: number
  is_active: boolean
}

interface TemplateConfig {
  id: number
  template_id: string
  is_enabled: boolean
  order_index: number
  title: string
  bg_color: string
}

interface AdminUser {
  id: number
  username: string
  name: string
  role: 'owner' | 'admin' | 'editor'
  created_at: string
}

interface SiteText {
  id: number
  key_name: string
  value_ar: string
  value_en: string
  value_ku: string
}

interface Template1Config {
  breakingNewsIds: string[]
  breakingNewsCount: number
  breakingNewsTitle: string
  economicAnalysisEnabled: boolean
  economicAnalysisTitle: string
  sliderNewsIds: string[]
  sliderCount: number
  sliderAutoPlay: boolean
  sliderInterval: number
  smallNewsTopIds: string[]
  smallNewsTopCount: number
  smallNewsTopTitle: string
  largeNewsTopIds: string[]
  largeNewsTopCount: number
  largeNewsTopTitle: string
  sideNewsIds: string[]
  sideNewsCount: number
  sideNewsTitle: string
  ourVisionEnabled: boolean
  ourVisionTitle: string
}

interface Template2Config {
  mainNewsId: string
  mainNewsImageHeight: string
  mainNewsTitleSize: string
  mainNewsDescriptionLines: number
  middleNewsIds: string[]
  middleNewsCount: number
  middleNewsImageHeight: string
  middleNewsTitleSize: string
  middleNewsDescriptionLines: number
  politicalAnalysisEnabled: boolean
  politicalAnalysisTitle: string
}

interface Template3Config {
  regularNewsIds: string[]
  regularNewsCount: number
  regularNewsImageHeight: string
  regularNewsTitleSize: string
  regularNewsDescriptionLines: number
}

interface MarqueeConfig {
  newsIds: string[]
  autoScroll: boolean
  scrollSpeed: number
  displayCount: number
}

// ============================================================
// المكون الرئيسي
// ============================================================
export default function OwnerPage() {
  const router = useRouter()
  
  // المصادقة
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(true)
  
  // التبويب النشط
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'settings' | 'ticker' | 'hero' | 'comments' | 'dailybrief' | 'exchange' | 'stats' | 'templates' | 'admins' | 'menu' | 'sitetexts' | 'template1' | 'template2' | 'template3' | 'marquee'>('home')
  
  // الأخبار
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  const [newNewsTitle, setNewNewsTitle] = useState('')
  const [newNewsContent, setNewNewsContent] = useState('')
  const [newNewsCategory, setNewNewsCategory] = useState('')
  const [newNewsImage, setNewNewsImage] = useState('')
  const [newNewsSlug, setNewNewsSlug] = useState('')
  const [newNewsPosition, setNewNewsPosition] = useState('auto')
  const [newNewsFeatured, setNewNewsFeatured] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // الإعدادات العامة
  const [settings, setSettings] = useState<Settings>({
    siteName: 'ديب سورس نيوز',
    telegramUrl: 'https://t.me/deepsourc',
    primaryColor: '#dc2626',
    tickerSpeed: 4000,
  })
  
  // البانر العلوي
  const [hero, setHero] = useState<HeroSection>({
    title: 'آخر الأخبار العميقة',
    subtitle: 'تحليلات لا تجدها في أي مكان آخر',
    background_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920',
    overlay_opacity: 20,
    button_text: 'استكشف الأخبار',
    button_link: '/',
    is_enabled: true,
  })
  
  // الشريط المتحرك
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTickerTextAr, setNewTickerTextAr] = useState('')
  const [newTickerTextEn, setNewTickerTextEn] = useState('')
  const [newTickerTextKu, setNewTickerTextKu] = useState('')
  const [newTickerLink, setNewTickerLink] = useState('')
  const [newTickerLinkText, setNewTickerLinkText] = useState('')
  const [newTickerIsExternal, setNewTickerIsExternal] = useState(false)
  
  // التعليقات
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  
  // الجريدة اليومية
  const [dailyBrief, setDailyBrief] = useState<DailyBriefItem[]>([])
  const [showDailyBriefModal, setShowDailyBriefModal] = useState(false)
  const [newBriefSection, setNewBriefSection] = useState('')
  const [newBriefTitle, setNewBriefTitle] = useState('')
  const [newBriefDescription, setNewBriefDescription] = useState('')
  const [newBriefLink, setNewBriefLink] = useState('')
  
  // الأسعار العالمية
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [showRateModal, setShowRateModal] = useState(false)
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null)
  const [newRateName, setNewRateName] = useState('')
  const [newRateCode, setNewRateCode] = useState('')
  const [newRateValue, setNewRateValue] = useState('')
  const [newRateUnit, setNewRateUnit] = useState('')
  const [newRateCategory, setNewRateCategory] = useState<'arab' | 'foreign' | 'crypto' | 'metal' | 'energy' | 'index'>('foreign')
  const [newRateTrend, setNewRateTrend] = useState<'up' | 'down' | 'stable'>('up')
  
  // الإحصائيات
  const [stats, setStats] = useState<StatItem[]>([])
  const [showStatModal, setShowStatModal] = useState(false)
  const [editingStat, setEditingStat] = useState<StatItem | null>(null)
  const [newStatIcon, setNewStatIcon] = useState('FaGlobe')
  const [newStatValue, setNewStatValue] = useState('')
  const [newStatLabel, setNewStatLabel] = useState('')
  
  // النصوص القابلة للتعديل
  const [siteTexts, setSiteTexts] = useState<SiteText[]>([])
  const [editingSiteText, setEditingSiteText] = useState<SiteText | null>(null)
  
  // القوالب الأساسية
  const [templates, setTemplates] = useState<TemplateConfig[]>([])
  
  // المشرفين
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor'>('editor')
  
  // القائمة العلوية
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [newMenuTitle, setNewMenuTitle] = useState('')
  const [newMenuLink, setNewMenuLink] = useState('')
  
  // خيارات الأخبار
  const [allNewsOptions, setAllNewsOptions] = useState<NewsItem[]>([])
  
  // إعدادات القالب الأول
  const [template1Config, setTemplate1Config] = useState<Template1Config>({
    breakingNewsIds: [],
    breakingNewsCount: 4,
    breakingNewsTitle: 'أخبار عاجلة',
    economicAnalysisEnabled: true,
    economicAnalysisTitle: 'التحليلات الاقتصادية',
    sliderNewsIds: [],
    sliderCount: 5,
    sliderAutoPlay: true,
    sliderInterval: 5000,
    smallNewsTopIds: [],
    smallNewsTopCount: 3,
    smallNewsTopTitle: 'أخبار سريعة',
    largeNewsTopIds: [],
    largeNewsTopCount: 3,
    largeNewsTopTitle: 'أخبار معمقة',
    sideNewsIds: [],
    sideNewsCount: 4,
    sideNewsTitle: 'أخبار جانبية',
    ourVisionEnabled: true,
    ourVisionTitle: 'رؤيتنا',
  })
  
  // إعدادات القالب الثاني
  const [template2Config, setTemplate2Config] = useState<Template2Config>({
    mainNewsId: '',
    mainNewsImageHeight: 'h-96',
    mainNewsTitleSize: 'text-3xl',
    mainNewsDescriptionLines: 3,
    middleNewsIds: [],
    middleNewsCount: 2,
    middleNewsImageHeight: 'h-56',
    middleNewsTitleSize: 'text-xl',
    middleNewsDescriptionLines: 2,
    politicalAnalysisEnabled: true,
    politicalAnalysisTitle: 'تحليلات سياسية',
  })
  
  // إعدادات القالب الثالث
  const [template3Config, setTemplate3Config] = useState<Template3Config>({
    regularNewsIds: [],
    regularNewsCount: 4,
    regularNewsImageHeight: 'h-48',
    regularNewsTitleSize: 'text-lg',
    regularNewsDescriptionLines: 2,
  })
  
  // إعدادات الشريط المتحرك
  const [marqueeConfig, setMarqueeConfig] = useState<MarqueeConfig>({
    newsIds: [],
    autoScroll: true,
    scrollSpeed: 30,
    displayCount: 10,
  })
  
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)

  // ============================================================
  // التحقق من صلاحية الدخول
  // ============================================================
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      if (!authenticated) {
        router.push('/login')
      } else {
        const admin = getCurrentAdmin()
        setAdminName(admin.name || 'المالك')
        setAdminRole(admin.role || 'owner')
        setIsAuthorized(true)
      }
      setLoadingAuth(false)
    }
    checkAuth()
  }, [router])

  // ============================================================
  // جلب البيانات
  // ============================================================
  const fetchNews = async () => {
    setLoading(true)
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
    if (data) setNews(data as NewsItem[])
    setLoading(false)
  }

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').single()
    if (data) {
      setSettings({
        siteName: data.site_name || 'ديب سورس نيوز',
        telegramUrl: data.telegram_url || 'https://t.me/deepsourc',
        primaryColor: data.primary_color || '#dc2626',
        tickerSpeed: data.ticker_speed || 4000,
      })
    }
  }

  const fetchHero = async () => {
    const { data } = await supabase.from('hero_section').select('*').single()
    if (data) {
      setHero({
        title: data.title || 'آخر الأخبار العميقة',
        subtitle: data.subtitle || 'تحليلات لا تجدها في أي مكان آخر',
        background_image: data.background_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920',
        overlay_opacity: data.overlay_opacity || 20,
        button_text: data.button_text || 'استكشف الأخبار',
        button_link: data.button_link || '/',
        is_enabled: data.is_enabled !== false,
      })
    }
  }

  const fetchTickerItems = async () => {
    const items = await getAllTickerItems()
    setTickerItems(items)
  }

  const fetchComments = async () => {
    setCommentsLoading(true)
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false })
    if (data) setComments(data as Comment[])
    setCommentsLoading(false)
  }

  const fetchDailyBrief = async () => {
    const { data } = await supabase.from('daily_brief').select('*').order('order_index', { ascending: true })
    if (data) setDailyBrief(data as DailyBriefItem[])
  }

  const fetchExchangeRates = async () => {
    const { data } = await supabase.from('exchange_rates_config').select('*').order('order_index', { ascending: true })
    if (data && data.length > 0) {
      setExchangeRates(data as ExchangeRate[])
    } else {
      const defaultRates: ExchangeRate[] = [
        { id: 1, name: 'الريال السعودي', code: 'SAR', value: 1.00, unit: 'ر.س', category: 'arab', trend: 'up', order_index: 1, is_active: true },
        { id: 2, name: 'الدرهم الإماراتي', code: 'AED', value: 1.02, unit: 'د.إ', category: 'arab', trend: 'stable', order_index: 2, is_active: true },
        { id: 3, name: 'الدولار الأمريكي', code: 'USD', value: 3.75, unit: 'ج.م', category: 'foreign', trend: 'up', order_index: 3, is_active: true },
        { id: 4, name: 'اليورو', code: 'EUR', value: 4.05, unit: 'ج.م', category: 'foreign', trend: 'down', order_index: 4, is_active: true },
        { id: 5, name: 'بتكوين', code: 'BTC', value: 65234, unit: '$', category: 'crypto', trend: 'up', order_index: 5, is_active: true },
        { id: 6, name: 'الذهب', code: 'XAU', value: 2350, unit: '$', category: 'metal', trend: 'up', order_index: 6, is_active: true },
        { id: 7, name: 'خام برنت', code: 'BRT', value: 85.20, unit: '$', category: 'energy', trend: 'down', order_index: 7, is_active: true },
        { id: 8, name: 'S&P 500', code: 'SPX', value: 5234, unit: 'نقطة', category: 'index', trend: 'up', order_index: 8, is_active: true },
      ]
      setExchangeRates(defaultRates)
    }
  }

  const fetchStats = async () => {
    const { data } = await supabase.from('site_stats').select('*').order('order_index', { ascending: true })
    if (data && data.length > 0) {
      setStats(data as StatItem[])
    } else {
      const defaultStats: StatItem[] = [
        { id: 1, icon: 'FaGlobe', value: '120+', label: 'دولة', order_index: 1, is_active: true },
        { id: 2, icon: 'FaUsers', value: '50K+', label: 'قارئ', order_index: 2, is_active: true },
        { id: 3, icon: 'FaChartLine', value: '10K+', label: 'مقال', order_index: 3, is_active: true },
        { id: 4, icon: 'FaCalendarAlt', value: 'منذ 2024', label: 'الانطلاق', order_index: 4, is_active: true },
      ]
      setStats(defaultStats)
    }
  }

  const fetchSiteTexts = async () => {
    const texts = await getAllSiteTexts()
    setSiteTexts(texts)
  }

  const fetchTemplates = async () => {
    const { data } = await supabase.from('templates_config').select('*').order('order_index', { ascending: true })
    if (data && data.length > 0) {
      setTemplates(data as TemplateConfig[])
    } else {
      const defaultTemplates: TemplateConfig[] = [
        { id: 1, template_id: 'template1', is_enabled: true, order_index: 1, title: 'القالب الأول (رئيسي)', bg_color: '#ffffff' },
        { id: 2, template_id: 'template2', is_enabled: true, order_index: 2, title: 'القالب الثاني (تحليلات)', bg_color: '#f3f4f6' },
        { id: 3, template_id: 'template3', is_enabled: true, order_index: 3, title: 'القالب الثالث (آراء وأسعار)', bg_color: '#f3f4f6' },
      ]
      setTemplates(defaultTemplates)
    }
  }

  const fetchAdmins = async () => {
    const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: true })
    if (data) setAdmins(data as AdminUser[])
  }

  const fetchMenu = async () => {
    const { data } = await supabase.from('menu_items').select('*').order('order_index', { ascending: true })
    if (data) setMenuItems(data)
  }

  const fetchAllNewsOptions = async () => {
    const { data } = await supabase.from('news').select('id, title, category, image, slug, created_at').order('created_at', { ascending: false })
    if (data) setAllNewsOptions(data as NewsItem[])
  }

  const fetchTemplate1Config = async () => {
    const { data } = await supabase.from('template1_config').select('*').single()
    if (data) {
      setTemplate1Config({
        breakingNewsIds: data.breaking_news_ids || [],
        breakingNewsCount: data.breaking_news_count || 4,
        breakingNewsTitle: data.breaking_news_title || 'أخبار عاجلة',
        economicAnalysisEnabled: data.economic_analysis_enabled !== false,
        economicAnalysisTitle: data.economic_analysis_title || 'التحليلات الاقتصادية',
        sliderNewsIds: data.slider_news_ids || [],
        sliderCount: data.slider_count || 5,
        sliderAutoPlay: data.slider_auto_play !== false,
        sliderInterval: data.slider_interval || 5000,
        smallNewsTopIds: data.small_news_top_ids || [],
        smallNewsTopCount: data.small_news_top_count || 3,
        smallNewsTopTitle: data.small_news_top_title || 'أخبار سريعة',
        largeNewsTopIds: data.large_news_top_ids || [],
        largeNewsTopCount: data.large_news_top_count || 3,
        largeNewsTopTitle: data.large_news_top_title || 'أخبار معمقة',
        sideNewsIds: data.side_news_ids || [],
        sideNewsCount: data.side_news_count || 4,
        sideNewsTitle: data.side_news_title || 'أخبار جانبية',
        ourVisionEnabled: data.our_vision_enabled !== false,
        ourVisionTitle: data.our_vision_title || 'رؤيتنا',
      })
    }
  }

  const fetchTemplate2Config = async () => {
    const { data } = await supabase.from('template2_config').select('*').single()
    if (data) {
      setTemplate2Config({
        mainNewsId: data.main_news_id || '',
        mainNewsImageHeight: data.main_news_image_height || 'h-96',
        mainNewsTitleSize: data.main_news_title_size || 'text-3xl',
        mainNewsDescriptionLines: data.main_news_description_lines || 3,
        middleNewsIds: data.middle_news_ids || [],
        middleNewsCount: data.middle_news_count || 2,
        middleNewsImageHeight: data.middle_news_image_height || 'h-56',
        middleNewsTitleSize: data.middle_news_title_size || 'text-xl',
        middleNewsDescriptionLines: data.middle_news_description_lines || 2,
        politicalAnalysisEnabled: data.political_analysis_enabled !== false,
        politicalAnalysisTitle: data.political_analysis_title || 'تحليلات سياسية',
      })
    }
  }

  const fetchTemplate3Config = async () => {
    const { data } = await supabase.from('template3_config').select('*').single()
    if (data) {
      setTemplate3Config({
        regularNewsIds: data.regular_news_ids || [],
        regularNewsCount: data.regular_news_count || 4,
        regularNewsImageHeight: data.regular_news_image_height || 'h-48',
        regularNewsTitleSize: data.regular_news_title_size || 'text-lg',
        regularNewsDescriptionLines: data.regular_news_description_lines || 2,
      })
    }
  }

  const fetchMarqueeConfig = async () => {
    const { data } = await supabase.from('marquee_config').select('*').single()
    if (data) {
      setMarqueeConfig({
        newsIds: data.news_ids || [],
        autoScroll: data.auto_scroll !== false,
        scrollSpeed: data.scroll_speed || 30,
        displayCount: data.display_count || 10,
      })
    }
  }

  // ============================================================
  // حفظ الإعدادات
  // ============================================================
  const saveTemplate1Config = async () => {
    const { data: existing } = await supabase.from('template1_config').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('template1_config').update({
        breaking_news_ids: template1Config.breakingNewsIds,
        breaking_news_count: template1Config.breakingNewsCount,
        breaking_news_title: template1Config.breakingNewsTitle,
        economic_analysis_enabled: template1Config.economicAnalysisEnabled,
        economic_analysis_title: template1Config.economicAnalysisTitle,
        slider_news_ids: template1Config.sliderNewsIds,
        slider_count: template1Config.sliderCount,
        slider_auto_play: template1Config.sliderAutoPlay,
        slider_interval: template1Config.sliderInterval,
        small_news_top_ids: template1Config.smallNewsTopIds,
        small_news_top_count: template1Config.smallNewsTopCount,
        small_news_top_title: template1Config.smallNewsTopTitle,
        large_news_top_ids: template1Config.largeNewsTopIds,
        large_news_top_count: template1Config.largeNewsTopCount,
        large_news_top_title: template1Config.largeNewsTopTitle,
        side_news_ids: template1Config.sideNewsIds,
        side_news_count: template1Config.sideNewsCount,
        side_news_title: template1Config.sideNewsTitle,
        our_vision_enabled: template1Config.ourVisionEnabled,
        our_vision_title: template1Config.ourVisionTitle,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('template1_config').insert([{
        breaking_news_ids: template1Config.breakingNewsIds,
        breaking_news_count: template1Config.breakingNewsCount,
        breaking_news_title: template1Config.breakingNewsTitle,
        economic_analysis_enabled: template1Config.economicAnalysisEnabled,
        economic_analysis_title: template1Config.economicAnalysisTitle,
        slider_news_ids: template1Config.sliderNewsIds,
        slider_count: template1Config.sliderCount,
        slider_auto_play: template1Config.sliderAutoPlay,
        slider_interval: template1Config.sliderInterval,
        small_news_top_ids: template1Config.smallNewsTopIds,
        small_news_top_count: template1Config.smallNewsTopCount,
        small_news_top_title: template1Config.smallNewsTopTitle,
        large_news_top_ids: template1Config.largeNewsTopIds,
        large_news_top_count: template1Config.largeNewsTopCount,
        large_news_top_title: template1Config.largeNewsTopTitle,
        side_news_ids: template1Config.sideNewsIds,
        side_news_count: template1Config.sideNewsCount,
        side_news_title: template1Config.sideNewsTitle,
        our_vision_enabled: template1Config.ourVisionEnabled,
        our_vision_title: template1Config.ourVisionTitle,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ إعدادات القالب الأول: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ إعدادات القالب الأول بنجاح')
    }
  }

  const saveTemplate2Config = async () => {
    const { data: existing } = await supabase.from('template2_config').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('template2_config').update({
        main_news_id: template2Config.mainNewsId,
        main_news_image_height: template2Config.mainNewsImageHeight,
        main_news_title_size: template2Config.mainNewsTitleSize,
        main_news_description_lines: template2Config.mainNewsDescriptionLines,
        middle_news_ids: template2Config.middleNewsIds,
        middle_news_count: template2Config.middleNewsCount,
        middle_news_image_height: template2Config.middleNewsImageHeight,
        middle_news_title_size: template2Config.middleNewsTitleSize,
        middle_news_description_lines: template2Config.middleNewsDescriptionLines,
        political_analysis_enabled: template2Config.politicalAnalysisEnabled,
        political_analysis_title: template2Config.politicalAnalysisTitle,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('template2_config').insert([{
        main_news_id: template2Config.mainNewsId,
        main_news_image_height: template2Config.mainNewsImageHeight,
        main_news_title_size: template2Config.mainNewsTitleSize,
        main_news_description_lines: template2Config.mainNewsDescriptionLines,
        middle_news_ids: template2Config.middleNewsIds,
        middle_news_count: template2Config.middleNewsCount,
        middle_news_image_height: template2Config.middleNewsImageHeight,
        middle_news_title_size: template2Config.middleNewsTitleSize,
        middle_news_description_lines: template2Config.middleNewsDescriptionLines,
        political_analysis_enabled: template2Config.politicalAnalysisEnabled,
        political_analysis_title: template2Config.politicalAnalysisTitle,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ إعدادات القالب الثاني: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ إعدادات القالب الثاني بنجاح')
    }
  }

  const saveTemplate3Config = async () => {
    const { data: existing } = await supabase.from('template3_config').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('template3_config').update({
        regular_news_ids: template3Config.regularNewsIds,
        regular_news_count: template3Config.regularNewsCount,
        regular_news_image_height: template3Config.regularNewsImageHeight,
        regular_news_title_size: template3Config.regularNewsTitleSize,
        regular_news_description_lines: template3Config.regularNewsDescriptionLines,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('template3_config').insert([{
        regular_news_ids: template3Config.regularNewsIds,
        regular_news_count: template3Config.regularNewsCount,
        regular_news_image_height: template3Config.regularNewsImageHeight,
        regular_news_title_size: template3Config.regularNewsTitleSize,
        regular_news_description_lines: template3Config.regularNewsDescriptionLines,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ إعدادات القالب الثالث: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ إعدادات القالب الثالث بنجاح')
    }
  }

  const saveMarqueeConfig = async () => {
    const { data: existing } = await supabase.from('marquee_config').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('marquee_config').update({
        news_ids: marqueeConfig.newsIds,
        auto_scroll: marqueeConfig.autoScroll,
        scroll_speed: marqueeConfig.scrollSpeed,
        display_count: marqueeConfig.displayCount,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('marquee_config').insert([{
        news_ids: marqueeConfig.newsIds,
        auto_scroll: marqueeConfig.autoScroll,
        scroll_speed: marqueeConfig.scrollSpeed,
        display_count: marqueeConfig.displayCount,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ إعدادات الشريط: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ إعدادات الشريط بنجاح')
    }
  }

  const updateSettings = async () => {
    const { data: existing } = await supabase.from('site_settings').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('site_settings').update({
        telegram_url: settings.telegramUrl,
        primary_color: settings.primaryColor,
        ticker_speed: settings.tickerSpeed,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('site_settings').insert([{
        site_name: settings.siteName,
        telegram_url: settings.telegramUrl,
        primary_color: settings.primaryColor,
        ticker_speed: settings.tickerSpeed,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ الإعدادات: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ الإعدادات بنجاح!')
    }
  }

  const saveHero = async () => {
    const { data: existing } = await supabase.from('hero_section').select('id').maybeSingle()
    let result
    if (existing) {
      result = await supabase.from('hero_section').update({
        title: hero.title,
        subtitle: hero.subtitle,
        background_image: hero.background_image,
        overlay_opacity: hero.overlay_opacity,
        button_text: hero.button_text,
        button_link: hero.button_link,
        is_enabled: hero.is_enabled,
        updated_at: new Date().toISOString(),
      }).eq('id', existing.id)
    } else {
      result = await supabase.from('hero_section').insert([{
        title: hero.title,
        subtitle: hero.subtitle,
        background_image: hero.background_image,
        overlay_opacity: hero.overlay_opacity,
        button_text: hero.button_text,
        button_link: hero.button_link,
        is_enabled: hero.is_enabled,
      }])
    }
    if (result?.error) {
      setMessage('❌ خطأ في حفظ البانر: ' + result.error.message)
    } else {
      setMessage('✅ تم حفظ البانر بنجاح!')
    }
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      const filePath = `hero/${fileName}`
      const { error: uploadError } = await supabase.storage.from('news-images').upload(filePath, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError
      const { data: publicUrlData } = supabase.storage.from('news-images').getPublicUrl(filePath)
      setHero(prev => ({ ...prev, background_image: publicUrlData.publicUrl }))
      setMessage('✅ تم رفع صورة الخلفية بنجاح')
    } catch (error) {
      setMessage('❌ خطأ في رفع الصورة: ' + (error as Error).message)
    }
    setUploading(false)
  }

  const handleAddToTicker = async () => {
    if (!newTickerTextAr.trim() || !newTickerTextEn.trim() || !newTickerTextKu.trim()) {
      setMessage('❌ الرجاء إدخال النص باللغات الثلاث')
      return
    }
    
    const textKey = `ticker_${Date.now()}`
    
    const { error } = await addCustomTickerItem(
      textKey,
      newTickerTextAr,
      newTickerTextEn,
      newTickerTextKu,
      newTickerLink || '',
      newTickerLinkText || '',
      newTickerIsExternal
    )
    
    if (!error) {
      setMessage('✅ تم إضافة العنصر إلى الشريط')
      setShowAddModal(false)
      setNewTickerTextAr('')
      setNewTickerTextEn('')
      setNewTickerTextKu('')
      setNewTickerLink('')
      setNewTickerLinkText('')
      setNewTickerIsExternal(false)
      fetchTickerItems()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleRemoveFromTicker = async (id: number) => {
    if (!confirm('هل تريد إزالة هذا العنصر من الشريط؟')) return
    const { error } = await deleteTickerItem(id)
    if (!error) {
      setMessage('✅ تم إزالة العنصر من الشريط')
      fetchTickerItems()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    const { error } = await toggleTickerItem(id, !currentStatus)
    if (!error) {
      setMessage(`✅ ${currentStatus ? 'تم تعطيل' : 'تم تفعيل'} العنصر في الشريط`)
      fetchTickerItems()
    }
  }

  const moveUp = async (index: number) => {
    if (index === 0) return
    const newItems = [...tickerItems]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    await updateTickerOrder(newItems)
    fetchTickerItems()
  }

  const moveDown = async (index: number) => {
    if (index === tickerItems.length - 1) return
    const newItems = [...tickerItems]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    await updateTickerOrder(newItems)
    fetchTickerItems()
  }

  const handleDeleteComment = async (id: string) => {
    if (!confirm('هل تريد حذف هذا التعليق؟')) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف التعليق')
      fetchComments()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleAddBrief = async () => {
    if (!newBriefSection || !newBriefTitle || !newBriefDescription) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }
    const { error } = await supabase.from('daily_brief').insert([{
      section_title: newBriefSection,
      title: newBriefTitle,
      description: newBriefDescription,
      link_url: newBriefLink || '',
      order_index: dailyBrief.length + 1,
      is_active: true
    }])
    if (!error) {
      setMessage('✅ تم إضافة العنصر بنجاح')
      setShowDailyBriefModal(false)
      setNewBriefSection('')
      setNewBriefTitle('')
      setNewBriefDescription('')
      setNewBriefLink('')
      fetchDailyBrief()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleDeleteBrief = async (id: number) => {
    if (!confirm('هل تريد حذف هذا العنصر؟')) return
    const { error } = await supabase.from('daily_brief').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم الحذف بنجاح')
      fetchDailyBrief()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleAddRate = async () => {
    if (!newRateName || !newRateCode || !newRateValue) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }
    const newRate: ExchangeRate = {
      id: Date.now(),
      name: newRateName,
      code: newRateCode.toUpperCase(),
      value: parseFloat(newRateValue),
      unit: newRateUnit,
      category: newRateCategory,
      trend: newRateTrend,
      order_index: exchangeRates.length + 1,
      is_active: true
    }
    const { error } = await supabase.from('exchange_rates_config').insert([newRate])
    if (!error) {
      setMessage('✅ تم إضافة السعر بنجاح')
      setShowRateModal(false)
      setNewRateName('')
      setNewRateCode('')
      setNewRateValue('')
      setNewRateUnit('')
      fetchExchangeRates()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleUpdateRate = async () => {
    if (!editingRate) return
    const { error } = await supabase.from('exchange_rates_config').update({
      name: editingRate.name,
      code: editingRate.code,
      value: editingRate.value,
      unit: editingRate.unit,
      category: editingRate.category,
      trend: editingRate.trend,
      is_active: editingRate.is_active
    }).eq('id', editingRate.id)
    if (!error) {
      setMessage('✅ تم تحديث السعر بنجاح')
      setEditingRate(null)
      fetchExchangeRates()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleDeleteRate = async (id: number) => {
    if (!confirm('هل تريد حذف هذا السعر؟')) return
    const { error } = await supabase.from('exchange_rates_config').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف السعر')
      fetchExchangeRates()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleAddStat = async () => {
    if (!newStatValue || !newStatLabel) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }
    const { error } = await supabase.from('site_stats').insert([{
      icon: newStatIcon,
      value: newStatValue,
      label: newStatLabel,
      order_index: stats.length + 1,
      is_active: true
    }])
    if (!error) {
      setMessage('✅ تم إضافة الإحصائية بنجاح')
      setShowStatModal(false)
      setNewStatIcon('FaGlobe')
      setNewStatValue('')
      setNewStatLabel('')
      fetchStats()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleUpdateStat = async () => {
    if (!editingStat) return
    const { error } = await supabase.from('site_stats').update({
      icon: editingStat.icon,
      value: editingStat.value,
      label: editingStat.label,
      is_active: editingStat.is_active
    }).eq('id', editingStat.id)
    if (!error) {
      setMessage('✅ تم تحديث الإحصائية بنجاح')
      setEditingStat(null)
      fetchStats()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleDeleteStat = async (id: number) => {
    if (!confirm('هل تريد حذف هذه الإحصائية؟')) return
    const { error } = await supabase.from('site_stats').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف الإحصائية')
      fetchStats()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleUpdateSiteText = async () => {
    if (!editingSiteText) return
    const { error } = await updateSiteText(
      editingSiteText.key_name,
      editingSiteText.value_ar,
      editingSiteText.value_en,
      editingSiteText.value_ku
    )
    if (!error) {
      setMessage('✅ تم تحديث النص بنجاح')
      setEditingSiteText(null)
      fetchSiteTexts()
    } else {
      setMessage('❌ خطأ في التحديث: ' + error)
    }
  }

  const handleToggleTemplate = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('templates_config').update({ is_enabled: !currentStatus }).eq('id', id)
    if (!error) {
      setMessage(`✅ ${currentStatus ? 'تم تعطيل' : 'تم تفعيل'} القالب`)
      fetchTemplates()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminUsername || !newAdminName || !newAdminPassword) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }
    const { error } = await supabase.from('admins').insert([{
      username: newAdminUsername,
      name: newAdminName,
      password: btoa(newAdminPassword),
      role: newAdminRole,
      created_at: new Date().toISOString()
    }])
    if (!error) {
      setMessage('✅ تم إضافة المشرف بنجاح')
      setShowAdminModal(false)
      setNewAdminUsername('')
      setNewAdminName('')
      setNewAdminPassword('')
      setNewAdminRole('editor')
      fetchAdmins()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleDeleteAdmin = async (id: number, username: string) => {
    if (username === 'owner') {
      setMessage('❌ لا يمكن حذف حساب المالك الرئيسي')
      return
    }
    if (!confirm(`هل تريد حذف المشرف ${username}؟`)) return
    const { error } = await supabase.from('admins').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف المشرف')
      fetchAdmins()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleAddMenuItem = async () => {
    if (!newMenuTitle || !newMenuLink) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }
    const { error } = await supabase.from('menu_items').insert([{
      title: newMenuTitle,
      link: newMenuLink,
      order_index: menuItems.length + 1,
      is_active: true
    }])
    if (!error) {
      setMessage('✅ تم إضافة العنصر بنجاح')
      setShowMenuModal(false)
      setNewMenuTitle('')
      setNewMenuLink('')
      fetchMenu()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('هل تريد حذف هذا العنصر؟')) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف العنصر')
      fetchMenu()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف الخبر بنجاح')
      fetchNews()
      fetchAllNewsOptions()
    } else {
      setMessage('❌ خطأ في الحذف: ' + error.message)
    }
  }

  const handleUpdate = async (newsItem: NewsItem) => {
    const { error } = await supabase.from('news').update({
      title: newsItem.title,
      content: newsItem.content,
      category: newsItem.category,
      image: newsItem.image,
      position: newsItem.position || 'auto',
      is_featured: newsItem.is_featured || false,
    }).eq('id', newsItem.id)
    if (!error) {
      setMessage('✅ تم تحديث الخبر بنجاح')
      setEditingNews(null)
      fetchNews()
      fetchAllNewsOptions()
    } else {
      setMessage('❌ خطأ في التحديث: ' + error.message)
    }
  }

  const handleAddNews = async () => {
    if (!newNewsTitle || !newNewsContent) {
      setMessage('❌ الرجاء إدخال العنوان والمحتوى')
      return
    }
    const slug = newNewsSlug || newNewsTitle
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .substring(0, 100)
    const { error } = await supabase.from('news').insert([{
      title: newNewsTitle,
      content: newNewsContent,
      category: newNewsCategory || 'عام',
      image: newNewsImage || '',
      slug: slug,
      description: newNewsContent.substring(0, 200),
      created_at: new Date().toISOString(),
      position: newNewsPosition,
      is_featured: newNewsFeatured,
    }])
    if (!error) {
      setMessage('✅ تم إضافة الخبر بنجاح')
      setShowAddNewsModal(false)
      setNewNewsTitle('')
      setNewNewsContent('')
      setNewNewsCategory('')
      setNewNewsImage('')
      setNewNewsSlug('')
      setNewNewsPosition('auto')
      setNewNewsFeatured(false)
      fetchNews()
      fetchAllNewsOptions()
    } else {
      setMessage('❌ خطأ في الإضافة: ' + error.message)
    }
  }

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `news-${Date.now()}.${fileExt}`
      const filePath = `news/${fileName}`
      const { error: uploadError } = await supabase.storage.from('news-images').upload(filePath, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError
      const { data: publicUrlData } = supabase.storage.from('news-images').getPublicUrl(filePath)
      setNewNewsImage(publicUrlData.publicUrl)
      setMessage('✅ تم رفع الصورة بنجاح')
    } catch (error) {
      setMessage('❌ خطأ في رفع الصورة: ' + (error as Error).message)
    }
    setUploadingImage(false)
  }

  const toggleNewsSelection = (id: string, list: string[], setList: (newList: string[]) => void) => {
    if (list.includes(id)) {
      setList(list.filter(i => i !== id))
    } else {
      setList([...list, id])
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  useEffect(() => {
    if (isAuthorized) {
      fetchNews()
      fetchSettings()
      fetchHero()
      fetchTickerItems()
      fetchComments()
      fetchDailyBrief()
      fetchExchangeRates()
      fetchStats()
      fetchSiteTexts()
      fetchTemplates()
      fetchAdmins()
      fetchMenu()
      fetchAllNewsOptions()
      fetchTemplate1Config()
      fetchTemplate2Config()
      fetchTemplate3Config()
      fetchMarqueeConfig()
    }
  }, [isAuthorized])

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-red-600 text-4xl" />
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold border-r-4 border-red-600 pr-4">👑 لوحة تحكم المالك الشاملة</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-600 dark:text-gray-400 block text-sm">مرحباً، {adminName}</span>
              <span className="text-gray-400 text-xs">{adminRole === 'owner' ? 'مالك الموقع' : adminRole === 'admin' ? 'مدير' : 'محرر'}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
              <FaSignOutAlt /> تسجيل خروج
            </button>
          </div>
        </div>

        {/* رسالة الحالة */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
            {message}
          </div>
        )}

        {/* أزرار التبويبات */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <button onClick={() => setActiveTab('home')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'home' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaHome /> الرئيسية
          </button>
          <button onClick={() => setActiveTab('hero')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'hero' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaImage /> البانر العلوي
          </button>
          <button onClick={() => setActiveTab('news')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'news' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaEdit /> الأخبار
          </button>
          <button onClick={() => setActiveTab('exchange')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'exchange' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaDollarSign /> الأسعار العالمية
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'stats' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaChartLine /> الإحصائيات
          </button>
          <button onClick={() => setActiveTab('sitetexts')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'sitetexts' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaLanguage /> النصوص القابلة للتعديل
          </button>
          <button onClick={() => setActiveTab('ticker')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'ticker' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaPaintBrush /> الشريط المتحرك
          </button>
          <button onClick={() => setActiveTab('dailybrief')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'dailybrief' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaNewspaper /> الجريدة اليومية
          </button>
          <button onClick={() => setActiveTab('comments')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'comments' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaCommentDots /> التعليقات
          </button>
          <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'menu' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaListUl /> القائمة العلوية
          </button>
          <button onClick={() => setActiveTab('admins')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'admins' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaUsers /> المشرفين
          </button>
          <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaCog /> الإعدادات
          </button>
          <button onClick={() => setActiveTab('template1')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'template1' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaThLarge /> تخصيص القالب الأول
          </button>
          <button onClick={() => setActiveTab('template2')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'template2' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaLayerGroup /> تخصيص القالب الثاني
          </button>
          <button onClick={() => setActiveTab('template3')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'template3' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaTh /> تخصيص القالب الثالث
          </button>
          <button onClick={() => setActiveTab('marquee')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'marquee' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaImages /> تخصيص الشريط المتحرك
          </button>
        </div>

        {/* ============================================================
            تبويب الرئيسية
        ============================================================ */}
        {activeTab === 'home' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4">🏠 ترتيب وتفعيل أقسام الصفحة الرئيسية</h2>
            <div className="space-y-3">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div><p className="font-medium">{template.title}</p><p className="text-xs text-gray-500">معرف: {template.template_id}</p></div>
                  <button onClick={() => handleToggleTemplate(template.id, template.is_enabled)} className={`px-3 py-1 rounded-lg text-sm transition ${template.is_enabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>{template.is_enabled ? 'مفعل' : 'معطل'}</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب البانر العلوي
        ============================================================ */}
        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-2xl font-bold mb-4">🖼️ تخصيص البانر العلوي</h2>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="relative rounded-xl overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: `url(${hero.background_image})` }}>
                <div className="absolute inset-0 flex items-center justify-center text-center p-4" style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity / 100})` }}>
                  <div><h3 className="text-2xl font-bold text-white">{hero.title}</h3><p className="text-gray-200">{hero.subtitle}</p></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2"><label className="block font-bold mb-2">🖼️ صورة الخلفية</label><div className="flex gap-3 flex-wrap"><button onClick={() => document.getElementById('heroImageInput')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={uploading}><FaUpload /> {uploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}</button><input id="heroImageInput" type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} /><input type="text" value={hero.background_image} onChange={(e) => setHero({ ...hero, background_image: e.target.value })} placeholder="أو أدخل رابط الصورة" className="flex-1 p-2 rounded-lg border dark:bg-gray-900" /></div></div>
              <div><label className="block font-bold mb-2">العنوان الرئيسي</label><input type="text" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
              <div><label className="block font-bold mb-2">النص الثانوي</label><input type="text" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
              <div><label className="block font-bold mb-2">نص الزر</label><input type="text" value={hero.button_text} onChange={(e) => setHero({ ...hero, button_text: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
              <div><label className="block font-bold mb-2">رابط الزر</label><input type="text" value={hero.button_link} onChange={(e) => setHero({ ...hero, button_link: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
              <div><label className="block font-bold mb-2">شفافية الطبقة ({hero.overlay_opacity}%)</label><input type="range" min="0" max="90" value={hero.overlay_opacity} onChange={(e) => setHero({ ...hero, overlay_opacity: parseInt(e.target.value) })} className="w-full" /></div>
              <div><label className="block font-bold mb-2">حالة القسم</label><button onClick={() => setHero({ ...hero, is_enabled: !hero.is_enabled })} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${hero.is_enabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>{hero.is_enabled ? <FaEye /> : <FaEyeSlash />} {hero.is_enabled ? 'مفعل' : 'معطل'}</button></div>
            </div>
            <button onClick={saveHero} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"><FaSave /> حفظ البانر</button>
          </div>
        )}

        {/* ============================================================
            تبويب الأخبار
        ============================================================ */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold">📰 إدارة الأخبار</h2><button onClick={() => setShowAddNewsModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> إضافة خبر جديد</button></div>
            {loading ? <p className="text-center py-20">جاري التحميل...</p> : news.length === 0 ? <p className="text-center py-20 text-gray-500">لا توجد أخبار بعد</p> : news.map((item) => (
              <div key={item.id} className="bg-white dark:bg-cardBg rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                {editingNews?.id === item.id ? (
                  <div className="space-y-3">
                    <input type="text" value={editingNews.title} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} className="w-full p-2 rounded-lg border dark:bg-gray-900" />
                    <textarea value={editingNews.content} onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} rows={5} className="w-full p-2 rounded-lg border dark:bg-gray-900" />
                    <div><label className="block font-bold mb-1 text-sm">📍 مكان ظهور الخبر</label><select value={editingNews.position || 'auto'} onChange={(e) => setEditingNews({ ...editingNews, position: e.target.value })} className="w-full p-2 rounded-lg border dark:bg-gray-900"><option value="auto">🔄 تلقائي (حسب التصنيف)</option><option value="featured">⭐ أخبار عاجلة</option><option value="side">📰 أخبار جانبية</option><option value="template1_top">📰 القالب الأول - أعلى</option><option value="template1_bottom">📰 القالب الأول - أسفل</option><option value="template2">📊 القالب الثاني</option><option value="template3">🌍 القالب الثالث</option><option value="category_only">📁 صفحة التصنيف فقط</option></select></div>
                    <div className="flex items-center gap-3"><input type="checkbox" id="featuredCheck" checked={editingNews.is_featured || false} onChange={(e) => setEditingNews({ ...editingNews, is_featured: e.target.checked })} className="w-4 h-4" /><label htmlFor="featuredCheck" className="text-sm">تمييز كخبر عاجل</label></div>
                    <div className="flex gap-2"><button onClick={() => handleUpdate(editingNews)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSave /> حفظ</button><button onClick={() => setEditingNews(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTimes /> إلغاء</button></div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1"><h3 className="font-bold text-lg">{item.title}</h3><p className="text-gray-500 text-sm">{item.category || 'عام'} • {new Date(item.created_at).toLocaleDateString('ar-EG')} • <span className="mr-2 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">{item.position === 'featured' ? '⭐ عاجل' : item.position === 'template1_top' ? '📰 قالب1 أعلى' : item.position === 'template1_bottom' ? '📰 قالب1 أسفل' : item.position === 'template2' ? '📊 قالب2' : item.position === 'template3' ? '🌍 قالب3' : item.position === 'side' ? '📰 جانبية' : item.position === 'category_only' ? '📁 تصنيف فقط' : '🔄 تلقائي'}</span>{item.is_featured && <span className="mr-1 px-2 py-0.5 rounded text-xs bg-red-100 text-red-700">🔥 مميز</span>}</p></div>
                    <div className="flex gap-2"><button onClick={() => setEditingNews(item)} className="text-blue-500 hover:text-blue-600 p-2"><FaEdit size={20} /></button><button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 p-2"><FaTrash size={20} /></button></div>
                  </div>
                )}
              </div>
            ))}
            {showAddNewsModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة خبر جديد</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2">العنوان *</label><input type="text" value={newNewsTitle} onChange={(e) => setNewNewsTitle(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" placeholder="أدخل عنوان الخبر" /></div>
                    <div><label className="block font-bold mb-2">المحتوى *</label><textarea value={newNewsContent} onChange={(e) => setNewNewsContent(e.target.value)} rows={8} className="w-full p-3 rounded-lg border dark:bg-gray-800" placeholder="أدخل محتوى الخبر..." /></div>
                    <div><label className="block font-bold mb-2">التصنيف</label><select value={newNewsCategory} onChange={(e) => setNewNewsCategory(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800"><option value="">اختر تصنيف</option><option value="politics">سياسة</option><option value="economy">اقتصاد</option><option value="tech">تكنولوجيا</option><option value="sports">رياضة</option><option value="culture">ثقافة</option><option value="opinions">آراء</option><option value="zodiac">أبراج الفلك</option><option value="misc">منوعات</option></select></div>
                    <div><label className="block font-bold mb-2">📍 مكان ظهور الخبر</label><select value={newNewsPosition} onChange={(e) => setNewNewsPosition(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800"><option value="auto">🔄 تلقائي (حسب التصنيف)</option><option value="featured">⭐ أخبار عاجلة</option><option value="side">📰 أخبار جانبية</option><option value="template1_top">📰 القالب الأول - أعلى</option><option value="template1_bottom">📰 القالب الأول - أسفل</option><option value="template2">📊 القالب الثاني</option><option value="template3">🌍 القالب الثالث</option><option value="category_only">📁 صفحة التصنيف فقط</option></select></div>
                    <div className="flex items-center gap-3"><input type="checkbox" id="featuredCheckAdd" checked={newNewsFeatured} onChange={(e) => setNewNewsFeatured(e.target.checked)} className="w-5 h-5" /><label htmlFor="featuredCheckAdd" className="font-bold">تمييز كخبر عاجل</label></div>
                    <div><label className="block font-bold mb-2">الصورة</label><div className="flex gap-3 flex-wrap"><button onClick={() => document.getElementById('newsImageInput')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={uploadingImage}><FaUpload /> {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}</button><input id="newsImageInput" type="file" accept="image/*" className="hidden" onChange={handleNewsImageUpload} /><input type="text" value={newNewsImage} onChange={(e) => setNewNewsImage(e.target.value)} placeholder="أو أدخل رابط الصورة" className="flex-1 p-3 rounded-lg border dark:bg-gray-800" /></div>{newNewsImage && <img src={newNewsImage} alt="معاينة" className="mt-2 h-32 object-cover rounded" />}</div>
                    <div><label className="block font-bold mb-2">رابط مخصص (Slug) - اختياري</label><input type="text" value={newNewsSlug} onChange={(e) => setNewNewsSlug(e.target.value)} placeholder="مثال: my-news-title" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={handleAddNews} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة الخبر</button><button onClick={() => { setShowAddNewsModal(false); setNewNewsTitle(''); setNewNewsContent(''); setNewNewsCategory(''); setNewNewsImage(''); setNewNewsSlug(''); setNewNewsPosition('auto'); setNewNewsFeatured(false); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الأسعار العالمية
        ============================================================ */}
        {activeTab === 'exchange' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">💰 إدارة الأسعار العالمية</h2><button onClick={() => setShowRateModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><FaPlus /> إضافة سعر جديد</button></div>
            <div className="mb-6"><h3 className="font-bold text-lg mb-3 border-r-2 border-green-500 pr-3">🇸🇦 العملات العربية</h3>{exchangeRates.filter(r => r.category === 'arab').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
            <div className="mb-6"><h3 className="font-bold text-lg mb-3 border-r-2 border-blue-500 pr-3">🌍 العملات الأجنبية</h3>{exchangeRates.filter(r => r.category === 'foreign').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
            <div className="mb-6"><h3 className="font-bold text-lg mb-3 border-r-2 border-purple-500 pr-3">💎 العملات الرقمية</h3>{exchangeRates.filter(r => r.category === 'crypto').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
            <div className="mb-6"><h3 className="font-bold text-lg mb-3 border-r-2 border-yellow-500 pr-3">🏆 المعادن النفيسة</h3>{exchangeRates.filter(r => r.category === 'metal').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
            <div className="mb-6"><h3 className="font-bold text-lg mb-3 border-r-2 border-gray-500 pr-3">⛽ الطاقة</h3>{exchangeRates.filter(r => r.category === 'energy').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
            <div><h3 className="font-bold text-lg mb-3 border-r-2 border-red-500 pr-3">📈 مؤشرات الأسهم</h3>{exchangeRates.filter(r => r.category === 'index').map((rate) => (<div key={rate.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"><div>{rate.name} ({rate.code})<p className="text-sm">{rate.value} {rate.unit}</p></div><div className="flex gap-2"><button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteRate(rate.id)} className="text-red-500"><FaTrash /></button></div></div>))}</div>
          </div>
        )}

        {showRateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold mb-4">{editingRate ? 'تعديل السعر' : 'إضافة سعر جديد'}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="الاسم" value={editingRate ? editingRate.name : newRateName} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, name: e.target.value }) : setNewRateName(e.target.value)} className="w-full p-3 rounded-lg border" />
                <input type="text" placeholder="الرمز (CODE)" value={editingRate ? editingRate.code : newRateCode} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, code: e.target.value.toUpperCase() }) : setNewRateCode(e.target.value.toUpperCase())} className="w-full p-3 rounded-lg border" />
                <input type="number" placeholder="القيمة" value={editingRate ? editingRate.value : newRateValue} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, value: parseFloat(e.target.value) }) : setNewRateValue(e.target.value)} className="w-full p-3 rounded-lg border" />
                <input type="text" placeholder="الوحدة" value={editingRate ? editingRate.unit : newRateUnit} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, unit: e.target.value }) : setNewRateUnit(e.target.value)} className="w-full p-3 rounded-lg border" />
                <select value={editingRate ? editingRate.category : newRateCategory} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, category: e.target.value as any }) : setNewRateCategory(e.target.value as any)} className="w-full p-3 rounded-lg border"><option value="arab">عملات عربية</option><option value="foreign">عملات أجنبية</option><option value="crypto">عملات رقمية</option><option value="metal">معادن</option><option value="energy">طاقة</option><option value="index">مؤشرات</option></select>
                <select value={editingRate ? editingRate.trend : newRateTrend} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, trend: e.target.value as any }) : setNewRateTrend(e.target.value as any)} className="w-full p-3 rounded-lg border"><option value="up">صاعد ↑</option><option value="down">هابط ↓</option><option value="stable">مستقر →</option></select>
              </div>
              <div className="flex gap-3 mt-6"><button onClick={editingRate ? handleUpdateRate : handleAddRate} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">{editingRate ? 'تحديث' : 'إضافة'}</button><button onClick={() => { setShowRateModal(false); setEditingRate(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب الإحصائيات
        ============================================================ */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">📊 إدارة إحصائيات الموقع</h2><button onClick={() => { setEditingStat(null); setNewStatIcon('FaGlobe'); setNewStatValue(''); setNewStatLabel(''); setShowStatModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><FaPlus /> إضافة إحصائية جديدة</button></div>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.id} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                  <div><p className="font-medium">{stat.label}</p><p className="text-2xl font-bold text-red-600">{stat.value}</p></div>
                  <div className="flex gap-2"><button onClick={() => { setEditingStat(stat); setShowStatModal(true); }} className="text-blue-500"><FaEdit /></button><button onClick={() => handleDeleteStat(stat.id)} className="text-red-500"><FaTrash /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showStatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold mb-4">{editingStat ? 'تعديل الإحصائية' : 'إضافة إحصائية جديدة'}</h3>
              <div className="space-y-4"><input type="text" placeholder="القيمة (120+)" value={editingStat ? editingStat.value : newStatValue} onChange={(e) => editingStat ? setEditingStat({ ...editingStat, value: e.target.value }) : setNewStatValue(e.target.value)} className="w-full p-3 rounded-lg border" /><input type="text" placeholder="الوصف (دولة، قارئ)" value={editingStat ? editingStat.label : newStatLabel} onChange={(e) => editingStat ? setEditingStat({ ...editingStat, label: e.target.value }) : setNewStatLabel(e.target.value)} className="w-full p-3 rounded-lg border" /></div>
              <div className="flex gap-3 mt-6"><button onClick={editingStat ? handleUpdateStat : handleAddStat} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">{editingStat ? 'تحديث' : 'إضافة'}</button><button onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب النصوص القابلة للتعديل
        ============================================================ */}
        {activeTab === 'sitetexts' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FaLanguage className="text-red-600" /> 📝 إدارة النصوص القابلة للتعديل</h2>
            <p className="text-gray-500 text-sm mb-6">يمكنك تعديل النصوص التي تظهر في الصفحة الرئيسية (التحليلات الاقتصادية، رؤيتنا، أبراج الفلك، تحليلات سياسية)</p>
            <div className="space-y-6">
              {siteTexts.map((text) => (
                <div key={text.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {text.key_name === 'economicAnalysis' && '📊 التحليلات الاقتصادية'}
                      {text.key_name === 'ourVision' && '👁️ رؤيتنا'}
                      {text.key_name === 'zodiacText' && '⭐ أبراج الفلك'}
                      {text.key_name === 'politicalAnalysisText' && '📈 تحليلات سياسية (القالب الثاني)'}
                    </h3>
                    {editingSiteText?.id === text.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleUpdateSiteText} className="text-green-600 hover:text-green-700"><FaSave size={20} /></button>
                        <button onClick={() => setEditingSiteText(null)} className="text-gray-500 hover:text-gray-600"><FaTimes size={20} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingSiteText(text)} className="text-blue-500 hover:text-blue-600"><FaEdit size={20} /></button>
                    )}
                  </div>
                  {editingSiteText?.id === text.id ? (
                    <div className="space-y-4">
                      <div><label className="block font-bold text-sm mb-1 text-green-700 dark:text-green-400">🇸🇦 العربية</label><textarea value={editingSiteText.value_ar} onChange={(e) => setEditingSiteText({ ...editingSiteText, value_ar: e.target.value })} rows={6} maxLength={3000} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
                      <div><label className="block font-bold text-sm mb-1 text-blue-700 dark:text-blue-400">🇬🇧 English</label><textarea value={editingSiteText.value_en} onChange={(e) => setEditingSiteText({ ...editingSiteText, value_en: e.target.value })} rows={6} maxLength={3000} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
                      <div><label className="block font-bold text-sm mb-1 text-purple-700 dark:text-purple-400">🏴 Kurdî</label><textarea value={editingSiteText.value_ku} onChange={(e) => setEditingSiteText({ ...editingSiteText, value_ku: e.target.value })} rows={6} maxLength={3000} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
                      <p className="text-xs text-gray-400">الحد الأقصى 3000 حرف</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg"><p className="text-xs text-green-600 dark:text-green-400 mb-1">🇸🇦 العربية</p><p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-5">{text.value_ar || '(فارغ)'}</p></div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg"><p className="text-xs text-blue-600 dark:text-blue-400 mb-1">🇬🇧 English</p><p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-5">{text.value_en || '(Empty)'}</p></div>
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg"><p className="text-xs text-purple-600 dark:text-purple-400 mb-1">🏴 Kurdî</p><p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line line-clamp-5">{text.value_ku || '(Vala)'}</p></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب الشريط المتحرك (مع الترجمة)
        ============================================================ */}
        {activeTab === 'ticker' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">📢 إدارة الشريط المتحرك</h2>
              <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> إضافة عنصر جديد</button>
            </div>
            <p className="text-gray-500 text-sm">يمكنك إضافة عناصر جديدة مع دعم ثلاث لغات (عربي، إنجليزي، كردي). العناصر النشطة فقط هي التي تظهر.</p>
            {tickerItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-gray-500">لا توجد عناصر في الشريط بعد</p></div>
            ) : (
              <div className="space-y-3">
                {tickerItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium text-green-600">🇸🇦 {item.text_content_ar}</p>
                        <p className="text-xs text-blue-600">🇬🇧 {item.text_content_en}</p>
                        <p className="text-xs text-purple-600">🏴 {item.text_content_ku}</p>
                        {item.link_url && <p className="text-xs text-blue-500 mt-1">🔗 {item.link_url}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => moveUp(index)} disabled={index === 0} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↑</button>
                      <button onClick={() => moveDown(index)} disabled={index === tickerItems.length - 1} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↓</button>
                      <button onClick={() => handleToggleActive(item.id, item.is_active)} className={`p-2 rounded ${item.is_active ? 'text-green-500' : 'text-gray-400'}`}>{item.is_active ? <FaEye /> : <FaEyeSlash />}</button>
                      <button onClick={() => handleRemoveFromTicker(item.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة عنصر جديد إلى الشريط</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2 text-green-600">🇸🇦 النص بالعربية *</label><input type="text" value={newTickerTextAr} onChange={(e) => setNewTickerTextAr(e.target.value)} placeholder="مثال: 🔥 عاجل: حدث مهم" className="w-full p-3 rounded-lg border dark:bg-gray-800" maxLength={200} /></div>
                    <div><label className="block font-bold mb-2 text-blue-600">🇬🇧 النص بالإنجليزية *</label><input type="text" value={newTickerTextEn} onChange={(e) => setNewTickerTextEn(e.target.value)} placeholder="Example: 🔥 BREAKING: Important event" className="w-full p-3 rounded-lg border dark:bg-gray-800" maxLength={200} /></div>
                    <div><label className="block font-bold mb-2 text-purple-600">🏴 النص بالكردية *</label><input type="text" value={newTickerTextKu} onChange={(e) => setNewTickerTextKu(e.target.value)} placeholder="Mînak: 🔥 Nûçe: Bûyerek girîng" className="w-full p-3 rounded-lg border dark:bg-gray-800" maxLength={200} /></div>
                    <div><label className="block font-bold mb-2">رابط (اختياري)</label><input type="text" value={newTickerLink} onChange={(e) => setNewTickerLink(e.target.value)} placeholder="/news/important-event" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">نص الرابط (اختياري)</label><input type="text" value={newTickerLinkText} onChange={(e) => setNewTickerLinkText(e.target.value)} placeholder="مثال: اقرأ المزيد" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div className="flex items-center gap-3"><input type="checkbox" id="isExternal" checked={newTickerIsExternal} onChange={(e) => setNewTickerIsExternal(e.target.checked)} className="w-5 h-5" /><label htmlFor="isExternal">رابط خارجي (يفتح في نافذة جديدة)</label></div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleAddToTicker} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button>
                    <button onClick={() => { setShowAddModal(false); setNewTickerTextAr(''); setNewTickerTextEn(''); setNewTickerTextKu(''); setNewTickerLink(''); setNewTickerLinkText(''); setNewTickerIsExternal(false); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الجريدة اليومية
        ============================================================ */}
        {activeTab === 'dailybrief' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">📰 الجريدة اليومية</h2><button onClick={() => setShowDailyBriefModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><FaPlus /> إضافة</button></div>
            {dailyBrief.map((item) => (
              <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div><p className="font-bold text-red-500">{item.section_title}</p><p>{item.title}</p></div>
                <button onClick={() => handleDeleteBrief(item.id)} className="text-red-500"><FaTrash /></button>
              </div>
            ))}
          </div>
        )}

        {showDailyBriefModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold mb-4">➕ إضافة عنصر جديد</h3>
              <div className="space-y-4"><input type="text" placeholder="عنوان القسم" value={newBriefSection} onChange={(e) => setNewBriefSection(e.target.value)} className="w-full p-3 rounded-lg border" /><input type="text" placeholder="العنوان" value={newBriefTitle} onChange={(e) => setNewBriefTitle(e.target.value)} className="w-full p-3 rounded-lg border" /><textarea placeholder="الوصف" value={newBriefDescription} onChange={(e) => setNewBriefDescription(e.target.value)} rows={3} className="w-full p-3 rounded-lg border" /><input type="text" placeholder="الرابط" value={newBriefLink} onChange={(e) => setNewBriefLink(e.target.value)} className="w-full p-3 rounded-lg border" /></div>
              <div className="flex gap-3 mt-6"><button onClick={handleAddBrief} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => setShowDailyBriefModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب التعليقات
        ============================================================ */}
        {activeTab === 'comments' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4">💬 إدارة التعليقات</h2>
            {commentsLoading ? <div className="text-center py-12">جاري التحميل...</div> : comments.length === 0 ? <div className="text-center py-12">لا توجد تعليقات</div> : comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg mb-3">
                <div className="flex justify-between"><div><span className="font-bold text-red-600">{comment.author_name}</span><span className="text-xs text-gray-400 mr-2">{new Date(comment.created_at).toLocaleString('ar-EG')}</span><p className="mt-2">{comment.content}</p></div><button onClick={() => handleDeleteComment(comment.id)} className="bg-red-500 text-white px-3 py-1 rounded">حذف</button></div>
              </div>
            ))}
          </div>
        )}

        {/* ============================================================
            تبويب القائمة العلوية
        ============================================================ */}
        {activeTab === 'menu' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">🔗 القائمة العلوية</h2><button onClick={() => setShowMenuModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><FaPlus /> إضافة رابط</button></div>
            {menuItems.map((item) => (
              <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2">
                <div><p className="font-medium">{item.title}</p><p className="text-xs text-blue-500">{item.link}</p></div>
                <button onClick={() => handleDeleteMenuItem(item.id)} className="text-red-500"><FaTrash /></button>
              </div>
            ))}
          </div>
        )}

        {showMenuModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold mb-4">➕ إضافة رابط جديد</h3>
              <div className="space-y-4"><input type="text" placeholder="النص الظاهر" value={newMenuTitle} onChange={(e) => setNewMenuTitle(e.target.value)} className="w-full p-3 rounded-lg border" /><input type="text" placeholder="الرابط" value={newMenuLink} onChange={(e) => setNewMenuLink(e.target.value)} className="w-full p-3 rounded-lg border" /></div>
              <div className="flex gap-3 mt-6"><button onClick={handleAddMenuItem} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => setShowMenuModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب المشرفين
        ============================================================ */}
        {activeTab === 'admins' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">👥 إدارة المشرفين</h2><button onClick={() => setShowAdminModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"><FaUserPlus /> إضافة مشرف جديد</button></div>
            {admins.map((admin) => (
              <div key={admin.id} className="flex justify-between p-4 bg-gray-50 rounded-lg mb-2">
                <div><p className="font-bold">{admin.name}</p><p className="text-sm text-gray-500">@{admin.username} • {admin.role === 'owner' ? 'مالك' : admin.role === 'admin' ? 'مدير' : 'محرر'}</p></div>
                {admin.username !== 'owner' && <button onClick={() => handleDeleteAdmin(admin.id, admin.username)} className="text-red-500"><FaUserMinus size={20} /></button>}
              </div>
            ))}
          </div>
        )}

        {showAdminModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold mb-4">➕ إضافة مشرف جديد</h3>
              <div className="space-y-4"><input type="text" placeholder="اسم المستخدم" value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} className="w-full p-3 rounded-lg border" /><input type="text" placeholder="الاسم الكامل" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className="w-full p-3 rounded-lg border" /><input type="password" placeholder="كلمة المرور" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="w-full p-3 rounded-lg border" /><select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'editor')} className="w-full p-3 rounded-lg border"><option value="admin">مدير</option><option value="editor">محرر</option></select></div>
              <div className="flex gap-3 mt-6"><button onClick={handleAddAdmin} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => setShowAdminModal(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب الإعدادات العامة
        ============================================================ */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ إعدادات الموقع العامة</h2>
            <div><label className="block font-bold mb-2">رابط تليجرام</label><input type="url" value={settings.telegramUrl} onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
            <div><label className="block font-bold mb-2">اللون الأساسي</label><div className="flex items-center gap-4"><input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-16 h-16 rounded cursor-pointer border" /><input type="text" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="flex-1 p-3 rounded-lg border dark:bg-gray-900" /></div></div>
            <div><label className="block font-bold mb-2">سرعة الشريط المتحرك (ms)</label><input type="number" value={settings.tickerSpeed} onChange={(e) => setSettings({ ...settings, tickerSpeed: parseInt(e.target.value) || 4000 })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
            <button onClick={updateSettings} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg w-full">حفظ الإعدادات</button>
          </div>
        )}

        {/* ============================================================
            تبويب تخصيص القالب الأول
        ============================================================ */}
        {activeTab === 'template1' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">🎨 تخصيص القالب الأول</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-red-600">🔴 العمود الأيمن</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">العنوان</label><input type="text" value={template1Config.breakingNewsTitle} onChange={(e) => setTemplate1Config({ ...template1Config, breakingNewsTitle: e.target.value })} className="w-full p-2 rounded-lg border" /></div><div><label className="block text-sm font-bold mb-1">عدد الأخبار</label><input type="number" min="1" max="10" value={template1Config.breakingNewsCount} onChange={(e) => setTemplate1Config({ ...template1Config, breakingNewsCount: parseInt(e.target.value) || 4 })} className="w-full p-2 rounded-lg border" /></div><div className="flex items-center gap-2"><input type="checkbox" checked={template1Config.economicAnalysisEnabled} onChange={(e) => setTemplate1Config({ ...template1Config, economicAnalysisEnabled: e.target.checked })} className="w-4 h-4" /><label>تفعيل التحليلات الاقتصادية</label></div></div></div>
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-green-600">🟢 العمود الأوسط</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">عدد صور السلايدر</label><input type="number" min="1" max="10" value={template1Config.sliderCount} onChange={(e) => setTemplate1Config({ ...template1Config, sliderCount: parseInt(e.target.value) || 5 })} className="w-full p-2 rounded-lg border" /></div><div className="flex items-center gap-2"><input type="checkbox" checked={template1Config.sliderAutoPlay} onChange={(e) => setTemplate1Config({ ...template1Config, sliderAutoPlay: e.target.checked })} className="w-4 h-4" /><label>تشغيل تلقائي</label></div><div><label className="block text-sm font-bold mb-1">عدد البطاقات الصغيرة</label><input type="number" min="1" max="6" value={template1Config.smallNewsTopCount} onChange={(e) => setTemplate1Config({ ...template1Config, smallNewsTopCount: parseInt(e.target.value) || 3 })} className="w-full p-2 rounded-lg border" /></div><div><label className="block text-sm font-bold mb-1">عدد البطاقات الكبيرة</label><input type="number" min="1" max="6" value={template1Config.largeNewsTopCount} onChange={(e) => setTemplate1Config({ ...template1Config, largeNewsTopCount: parseInt(e.target.value) || 3 })} className="w-full p-2 rounded-lg border" /></div></div></div>
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-blue-600">🔵 العمود الأيسر</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">العنوان</label><input type="text" value={template1Config.sideNewsTitle} onChange={(e) => setTemplate1Config({ ...template1Config, sideNewsTitle: e.target.value })} className="w-full p-2 rounded-lg border" /></div><div><label className="block text-sm font-bold mb-1">عدد الأخبار</label><input type="number" min="1" max="10" value={template1Config.sideNewsCount} onChange={(e) => setTemplate1Config({ ...template1Config, sideNewsCount: parseInt(e.target.value) || 4 })} className="w-full p-2 rounded-lg border" /></div><div className="flex items-center gap-2"><input type="checkbox" checked={template1Config.ourVisionEnabled} onChange={(e) => setTemplate1Config({ ...template1Config, ourVisionEnabled: e.target.checked })} className="w-4 h-4" /><label>تفعيل رؤيتنا</label></div></div></div>
            </div>
            <div className="mt-6 flex justify-center"><button onClick={saveTemplate1Config} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"><FaSave /> حفظ إعدادات القالب الأول</button></div>
          </div>
        )}

        {/* ============================================================
            تبويب تخصيص القالب الثاني
        ============================================================ */}
        {activeTab === 'template2' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">🎨 تخصيص القالب الثاني</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-red-600">📰 الخبر الرئيسي</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">اختيار الخبر</label><select value={template2Config.mainNewsId} onChange={(e) => setTemplate2Config({ ...template2Config, mainNewsId: e.target.value })} className="w-full p-2 rounded-lg border"><option value="">-- اختر خبراً --</option>{allNewsOptions.map(news => (<option key={news.id} value={news.id}>{news.title.substring(0, 50)}</option>))}</select></div><div><label className="block text-sm font-bold mb-1">ارتفاع الصورة</label><select value={template2Config.mainNewsImageHeight} onChange={(e) => setTemplate2Config({ ...template2Config, mainNewsImageHeight: e.target.value })} className="w-full p-2 rounded-lg border"><option value="h-64">متوسط</option><option value="h-80">كبير</option><option value="h-96">كبير جداً</option></select></div></div></div>
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-green-600">📌 الخبرين الوسط</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">الخبر الأول</label><select value={template2Config.middleNewsIds[0] || ''} onChange={(e) => { const newIds = [...template2Config.middleNewsIds]; newIds[0] = e.target.value; setTemplate2Config({ ...template2Config, middleNewsIds: newIds }) }} className="w-full p-2 rounded-lg border"><option value="">-- اختر --</option>{allNewsOptions.filter(n => n.id !== template2Config.mainNewsId).map(news => (<option key={news.id} value={news.id}>{news.title.substring(0, 40)}</option>))}</select></div><div><label className="block text-sm font-bold mb-1">الخبر الثاني</label><select value={template2Config.middleNewsIds[1] || ''} onChange={(e) => { const newIds = [...template2Config.middleNewsIds]; newIds[1] = e.target.value; setTemplate2Config({ ...template2Config, middleNewsIds: newIds }) }} className="w-full p-2 rounded-lg border"><option value="">-- اختر --</option>{allNewsOptions.filter(n => n.id !== template2Config.mainNewsId && n.id !== template2Config.middleNewsIds[0]).map(news => (<option key={news.id} value={news.id}>{news.title.substring(0, 40)}</option>))}</select></div></div></div>
            </div>
            <div className="border rounded-lg p-4 mt-6"><h3 className="font-bold text-lg mb-4 text-purple-600">📊 تحليلات سياسية</h3><div className="space-y-3"><div className="flex items-center gap-2"><input type="checkbox" checked={template2Config.politicalAnalysisEnabled} onChange={(e) => setTemplate2Config({ ...template2Config, politicalAnalysisEnabled: e.target.checked })} className="w-4 h-4" /><label>تفعيل القسم</label></div><div><label className="block text-sm font-bold mb-1">العنوان</label><input type="text" value={template2Config.politicalAnalysisTitle} onChange={(e) => setTemplate2Config({ ...template2Config, politicalAnalysisTitle: e.target.value })} className="w-full p-2 rounded-lg border" /></div><p className="text-sm text-gray-500">المحتوى يتم إدارته من تبويب "النصوص القابلة للتعديل" (politicalAnalysisText)</p></div></div>
            <div className="mt-6 flex justify-center"><button onClick={saveTemplate2Config} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"><FaSave /> حفظ إعدادات القالب الثاني</button></div>
          </div>
        )}

        {/* ============================================================
            تبويب تخصيص القالب الثالث
        ============================================================ */}
        {activeTab === 'template3' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">🎨 تخصيص القالب الثالث</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-red-600">📰 أخبار القالب الثالث</h3><div className="space-y-3"><div><label className="block text-sm font-bold mb-1">عدد الأخبار</label><input type="number" min="2" max="8" value={template3Config.regularNewsCount} onChange={(e) => setTemplate3Config({ ...template3Config, regularNewsCount: parseInt(e.target.value) || 4 })} className="w-full p-2 rounded-lg border" /></div><div><label className="block text-sm font-bold mb-1">ارتفاع الصورة</label><select value={template3Config.regularNewsImageHeight} onChange={(e) => setTemplate3Config({ ...template3Config, regularNewsImageHeight: e.target.value })} className="w-full p-2 rounded-lg border"><option value="h-40">صغير</option><option value="h-48">متوسط</option><option value="h-56">كبير</option></select></div></div></div>
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-blue-600">💰 الأسعار العالمية</h3><p className="text-sm text-gray-500">الأسعار العالمية يتم إدارتها من تبويب "الأسعار العالمية"</p></div>
            </div>
            <div className="mt-6 flex justify-center"><button onClick={saveTemplate3Config} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"><FaSave /> حفظ إعدادات القالب الثالث</button></div>
          </div>
        )}

        {/* ============================================================
            تبويب تخصيص الشريط المتحرك (ماركيز)
        ============================================================ */}
        {activeTab === 'marquee' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">🎨 تخصيص الشريط المتحرك (ماركيز)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-red-600">📰 الأخبار في الشريط</h3><div><label className="block text-sm font-bold mb-1">عدد الأخبار المعروضة</label><input type="number" min="3" max="20" value={marqueeConfig.displayCount} onChange={(e) => setMarqueeConfig({ ...marqueeConfig, displayCount: parseInt(e.target.value) || 10 })} className="w-full p-2 rounded-lg border" /></div></div>
              <div className="border rounded-lg p-4"><h3 className="font-bold text-lg mb-4 text-green-600">⚙️ إعدادات الحركة</h3><div className="flex items-center gap-2 mb-3"><input type="checkbox" checked={marqueeConfig.autoScroll} onChange={(e) => setMarqueeConfig({ ...marqueeConfig, autoScroll: e.target.checked })} className="w-4 h-4" /><label>تفعيل الحركة التلقائية</label></div><div><label className="block text-sm font-bold mb-1">سرعة الحركة</label><input type="number" min="1" max="60" value={marqueeConfig.scrollSpeed} onChange={(e) => setMarqueeConfig({ ...marqueeConfig, scrollSpeed: parseInt(e.target.value) || 30 })} className="w-full p-2 rounded-lg border" /></div></div>
            </div>
            <div className="mt-6 flex justify-center"><button onClick={saveMarqueeConfig} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg flex items-center gap-2"><FaSave /> حفظ إعدادات الشريط</button></div>
          </div>
        )}
      </div>
    </div>
  )
}
```