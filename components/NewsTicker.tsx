'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { FaNewspaper } from 'react-icons/fa'

interface TickerItem {
  id: number
  text_content_ar: string
  text_content_en: string
  text_content_ku: string
  link_url: string | null
  link_text: string | null
  order_index: number
  is_active: boolean
}

export default function NewsTicker() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)
  const currentLocale = i18n.language

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      setItems(data || [])
      setLoading(false)
    }
    fetchItems()
  }, [currentLocale])

  if (loading || items.length === 0) return null

  const getText = (item: TickerItem) => {
    if (currentLocale === 'ar') return item.text_content_ar
    if (currentLocale === 'en') return item.text_content_en
    return item.text_content_ku
  }

  const text = items.map(item => getText(item)).join(' | ')

  return (
    <div className="bg-gradient-to-r from-red-900 to-red-800 py-3 overflow-hidden">
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-black/70 px-4 py-2 rounded-l-full">
          <FaNewspaper className="text-yellow-400" />
          <span className="font-bold text-white text-sm">{t('breaking')}</span>
        </div>
        <div className="overflow-hidden ml-28">
          <marquee className="text-white text-sm py-1">{text}</marquee>
        </div>
      </div>
    </div>
  )
}