// lib/translate.ts

// ترجمة نص واحد باستخدام Google Translate API
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') return text
  if (targetLang === 'ar') return text
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data && data[0]) {
      return data[0].map((item: any) => item[0]).join('')
    }
    return text
  } catch (error) {
    console.error('خطأ في الترجمة:', error)
    return text
  }
}

// ترجمة قائمة من المقالات
export async function translateNewsList(newsList: any[], targetLang: string): Promise<any[]> {
  if (targetLang === 'ar') return newsList
  if (!newsList || newsList.length === 0) return newsList
  
  const translatedNews = await Promise.all(
    newsList.map(async (news) => ({
      ...news,
      title: await translateText(news.title, targetLang),
      description: news.description ? await translateText(news.description, targetLang) : '',
      category: news.category ? await translateText(news.category, targetLang) : '',
    }))
  )
  
  return translatedNews
}

// ترجمة خبر واحد
export async function translateSingleNews(news: any, targetLang: string): Promise<any> {
  if (targetLang === 'ar') return news
  if (!news) return news
  
  return {
    ...news,
    title: await translateText(news.title, targetLang),
    description: news.description ? await translateText(news.description, targetLang) : '',
    content: news.content ? await translateText(news.content, targetLang) : '',
    category: news.category ? await translateText(news.category, targetLang) : '',
  }
}