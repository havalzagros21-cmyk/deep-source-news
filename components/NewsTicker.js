'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTickerItems } from '../lib/siteConfig'
import { FaNewspaper } from 'react-icons/fa'

export default function NewsTicker() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchTickerItems()
  }, [])

  const fetchTickerItems = async () => {
    const data = await getTickerItems()
    setItems(data)
  }

  if (items.length === 0) return null

  return (
    <div className="bg-gradient-to-r from-red-900 to-red-800 dark:from-red-950 dark:to-red-900 py-3 border-y border-red-700/50 shadow-lg overflow-hidden">
      <div className="relative">
        {/* شارة عاجل ثابتة */}
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-l-full shadow-lg">
          <FaNewspaper className="text-yellow-400 animate-pulse" />
          <span className="font-bold text-white text-sm tracking-wider hidden sm:inline">عاجل</span>
        </div>

        {/* المحتوى المتحرك */}
        <div className="overflow-hidden ml-24">
          <div className="flex animate-ticker whitespace-nowrap">
            {items.map((item, index) => (
              <div key={item.id} className="inline-flex items-center gap-3 px-4 py-1">
                <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                
                {item.link_url ? (
                  <a 
                    href={item.link_url}
                    target={item.is_external ? '_blank' : '_self'}
                    rel={item.is_external ? 'noopener noreferrer' : ''}
                    className="text-white hover:text-yellow-300 transition-colors duration-200 text-base md:text-lg font-medium"
                  >
                    {item.text_content}
                    {item.link_text && (
                      <span className="text-yellow-400 text-sm mr-2">← {item.link_text}</span>
                    )}
                  </a>
                ) : (
                  <span className="text-white text-base md:text-lg font-medium">
                    {item.text_content}
                  </span>
                )}
                
                <span className="text-red-300 text-sm mx-2">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: tickerScroll 30s linear infinite;
          width: fit-content;
        }
        
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}