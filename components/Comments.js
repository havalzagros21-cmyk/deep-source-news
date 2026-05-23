'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { FaUser, FaClock, FaComment, FaPaperPlane } from 'react-icons/fa'

interface Comment {
    id: string
    author_name: string
    content: string
    created_at: string
}

export default function Comments({ newsSlug }: { newsSlug: string }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState({ name: '', content: '' })
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // جلب التعليقات
    const fetchComments = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('news_slug', newsSlug)
            .order('created_at', { ascending: false })
        
        if (data) setComments(data)
        setLoading(false)
    }

    // الاشتراك بالتحديثات المباشرة
    useEffect(() => {
        fetchComments()

        const subscription = supabase
            .channel(`comments-${newsSlug}`)
            .on('postgres_changes', 
                { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'comments',
                    filter: `news_slug=eq.${newsSlug}` 
                },
                (payload) => {
                    setComments(prev => [payload.new as Comment, ...prev])
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [newsSlug])

    // إضافة تعليق جديد
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.content.trim()) return

        setSubmitting(true)
        const { error } = await supabase
            .from('comments')
            .insert([{
                news_slug: newsSlug,
                author_name: newComment.name.trim() || 'زائر',
                content: newComment.content.trim(),
            }])

        if (!error) {
            setNewComment({ name: '', content: '' })
        }
        setSubmitting(false)
    }

    return (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaComment className="text-red-600" />
                التعليقات ({comments.length})
            </h3>

            {/* نموذج إضافة تعليق */}
            <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl mb-8">
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">الاسم (اختياري)</label>
                    <input
                        type="text"
                        value={newComment.name}
                        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="زائر"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2">التعليق *</label>
                    <textarea
                        value={newComment.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                        rows={3}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="اكتب تعليقك..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                    <FaPaperPlane /> {submitting ? 'جاري النشر...' : 'نشر التعليق'}
                </button>
            </form>

            {/* قائمة التعليقات */}
            {loading ? (
                <div className="text-center py-8 text-gray-500">جاري تحميل التعليقات...</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    لا توجد تعليقات بعد. كن أول من يعلق!
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <FaUser className="text-red-600 text-sm" />
                                </div>
                                <span className="font-bold">{comment.author_name}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <FaClock size={10} /> 
                                    {new Date(comment.created_at).toLocaleString('ar-EG')}
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pr-11">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}