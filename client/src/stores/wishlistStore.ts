import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  originalPrice?: number | string | null;
  scale?: string | null;
  status: string;
  images?: { imageUrl: string }[];
  category?: { name: string; slug: string };
  series?: { name: string; slug: string };
}

interface WishlistState {
  items: WishlistProduct[];
  ids: number[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: WishlistProduct) => Promise<boolean>;
  removeItem: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      ids: [],
      isLoading: false,

      fetchWishlist: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        set({ isLoading: true });
        try {
          const res = await api.get('/wishlist');
          const items = res.data.data || [];
          set({
            items,
            ids: items.map((i: WishlistProduct) => i.id),
            isLoading: false,
          });
        } catch {
          set({ isLoading: false });
        }
      },

      toggleWishlist: async (product) => {
        const token = localStorage.getItem('accessToken');
        const { ids, items } = get();
        const exists = ids.includes(product.id);

        if (!token) {
          // If guest, keep in local storage
          if (exists) {
            set({
              ids: ids.filter((id) => id !== product.id),
              items: items.filter((item) => item.id !== product.id),
            });
            return false;
          } else {
            set({
              ids: [...ids, product.id],
              items: [product, ...items],
            });
            return true;
          }
        }

        // Authenticated
        try {
          const res = await api.post(`/wishlist/${product.id}`);
          const isAdded = res.data.data.isWishlisted;

          if (isAdded) {
            set({
              ids: [...ids, product.id],
              items: [product, ...items],
            });
          } else {
            set({
              ids: ids.filter((id) => id !== product.id),
              items: items.filter((item) => item.id !== product.id),
            });
          }
          return isAdded;
        } catch {
          return exists;
        }
      },

      removeItem: async (productId) => {
        const token = localStorage.getItem('accessToken');
        const { ids, items } = get();

        set({
          ids: ids.filter((id) => id !== productId),
          items: items.filter((item) => item.id !== productId),
        });

        if (token) {
          try {
            await api.delete(`/wishlist/${productId}`);
          } catch (err) {
            console.error('Error removing wishlist item:', err);
          }
        }
      },

      isWishlisted: (productId) => {
        return get().ids.includes(productId);
      },
    }),
    {
      name: 'akiba_wishlist_storage',
      partialize: (state) => ({ ids: state.ids, items: state.items }),
    }
  )
);

