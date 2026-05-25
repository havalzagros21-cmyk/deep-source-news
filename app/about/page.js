'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { FaNewspaper, FaGlobe, FaUsers, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import '../../lib/i18n'

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )
  }

  const stats = [
    { icon: FaGlobe, value: '120+', label: t('countries') },
    { icon: FaUsers, value: '50K+', label: t('readers') },
    { icon: FaChartLine, value: '10K+', label: t('articles') },
    { icon: FaCalendarAlt, value: '2024', label: t('launch') },
  ]

  return (
    <div className="container-custom py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <FaNewspaper className="text-red-600 text-3xl" />
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {t('deepSourceNews')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('footerDescription')}
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-r-4 border-red-500 pr-3">
            {t('ourVision')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('ourVisionText')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-r-4 border-red-500 pr-3">
            {t('ourMission')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {t('ourMissionText')}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-white">
              <stat.icon className="text-3xl mx-auto mb-3 opacity-80" />
              <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="text-sm opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          {t('ourValues')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">✓</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('credibility')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('credibilityText')}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">🔍</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('depth')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('depthText')}</p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 text-xl">🌍</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t('comprehensiveness')}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t('comprehensivenessText')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}