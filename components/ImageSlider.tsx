'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
const SLIDE_INTERVAL = 5000 // 5 ثوانٍ بين كل شريحة

export default function ImageSlider({ slides }: ImageSliderProps) {
  const [current, setCurrent] = useState<number>(0)
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  const validSlides = slides.filter(slide => slide.image && slide.image !== '')

  // دالة الانتقال إلى الشريحة التالية
  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % validSlides.length)
  }, [validSlides.length])

  // دالة الانتقال إلى الشريحة السابقة
  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + validSlides.length) % validSlides.length)
  }, [validSlides.length])

  // إعداد المؤقت اللامتناهي (يعمل بشكل مستمر ولن يتوقف أبداً)
  useEffect(() => {
    if (validSlides.length === 0) return

    // تنظيف أي مؤقت سابق
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // لا نبدأ المؤقت إذا كان الماوس فوق السلايدر
    if (isHovering) return

    // بدء مؤتمر جديد
    intervalRef.current = setInterval(next, SLIDE_INTERVAL)

    // تنظيف عند إزالة المكون
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [validSlides.length, isHovering, next])

  // الانتقال إلى شريحة محددة (مع إعادة تعيين المؤقت)
  const goToSlide = useCallback((index: number) => {
    setCurrent(index)
    
    // إعادة تعيين المؤقت لضمان استمرار الحركة بعد النقر اليدوي
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (!isHovering) {
      intervalRef.current = setInterval(next, SLIDE_INTERVAL)
    }
  }, [isHovering, next])

  // معالجة اللمس للأجهزة المحمولة
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    if (diff > 50) prev()
    if (diff < -50) next()
    touchStartX.current = null
  }

  // حالة عدم وجود صور
  if (validSlides.length === 0) {
    return (
      <div className="relative w-full h-80 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">لا توجد صور لعرضها</span>
      </div>
    )
  }

  const currentSlide = validSlides[current]
  const imageUrl = currentSlide.image && currentSlide.image !== '' ? currentSlide.image : DEFAULT_IMAGE

  return (
    <div 
      className="relative w-full h-80 md:h-96 overflow-hidden rounded-xl cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* الصورة مع تأثير الانتقال */}
      <img
        src={imageUrl}
        alt={currentSlide.title || 'خبر'}
        className="w-full h-full object-cover transition-all duration-700 ease-in-out"
      />
      
      {/* طبقة التظليل */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* محتوى الشريحة */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-10">
        <span className="inline-block bg-red-600 text-xs px-2 py-1 rounded mb-2">
          {currentSlide.category || 'أخبار'}
        </span>
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 line-clamp-2">
          {currentSlide.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-200 mb-3 line-clamp-2">
          {currentSlide.description || 'اضغط للمزيد من التفاصيل'}
        </p>
        <a
          href={`/news/${currentSlide.slug}`}
          className="inline-block bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
        >
          اقرأ المزيد ←
        </a>
      </div>
      
      {/* زر السابق */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
        aria-label="السابق"
      >
        <FaChevronLeft className="text-white" size={18} />
      </button>
      
      {/* زر التالي */}
      <button
        onClick={next}
        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
        aria-label="التالي"
      >
        <FaChevronRight className="text-white" size={18} />
      </button>
      
      {/* نقاط التنقل */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {validSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? 'w-6 bg-red-500' : 'w-3 bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`الانتقال إلى الصورة ${index + 1}`}
          />
        ))}
      </div>

      {/* إضافة CSS لظهور الأزرار عند hover */}
      <style>{`
        .group:hover .opacity-0 {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}