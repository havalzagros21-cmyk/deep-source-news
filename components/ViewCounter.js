'use client'

import { useEffect } from 'react'
import { FaEye } from 'react-icons/fa'

export default function ViewCounter({ views }) {
  return (
    <span className="flex items-center gap-1">
      <FaEye /> {views} مشاهدة
    </span>
  )
}