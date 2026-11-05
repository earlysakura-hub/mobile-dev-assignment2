import React, { createContext, useContext, useState } from 'react';

export type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

export const WishlistContext = createContext<WishlistState | null>(null);

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('WishlistContext not found');
  return context;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(['wukong', 'ace']);
  const value: WishlistState = {
    ids,
    toggle: (id) => setIds((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]),
    remove: (id) => setIds((current) => current.filter((x) => x !== id)),
  };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
