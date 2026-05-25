'use client'

import { useState, useEffect, useRef } from 'react'
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
  is_external: boolean
}

export default function NewsTicker() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<TickerItem[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const currentLocale = i18n.language

  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
      
      if (error) throw error
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching ticker:', error)
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

  useEffect(() => {
    if (items.length > 0) {
      fetchTickerItems()
    }
  }, [currentLocale])

  const getText = (item: TickerItem) => {
    if (currentLocale === 'ar') return item.text_content_ar
    if (currentLocale === 'en') return item.text_content_en
    return item.text_content_ku
  }

  // لا تعرض الشريط إذا كان تحميل أو لا توجد بيانات
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-900 to-red-800 py-3">
        <div className="text-center text-white/50 text-sm">جاري التحميل...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  const duplicateItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current || isHovered) return

    let animationId: number
    let position = 0
    const speed = 0.8

    const animate = () => {
      if (!scrollRef.current || !contentRef.current) return
      
      position -= speed
      
      if (position <= -contentRef.current.scrollWidth / 2) {
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

  return (
    <div
      className="bg-gradient-to-r from-red-900 to-red-800 dark:from-red-950 dark:to-red-900 py-3 border-y border-red-700/50 shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-l-full shadow-lg">
          <FaNewspaper className="text-yellow-400 animate-pulse" />
          <span className="font-bold text-white text-sm tracking-wider hidden sm:inline">
            {t('breaking')}
          </span>
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
                  {item.link_url ? (
                    <a
                      href={item.link_url}
                      target={item.is_external ? '_blank' : '_self'}
                      rel={item.is_external ? 'noopener noreferrer' : ''}
                      className="text-white hover:text-yellow-300 transition-colors duration-200 text-base md:text-lg font-medium whitespace-nowrap"
                    >
                      {getText(item)}
                      {item.link_text && (
                        <span className="text-yellow-400 text-sm mr-2 whitespace-nowrap"> ← {item.link_text}</span>
                      )}
                    </a>
                  ) : (
                    <span className="text-white text-base md:text-lg font-medium whitespace-nowrap">
                      {getText(item)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}