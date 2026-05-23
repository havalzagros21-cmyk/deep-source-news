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
  FaRulerCombined, FaFont, FaBorderAll, FaSlidersH
} from 'react-icons/fa'
import { getAllTickerItems, addCustomTickerItem, deleteTickerItem, updateTickerOrder, toggleTickerItem } from '../../lib/siteConfig'

// ============================================================
// تعريفات الأنواع (Types)
// ============================================================
interface NewsItem {
  id: string
  title: string
  content: string
  category: string
  image: string
  created_at: string
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
  text_content: string
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

interface FreeText {
  id: number
  key: string
  title: string
  content: string
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

// ============================================================
// المكون الرئيسي
// ============================================================
export default function OwnerPage() {
  const router = useRouter()
  
  // حالات المصادقة
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminRole, setAdminRole] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(true)
  
  // حالات التبويبات
  const [activeTab, setActiveTab] = useState<'home' | 'news' | 'settings' | 'ticker' | 'hero' | 'comments' | 'dailybrief' | 'exchange' | 'stats' | 'freetext' | 'templates' | 'admins' | 'menu'>('home')
  
  // حالات الأخبار
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  
  // حالات إضافة خبر جديد
  const [showAddNewsModal, setShowAddNewsModal] = useState(false)
  const [newNewsTitle, setNewNewsTitle] = useState('')
  const [newNewsContent, setNewNewsContent] = useState('')
  const [newNewsCategory, setNewNewsCategory] = useState('')
  const [newNewsImage, setNewNewsImage] = useState('')
  const [newNewsSlug, setNewNewsSlug] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // حالات الإعدادات العامة
  const [settings, setSettings] = useState<Settings>({
    siteName: 'ديب سورس نيوز',
    telegramUrl: 'https://t.me/deepsourc',
    primaryColor: '#dc2626',
    tickerSpeed: 4000,
  })
  
  // حالات البانر العلوي
  const [hero, setHero] = useState<HeroSection>({
    title: 'آخر الأخبار العميقة',
    subtitle: 'تحليلات لا تجدها في أي مكان آخر',
    background_image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1920',
    overlay_opacity: 20,
    button_text: 'استكشف الأخبار',
    button_link: '/',
    is_enabled: true,
  })
  
  // حالات الشريط المتحرك
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTickerText, setNewTickerText] = useState('')
  const [newTickerLink, setNewTickerLink] = useState('')
  const [newTickerLinkText, setNewTickerLinkText] = useState('')
  const [newTickerIsExternal, setNewTickerIsExternal] = useState(false)
  
  // حالات التعليقات
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  
  // حالات الجريدة اليومية
  const [dailyBrief, setDailyBrief] = useState<DailyBriefItem[]>([])
  const [showDailyBriefModal, setShowDailyBriefModal] = useState(false)
  const [newBriefSection, setNewBriefSection] = useState('')
  const [newBriefTitle, setNewBriefTitle] = useState('')
  const [newBriefDescription, setNewBriefDescription] = useState('')
  const [newBriefLink, setNewBriefLink] = useState('')
  
