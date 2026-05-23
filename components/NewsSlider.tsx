'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import { FaFire, FaNewspaper, FaChartBar, FaEye } from 'react-icons/fa'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// قائمة مرقمة مع صور
const NumberedListWithImage = ({ items, color = "text-red-600" }: any) => (
  <div className="space-y-3">
    {items.map((news: any, idx: number) => (
      <a key={news.id} href={`/news/${news.slug}`} className="flex gap-3 group hover:bg-red-50 dark:hover:bg-red-950/30 p-2 rounded-lg transition">
        {news.image && <img src={news.image} alt={news.title} className="w-12 h-12 object-cover rounded" />}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`${color} font-bold text-sm min-w-[24px]`}>{idx + 1}.</span>
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-red-600">{news.title}</h4>
          </div>
          <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
        </div>
      </a>
    ))}
  </div>
)

// مكون النص الحر الطويل
const FreeTextBlock = ({ title, icon, content, color = "text-gray-700 dark:text-gray-300" }: any) => (
  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
    <h4 className={`${color} font-bold text-base mb-4 flex items-center gap-2`}>
      {icon} {title}
    </h4>
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  </div>
)

// مكون عرض شريحة القالب الأول
const TemplateOneSlide = ({ breakingItems, mainItem, smallItems, largeItems, sideItems, economicAnalysisText, ourVisionText }: any) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    
    <div className="lg:col-span-3 order-2 lg:order-1">
      <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
        <h3 className="text-red-600 font-bold text-lg mb-4 pb-2 border-b border-red-200 dark:border-red-800 flex items-center gap-2">
          <FaFire /> أخبار عاجلة
        </h3>
        <NumberedListWithImage items={breakingItems} color="text-red-500" />
        <FreeTextBlock 
          title="التحليلات الاقتصادية" 
          icon={<FaChartBar />} 
          content={economicAnalysisText}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>

    <div className="lg:col-span-6 order-1 lg:order-2">
      {mainItem && (
        <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
          <a href={`/news/${mainItem.slug}`}>
            {mainItem.image && <img src={mainItem.image} alt={mainItem.title} className="w-full h-80 object-cover" />}
            <div className="p-5">
              <span className="text-red-500 text-xs font-bold">{mainItem.category || 'أخبار'}</span>
              <h2 className="font-bold text-2xl mt-2 line-clamp-2 group-hover:text-red-600">{mainItem.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">{mainItem.description || mainItem.content?.substring(0, 150)}...</p>
              <span className="text-gray-400 text-xs mt-3 block">{new Date(mainItem.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
          </a>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {smallItems.map((news: any) => (
          <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
            <a href={`/news/${news.slug}`} className="flex gap-3">
              {news.image && <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded" />}
              <div className="flex-1">
                <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                <h4 className="font-bold text-sm line-clamp-2 mt-1 group-hover:text-red-600">{news.title}</h4>
                <span className="text-gray-400 text-xs">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {largeItems.map((news: any) => (
          <div key={news.id} className="bg-white/50 dark:bg-gray-800/50 rounded-lg overflow-hidden hover:bg-red-50 dark:hover:bg-red-950/30 transition group">
            <a href={`/news/${news.slug}`}>
              {news.image && <img src={news.image} alt={news.title} className="w-full h-44 object-cover" />}
              <div className="p-4">
                <span className="text-red-500 text-xs font-bold">{news.category || 'أخبار'}</span>
                <h3 className="font-bold text-lg mt-2 line-clamp-2 group-hover:text-red-600">{news.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">{news.description || news.content?.substring(0, 100)}...</p>
                <span className="text-gray-400 text-xs mt-2 block">{new Date(news.created_at).toLocaleDateString('ar-EG')}</span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>

    <div className="lg:col-span-3 order-3">
      <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-xl">
        <h3 className="text-gray-700 dark:text-gray-300 font-bold text-lg mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
          <FaNewspaper /> أخبار جانبية
        </h3>
        <NumberedListWithImage items={sideItems} color="text-gray-500" />
        <FreeTextBlock 
          title="رؤيتنا" 
          icon={<FaEye />} 
          content={ourVisionText}
          color="text-purple-600 dark:text-purple-400"
        />
      </div>
    </div>
  </div>
)

export default function NewsSlider({ 
  breakingGroup, 
  mainNews, 
  smallGroups, 
  largeGroups, 
  sideGroup,
  economicAnalysisText,
  ourVisionText
}: any) {
  return (
    <div className="container-custom py-8">
      <style>{`
        .main-news-slider {
          padding-bottom: 50px !important;
        }
        .main-news-slider .swiper-pagination-bullet-active {
          background-color: #ef4444 !important;
        }
        .main-news-slider .swiper-button-next,
        .main-news-slider .swiper-button-prev {
          background-color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .main-news-slider .swiper-button-next:hover,
        .main-news-slider .swiper-button-prev:hover {
          background-color: #ef4444;
          color: white;
        }
        .main-news-slider .swiper-button-next:after,
        .main-news-slider .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .main-news-slider .swiper-button-next:hover:after,
        .main-news-slider .swiper-button-prev:hover:after {
          color: white;
        }
      `}</style>
      
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        grabCursor={true}
        className="main-news-slider"
      >
        <SwiperSlide>
          <TemplateOneSlide 
            breakingItems={breakingGroup}
            mainItem={mainNews}
            smallItems={smallGroups[0]}
            largeItems={largeGroups[0]}
            sideItems={sideGroup}
            economicAnalysisText={economicAnalysisText}
            ourVisionText={ourVisionText}
          />
        </SwiperSlide>

        <SwiperSlide>
          <TemplateOneSlide 
            breakingItems={breakingGroup.slice(0, 4)}
            mainItem={mainNews}
            smallItems={smallGroups[1]}
            largeItems={largeGroups[1]}
            sideItems={sideGroup.slice(0, 4)}
            economicAnalysisText={economicAnalysisText}
            ourVisionText={ourVisionText}
          />
        </SwiperSlide>

        <SwiperSlide>
          <TemplateOneSlide 
            breakingItems={breakingGroup.slice(0, 4)}
            mainItem={mainNews}
            smallItems={smallGroups[2]}
            largeItems={largeGroups[2]}
            sideItems={sideGroup.slice(0, 4)}
            economicAnalysisText={economicAnalysisText}
            ourVisionText={ourVisionText}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}