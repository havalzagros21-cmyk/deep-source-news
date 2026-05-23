// بيانات المالك الثابتة
const OWNER_EMAIL = 'owner@deepsource.com'
const OWNER_PASSWORD = 'owner123'
const OWNER_NAME = 'مالك الموقع'

// تسجيل الدخول
export async function login(email, password) {
  // التحقق من البريد وكلمة المرور
  if (email === OWNER_EMAIL && password === OWNER_PASSWORD) {
    // تخزين بيانات المالك
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOwner', 'true')
      localStorage.setItem('ownerEmail', email)
      localStorage.setItem('ownerName', OWNER_NAME)
    }
    
    return { 
      success: true, 
      admin: { email: OWNER_EMAIL, full_name: OWNER_NAME, role: 'owner' } 
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
  }
}

// التحقق من حالة تسجيل الدخول
export function isAuthenticated() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isOwner') === 'true'
  }
  return false
}

// جلب بيانات المالك الحالي
export function getCurrentAdmin() {
  if (typeof window !== 'undefined') {
    return {
      email: localStorage.getItem('ownerEmail'),
      name: localStorage.getItem('ownerName'),
      isAuthenticated: isAuthenticated(),
    }
  }
  return { email: null, name: null, isAuthenticated: false }
}