// src/components/home/CurvedBackground.tsx
'use client'
import React from 'react'

export default function CurvedBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <img
        src="/back.png"
        alt="background"
        className="w-full h-full object-cover"
      />
    </div>
  )
}