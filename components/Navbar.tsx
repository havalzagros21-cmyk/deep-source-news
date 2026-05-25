'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { FaBars, FaTimes, FaTelegram, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { isAuthenticated, logout } from '../lib/auth'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import '../lib/i18n'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // منع الـ hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAuthStatus = useCallback(() => {
    setIsOwner(isAuthenticated())
    try {
      const admin = localStorage.getItem('admin')
      if (admin) {
        const adminData = JSON.parse(admin)
        setAdminName(adminData.name || '')
      }
    } catch (e) {
      console.error('خطأ في قراءة بيانات المدير')
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsOwner(false)
    setAdminName('')
    setIsOpen(false)
    router.push('/')
  }

  useEffect(() => {
    checkAuthStatus()

    const isDark = localStorage.getItem('theme') === 'dark'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin') {
        checkAuthStatus()
      }
    }

    const handleAuthChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authChange', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [checkAuthStatus])

  const toggleTheme = () => {
    const newDark = !darkMode
    setDarkMode(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    if (newDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // الروابط العامة
  const publicLinks = [
    { name: mounted ? t('home') : 'الرئيسية', href: '/' },
    { name: mounted ? t('politics') : 'سياسة', href: '/category/politics' },
    { name: mounted ? t('economy') : 'اقتصاد', href: '/category/economy' },
    { name: mounted ? t('tech') : 'تكنولوجيا', href: '/category/tech' },
    { name: mounted ? t('opinions') : 'آراء', href: '/category/opinions' },
    { name: mounted ? t('zodiac') : 'أبراج الفلك', href: '/category/zodiac' },
    { name: mounted ? t('misc') : 'منوعات', href: '/category/misc' },
    { name: mounted ? t('about') : 'عن الموقع', href: '/about' },
  ]

  const adminLinks = [
    { name: mounted ? t('ownerPanel') : 'لوحة المالك', href: '/owner' },
  ]

  const navLinks = isOwner ? [...publicLinks, ...adminLinks] : publicLinks

  // عرض بسيط قبل التحميل
  if (!mounted) {
    return (
      <nav className="bg-gray-900/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-lg">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl md:text-2xl font-bold">
              <span className="text-red-500">Deep</span>
              <span className="text-white">Source</span>
              <span className="text-gray-400 text-sm mr-1">News</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gray-900/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
          >
            <span className="text-red-500">Deep</span>
            <span className="text-white dark:text-gray-200">Source</span>
            <span className="text-gray-400 text-sm mr-1">News</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 flex-wrap">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="relative text-gray-300 hover:text-red-500 active:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-sm tracking-wide px-3 py-1.5 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            
            {isOwner && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium active:scale-95"
              >
                <FaSignOutAlt className="text-sm" />
                <span>{mounted ? t('logout') : 'تسجيل خروج'}</span>
              </button>
            )}
            
            <a 
              href="https://t.me/deepsourc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-1.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium active:scale-95"
            >
              <FaTelegram className="text-sm" />
              <span>{mounted ? t('navTelegram') : 'تليجرام'}</span>
            </a>
            
            <LanguageSwitcher />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-yellow-400 text-sm" /> : <FaMoon className="text-gray-300 text-sm" />}
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            {isOpen ? <FaTimes size={22} className="text-red-500" /> : <FaBars size={22} className="text-white" />}
          </button>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-4 border-t border-gray-800 space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="flex items-center gap-3 py-3 px-3 text-gray-300 hover:text-red-500 hover:bg-gray-800/50 active:bg-gray-700 rounded-lg transition-all duration-200 text-sm" 
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            {isOwner && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 text-sm"
              >
                <FaSignOutAlt />
                <span>{mounted ? t('logout') : 'تسجيل خروج'}</span>
              </button>
            )}
            
            <a 
              href="https://t.me/deepsourc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full my-3 w-full justify-center transition-all duration-300 active:scale-95 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <FaTelegram />
              <span>{mounted ? t('joinTelegram') : 'انضم لتليجرام'}</span>
            </a>
            
            <button
              onClick={() => {
                toggleTheme()
                setIsOpen(false)
              }}
              className="flex items-center justify-center gap-2 w-full py-2 mt-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-all duration-300 text-sm"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-300" />}
              <span>{darkMode ? (mounted ? t('lightMode') : 'الوضع الفاتح') : (mounted ? t('darkMode') : 'الوضع المظلم')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}