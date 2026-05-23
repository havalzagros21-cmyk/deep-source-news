import { FaTelegram, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: FaTelegram, href: 'https://t.me/deepsourc', label: 'Telegram', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-700' },
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
  ]

  return (
    <footer className="bg-gray-900 text-white mt-0 pt-0">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              ديب <span className="text-red-500">سورس</span> نيوز
            </h3>
            <p className="text-gray-400 leading-relaxed">
              منصة إعلامية تقدم تحليلات معمّقة للأحداث السياسية والأمنية والعسكرية، 
              مع تركيز على كشف خلفيات التطورات الإقليمية والدولية برؤية واقعية واحترافية.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-lg">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">الرئيسية</a></li>
              <li><a href="/admin" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">لوحة التحكم</a></li>
              <li><a href="/owner" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">لوحة المالك</a></li>
              <li><a href="/about" className="hover:text-red-500 transition-colors duration-200 hover:translate-x-1 inline-block">عن الموقع</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-lg">تواصل معنا</h4>
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
            <h4 className="font-bold mb-4 text-lg">تابعنا</h4>
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
          <p>© {currentYear} ديب سورس نيوز. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}