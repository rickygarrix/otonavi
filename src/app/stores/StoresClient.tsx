"use client";

import { useRouter, useSearchParams } from "next/navigation";

import StoreCard from "@/components/store/StoreCard";
import Footer from "@/components/ui/Footer";
import HomeButton from "@/components/ui/HomeButton";
import BackToHomeButton from "@/components/ui/BackToHomeButton";

import { useStoresForSearch, useStoreFilters } from "@/hooks/store";
import { useHomeMasters } from "@/hooks/home";

export default function StoresClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { stores, loading } = useStoresForSearch();
  const masters = useHomeMasters();
  const labelMap = masters.externalLabelMap;

  const selectedFilters = searchParams.getAll("filters");
  const storeTypeId = searchParams.get("store_type_id");

  const { filteredStores } = useStoreFilters(stores, {
    filters: selectedFilters,
    storeTypeId,
  });

  const params = searchParams.toString();

  if (loading) {
    return <div className="pt-20 text-center">Loading...</div>;
  }

  const displayLabels: string[] = [];

  // storeTypeId（id → label）
  if (storeTypeId) {
    const storeTypeLabel = Array.from(
      masters.genericMasters.values()
    ).find(
      (m) => m.table === "store_types" && m.id === storeTypeId
    )?.label;

    if (storeTypeLabel) {
      displayLabels.push(storeTypeLabel);
    }
  }

  // filters（key → label）
  selectedFilters.forEach((key) => {
    const label = labelMap.get(key);
    if (label) displayLabels.push(label);
  });

  return (
    <div className="text-dark-5 flex min-h-screen flex-col bg-white pt-20">
      {/* ===== Header ===== */}
      <div className="fixed top-0 left-0 z-100 flex w-full justify-center">
        <header className="m-auto flex h-20 w-full max-w-105 items-center gap-4 bg-white/80 px-4 backdrop-blur-lg">
          <HomeButton />

          {/* 件数 */}
          <div className="shrink-0 text-lg font-bold tracking-widest">
            {filteredStores.length}
            <span className="ml-1 text-[10px]">件</span>
          </div>

          {/* 検索条件（label 表示） */}
          {displayLabels.length > 0 && (
            <div className="line-clamp-2 flex-1 text-xs text-blue-700">
              {displayLabels.join(", ")}
            </div>
          )}
        </header>
      </div>

      {/* ===== Store List ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {filteredStores.map((store) => (
            <div key={store.id} className="flex min-h-[250px]">
              <StoreCard store={store} query={params} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <BackToHomeButton
        onClick={() => router.push("/")}
        className="px-6 pb-8"
      />
      <Footer />
    </div>
  );
}