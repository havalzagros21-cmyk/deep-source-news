'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import NewsCard from '../../components/NewsCard'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'

// مكون البحث الرئيسي (مع useSearchParams)
function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (initialQuery) {
      performSearch()
    }
  }, [initialQuery, category, sortBy])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('news')
      .select('category')
      .not('category', 'is', null)
    
    if (data) {
      const uniqueCategories = [...new Set(data.map(item => item.category))]
      setCategories(uniqueCategories)
    }
  }

  const performSearch = async () => {
    if (!initialQuery && !query) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    
    let searchQuery = supabase
      .from('news')
      .select('*')
      .or(`title.ilike.%${initialQuery || query}%,content.ilike.%${initialQuery || query}%,description.ilike.%${initialQuery || query}%`)

    if (category !== 'all') {
      searchQuery = searchQuery.eq('category', category)
    }

    if (sortBy === 'recent') {
      searchQuery = searchQuery.order('created_at', { ascending: false })
    } else if (sortBy === 'oldest') {
      searchQuery = searchQuery.order('created_at', { ascending: true })
    } else if (sortBy === 'most_viewed') {
      searchQuery = searchQuery.order('views', { ascending: false })
    }

    const { data } = await searchQuery
    setResults(data || [])
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const clearFilters = () => {
    setCategory('all')
    setSortBy('recent')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg py-12">
      <div className="container-custom">
        <form onSubmit={handleSearch} className="relative mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في الأخبار..."
            className="w-full p-4 pr-14 text-lg rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
            <FaSearch className="text-gray-400 text-xl hover:text-red-500 transition" />
          </button>
        </form>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg"
        >
          <FaFilter /> فلترة
        </button>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white dark:bg-cardBg rounded-xl p-4 mb-8 border border-gray-200 dark:border-gray-800`}>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm text-gray-500 ml-2">التصنيف:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-2 rounded-lg border dark:bg-gray-800"
                >
                  <option value="all">الكل</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 ml-2">ترتيب حسب:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-2 rounded-lg border dark:bg-gray-800"
                >
                  <option value="recent">الأحدث</option>
                  <option value="oldest">الأقدم</option>
                  <option value="most_viewed">الأكثر مشاهدة</option>
                </select>
              </div>
            </div>

            {(category !== 'all' || sortBy !== 'recent') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FaTimes /> إلغاء الفلترة
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-500">
            {loading ? 'جاري البحث...' : `تم العثور على ${results.length} نتيجة`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">لم نعثر على أي أخبار تطابق بحثك</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// مكون الصفحة الرئيسي مع Suspense
export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  )
}