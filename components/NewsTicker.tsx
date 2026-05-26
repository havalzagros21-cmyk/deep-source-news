'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { FaNewspaper } from 'react-icons/fa';

interface TickerItem {
  id: number;
  text_content_ar: string;
  text_content_en: string;
  text_content_ku: string;
  link_url: string | null;
  link_text: string | null;
  order_index: number;
  is_active: boolean;
  is_external: boolean;
}

export default function NewsTicker() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentLocale = i18n.language;

  const isRTL = currentLocale === 'ar';
  const scrollDirection = isRTL ? 1 : -1;
  const speed = 0.4;

  const fetchTickerItems = async () => {
    try {
      const { data, error } = await supabase
        .from('ticker_items')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickerItems();
    const channel = supabase
      .channel('ticker_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ticker_items' }, () => fetchTickerItems())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      fetchTickerItems();
    }
  }, [currentLocale]);

  const getText = (item: TickerItem): string => {
    if (currentLocale === 'ar') {
      return item.text_content_ar || item.text_content_en || 'خبر عاجل';
    }
    if (currentLocale === 'en') {
      return item.text_content_en || item.text_content_ar || 'Breaking News';
    }
    return item.text_content_ku || item.text_content_ar || 'Nûçe';
  };

  // حركة مستمرة بدون فراغات
  useEffect(() => {
    if (!tickerRef.current || !contentRef.current || isHovered || items.length === 0) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      if (!tickerRef.current || !contentRef.current) return;
      position += scrollDirection * speed;
      
      if (isRTL) {
        if (position >= contentRef.current.scrollWidth / 2) position = 0;
      } else {
        if (position <= -contentRef.current.scrollWidth / 2) position = 0;
      }
      
      tickerRef.current.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, items.length, scrollDirection, isRTL]);

  if (loading) {
    return (
      <div className="bg-gray-900/95 py-2">
        <div className="text-center text-gray-400 text-sm">جاري التحميل...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  // تكرار كافٍ لضمان عدم وجود فراغات
  const contentItems = [...items, ...items, ...items];

  return (
    <div
      className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* شارة "عاجل" مع نقطة متغيرة الألوان */}
        <div className={`absolute ${isRTL ? 'right-0' : 'left-0'} top-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-l from-red-600/90 to-transparent px-4 shadow-md`}>
          <FaNewspaper className="text-white text-sm" />
          <span className="font-bold text-white text-xs uppercase tracking-wider">{t('breaking')}</span>
          {/* نقطة متغيرة الألوان */}
          <div className="relative w-2 h-2">
            <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse-red"></div>
            <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse-green"></div>
            <div className="absolute inset-0 rounded-full bg-yellow-500 animate-pulse-yellow"></div>
          </div>
        </div>

        {/* خط فاصل */}
        <div className={`absolute ${isRTL ? 'right-32' : 'left-32'} top-2 bottom-2 w-px bg-red-600/30 z-20`}></div>

        {/* المحتوى المتحرك */}
        <div className={`overflow-hidden ${isRTL ? 'mr-40' : 'ml-40'} py-2.5`}>
          <div ref={tickerRef} className="whitespace-nowrap" style={{ display: 'inline-block', willChange: 'transform' }}>
            <div ref={contentRef} className="inline-block">
              {contentItems.map((item, idx) => {
                const text = getText(item);
                return (
                  <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 mx-3">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {item.link_url ? (
                      <a href={item.link_url} target={item.is_external ? '_blank' : '_self'} rel={item.is_external ? 'noopener noreferrer' : ''} className="text-gray-300 hover:text-red-400 transition text-sm md:text-base">
                        {text}
                        {item.link_text && <span className="text-red-400 text-xs ml-1">→ {item.link_text}</span>}
                      </a>
                    ) : (
                      <span className="text-gray-300 text-sm md:text-base hover:text-red-400 transition">{text}</span>
                    )}
                    <span className="text-red-600 text-lg">✦</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-red {
          0%, 100% { opacity: 1; background-color: #ef4444; }
          33% { opacity: 0.3; background-color: #ef4444; }
        }
        @keyframes pulse-green {
          0%, 100% { opacity: 0.3; background-color: #22c55e; }
          33% { opacity: 1; background-color: #22c55e; }
          66% { opacity: 0.3; background-color: #22c55e; }
        }
        @keyframes pulse-yellow {
          0%, 100% { opacity: 0.3; background-color: #eab308; }
          66% { opacity: 1; background-color: #eab308; }
        }
        .animate-pulse-red {
          animation: pulse-red 1.5s ease-in-out infinite;
        }
        .animate-pulse-green {
          animation: pulse-green 1.5s ease-in-out infinite;
        }
        .animate-pulse-yellow {
          animation: pulse-yellow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}