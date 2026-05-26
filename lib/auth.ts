// lib/auth.ts

import { supabase } from './supabase'

// دالة مساعدة لإرسال حدث تغيير حالة المصادقة
const emitAuthChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('authChange'))
    const event = new StorageEvent('storage', {
      key: 'admin',
      newValue: localStorage.getItem('admin'),
      oldValue: null,
      storageArea: localStorage,
    })
    window.dispatchEvent(event)
  }
}

// تسجيل الدخول من قاعدة البيانات
export async function login(email: string, password: string) {
  try {
    // جلب بيانات المستخدم من قاعدة البيانات
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !data) {
      console.error('خطأ في جلب المستخدم:', error)
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    // التحقق من كلمة المرور (مشفر بـ base64)
    const hashedPassword = btoa(password)
    
    if (data.password_hash !== hashedPassword) {
      return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }
    }

    // إعداد بيانات الجلسة
    const adminData = {
      id: data.id,
      email: data.email,
      name: data.full_name,
      role: data.role,
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOwner', data.role === 'owner' ? 'true' : 'true')
      localStorage.setItem('ownerEmail', data.email)
      localStorage.setItem('ownerName', data.full_name)
      localStorage.setItem('admin', JSON.stringify(adminData))
    }
    
    emitAuthChange()
    
    return { 
      success: true, 
      admin: adminData
    }
  } catch (err) {
    console.error('خطأ في تسجيل الدخول:', err)
    return { success: false, error: 'حدث خطأ أثناء محاولة تسجيل الدخول' }
  }
}

// تسجيل الخروج
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isOwner')
    localStorage.removeItem('ownerEmail')
    localStorage.removeItem('ownerName')
    localStorage.removeItem('admin')
  }
  
  emitAuthChange()
}

// التحقق من حالة تسجيل الدخول
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isOwner') === 'true' || localStorage.getItem('admin') !== null
  }
  return false
}

// جلب بيانات المالك الحالي
export function getCurrentAdmin(): { email: string | null; name: string | null; isAuthenticated: boolean; role?: string; id?: number } {
  if (typeof window !== 'undefined') {
    const adminStr = localStorage.getItem('admin')
    if (adminStr) {
      try {
        const admin = JSON.parse(adminStr)
        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          isAuthenticated: true,
        }
      } catch (e) {
        console.error('خطأ في قراءة بيانات admin')
      }
    }
    
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