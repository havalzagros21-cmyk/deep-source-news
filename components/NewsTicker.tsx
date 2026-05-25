'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getTickerItems } from '../lib/siteConfig'
import { FaNewspaper } from 'react-icons/fa'

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
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

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

  // تكرار المحتوى 3 مرات لضمان الحركة المستمرة
  const duplicateItems = items.length > 0 ? [...items, ...items, ...items] : []

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current || isHovered || items.length === 0) return

    let animationId: number
    let position = 0
    const speed = 0.8

    const animate = () => {
      if (!scrollRef.current || !contentRef.current) return
      
      position -= speed
      
      // إعادة الضبط عند النهاية
      if (position <= -contentRef.current.scrollWidth / 3) {
        position = 0
      }
      
      scrollRef.current.style.transform = `translateX(${position}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [isHovered, items.length])

  // إظهار رسالة في Console للمساعدة في التصحيح
  useEffect(() => {
    if (!loading && items.length === 0) {
      console.log('⚠️ لا توجد عناصر في الشريط المتحرك. أضف عناصر من لوحة التحكم.')
    }
  }, [loading, items.length])

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-800 py-3">
        <div className="text-center text-white/50 text-sm">جاري تحميل الشريط...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div
      className="bg-gradient-to-r from-red-900 to-red-800 dark:from-red-950 dark:to-red-900 py-3 border-y border-red-700/50 shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-l-full shadow-lg">
          <FaNewspaper className="text-yellow-400 animate-pulse" />
          <span className="font-bold text-white text-sm tracking-wider hidden sm:inline">عاجل</span>
        </div>

        <div className="overflow-hidden ml-24">
          <div
            ref={scrollRef}
            className="whitespace-nowrap"
            style={{ display: 'inline-block' }}
          >
            <div ref={contentRef} className="inline-block">
              {duplicateItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-3 px-4 py-1">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0 animate-pulse"></span>

                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target={item.is_external ? '_blank' : '_self'}
                      rel={item.is_external ? 'noopener noreferrer' : ''}
                      className="text-white hover:text-yellow-300 transition-colors duration-200 text-base md:text-lg font-medium whitespace-nowrap"
                    >
                      {item.text_content}
                      {item.link_text && (
                        <span className="text-yellow-400 text-sm mr-2 whitespace-nowrap">← {item.link_text}</span>
                      )}
                    </a>
                  ) : (
                    <span className="text-white text-base md:text-lg font-medium whitespace-nowrap">
                      {item.text_content}
                    </span>
                  )}

                  <span className="text-red-300 text-sm mx-2 flex-shrink-0">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}