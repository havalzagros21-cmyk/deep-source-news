'use client'

import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaLink, FaPrint, FaEnvelope } from 'react-icons/fa'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  image?: string
}

export default function ShareButtons({ url, title, description = '', image = '' }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const encodedImage = encodeURIComponent(image)

  // نسخ الرابط إلى الحافظة
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('فشل النسخ:', err)
    }
  }

  // طباعة الصفحة
  const printPage = () => {
    window.print()
  }

  // مشاركة عبر البريد الإلكتروني
  const shareByEmail = () => {
    window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  // روابط المشاركة
  const shares = [
    {
      name: 'فيسبوك',
      icon: FaFacebook,
      href: `https://www.facebook.com/sharer.php?u=${encodedUrl}`,
      color: 'bg-[#1877f2] hover:bg-[#0d65d9]',
      bgLight: 'bg-[#1877f2]/10',
      textColor: 'text-[#1877f2]'
    },
    {
      name: 'تويتر',
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'bg-[#1da1f2] hover:bg-[#0d8de8]',
      bgLight: 'bg-[#1da1f2]/10',
      textColor: 'text-[#1da1f2]'
    },
    {
      name: 'واتساب',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`,
      color: 'bg-[#25d366] hover:bg-[#20bd5a]',
      bgLight: 'bg-[#25d366]/10',
      textColor: 'text-[#25d366]'
    },
    {
      name: 'تيليجرام',
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-[#26a5e4] hover:bg-[#1e93cc]',
      bgLight: 'bg-[#26a5e4]/10',
      textColor: 'text-[#26a5e4]'
    }
  ]

  return (
    <div className="my-6">
      {/* عنوان القسم */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-1 bg-red-500 rounded-full"></div>
        <h3 className="text-gray-700 dark:text-gray-300 font-bold text-sm">
          مشاركة الخبر
        </h3>
      </div>

      {/* أزرار المشاركة */}
      <div className="flex flex-wrap gap-3">
        {shares.map((share) => (
          <a
            key={share.name}
            href={share.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${share.color} text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg`}
            aria-label={`مشاركة على ${share.name}`}
          >
            <share.icon size={18} />
          </a>
        ))}

        {/* زر نسخ الرابط */}
        <button
          onClick={copyToClipboard}
          className={`relative p-3 rounded-full transition-all duration-300 hover:scale-110 ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          aria-label="نسخ الرابط"
        >
          <FaLink size={18} />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              تم النسخ!
            </span>
          )}
        </button>

        {/* زر الطباعة */}
        <button
          onClick={printPage}
          className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="طباعة"
        >
          <FaPrint size={18} />
        </button>

        {/* زر البريد الإلكتروني */}
        <button
          onClick={shareByEmail}
          className="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="مشاركة عبر البريد"
        >
          <FaEnvelope size={18} />
        </button>
      </div>

      {/* إحصائيات المشاركة (اختياري) */}
      <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
        شارك هذا الخبر مع أصدقائك
      </div>
    </div>
  )
}