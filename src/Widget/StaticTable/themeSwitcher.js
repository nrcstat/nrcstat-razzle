/* ===========================================================================
 * TEMPORARY THEME SWITCHER — REMOVE WHEN A FINAL TABLE DESIGN IS CHOSEN
 * ---------------------------------------------------------------------------
 * Lets reviewers flip between the two candidate skins, either by:
 *   • clicking the floating "Switch to …" button (bottom-right), or
 *   • pressing the "v" key.
 *
 *     • default  (no class on <html>)            → "Liquid Glass"
 *     • <html class="nrcstat-theme-material">     → "Material Design"
 *
 * The choice is persisted in localStorage so it survives reloads while you
 * evaluate. A small toast confirms the active theme.
 *
 * TO REMOVE LATER (once you've picked a design):
 *   1. delete this file
 *   2. delete the line `import './themeSwitcher'` in StaticTable.js
 *   3. delete the "MATERIAL DESIGN THEME" + "THEME SWITCHER UI" blocks at
 *      the bottom of StaticTable.scss
 *   (If you keep Material instead of Glass, see the note in StaticTable.scss.)
 * ========================================================================= */

import { isClient } from '../../util/utils'

const STORAGE_KEY = 'nrcstat-table-theme'
const MATERIAL_CLASS = 'nrcstat-theme-material'

function isMaterial() {
  return document.documentElement.classList.contains(MATERIAL_CLASS)
}

function apply(theme) {
  const html = document.documentElement
  if (theme === 'material') html.classList.add(MATERIAL_CLASS)
  else html.classList.remove(MATERIAL_CLASS)
  updateButton()
}

function showToast(theme) {
  let el = document.getElementById('nrcstat-theme-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'nrcstat-theme-toast'
    document.body.appendChild(el)
  }
  el.textContent = theme === 'material' ? 'Material Design' : 'Liquid Glass'
  el.setAttribute('data-show', '1')
  clearTimeout(el._hideTimer)
  el._hideTimer = setTimeout(() => el.setAttribute('data-show', '0'), 1400)
}

function toggle() {
  const next = isMaterial() ? 'glass' : 'material'
  apply(next)
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch (e) {
    /* ignore */
  }
  showToast(next)
}

function updateButton() {
  const btn = document.getElementById('nrcstat-theme-switch')
  if (!btn) return
  // Label shows what a click will switch TO.
  btn.textContent = isMaterial()
    ? 'Switch to Liquid Glass'
    : 'Switch to Material Design'
}

function ensureButton() {
  if (document.getElementById('nrcstat-theme-switch')) return
  const btn = document.createElement('button')
  btn.id = 'nrcstat-theme-switch'
  btn.type = 'button'
  btn.setAttribute('aria-label', 'Switch table design')
  btn.addEventListener('click', toggle)
  document.body.appendChild(btn)
  updateButton()
}

if (isClient() && !window.__nrcstatThemeSwitcherInstalled) {
  window.__nrcstatThemeSwitcherInstalled = true

  const init = () => {
    // Apply any persisted choice as early as possible.
    try {
      apply(localStorage.getItem(STORAGE_KEY) || 'glass')
    } catch (e) {
      /* localStorage may be unavailable (private mode); ignore */
    }
    ensureButton()
  }

  // body may not exist yet depending on when this module evaluates.
  if (document.body) init()
  else document.addEventListener('DOMContentLoaded', init)

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'v' && e.key !== 'V') return
    // Don't hijack "v" while the user is typing in a field.
    const tag = (e.target && e.target.tagName) || ''
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(tag)) return
    if (e.target && e.target.isContentEditable) return
    if (e.metaKey || e.ctrlKey || e.altKey) return // leave paste/shortcuts alone
    toggle()
  })
}
