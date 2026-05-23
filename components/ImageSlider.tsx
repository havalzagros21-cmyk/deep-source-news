'use client'

import { useState, useEffect } from 'react'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'

interface Slide {
  id: string
  title: string
  description: string
  image: string
  slug: string
  category: string
}

interface ImageSliderProps {
  slides: Slide[]
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&h=600&fit=crop'

export default function ImageSlider({ slides }: ImageSliderProps) {
  const [current, setCurrent] = useState<number>(0)

  const validSlides = slides.filter(slide => slide.image && slide.image !== '')

  useEffect(() => {
    if (validSlides.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validSlides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [validSlides.length])

  if (validSlides.length === 0) {
    return (
      <div className="w-full h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">لا توجد صور لعرضها</span>
      </div>
    )
  }

  const next = () => setCurrent((prev) => (prev + 1) % validSlides.length)
  const prev = () => setCurrent((prev) => (prev - 1 + validSlides.length) % validSlides.length)

  const currentSlide = validSlides[current]
  const imageUrl = currentSlide.image && currentSlide.image !== '' ? currentSlide.image : DEFAULT_IMAGE

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing">
      <img
        src={imageUrl}
        alt={currentSlide.title || 'خبر'}
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
        <span className="inline-block bg-red-600 text-xs px-2 py-1 rounded mb-2">
          {currentSlide.category || 'أخبار'}
        </span>
        <h3 className="text-xl font-bold mb-1 line-clamp-1">
          {currentSlide.title}
        </h3>
        <p className="text-sm text-gray-200 mb-3 line-clamp-2">
          {currentSlide.description || 'اضغط للمزيد من التفاصيل'}
        </p>
        <a
          href={`/news/${currentSlide.slug}`}
          className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition"
        >
          اقرأ المزيد
        </a>
      </div>
      
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition z-10"
        aria-label="السابق"
      >
        <FaChevronLeft className="text-white" size={20} />
      </button>
      
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition z-10"
        aria-label="التالي"
      >
        <FaChevronRight className="text-white" size={20} />
      </button>
      
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {validSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-1 rounded-full transition-all ${
              index === current ? 'w-6 bg-red-500' : 'w-3 bg-white/50'
            }`}
            aria-label={`الانتقال إلى الصورة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}