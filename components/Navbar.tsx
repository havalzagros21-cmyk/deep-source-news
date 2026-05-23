'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaTelegram, FaMoon, FaSun } from 'react-icons/fa'
import { isAuthenticated } from '../lib/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    setIsOwner(isAuthenticated())
    const isDark = localStorage.getItem('theme') === 'dark'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

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
    { name: 'الرئيسية', href: '/' },
    { name: 'سياسة', href: '/category/politics' },
    { name: 'اقتصاد', href: '/category/economy' },
    { name: 'تكنولوجيا', href: '/category/tech' },
    { name: 'آراء', href: '/category/opinions' },
    { name: 'أبراج الفلك', href: '/category/zodiac' },
    { name: 'منوعات', href: '/category/misc' },
    { name: 'عن الموقع', href: '/about' },
  ]

  // روابط الإدارة (تظهر فقط للمالك)
  const adminLinks = [
    { name: 'لوحة التحكم', href: '/admin' },
    { name: 'لوحة المالك', href: '/owner' },
  ]

  const navLinks = isOwner ? [...publicLinks, ...adminLinks] : publicLinks

  return (
    <nav className="bg-gray-900/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl md:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity duration-300 flex-shrink-0"
          >
            <span className="text-red-500">Deep</span>
            <span className="text-white dark:text-gray-200">Source</span>
            <span className="text-gray-400 text-sm mr-1">News</span>
          </Link>

          {/* Desktop Menu - مسافة مناسبة مع تأثير الضغط */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 xl:gap-4 flex-wrap">
            {navLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="relative text-gray-300 hover:text-red-500 active:bg-gray-800 active:scale-95 transition-all duration-200 font-medium text-sm tracking-wide px-3 py-1.5 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            
            {/* Telegram Link */}
            <a 
              href="https://t.me/deepsourc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-1.5 rounded-full transition-all duration-300 hover:scale-105 text-sm font-medium active:scale-95"
            >
              <FaTelegram className="text-sm" />
              <span>تليجرام</span>
            </a>
            
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-110 active:scale-95"
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun className="text-yellow-400 text-sm" /> : <FaMoon className="text-gray-300 text-sm" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            {isOpen ? <FaTimes size={22} className="text-red-500" /> : <FaBars size={22} className="text-white" />}
          </button>
        </div>

        {/* Mobile Menu */}
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
            
            <a 
              href="https://t.me/deepsourc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full my-3 w-full justify-center transition-all duration-300 active:scale-95 text-sm"
              onClick={() => setIsOpen(false)}
            >
              <FaTelegram />
              <span>انضم لتليجرام</span>
            </a>
            
            <button
              onClick={() => {
                toggleTheme()
                setIsOpen(false)
              }}
              className="flex items-center justify-center gap-2 w-full py-2 mt-2 rounded-lg bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-all duration-300 text-sm"
            >
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-300" />}
              <span>{darkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}