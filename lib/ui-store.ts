"use client";

import { useSyncExternalStore } from "react";

// Tiny shared UI state (menu open), readable from any client island without a provider.
let menuOpen = false;
const listeners = new Set<() => void>();

export const uiStore = {
  getMenuOpen: () => menuOpen,
  setMenuOpen(value: boolean) {
    if (value === menuOpen) return;
    menuOpen = value;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useMenuOpen(): boolean {
  return useSyncExternalStore(uiStore.subscribe, uiStore.getMenuOpen, () => false);
}