  // حالات الأسعار العالمية
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [showRateModal, setShowRateModal] = useState(false)
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null)
  const [newRateName, setNewRateName] = useState('')
  const [newRateCode, setNewRateCode] = useState('')
  const [newRateValue, setNewRateValue] = useState('')
  const [newRateUnit, setNewRateUnit] = useState('')
  const [newRateCategory, setNewRateCategory] = useState<'arab' | 'foreign' | 'crypto' | 'metal' | 'energy' | 'index'>('foreign')
  const [newRateTrend, setNewRateTrend] = useState<'up' | 'down' | 'stable'>('up')
  
  // حالات الإحصائيات
  const [stats, setStats] = useState<StatItem[]>([])
  const [showStatModal, setShowStatModal] = useState(false)
  const [editingStat, setEditingStat] = useState<StatItem | null>(null)
  const [newStatIcon, setNewStatIcon] = useState('FaGlobe')
  const [newStatValue, setNewStatValue] = useState('')
  const [newStatLabel, setNewStatLabel] = useState('')
  
  // حالات النصوص الحرة
  const [freeTexts, setFreeTexts] = useState<FreeText[]>([])
  const [editingText, setEditingText] = useState<FreeText | null>(null)
  
  // حالات القوالب
  const [templates, setTemplates] = useState<TemplateConfig[]>([])
  
  // حالات المشرفين
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor'>('editor')
  
  // حالات القائمة العلوية
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [newMenuTitle, setNewMenuTitle] = useState('')
  const [newMenuLink, setNewMenuLink] = useState('')
  
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
  // جلب البيانات من قاعدة البيانات
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
      // بيانات افتراضية
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

  const fetchFreeTexts = async () => {
    const { data } = await supabase.from('free_texts').select('*').order('id', { ascending: true })
    if (data && data.length > 0) {
      setFreeTexts(data as FreeText[])
    } else {
      const defaultTexts: FreeText[] = [
        { id: 1, key: 'economic_analysis', title: 'التحليلات الاقتصادية', content: 'هنا يمكنك كتابة التحليلات الاقتصادية...', is_active: true },
        { id: 2, key: 'our_vision', title: 'رؤيتنا', content: 'هنا يمكنك كتابة رؤيتك...', is_active: true },
        { id: 3, key: 'zodiac', title: 'أبراج اليوم', content: '🍀 برج الحمل: يوم مليء بالطاقة...', is_active: true },
      ]
      setFreeTexts(defaultTexts)
    }
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
      fetchFreeTexts()
      fetchTemplates()
      fetchAdmins()
      fetchMenu()
    }
  }, [isAuthorized])

  // ============================================================
  // دوال إدارة الأخبار
  // ============================================================
  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return
    const { error } = await supabase.from('news').delete().eq('id', id)
    if (!error) {
      setMessage('✅ تم حذف الخبر بنجاح')
      fetchNews()
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
    }).eq('id', newsItem.id)
    if (!error) {
      setMessage('✅ تم تحديث الخبر بنجاح')
      setEditingNews(null)
      fetchNews()
    } else {
      setMessage('❌ خطأ في التحديث: ' + error.message)
    }
  }

  // دالة إضافة خبر جديد
  const handleAddNews = async () => {
    if (!newNewsTitle || !newNewsContent) {
      setMessage('❌ الرجاء إدخال العنوان والمحتوى')
      return
    }

    // إنشاء slug تلقائي من العنوان
    const slug = newNewsSlug || newNewsTitle
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
      .substring(0, 100)

    const { error } = await supabase
      .from('news')
      .insert([{
        title: newNewsTitle,
        content: newNewsContent,
        category: newNewsCategory || 'عام',
        image: newNewsImage || '',
        slug: slug,
        description: newNewsContent.substring(0, 200),
        created_at: new Date().toISOString(),
        is_featured: false
      }])

    if (!error) {
      setMessage('✅ تم إضافة الخبر بنجاح')
      setShowAddNewsModal(false)
      setNewNewsTitle('')
      setNewNewsContent('')
      setNewNewsCategory('')
      setNewNewsImage('')
      setNewNewsSlug('')
      fetchNews()
    } else {
      setMessage('❌ خطأ في الإضافة: ' + error.message)
    }
  }

  // دالة رفع صورة للخبر
  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `news-${Date.now()}.${fileExt}`
      const filePath = `news/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('news-images')
        .getPublicUrl(filePath)

      setNewNewsImage(publicUrlData.publicUrl)
      setMessage('✅ تم رفع الصورة بنجاح')
    } catch (error) {
      setMessage('❌ خطأ في رفع الصورة: ' + (error as Error).message)
    }
    setUploadingImage(false)
  }

  // ============================================================
  // دوال إعدادات الموقع
  // ============================================================
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

  // ============================================================
  // دوال البانر العلوي
  // ============================================================
  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${fileExt}`
      const filePath = `hero/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('news-images').getPublicUrl(filePath)
      setHero(prev => ({ ...prev, background_image: publicUrlData.publicUrl }))
      setMessage('✅ تم رفع صورة الخلفية بنجاح')
    } catch (error) {
      setMessage('❌ خطأ في رفع الصورة: ' + (error as Error).message)
    }
    setUploading(false)
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

  // ============================================================
  // دوال الشريط المتحرك
  // ============================================================
  const handleAddToTicker = async () => {
    if (!newTickerText.trim()) {
      setMessage('❌ الرجاء إدخال نص للعنصر')
      return
    }

    const { error } = await addCustomTickerItem(newTickerText, newTickerLink || '', newTickerLinkText || '', newTickerIsExternal)
    
    if (!error) {
      setMessage('✅ تم إضافة العنصر إلى الشريط')
      setShowAddModal(false)
      setNewTickerText('')
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

  // ============================================================
  // دوال التعليقات
  // ============================================================
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

  // ============================================================
  // دوال الجريدة اليومية
  // ============================================================
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

  const moveBriefUp = async (index: number) => {
    if (index === 0) return
    const newItems = [...dailyBrief]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    for (const item of newItems) {
      await supabase.from('daily_brief').update({ order_index: item.order_index }).eq('id', item.id)
    }
    fetchDailyBrief()
  }

  const moveBriefDown = async (index: number) => {
    if (index === dailyBrief.length - 1) return
    const newItems = [...dailyBrief]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    for (const item of newItems) {
      await supabase.from('daily_brief').update({ order_index: item.order_index }).eq('id', item.id)
    }
    fetchDailyBrief()
  }

  // ============================================================
  // دوال الأسعار العالمية
  // ============================================================
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

  const moveRateUp = async (index: number) => {
    if (index === 0) return
    const newItems = [...exchangeRates]
    const temp = newItems[index]
    newItems[index] = newItems[index - 1]
    newItems[index - 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    for (const item of newItems) {
      await supabase.from('exchange_rates_config').update({ order_index: item.order_index }).eq('id', item.id)
    }
    fetchExchangeRates()
  }

  const moveRateDown = async (index: number) => {
    if (index === exchangeRates.length - 1) return
    const newItems = [...exchangeRates]
    const temp = newItems[index]
    newItems[index] = newItems[index + 1]
    newItems[index + 1] = temp
    newItems.forEach((item, i) => item.order_index = i)
    for (const item of newItems) {
      await supabase.from('exchange_rates_config').update({ order_index: item.order_index }).eq('id', item.id)
    }
    fetchExchangeRates()
  }

  // ============================================================
  // دوال الإحصائيات
  // ============================================================
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

  // ============================================================
  // دوال النصوص الحرة
  // ============================================================
  const handleUpdateFreeText = async () => {
    if (!editingText) return

    const { error } = await supabase.from('free_texts').update({
      title: editingText.title,
      content: editingText.content,
      is_active: editingText.is_active
    }).eq('id', editingText.id)

    if (!error) {
      setMessage('✅ تم تحديث النص بنجاح')
      setEditingText(null)
      fetchFreeTexts()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  // ============================================================
  // دوال القوالب
  // ============================================================
  const handleToggleTemplate = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase.from('templates_config').update({ is_enabled: !currentStatus }).eq('id', id)
    if (!error) {
      setMessage(`✅ ${currentStatus ? 'تم تعطيل' : 'تم تفعيل'} القالب`)
      fetchTemplates()
    } else {
      setMessage('❌ خطأ: ' + error.message)
    }
  }

  // ============================================================
  // دوال المشرفين
  // ============================================================
  const handleAddAdmin = async () => {
    if (!newAdminUsername || !newAdminName || !newAdminPassword) {
      setMessage('❌ الرجاء ملء جميع الحقول')
      return
    }

    const { error } = await supabase.from('admins').insert([{
      username: newAdminUsername,
      name: newAdminName,
      password: btoa(newAdminPassword), // تشفير بسيط
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

  // ============================================================
  // دوال القائمة العلوية
  // ============================================================
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

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // ============================================================
  // حالة التحميل
  // ============================================================
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

  // ============================================================
  // واجهة المستخدم
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-bold border-r-4 border-red-600 pr-4">
            👑 لوحة تحكم المالك الشاملة
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-gray-600 dark:text-gray-400 block text-sm">مرحباً، {adminName}</span>
              <span className="text-gray-400 text-xs">{adminRole === 'owner' ? 'مالك الموقع' : adminRole === 'admin' ? 'مدير' : 'محرر'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
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

        {/* أزرار التبويبات الرئيسية */}
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
          <button onClick={() => setActiveTab('freetext')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'freetext' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaPenFancy /> النصوص الحرة
          </button>
          <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${activeTab === 'templates' ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700'}`}>
            <FaBorderAll /> القوالب
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
        </div>

        {/* ============================================================
            تبويب الصفحة الرئيسية (HOME)
        ============================================================ */}
        {activeTab === 'home' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaHome className="text-red-600" /> 🏠 ترتيب وتفعيل أقسام الصفحة الرئيسية
            </h2>
            <p className="text-gray-500 mb-6">يمكنك تفعيل/تعطيل وإعادة ترتيب الأقسام التي تظهر في الصفحة الرئيسية</p>
            
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-gray-400 w-8">{index + 1}</span>
                    <div>
                      <p className="font-medium">{template.title}</p>
                      <p className="text-xs text-gray-500">معرف القالب: {template.template_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleToggleTemplate(template.id, template.is_enabled)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${template.is_enabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
                    >
                      {template.is_enabled ? 'مفعل' : 'معطل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 <strong>ملاحظة:</strong> ترتيب الأقسام يظهر كما هو في الصفحة الرئيسية. القالب الأول هو الأعلى، ثم الثاني، ثم الثالث.
              </p>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب البانر العلوي (HERO)
        ============================================================ */}
        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-2xl font-bold mb-4">🖼️ تخصيص البانر العلوي</h2>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">معاينة حية (كما ستظهر في الموقع)</p>
              <div className="relative rounded-xl overflow-hidden h-48 bg-cover bg-center" style={{ backgroundImage: `url(${hero.background_image})` }}>
                <div className="absolute inset-0 flex items-center justify-center text-center p-4" style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity / 100})` }}>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{hero.title}</h3>
                    <p className="text-gray-200">{hero.subtitle}</p>
                    {hero.button_text && (
                      <button className="mt-3 bg-red-600 text-white px-4 py-1 rounded-full text-sm">{hero.button_text}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block font-bold mb-2">🖼️ صورة الخلفية</label>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => document.getElementById('heroImageInput')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2" disabled={uploading}>
                    <FaUpload /> {uploading ? 'جاري الرفع...' : 'رفع صورة جديدة'}
                  </button>
                  <input id="heroImageInput" type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
                  <input type="text" value={hero.background_image} onChange={(e) => setHero({ ...hero, background_image: e.target.value })} placeholder="أو أدخل رابط الصورة" className="flex-1 p-2 rounded-lg border dark:bg-gray-900" />
                </div>
              </div>
              
              <div>
                <label className="block font-bold mb-2">📝 العنوان الرئيسي</label>
                <input type="text" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" />
              </div>
              
              <div>
                <label className="block font-bold mb-2">📄 النص الثانوي</label>
                <input type="text" value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" />
              </div>
              
              <div>
                <label className="block font-bold mb-2">🔘 نص الزر</label>
                <input type="text" value={hero.button_text} onChange={(e) => setHero({ ...hero, button_text: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" />
              </div>
              
              <div>
                <label className="block font-bold mb-2">🔗 رابط الزر</label>
                <input type="text" value={hero.button_link} onChange={(e) => setHero({ ...hero, button_link: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" />
              </div>
              
              <div>
                <label className="block font-bold mb-2">🎨 شفافية الطبقة ({hero.overlay_opacity}%)</label>
                <input type="range" min="0" max="90" value={hero.overlay_opacity} onChange={(e) => setHero({ ...hero, overlay_opacity: parseInt(e.target.value) })} className="w-full" />
              </div>
              
              <div>
                <label className="block font-bold mb-2">✅ حالة القسم</label>
                <button onClick={() => setHero({ ...hero, is_enabled: !hero.is_enabled })} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${hero.is_enabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                  {hero.is_enabled ? <FaEye /> : <FaEyeSlash />}
                  {hero.is_enabled ? 'مفعل' : 'معطل'}
                </button>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t">
              <button onClick={saveHero} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"><FaSave /> حفظ البانر</button>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب إدارة الأخبار (NEWS) مع إضافة خبر جديد
        ============================================================ */}
        {activeTab === 'news' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">📰 إدارة الأخبار</h2>
              <button 
                onClick={() => setShowAddNewsModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaPlus /> إضافة خبر جديد
              </button>
            </div>
            
            {loading ? (
              <p className="text-center py-20">جاري التحميل...</p>
            ) : news.length === 0 ? (
              <p className="text-center py-20 text-gray-500">لا توجد أخبار بعد</p>
            ) : (
              news.map((item) => (
                <div key={item.id} className="bg-white dark:bg-cardBg rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  {editingNews?.id === item.id ? (
                    <div className="space-y-3">
                      <input type="text" value={editingNews.title} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} className="w-full p-2 rounded-lg border dark:bg-gray-900" />
                      <textarea value={editingNews.content} onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })} rows={5} className="w-full p-2 rounded-lg border dark:bg-gray-900" />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(editingNews)} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaSave /> حفظ</button>
                        <button onClick={() => setEditingNews(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaTimes /> إلغاء</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.category || 'عام'} • {new Date(item.created_at).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingNews(item)} className="text-blue-500 hover:text-blue-600 p-2"><FaEdit size={20} /></button>
                        <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 p-2"><FaTrash size={20} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* مودال إضافة خبر جديد */}
            {showAddNewsModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة خبر جديد</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold mb-2">العنوان *</label>
                      <input 
                        type="text" 
                        value={newNewsTitle} 
                        onChange={(e) => setNewNewsTitle(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800"
                        placeholder="أدخل عنوان الخبر"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-2">المحتوى *</label>
                      <textarea 
                        value={newNewsContent} 
                        onChange={(e) => setNewNewsContent(e.target.value)}
                        rows={8}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800"
                        placeholder="أدخل محتوى الخبر..."
                      />
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-2">التصنيف</label>
                      <select 
                        value={newNewsCategory} 
                        onChange={(e) => setNewNewsCategory(e.target.value)}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800"
                      >
                        <option value="">اختر تصنيف</option>
                        <option value="politics">سياسة</option>
                        <option value="economy">اقتصاد</option>
                        <option value="tech">تكنولوجيا</option>
                        <option value="sports">رياضة</option>
                        <option value="culture">ثقافة</option>
                        <option value="opinions">آراء</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-2">الصورة</label>
                      <div className="flex gap-3 flex-wrap">
                        <button 
                          onClick={() => document.getElementById('newsImageInput')?.click()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          disabled={uploadingImage}
                        >
                          <FaUpload /> {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}
                        </button>
                        <input id="newsImageInput" type="file" accept="image/*" className="hidden" onChange={handleNewsImageUpload} />
                        <input 
                          type="text" 
                          value={newNewsImage} 
                          onChange={(e) => setNewNewsImage(e.target.value)}
                          placeholder="أو أدخل رابط الصورة"
                          className="flex-1 p-3 rounded-lg border dark:bg-gray-800"
                        />
                      </div>
                      {newNewsImage && (
                        <img src={newNewsImage} alt="معاينة" className="mt-2 h-32 object-cover rounded" />
                      )}
                    </div>
                    
                    <div>
                      <label className="block font-bold mb-2">رابط مخصص (Slug) - اختياري</label>
                      <input 
                        type="text" 
                        value={newNewsSlug} 
                        onChange={(e) => setNewNewsSlug(e.target.value)}
                        placeholder="مثال: my-news-title"
                        className="w-full p-3 rounded-lg border dark:bg-gray-800"
                      />
                      <p className="text-xs text-gray-500 mt-1">اتركه فارغاً ليتم إنشاؤه تلقائياً من العنوان</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button onClick={handleAddNews} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة الخبر</button>
                    <button onClick={() => {
                      setShowAddNewsModal(false)
                      setNewNewsTitle('')
                      setNewNewsContent('')
                      setNewNewsCategory('')
                      setNewNewsImage('')
                      setNewNewsSlug('')
                    }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الأسعار العالمية (EXCHANGE RATES)
        ============================================================ */}
        {activeTab === 'exchange' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold">💰 إدارة الأسعار العالمية</h2>
              <button onClick={() => { setEditingRate(null); setNewRateName(''); setNewRateCode(''); setNewRateValue(''); setNewRateUnit(''); setNewRateCategory('foreign'); setNewRateTrend('up'); setShowRateModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus /> إضافة سعر جديد
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-6">يمكنك إضافة وتعديل وحذف الأسعار العالمية (عملات، معادن، طاقة، مؤشرات)</p>

            {/* العملات العربية */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 border-r-2 border-green-500 pr-3">🇸🇦 العملات العربية</h3>
              <div className="space-y-2">
                {exchangeRates.filter(r => r.category === 'arab').map((rate, idx) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 w-8">{idx + 1}</span>
                      <div>
                        <p className="font-medium">{rate.name} ({rate.code})</p>
                        <p className="text-sm">{rate.value} {rate.unit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => moveRateUp(idx)} disabled={idx === 0} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↑</button>
                      <button onClick={() => moveRateDown(idx)} disabled={idx === exchangeRates.filter(r => r.category === 'arab').length - 1} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↓</button>
                      <button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="p-2 text-blue-500 hover:text-blue-700"><FaEdit /></button>
                      <button onClick={() => handleDeleteRate(rate.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* العملات الأجنبية */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 border-r-2 border-blue-500 pr-3">🌍 العملات الأجنبية</h3>
              <div className="space-y-2">
                {exchangeRates.filter(r => r.category === 'foreign').map((rate, idx) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 w-8">{idx + 1}</span>
                      <div>
                        <p className="font-medium">{rate.name} ({rate.code})</p>
                        <p className="text-sm">{rate.value} {rate.unit}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => moveRateUp(idx + exchangeRates.filter(r => r.category === 'arab').length)} disabled={idx === 0} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↑</button>
                      <button onClick={() => moveRateDown(idx + exchangeRates.filter(r => r.category === 'arab').length)} disabled={idx === exchangeRates.filter(r => r.category === 'foreign').length - 1} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↓</button>
                      <button onClick={() => { setEditingRate(rate); setShowRateModal(true); }} className="p-2 text-blue-500 hover:text-blue-700"><FaEdit /></button>
                      <button onClick={() => handleDeleteRate(rate.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* مودال إضافة/تعديل سعر */}
            {showRateModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">{editingRate ? '✏️ تعديل السعر' : '➕ إضافة سعر جديد'}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold mb-2">الاسم</label>
                      <input type="text" value={editingRate ? editingRate.name : newRateName} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, name: e.target.value }) : setNewRateName(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">الرمز (CODE)</label>
                      <input type="text" value={editingRate ? editingRate.code : newRateCode} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, code: e.target.value.toUpperCase() }) : setNewRateCode(e.target.value.toUpperCase())} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">القيمة</label>
                      <input type="number" step="0.01" value={editingRate ? editingRate.value : newRateValue} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, value: parseFloat(e.target.value) }) : setNewRateValue(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">الوحدة</label>
                      <input type="text" value={editingRate ? editingRate.unit : newRateUnit} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, unit: e.target.value }) : setNewRateUnit(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">الفئة</label>
                      <select value={editingRate ? editingRate.category : newRateCategory} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, category: e.target.value as any }) : setNewRateCategory(e.target.value as any)} className="w-full p-3 rounded-lg border dark:bg-gray-800">
                        <option value="arab">🇸🇦 عملات عربية</option>
                        <option value="foreign">🌍 عملات أجنبية</option>
                        <option value="crypto">💎 عملات رقمية</option>
                        <option value="metal">🏆 معادن</option>
                        <option value="energy">⛽ طاقة</option>
                        <option value="index">📈 مؤشرات</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-2">الاتجاه</label>
                      <select value={editingRate ? editingRate.trend : newRateTrend} onChange={(e) => editingRate ? setEditingRate({ ...editingRate, trend: e.target.value as any }) : setNewRateTrend(e.target.value as any)} className="w-full p-3 rounded-lg border dark:bg-gray-800">
                        <option value="up">📈 صاعد ↑</option>
                        <option value="down">📉 هابط ↓</option>
                        <option value="stable">➡️ مستقر →</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button onClick={editingRate ? handleUpdateRate : handleAddRate} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">{editingRate ? 'تحديث' : 'إضافة'}</button>
                    <button onClick={() => { setShowRateModal(false); setEditingRate(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الإحصائيات (STATS)
        ============================================================ */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold">📊 إدارة إحصائيات الموقع</h2>
              <button onClick={() => { setEditingStat(null); setNewStatIcon('FaGlobe'); setNewStatValue(''); setNewStatLabel(''); setShowStatModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaPlus /> إضافة إحصائية جديدة
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-6">تظهر هذه الإحصائيات في أسفل الصفحة (عدد الدول، القراء، المقالات)</p>

            <div className="space-y-3">
              {stats.map((stat, idx) => (
                <div key={stat.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 w-8">{idx + 1}</span>
                    <div>
                      <p className="font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-red-600">{stat.value}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingStat(stat); setShowStatModal(true); }} className="p-2 text-blue-500 hover:text-blue-700"><FaEdit /></button>
                    <button onClick={() => handleDeleteStat(stat.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* مودال إضافة/تعديل إحصائية */}
            {showStatModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">{editingStat ? '✏️ تعديل الإحصائية' : '➕ إضافة إحصائية جديدة'}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold mb-2">القيمة (مثال: 120+، 50K+)</label>
                      <input type="text" value={editingStat ? editingStat.value : newStatValue} onChange={(e) => editingStat ? setEditingStat({ ...editingStat, value: e.target.value }) : setNewStatValue(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block font-bold mb-2">الوصف (مثال: دولة، قارئ، مقال)</label>
                      <input type="text" value={editingStat ? editingStat.label : newStatLabel} onChange={(e) => editingStat ? setEditingStat({ ...editingStat, label: e.target.value }) : setNewStatLabel(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <button onClick={editingStat ? handleUpdateStat : handleAddStat} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">{editingStat ? 'تحديث' : 'إضافة'}</button>
                    <button onClick={() => { setShowStatModal(false); setEditingStat(null); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب النصوص الحرة (FREE TEXT)
        ============================================================ */}
        {activeTab === 'freetext' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">📝 إدارة النصوص الحرة</h2>
            <p className="text-gray-500 text-sm mb-6">يمكنك تعديل النصوص التي تظهر في الأقسام (التحليلات الاقتصادية، الرؤية، أبراج اليوم)</p>

            <div className="space-y-6">
              {freeTexts.map((text) => (
                <div key={text.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{text.title}</h3>
                    {editingText?.id === text.id ? (
                      <div className="flex gap-2">
                        <button onClick={handleUpdateFreeText} className="text-green-600"><FaSave size={20} /></button>
                        <button onClick={() => setEditingText(null)} className="text-gray-500"><FaTimes size={20} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingText(text)} className="text-blue-500"><FaEdit size={20} /></button>
                    )}
                  </div>
                  {editingText?.id === text.id ? (
                    <textarea value={editingText.content} onChange={(e) => setEditingText({ ...editingText, content: e.target.value })} rows={6} className="w-full p-3 rounded-lg border dark:bg-gray-900" />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{text.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب القوالب (TEMPLATES)
        ============================================================ */}
        {activeTab === 'templates' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">🎨 تخصيص القوالب</h2>
            <p className="text-gray-500 text-sm mb-6">يمكنك تفعيل/تعطيل وإعادة ترتيب القوالب في الصفحة الرئيسية</p>

            <div className="space-y-4">
              {templates.map((template, idx) => (
                <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-bold">{template.title}</p>
                    <p className="text-sm text-gray-500">معرف: {template.template_id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleToggleTemplate(template.id, template.is_enabled)} className={`px-4 py-2 rounded-lg transition ${template.is_enabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                      {template.is_enabled ? 'مفعل' : 'معطل'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                💡 <strong>ملاحظة:</strong> القالب الأول (رئيسي)، القالب الثاني (تحليلات سياسية وأبراج)، القالب الثالث (آراء وأسعار عالمية)
              </p>
            </div>
          </div>
        )}

        {/* ============================================================
            تبويب الشريط المتحرك (TICKER)
        ============================================================ */}
        {activeTab === 'ticker' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2 className="text-2xl font-bold">📢 إدارة الشريط المتحرك</h2>
              <button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> إضافة عنصر جديد</button>
            </div>

            <p className="text-gray-500 text-sm">يمكنك إضافة أي نص تريده إلى الشريط (إعلانات، تنبيهات، روابط). العناصر النشطة فقط هي التي تظهر.</p>

            {tickerItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500">لا توجد عناصر في الشريط بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickerItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium">{item.text_content}</p>
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

            {/* مودال إضافة عنصر جديد */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة عنصر جديد إلى الشريط</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2">النص *</label><input type="text" value={newTickerText} onChange={(e) => setNewTickerText(e.target.value)} placeholder="مثال: 🔥 عاجل: حدث مهم" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">رابط (اختياري)</label><input type="text" value={newTickerLink} onChange={(e) => setNewTickerLink(e.target.value)} placeholder="/news/important-event" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">نص الرابط (اختياري)</label><input type="text" value={newTickerLinkText} onChange={(e) => setNewTickerLinkText(e.target.value)} placeholder="مثال: اقرأ المزيد" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div className="flex items-center gap-3"><input type="checkbox" id="isExternal" checked={newTickerIsExternal} onChange={(e) => setNewTickerIsExternal(e.target.checked)} className="w-5 h-5" /><label htmlFor="isExternal">رابط خارجي (يفتح في نافذة جديدة)</label></div>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={handleAddToTicker} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => { setShowAddModal(false); setNewTickerText(''); setNewTickerLink(''); setNewTickerLinkText(''); setNewTickerIsExternal(false); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الجريدة اليومية (DAILY BRIEF)
        ============================================================ */}
        {activeTab === 'dailybrief' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📰 إدارة الجريدة اليومية</h2>
              <button onClick={() => setShowDailyBriefModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> إضافة عنصر جديد</button>
            </div>

            {dailyBrief.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-gray-500">لا توجد عناصر في الجريدة اليومية</p></div>
            ) : (
              <div className="space-y-3">
                {dailyBrief.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1"><div className="flex items-center gap-3 mb-1"><span className="text-red-500 font-bold text-sm">{item.section_title}</span><span className="font-medium text-sm">{item.title}</span></div><p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1">{item.description}</p></div>
                    <div className="flex gap-2">
                      <button onClick={() => moveBriefUp(index)} disabled={index === 0} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↑</button>
                      <button onClick={() => moveBriefDown(index)} disabled={index === dailyBrief.length - 1} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-30">↓</button>
                      <button onClick={() => handleDeleteBrief(item.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* مودال إضافة عنصر جديد */}
            {showDailyBriefModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة عنصر جديد</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2">عنوان القسم *</label><input type="text" value={newBriefSection} onChange={(e) => setNewBriefSection(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">العنوان *</label><input type="text" value={newBriefTitle} onChange={(e) => setNewBriefTitle(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">الوصف *</label><textarea value={newBriefDescription} onChange={(e) => setNewBriefDescription(e.target.value)} rows={3} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">رابط (اختياري)</label><input type="text" value={newBriefLink} onChange={(e) => setNewBriefLink(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={handleAddBrief} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => { setShowDailyBriefModal(false); setNewBriefSection(''); setNewBriefTitle(''); setNewBriefDescription(''); setNewBriefLink(''); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب التعليقات (COMMENTS)
        ============================================================ */}
        {activeTab === 'comments' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><FaCommentDots className="text-red-600" /> 💬 إدارة التعليقات</h2>
            <p className="text-gray-500 text-sm mb-6">جميع التعليقات التي كتبها الزوار على الأخبار.</p>
            
            {commentsLoading ? (
              <div className="text-center py-12"><div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div><p className="mt-2 text-gray-500">جاري تحميل التعليقات...</p></div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"><FaCommentDots className="text-gray-400 text-4xl mx-auto mb-3" /><p className="text-gray-500">لا توجد تعليقات بعد</p></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4"><p className="text-sm text-gray-500">إجمالي التعليقات: {comments.length}</p></div>
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex-1"><div className="flex items-center gap-3 flex-wrap mb-2"><span className="font-bold text-red-600">{comment.author_name}</span><span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">{comment.news_slug}</span><span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('ar-EG')}</span></div><p className="text-gray-700 dark:text-gray-300">{comment.content}</p></div>
                      <button onClick={() => handleDeleteComment(comment.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"><FaTrash size={14} /> حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب القائمة العلوية (MENU)
        ============================================================ */}
        {activeTab === 'menu' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🔗 إدارة القائمة العلوية</h2>
              <button onClick={() => setShowMenuModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaPlus /> إضافة رابط جديد</button>
            </div>
            <p className="text-gray-500 text-sm mb-6">تظهر هذه الروابط في القائمة العلوية للموقع</p>

            {menuItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg"><p className="text-gray-500">لا توجد عناصر في القائمة</p></div>
            ) : (
              <div className="space-y-3">
                {menuItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div><p className="font-medium">{item.title}</p><p className="text-xs text-blue-500">{item.link}</p></div>
                    <div className="flex gap-2"><button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 text-red-500 hover:text-red-700"><FaTrash /></button></div>
                  </div>
                ))}
              </div>
            )}

            {showMenuModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">➕ إضافة رابط جديد</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2">النص الظاهر *</label><input type="text" value={newMenuTitle} onChange={(e) => setNewMenuTitle(e.target.value)} placeholder="مثال: الرئيسية" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">الرابط *</label><input type="text" value={newMenuLink} onChange={(e) => setNewMenuLink(e.target.value)} placeholder="/  أو /category/tech" className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={handleAddMenuItem} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => { setShowMenuModal(false); setNewMenuTitle(''); setNewMenuLink(''); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب المشرفين (ADMINS)
        ============================================================ */}
        {activeTab === 'admins' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">👥 إدارة المشرفين</h2>
              <button onClick={() => setShowAdminModal(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"><FaUserPlus /> إضافة مشرف جديد</button>
            </div>
            <p className="text-gray-500 text-sm mb-6">يمكنك إضافة مشرفين جدد مع صلاحيات محددة</p>

            <div className="space-y-3">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div><p className="font-bold">{admin.name}</p><p className="text-sm text-gray-500">@{admin.username} • {admin.role === 'owner' ? 'مالك' : admin.role === 'admin' ? 'مدير' : 'محرر'}</p></div>
                  {admin.username !== 'owner' && <button onClick={() => handleDeleteAdmin(admin.id, admin.username)} className="p-2 text-red-500 hover:text-red-700"><FaUserMinus size={20} /></button>}
                </div>
              ))}
            </div>

            {showAdminModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-lg mx-4">
                  <h3 className="text-xl font-bold mb-4">👤 إضافة مشرف جديد</h3>
                  <div className="space-y-4">
                    <div><label className="block font-bold mb-2">اسم المستخدم *</label><input type="text" value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">الاسم الكامل *</label><input type="text" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">كلمة المرور *</label><input type="password" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} className="w-full p-3 rounded-lg border dark:bg-gray-800" /></div>
                    <div><label className="block font-bold mb-2">الصلاحية</label><select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'editor')} className="w-full p-3 rounded-lg border dark:bg-gray-800"><option value="admin">مدير (صلاحيات كاملة)</option><option value="editor">محرر (تعديل محتوى فقط)</option></select></div>
                  </div>
                  <div className="flex gap-3 mt-6"><button onClick={handleAddAdmin} className="bg-red-600 text-white px-4 py-2 rounded-lg flex-1">إضافة</button><button onClick={() => { setShowAdminModal(false); setNewAdminUsername(''); setNewAdminName(''); setNewAdminPassword(''); setNewAdminRole('editor'); }} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex-1">إلغاء</button></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            تبويب الإعدادات العامة (SETTINGS)
        ============================================================ */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-cardBg rounded-xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">
            <h2 className="text-2xl font-bold mb-4">⚙️ إعدادات الموقع العامة</h2>
            
            <div><label className="block font-bold mb-2 flex items-center gap-2"><FaTelegram className="text-blue-500" /> رابط تليجرام</label><input type="url" value={settings.telegramUrl} onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
            
            <div><label className="block font-bold mb-2">اللون الأساسي للموقع</label><div className="flex items-center gap-4 flex-wrap"><input type="color" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="w-16 h-16 rounded cursor-pointer border" /><input type="text" value={settings.primaryColor} onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })} className="flex-1 p-3 rounded-lg border dark:bg-gray-900" /></div></div>
            
            <div><label className="block font-bold mb-2">سرعة الشريط المتحرك (ميلي ثانية)</label><input type="number" value={settings.tickerSpeed} onChange={(e) => setSettings({ ...settings, tickerSpeed: parseInt(e.target.value) || 4000 })} className="w-full p-3 rounded-lg border dark:bg-gray-900" /></div>
            
            <button onClick={updateSettings} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition w-full justify-center font-bold"><FaSave /> حفظ جميع الإعدادات</button>
          </div>
        )}
      </div>
    </div>
  )
}