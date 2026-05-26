'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../lib/supabase';
import { FaNewspaper, FaCalendarAlt, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface DailyBriefItem {
  id: number;
  section_title_ar: string;
  section_title_en: string;
  section_title_ku: string;
  title_ar: string;
  title_en: string;
  title_ku: string;
  description_ar: string;
  description_en: string;
  description_ku: string;
  link_url: string;
  order_index: number;
  is_active: boolean;
}

export default function DailyBriefPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<DailyBriefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const currentLocale = i18n.language;

  useEffect(() => {
    const fetchBrief = async () => {
      const { data } = await supabase
        .from('daily_brief')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      setItems(data || []);
      setLoading(false);
    };
    fetchBrief();
  }, []);

  const getText = (item: DailyBriefItem, field: string): string => {
    const fieldMap: any = {
      section_title: {
        ar: item.section_title_ar,
        en: item.section_title_en,
        ku: item.section_title_ku,
      },
      title: {
        ar: item.title_ar,
        en: item.title_en,
        ku: item.title_ku,
      },
      description: {
        ar: item.description_ar,
        en: item.description_en,
        ku: item.description_ku,
      },
    };
    return fieldMap[field]?.[currentLocale] || fieldMap[field]?.ar || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container-custom">
        {/* زر العودة */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 mb-6 transition">
          <FaArrowLeft /> {t('backToHome')}
        </Link>

        {/* الهيدر */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <FaNewspaper className="text-red-600 text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            📰 {t('dailyBrief')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('dailyBriefDescription', 'أهم الأحداث والتحليلات اليومية')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
            <FaCalendarAlt />
            <span>{new Date().toLocaleDateString(currentLocale === 'en' ? 'en-US' : 'ar-EG')}</span>
          </div>
        </div>

        {/* المحتوى */}
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500">{t('noResults', 'لا توجد عناصر في الجريدة اليومية حالياً')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-red-500 text-sm font-bold uppercase tracking-wider">
                    {getText(item, 'section_title')}
                  </span>
                  <FaExternalLinkAlt className="text-gray-400 group-hover:text-red-500 text-sm transition" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-red-600 transition">
                  {getText(item, 'title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  {getText(item, 'description')}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-red-500 font-medium">
                  <span>{t('readMore')}</span>
                  <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* الفوتر */}
        <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300">
            📌 {t('dailyBriefFooter', 'يتم تحديث الجريدة يومياً بأهم الأخبار والتحليلات')}
          </p>
        </div>
      </div>
    </div>
  );
}