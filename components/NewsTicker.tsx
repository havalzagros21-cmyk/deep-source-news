'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { FaNewspaper, FaCircle } from 'react-icons/fa'
import '../lib/i18n'

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

  console.log('Current language:', currentLocale) // للتأكد من اللغة

  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      console.log('Fetched items:', data) // للتأكد من البيانات
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching ticker items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickerItems()

    const channel = supabase
      .channel('ticker-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticker_items' }, () => {
        console.log('Ticker changed, refetching...')
        fetchTickerItems()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden py-2">
        <div className="text-center text-gray-400 text-sm">جاري التحميل...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  // اختيار النص حسب اللغة الحالية
  const getTextByLanguage = (item: TickerItem) => {
    if (currentLocale === 'ar') return item.text_content_ar
    if (currentLocale === 'en') return item.text_content_en
    if (currentLocale === 'ku') return item.text_content_ku
    return item.text_content_ar
  }

  // بناء النص المتكرر
  const displayItems = [...items, ...items, ...items]
  
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
          <div className="whitespace-nowrap animate-marquee inline-block py-3">
            {displayItems.map((item, idx) => (
              <span key={`${item.id}-${idx}`} className="inline-block mx-4">
                {item.link_url ? (
                  <a
                    href={item.link_url}
                    target={item.is_external ? '_blank' : '_self'}
                    rel={item.is_external ? 'noopener noreferrer' : ''}
                    className="text-gray-300 hover:text-white transition text-sm"
                  >
                    🔥 {getTextByLanguage(item)} ➜ {item.link_text || t('readMore')}
                  </a>
                ) : (
                  <span className="text-gray-300 text-sm">
                    🔥 {getTextByLanguage(item)}
                  </span>
                )}
                <span className="text-red-600 mx-2">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}