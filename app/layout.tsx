import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ClientLayout from '../components/ClientLayout'

export const metadata = {
  title: 'ديب سورس نيوز | تحليلات معمقة',
  description: 'منصة إعلامية تقدم تحليلات معمّقة للأحداث السياسية والأمنية والعسكرية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <ClientLayout>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}