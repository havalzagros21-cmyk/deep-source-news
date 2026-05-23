import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../globals.css';

const locales = ['ar', 'en', 'ku'];

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  // التحقق من صحة اللغة
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // جلب ملفات الترجمة
  const messages = await getMessages();
  
  // تحديد اتجاه النص حسب اللغة (العربية والكردية من اليمين لليسار)
  const direction = locale === 'ar' || locale === 'ku' ? 'rtl' : 'ltr';
  
  // تحديد لغة الواجهة
  const htmlLang = locale === 'ku' ? 'ku' : locale;

  // بيانات الـ SEO حسب اللغة
  const seoData = {
    ar: {
      title: 'ديب سورس نيوز | تحليلات معمقة',
      description: 'منصة إعلامية تقدم تحليلات معمّقة للأحداث السياسية والأمنية والعسكرية',
    },
    en: {
      title: 'Deep Source News | In-depth Analysis',
      description: 'A media platform providing in-depth analysis of political, security, and military events',
    },
    ku: {
      title: 'Deep Source News | Analîzên Kûr',
      description: 'Platfurmeke medyayê ku analîzên kûr ên bûyerên siyasî, ewlekarî û leşkerî pêşkêş dike',
    },
  };

  const currentSeo = seoData[locale as keyof typeof seoData] || seoData.ar;

  return (
    <html lang={htmlLang} dir={direction}>
      <head>
        <title>{currentSeo.title}</title>
        <meta name="description" content={currentSeo.description} />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}