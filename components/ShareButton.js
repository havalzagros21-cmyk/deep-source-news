'use client'

import { FaShareAlt } from 'react-icons/fa'

export default function ShareButton({ title }) {
  const handleShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + ' - ' + window.location.href)}`, '_blank')
  }

  return (
    <button 
      onClick={handleShare}
      className="hover:text-green-600 cursor-pointer flex items-center gap-2"
    >
      <FaShareAlt /> مشاركة
    </button>
  )
}