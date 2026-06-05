/* ===========================================================================
 * TEMPORARY THEME SWITCHER — REMOVE WHEN A FINAL TABLE DESIGN IS CHOSEN
 * ---------------------------------------------------------------------------
 * Cycles through the candidate table skins, either by:
 *   • clicking the floating button (bottom-right), or
 *   • pressing the "v" key.
 *
 *   1. "Liquid Glass"     → no class on <html>
 *   2. "Material Design"  → <html class="nrcstat-theme-material">
 *   3. "Hybrid"           → <html class="nrcstat-theme-hybrid">
 *
 * The choice is persisted in localStorage so it survives reloads while you
 * evaluate. A small toast confirms the active skin.
 *
 * TO REMOVE LATER (once you've picked a design):
 *   1. delete this file
 *   2. delete the line `import './themeSwitcher'` in StaticTable.js
 *   3. delete the "MATERIAL DESIGN THEME", "HYBRID THEME" and
 *      "THEME SWITCHER UI" blocks at the bottom of StaticTable.scss
 *   (If you keep a non-default skin, see the note in StaticTable.scss.)
 * ========================================================================= */

import { isClient } from '../../util/utils'

const STORAGE_KEY = 'nrcstat-table-theme'

// Ordered cycle. `cls` is the class applied to <html> ('' = Liquid Glass default).
const THEMES = [
  { key: 'glass', cls: '', label: 'Liquid Glass' },
  { key: 'material', cls: 'nrcstat-theme-material', label: 'Material Design' },
  { key: 'hybrid', cls: 'nrcstat-theme-hybrid', label: 'Hybrid' },
]
const ALL_CLASSES = THEMES.map((t) => t.cls).filter(Boolean)

function themeByKey(key) {
  return THEMES.find((t) => t.key === key) || THEMES[0]
}

function currentTheme() {
  const html = document.documentElement
  return (
    THEMES.find((t) => t.cls && html.classList.contains(t.cls)) || THEMES[0]
  )
}

function apply(key) {
  const html = document.documentElement
  html.classList.remove(...ALL_CLASSES)
  const theme = themeByKey(key)
  if (theme.cls) html.classList.add(theme.cls)
  updateButton()
}

function showToast(label) {
  let el = document.getElementById('nrcstat-theme-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'nrcstat-theme-toast'
    document.body.appendChild(el)
  }
  el.textContent = label
  el.setAttribute('data-show', '1')
  clearTimeout(el._hideTimer)
  el._hideTimer = setTimeout(() => el.setAttribute('data-show', '0'), 1400)
}

function cycle() {
  const idx = THEMES.indexOf(currentTheme())
  const next = THEMES[(idx + 1) % THEMES.length]
  apply(next.key)
  try {
    localStorage.setItem(STORAGE_KEY, next.key)
  } catch (e) {
    /* ignore */
  }
  showToast(next.label)
}

function updateButton() {
  const btn = document.getElementById('nrcstat-theme-switch')
  if (!btn) return
  btn.textContent = 'Design: ' + currentTheme().label
}

function ensureButton() {
  if (document.getElementById('nrcstat-theme-switch')) return
  const btn = document.createElement('button')
  btn.id = 'nrcstat-theme-switch'
  btn.type = 'button'
  btn.title = 'Click (or press "v") to cycle table designs'
  btn.setAttribute('aria-label', 'Cycle table design')
  btn.addEventListener('click', cycle)
  document.body.appendChild(btn)
  updateButton()
}

if (isClient() && !window.__nrcstatThemeSwitcherInstalled) {
  window.__nrcstatThemeSwitcherInstalled = true

  const init = () => {
    try {
      apply(localStorage.getItem(STORAGE_KEY) || 'glass')
    } catch (e) {
      /* localStorage may be unavailable (private mode); ignore */
    }
    ensureButton()
  }

  if (document.body) init()
  else document.addEventListener('DOMContentLoaded', init)

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'v' && e.key !== 'V') return
    // Don't hijack "v" while the user is typing in a field.
    const tag = (e.target && e.target.tagName) || ''
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag)) return
    if (e.target && e.target.isContentEditable) return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    cycle()
  })
}
