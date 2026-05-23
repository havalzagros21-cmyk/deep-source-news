import { FaTelegram, FaTwitter, FaEnvelope, FaGlobe } from 'react-icons/fa'

export const metadata = {
  title: 'عن الموقع | ديب سورس نيوز',
  description: 'تعرف على منصة ديب سورس نيوز ورؤيتنا',
}

export default function AboutPage() {
  return (
    <div className="container-custom py-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 border-r-4 border-red-600 pr-4">عن الموقع</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg leading-relaxed">
          <strong>ديب سورس نيوز</strong> هي منصة إعلامية مستقلة تقدم تحليلات معمقة 
          للأحداث السياسية والأمنية والعسكرية، مع تركيز على كشف خلفيات التطورات الإقليمية 
          والدولية برؤية واقعية واحترافية.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">رؤيتنا</h2>
        <p>
          نسعى إلى تقديم محتوى إعلامي يختلف عن السائد، حيث نغوص في التفاصيل ونكشف 
          الخلفيات التي لا تجدها في العناوين الرئيسية.
        </p>
        
        <h2 className="text-2xl font-bold mt-8">تواصل معنا</h2>
        <div className="flex flex-col gap-4 mt-4">
          <a 
            href="https://t.me/deepsourc" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            <FaTelegram /> تليجرام: @deepsourc
          </a>
        </div>
      </div>
    </div>
  )
}