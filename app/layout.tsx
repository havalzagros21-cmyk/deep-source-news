import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import './globals.css';

// تحديد اللغة الافتراضية
const defaultLocale = 'ar';
const locales = ['ar', 'en', 'ku'];

interface RootLayoutProps {
  children: ReactNode;
  params?: { locale?: string };
}

// هذا الـ Layout الرئيسي سيعيد توجيه المستخدم إلى المسار مع اللغة
export default function RootLayout({ children, params }: RootLayoutProps) {
  // التحقق من وجود اللغة في المسار
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const firstSegment = pathname.split('/')[1];
  
  // إذا كان المستخدم في المسار الرئيسي (بدون لغة)، نعيد التوجيه إلى العربية
  if (typeof window !== 'undefined' && !locales.includes(firstSegment as any)) {
    redirect(`/${defaultLocale}${pathname}`);
  }

  // هذا الـ Layout لا يستخدم html و body مباشرة
  // لأن ملف [locale]/layout.tsx هو من سيتولى ذلك
  return <>{children}</>;
}