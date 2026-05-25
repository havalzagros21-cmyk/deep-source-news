'use client'

import { FaTelegram, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import '../lib/i18n'

export default function Footer() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const currentYear = new Date().getFullYear()
  const currentLocale = i18n.language

  useEffect(() => {
    setMounted(true)
  }, [])

  const socialLinks = [
    { icon: FaTelegram, href: 'https://t.me/deepsourc', label: 'Telegram', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-700' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
  ]

  if (!mounted) {
    return (
      <footer className="bg-gray-900 text-white mt-0 pt-0">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div><div className="w-32 h-8 bg-gray-700 rounded animate-pulse"></div></div>
            <div><div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div></div>
            <div><div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div></div>
            <div><div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-gray-900 text-white mt-0 pt-0">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section - اسم الموقع ثابت */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-red-500">Deep</span>
              <span className="text-white">Source</span>
              <span className="text-gray-400 text-sm mr-1">News</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {t('footerDescription')}
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">{t('footerQuickLinks')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">{t('home')}</a></li>
              <li><a href="/admin" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">{t('ownerPanel')}</a></li>
              <li><a href="/owner" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">{t('ownerPanel')}</a></li>
              <li><a href="/about" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">{t('about')}</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">{t('footerContact')}</h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <FaTelegram className="text-blue-500" />
                <a href="https://t.me/deepsourc" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                  @deepsourc
                </a>
              </p>
            </div>
          </div>
          
          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-4 text-lg">{t('footerFollowUs')}</h4>
            <div className="flex space-x-4 space-x-reverse text-2xl">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 hover:scale-125 hover:-translate-y-1 ${color}`}
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>© {currentYear} Deep Source News. {t('footerRights')}</p>
        </div>
      </div>
    </footer>
  )
}