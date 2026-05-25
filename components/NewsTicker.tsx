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
      console.log('Ticker items:', data) // للتأكد من البيانات
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
        fetchTickerItems()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading || items.length === 0) return null

  // اختيار النص حسب اللغة الحالية
  const repeatedText = items
    .map(item => {
      let text = ''
      if (currentLocale === 'ar') {
        text = item.text_content_ar || item.text_content_ar
        console.log('Using Arabic:', text)
      } else if (currentLocale === 'en') {
        text = item.text_content_en || item.text_content_ar
        console.log('Using English:', text)
      } else {
        text = item.text_content_ku || item.text_content_ar
        console.log('Using Kurdish:', text)
      }
      
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
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-l from-red-600/90 to-transparent px-5">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-red-500 text-sm" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              {t('breaking')}
            </span>
            <FaCircle className="text-red-500 text-[6px] animate-pulse" />
          </div>
        </div>

        <div className="absolute right-32 top-2 bottom-2 w-px bg-red-600/30 z-20"></div>

        <div className="overflow-hidden mr-36">
          <marquee behavior="scroll" direction="left" scrollamount="4" className="text-gray-300 text-sm py-3">
            {repeatedText}
          </marquee>
        </div>
      </div>
    </div>
  )
}