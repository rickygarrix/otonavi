// src/components/home/LogoHero.tsx
'use client'

import Image from 'next/image'
import React from 'react'

export default function LogoHero() {
  return (
    <div className="pt-14 pb-4 flex flex-col items-center justify-center">
      <Image
        src="/logo2.svg"
        alt="オトナビ"
        width={180}
        height={60}
        className="drop-shadow-lg"
      />
    </div>
  )
}