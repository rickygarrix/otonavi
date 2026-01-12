import { create } from 'zustand';
import type { HomeStore } from '@/types/store';

type SearchStoreState = {
  stores: HomeStore[];
  loading: boolean;
  setStores: (stores: HomeStore[]) => void;
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