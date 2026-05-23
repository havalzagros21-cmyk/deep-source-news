'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
      
      setResult(data)
      setError(error?.message || null)
    }
    
    testConnection()
  }, [])

  return (
    <div className="container-custom py-20">
      <h1 className="text-2xl font-bold mb-4">اختبار قاعدة البيانات</h1>
      {error && <div className="bg-red-100 p-4 rounded mb-4">خطأ: {error}</div>}
      {result && (
        <div className="bg-green-100 p-4 rounded">
          <p>✅ تم الاتصال بقاعدة البيانات بنجاح!</p>
          <pre className="mt-4 bg-gray-800 text-white p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}