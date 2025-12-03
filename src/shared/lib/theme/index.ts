import { makeAutoObservable } from 'mobx'

type ThemeMode = 'light' | 'dark'

class ThemeStore {
  mode: ThemeMode = 'light'

  constructor() {
    const saved = localStorage.getItem('theme_mode')
    if (saved === 'dark' || saved === 'light') {
      this.mode = saved
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
      this.mode = prefersDark ? 'dark' : 'light'
    }

    makeAutoObservable(this)
  }

  get isDark() {
    return this.mode === 'dark'
  }

  setTheme(mode: ThemeMode) {
    this.mode = mode
    localStorage.setItem('theme_mode', mode)
  }

  toggle() {
    this.setTheme(this.isDark ? 'light' : 'dark')
  }
}

export const themeStore = new ThemeStore()

