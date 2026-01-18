// src/stores/searchStore.ts
import { create } from 'zustand';
import type { SearchStore } from '@/types/store';

type SearchStoreState = {
  stores: SearchStore[];
  loading: boolean;
  setStores: (stores: SearchStore[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useSearchStore = create<SearchStoreState>((set) => ({
  stores: [],
  loading: false,

  setStores: (stores) => set({ stores }),
  setLoading: (loading) => set({ loading }),

  reset: () => set({ stores: [], loading: false }),
}));