'use client'

import { useState, useEffect, useRef } from 'react'
import { getTickerItems } from '../lib/siteConfig'
import { FaNewspaper } from 'react-icons/fa'

export default function NewsTicker() {
  const [items, setItems] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    fetchTickerItems()
  }, [])

  const fetchTickerItems = async () => {
    const data = await getTickerItems()
    setItems(data)
  }

  // تكرار المحتوى 4 مرات للعربية (لضمان الاستمرارية)
  const duplicateItems = [...items, ...items, ...items, ...items]

  useEffect(() => {
    if (!scrollRef.current || !contentRef.current || isHovered) return

    let animationId
    let position = 0
    const speed = 0.8

    const animate = () => {
      if (!scrollRef.current || !contentRef.current) return
      
      position -= speed
      
      // إعادة الضبط عند النهاية
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

  if (items.length === 0) return null

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
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0"></span>

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