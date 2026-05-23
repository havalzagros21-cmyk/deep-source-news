// lib/auth.ts

// بيانات المالك الثابتة
const OWNER_EMAIL = 'owner@deepsource.com'
const OWNER_PASSWORD = 'owner123'
const OWNER_NAME = 'مالك الموقع'
const OWNER_ID = 1
const OWNER_ROLE = 'owner'

// دالة مساعدة لإرسال حدث تغيير حالة المصادقة
const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    // إرسال حدث مخصص يمكن للمكونات الاستماع إليه
    window.dispatchEvent(new Event('authChange'))
    
    // أيضاً إرسال حدث تغيير في localStorage للمكونات الأخرى
    const event = new StorageEvent('storage', {
      key: 'admin',
      newValue: localStorage.getItem('admin'),
      oldValue: null,
      storageArea: localStorage,
    })
    window.dispatchEvent(event)
  }
}

// تسجيل الدخول
export async function login(email: string, password: string) {
  // التحقق من البريد وكلمة المرور
  if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
    // إنشاء كائن المدير بنفس التنسيق المستخدم في OwnerPage
    const adminData = {
      id: OWNER_ID,
      username: email.split('@')[0],
      name: OWNER_NAME,
      role: OWNER_ROLE,
      email: OWNER_EMAIL,
    }
    
    // تخزين بيانات المالك (بصيغتين للتوافق)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOwner', 'true')
      localStorage.setItem('ownerEmail', email)
      localStorage.setItem('ownerName', OWNER_NAME)
      localStorage.setItem('admin', JSON.stringify(adminData))
    }
    
    // إرسال حدث التغيير
    emitAuthChange()
    
    return { 
      success: true, 
      admin: adminData
    }
  }
  
  return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
}

// تسجيل الخروج
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isOwner')
    localStorage.removeItem('ownerEmail')
    localStorage.removeItem('ownerName')
    localStorage.removeItem('admin')
  }
  
  // إرسال حدث التغيير
  emitAuthChange()
}

// التحقق من حالة تسجيل الدخول
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    // التحقق من وجود أي من المفاتيح (للتوافق مع الإصدارات السابقة)
    return localStorage.getItem('isOwner') === 'true' || localStorage.getItem('admin') !== null
  }
  return false
}

// جلب بيانات المالك الحالي
export function getCurrentAdmin(): { email: string | null; name: string | null; isAuthenticated: boolean; role?: string; id?: number } {
  if (typeof window !== 'undefined') {
    // محاولة جلب البيانات من admin أولاً
    const adminStr = localStorage.getItem('admin')
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr)
        return {
          id: admin.id,
          email: admin.email || admin.username + '@deepsource.com',
          name: admin.name,
          role: admin.role,
          isAuthenticated: true,
        }
      } catch (e) {
        console.error('خطأ في قراءة بيانات admin')
      }
    }
    
    // الرجوع إلى البيانات القديمة
    return {
      email: localStorage.getItem('ownerEmail'),
      name: localStorage.getItem('ownerName'),
      isAuthenticated: isAuthenticated(),
      role: 'owner',
    }
  }
  return { email: null, name: null, isAuthenticated: false }
}

// الحصول على دور المستخدم الحالي
export function getCurrentUserRole(): string | null {
  if (typeof window !== 'undefined') {
    const adminStr = localStorage.getItem('admin')
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr)
        return admin.role
      } catch (e) {
        return null
      }
    }
    return isAuthenticated() ? 'owner' : null
  }
  return null
}