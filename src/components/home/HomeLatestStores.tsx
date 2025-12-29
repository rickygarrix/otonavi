"use client"

import { useRouter } from "next/navigation"
import HomeStoreCard from "../home/HomeStoreCard"
import type { HomeStore } from "@/types/store"

type Props = {
  stores: HomeStore[]
}

export default function HomeLatestStores({ stores }: Props) {
  const router = useRouter()

  const latestStores = [...stores]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 3)

  if (latestStores.length === 0) return null

  return (
    <div className="w-full px-6 mt-10">
      <h2 className="text-white text-lg font-bold mb-4 text-center">
        最近更新された音箱
      </h2>

      <div className="grid grid-cols-3 gap-3 items-start">
        {latestStores.map((store) => (
          <div
            key={store.id}
            onClick={() => router.push(`/stores/${store.id}`)}
            className="
              cursor-pointer
              active:scale-95
              transition-transform
              max-w-[110px]
              w-full
              mx-auto
            "
          >
            <HomeStoreCard store={store} />
          </div>
        ))}
      </div>
    </div>
  )
}