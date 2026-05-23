'use client'

import { supabase } from '../../../lib/supabase'
import { FaCalendar, FaEye, FaShareAlt } from 'react-icons/fa'
import { notFound, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// دالة لاستخراج YouTube ID
function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : ''
}

// دالة لاستخراج Vimeo ID
function getVimeoId(url: string) {
    const regExp = /vimeo\.com\/(\d+)/
    const match = url.match(regExp)
    return match ? match[1] : ''
}

export default function NewsDetailPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
    const router = useRouter()
    const [news, setNews] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchNews() {
            const resolvedParams = await params
            const slug = resolvedParams.slug
            const decodedSlug = decodeURIComponent(slug)
            
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('slug', decodedSlug)
                .single()

            if (error || !data) {
                notFound()
                return
            }

            setNews(data)

            // زيادة عدد المشاهدات
            await supabase
                .from('news')
                .update({ views: (data.views || 0) + 1 })
                .eq('slug', decodedSlug)
            
            setLoading(false)
        }
        
        fetchNews()
    }, [params])

    const handleShare = () => {
        if (news) {
            window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' - ' + window.location.href)}`, '_blank')
        }
    }

    if (loading) {
        return (
            <div className="container-custom py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">جاري تحميل الخبر...</p>
            </div>
        )
    }

    if (!news) {
        return notFound()
    }

    const date = new Date(news.created_at).toLocaleDateString('ar-EG')

    return (
        <article className="container-custom py-12 max-w-4xl mx-auto">
            {/* التصنيف */}
            <span className="text-red-600 text-sm font-bold uppercase">
                {news.category || 'عام'}
            </span>
            
            {/* العنوان */}
            <h1 className="text-4xl md:text-5xl font-bold mt-4">{news.title}</h1>
            
            {/* معلومات الخبر */}
            <div className="flex items-center gap-6 mt-6 text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-6 flex-wrap">
                <span className="flex items-center gap-1">
                    <FaCalendar /> {date}
                </span>
                <span className="flex items-center gap-1">
                    <FaEye /> {news.views || 0} مشاهدة
                </span>
                <button 
                    onClick={handleShare}
                    className="hover:text-green-600 cursor-pointer flex items-center gap-1 transition-colors"
                >
                    <FaShareAlt /> مشاركة
                </button>
            </div>
            
            {/* الصورة */}
            {news.image && (
                <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full rounded-xl my-8 max-h-96 object-cover" 
                />
            )}
            
            {/* عرض الفيديو */}
            {news.video_url && news.video_type && news.video_type !== 'none' && (
                <div className="my-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        🎬 فيديو الخبر
                    </h2>
                    <div className="rounded-xl overflow-hidden bg-black">
                        {news.video_type === 'upload' && (
                            <video controls className="w-full" preload="metadata">
                                <source src={news.video_url} />
                                متصفحك لا يدعم تشغيل الفيديو
                            </video>
                        )}
                        {news.video_type === 'youtube' && (
                            <iframe 
                                src={`https://www.youtube.com/embed/${getYouTubeId(news.video_url)}`}
                                className="w-full aspect-video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                        {news.video_type === 'vimeo' && (
                            <iframe 
                                src={`https://player.vimeo.com/video/${getVimeoId(news.video_url)}`}
                                className="w-full aspect-video"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                </div>
            )}
            
            {/* المحتوى */}
            <div 
                className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: news.content }} 
            />
        </article>
    )
}