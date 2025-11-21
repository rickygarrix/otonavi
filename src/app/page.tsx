'use client'

import CurvedBackground from '@/components/home/CurvedBackground'
import LogoHero from '@/components/home/LogoHero'
import HomeSlider from '@/components/home/HomeSlider'
import { useHomeStores } from '@/hooks/useHomeStores'
import SearchFilter from '@/components/home/SearchFilter'

export default function HomePage() {
  const { stores, loading } = useHomeStores()

  return (
    <>
      {/* ========================== */}
      {/* 🎨 背景カーブ内部エリア */}
      {/* ========================== */}
      <div className="relative w-full text-white overflow-hidden">

        {/* 背景（湾曲） */}
        <CurvedBackground />

        {/* ロゴ（上から 80px） */}
        <div className="mt-[80px]">
          <LogoHero />
        </div>

        {/* ロゴ → スライダー間の余白：40px */}
        <div className="mt-[40px]">
          {!loading && <HomeSlider stores={stores} />}
        </div>

        {/* 背景湾曲の底までスペース（Figma 再現用） */}
        <div className="h-[140px]" />
      </div>

      {/* ========================== */}
      {/* 🔍 CurvedBackground の外（白背景） */}
      {/* ========================== */}
      <div className="bg-white w-full py-8">
        <SearchFilter />
      </div>
    </>
  )
}