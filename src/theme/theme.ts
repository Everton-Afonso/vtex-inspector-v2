const THEME_KEY = '@sds.vtex-inspector.theme'

const stored = localStorage.getItem(THEME_KEY)

const theme =
  stored === 'light' || stored === 'dark'
    ? stored
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

if (theme === 'dark') {
  document.documentElement.classList.add('dark')
}