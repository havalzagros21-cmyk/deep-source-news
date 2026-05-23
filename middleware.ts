import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  locales: ['ar', 'en', 'ku'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed',
});
 
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};