'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { FaNewspaper, FaCircle } from 'react-icons/fa'

// ============================================================
// الشريط المتحرك - نسخة كاملة مع الترجمة
// ============================================================

interface TickerItem {
  id: number
  text_content_ar: string
  text_content_en: string
  text_content_ku: string
  link_url: string | null
  link_text: string | null
  order_index: number
  is_active: boolean
  is_external: boolean
}

export default function NewsTicker() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const currentLocale = i18n.language

  // جلب البيانات من قاعدة البيانات
  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (error) {
        console.error('❌ خطأ في جلب البيانات:', error)
        return
      }
      
      if (data && data.length > 0) {
        console.log('✅ تم جلب البيانات:', data.length, 'عنصر')
        console.log('🌐 اللغة الحالية:', currentLocale)
        setItems(data)
      } else {
        console.log('⚠️ لا توجد بيانات في الشريط')
      }
    } catch (err) {
      console.error('❌ خطأ:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickerItems()
  }, [])

  // تحديث فوري عند تغيير اللغة أو البيانات
  useEffect(() => {
    fetchTickerItems()
  }, [currentLocale])

  // الاشتراك في التغييرات الفورية (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel('ticker-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ticker_items' }, 
        () => {
          console.log('🔄 تم تغيير الشريط - تحديث فوري')
          fetchTickerItems()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // الحصول على النص حسب اللغة الحالية
  const getTextByLanguage = (item: TickerItem): string => {
    switch (currentLocale) {
      case 'ar':
        return item.text_content_ar || item.text_content_ar
      case 'en':
        return item.text_content_en || item.text_content_ar
      case 'ku':
        return item.text_content_ku || item.text_content_ar
      default:
        return item.text_content_ar
    }
  }

  // حالة التحميل
  if (loading) {
    return (
      <div className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden py-2">
        <div className="text-center text-gray-400 text-sm">
          {t('loading') || 'جاري التحميل...'}
        </div>
      </div>
    )
  }

  // لا توجد بيانات
  if (items.length === 0) {
    console.log('ℹ️ لا توجد عناصر نشطة في الشريط')
    return null
  }

  // بناء النص المتكرر للحركة المستمرة
  const repeatedText = items
    .map(item => {
      const text = getTextByLanguage(item)
      if (item.link_url) {
        return `🔥 ${text} ➜ ${item.link_text || t('readMore')} | `
      }
      return `🔥 ${text} | `
    })
    .join(' ')
    .repeat(5)

  return (
    <div className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden">
      <div className="relative">
        {/* شارة "عاجل" */}
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-l from-red-600/90 to-transparent px-5">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-red-500 text-sm animate-pulse" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              {t('breaking')}
            </span>
            <FaCircle className="text-red-500 text-[6px] animate-pulse" />
          </div>
        </div>

        {/* خط فاصل */}
        <div className="absolute right-32 top-2 bottom-2 w-px bg-red-600/30 z-20"></div>

        {/* النص المتحرك */}
        <div className="overflow-hidden mr-36">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="4"
            className="text-gray-300 text-sm py-3"
          >
            {repeatedText}
          </marquee>
        </div>
      </div>
    </div>
  )
}