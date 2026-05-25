'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getTickerItems } from '../lib/siteConfig'
import { FaNewspaper, FaCircle } from 'react-icons/fa'
import '../lib/i18n'

interface TickerItem {
  id: number
  text_content: string
  link_url: string | null
  link_text: string | null
  order_index: number
  is_active: boolean
  is_external: boolean
}

export default function NewsTicker() {
  const [items, setItems] = useState<TickerItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickerItems = async () => {
    try {
      const data = await getTickerItems()
      console.log('✅ Ticker items loaded:', data?.length || 0, 'items')
      setItems(data || [])
    } catch (error) {
      console.error('❌ Error fetching ticker items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickerItems()

    // الاشتراك في التغييرات الفورية (Realtime)
    const channel = supabase
      .channel('ticker-changes')
      .on(
        'postgres_changes',
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

  if (loading || items.length === 0) {
    return null
  }

  // بناء النص المتكرر من العناصر الموجودة في قاعدة البيانات (بنفس تنسيق القديم)
  const repeatedText = items
    .map(item => {
      if (item.link_url) {
        return `🔥 ${item.text_content} ➜ ${item.link_text || 'اقرأ'} | `
      }
      return `🔥 ${item.text_content} | `
    })
    .join(' ')
    .repeat(5)

  return (
    <div className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden">
      <div className="relative">
        {/* شارة عاجل بتصميم الموقع القديم */}
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-l from-red-600/90 to-transparent px-5">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-red-500 text-sm" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              عاجل
            </span>
            <FaCircle className="text-red-500 text-[6px] animate-pulse" />
          </div>
        </div>

        {/* خط فاصل */}
        <div className="absolute right-32 top-2 bottom-2 w-px bg-red-600/30 z-20"></div>

        {/* النص المتحرك من قاعدة البيانات */}
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