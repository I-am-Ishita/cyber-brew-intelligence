// Simple localStorage-backed store for the prototype.
// A real backend would replace this without touching UI code.

import { useSyncExternalStore } from "react";

export type UserState = {
  isAuthed: boolean;
  name: string;
  email: string;
  role: string | null;
  follows: string[];
  bookmarks: string[];
  bookmarkedCves: string[];
  liked: string[];
  reading: string[]; // article ids in progress
  history: string[];
  onboarded: boolean;
  notifications: {
    breaking: boolean;
    dailyBrief: boolean;
    criticalCves: boolean;
    watchlist: boolean;
    weather: boolean;
    topics: boolean;
    breaches: boolean;
  };
  theme: "dark" | "light";
};

const KEY = "cyberbrew.state.v1";
const DEFAULT: UserState = {
  isAuthed: false,
  name: "",
  email: "",
  role: null,
  follows: [],
  bookmarks: [],
  bookmarkedCves: [],
  liked: [],
  reading: [],
  history: [],
  onboarded: false,
  notifications: {
    breaking: true,
    dailyBrief: true,
    criticalCves: true,
    watchlist: true,
    weather: true,
    topics: true,
    breaches: true,
  },
  theme: "dark",
};

let state: UserState = DEFAULT;
const listeners = new Set<() => void>();

function load(): UserState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

let hydrated = false;
export function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  state = load();
  hydrated = true;
  applyTheme();
}

function applyTheme() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (state.theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function getState(): UserState {
  ensureHydrated();
  return state;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: UserState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getState()),
    () => selector(DEFAULT),
  );
}

export const actions = {
  login(name: string, email: string) {
    state = { ...state, isAuthed: true, name, email };
    persist();
  },
  logout() {
    state = { ...state, isAuthed: false };
    persist();
  },
  setRole(role: string) {
    state = { ...state, role };
    persist();
  },
  toggleFollow(item: string) {
    const follows = state.follows.includes(item)
      ? state.follows.filter((f) => f !== item)
      : [...state.follows, item];
    state = { ...state, follows };
    persist();
  },
  completeOnboarding() {
    state = { ...state, onboarded: true };
    persist();
  },
  toggleBookmark(id: string) {
    const list = state.bookmarks.includes(id)
      ? state.bookmarks.filter((x) => x !== id)
      : [...state.bookmarks, id];
    state = { ...state, bookmarks: list };
    persist();
  },
  toggleCveBookmark(id: string) {
    const list = state.bookmarkedCves.includes(id)
      ? state.bookmarkedCves.filter((x) => x !== id)
      : [...state.bookmarkedCves, id];
    state = { ...state, bookmarkedCves: list };
    persist();
  },
  toggleLike(id: string) {
    const list = state.liked.includes(id)
      ? state.liked.filter((x) => x !== id)
      : [...state.liked, id];
    state = { ...state, liked: list };
    persist();
  },
  markRead(id: string) {
    const history = [id, ...state.history.filter((x) => x !== id)].slice(0, 40);
    state = { ...state, history };
    persist();
  },
  addReading(id: string) {
    const reading = [id, ...state.reading.filter((x) => x !== id)].slice(0, 8);
    state = { ...state, reading };
    persist();
  },
  toggleNotification(key: keyof UserState["notifications"]) {
    state = {
      ...state,
      notifications: { ...state.notifications, [key]: !state.notifications[key] },
    };
    persist();
  },
  setTheme(theme: "dark" | "light") {
    state = { ...state, theme };
    persist();
    applyTheme();
  },
  reset() {
    state = DEFAULT;
    persist();
  },
};