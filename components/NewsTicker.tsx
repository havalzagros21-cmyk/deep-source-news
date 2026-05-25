'use client'

import { useTranslation } from 'react-i18next'
import { FaNewspaper, FaCircle } from 'react-icons/fa'
import '../lib/i18n'

export default function NewsTicker() {
  const { t, i18n } = useTranslation()

  const currentLocale = i18n.language

  // النص المتحرك
  const newsText = currentLocale === 'ar' 
    ? 'عاجل | تطورات جديدة في المنطقة العربية | النفط يرتفع لأعلى مستوى منذ عامين | الأسهم تتراجع بشكل حاد | اجتماع طارئ في البيت الأبيض | تحديثات مباشرة من الجبهة | مفاجأة في الأسواق العالمية | '
    : currentLocale === 'en'
    ? 'BREAKING | New developments in the region | Oil reaches highest level in two years | Stocks decline sharply | Emergency meeting at the White House | Live updates from the front | Surprise in global markets | '
    : 'NÛÇEYA LEZGÎN | Pêşketinên nû li herêmê | Neft digihîje asta herî bilind | Stokên bi tûjî dakevin | Civîna acîl li Qesra Spî | Nûvekirinên rasterast | Sûrprîz li bazarên cîhanî | '

  const repeatedText = newsText.repeat(5)

  return (
    <div className="bg-gray-900/95 border-y border-red-800/30 shadow-lg overflow-hidden">
      <div className="relative">
        {/* شارة عاجل بتصميم الموقع */}
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center gap-2 bg-gradient-to-l from-red-600/90 to-transparent px-5">
          <div className="flex items-center gap-2">
            <FaNewspaper className="text-red-500 text-sm" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              {t('breaking')}
            </span>
            <FaCircle className="text-red-500 text-[6px] animate-pulse" />
          </div>
        </div>

        {/* خط فاصل */}
        <div className="absolute right-32 top-2 bottom-2 w-px bg-red-600/30 z-20"></div>

        {/* النص المتحرك */}
        <div className="overflow-hidden mr-36">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="4"
            className="text-gray-300 text-sm py-3"
          >
            {repeatedText}
          </marquee>
        </div>
      </div>
    </div>
  )
}