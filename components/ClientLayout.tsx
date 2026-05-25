'use client'

import { useEffect, useState } from 'react'
import '../lib/i18n'  // تغيير المسار إلى i18n.ts

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}