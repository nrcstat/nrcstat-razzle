import { isClient } from '../../../util/utils'

/**
 * Cap a table widget to its TRUE available layout width so a pathological
 * CSS-grid / flexbox ancestor can't force it wider than the column it lives in.
 *
 * Context: when the widget is embedded in a `display:grid`/`flex` item whose
 * `min-width` resolves to `auto`/`100%` (e.g. the NRC CMS article layout, where
 * `.bottom-content` sits in an auto implicit grid column), the item refuses to
 * shrink below the table's intrinsic min-content width. Our container
 * (`width:auto`) faithfully fills that over-wide item, so DataTables Responsive
 * measures too much space and barely collapses — overflowing not just the
 * viewport but the article's content column. Capping the container's max-width
 * to the real available width breaks that loop; Responsive then recalculates
 * against the constrained width and collapses columns to fit.
 *
 * Detecting "available width": the blown ancestors all share the container's
 * over-wide clientWidth. We walk up and find the first ancestor whose
 * clientWidth is meaningfully smaller — that's the correctly-sized layout
 * container (e.g. the grid container `.news-article__main-content`). Its inner
 * (content-box) width is the space actually available to the widget. We then
 * bound it by `document.documentElement.clientWidth` as a safety net (the
 * available width can never legitimately exceed the viewport, and a narrow
 * mobile parent with `min-width:100%` can otherwise mis-measure).
 *
 * In a normal block-flow embed the container already equals its parent's width
 * (no blown ancestor), so no ancestor is narrower, we fall back to the viewport
 * bound, and the cap never shrinks the widget below its rightful column width.
 *
 * The generic widgets additionally cap their inner `.nrcstat-table-widget` to
 * 600px; that is a different element from the container we touch here, so this
 * cap leaves the 600px card untouched.
 *
 * @param {Element} el  any element inside the widget (the closest
 *                      `.nrcstat__static-table__container` is what gets capped)
 * @param {object}  ft  the DataTables API instance, for recalc after resize
 */
export default function fitWidgetToViewport(el, ft) {
  if (!isClient() || !el) return

  const container =
    (el.closest && el.closest('.nrcstat__static-table__container')) || el

  const availableWidth = () => {
    const viewport = document.documentElement.clientWidth

    // Find the nearest ancestor that is narrower than the container. The blown
    // grid/flex item(s) share the container's width; the first narrower
    // ancestor is the correctly-sized layout container. A small tolerance
    // avoids treating sub-pixel/border rounding as a real narrowing.
    const containerWidth = container.getBoundingClientRect().width
    let stableInner = null
    let node = container.parentElement
    while (node && node !== document.documentElement) {
      if (node.clientWidth + 1 < containerWidth) {
        const cs = window.getComputedStyle(node)
        stableInner =
          node.clientWidth -
          (parseFloat(cs.paddingLeft) || 0) -
          (parseFloat(cs.paddingRight) || 0)
        break
      }
      node = node.parentElement
    }

    // Bound by the viewport as a safety net; if no narrower ancestor was found
    // the widget isn't being blown out, so the viewport bound is what applies.
    if (stableInner == null) return viewport
    return Math.min(stableInner, viewport)
  }

  const apply = () => {
    if (!container.isConnected) return
    // Clear any previous cap so the measurement reflects the natural layout.
    container.style.maxWidth = ''
    const width = availableWidth()
    if (width > 0) container.style.maxWidth = width + 'px'
    try {
      ft.columns.adjust()
      if (ft.responsive) ft.responsive.recalc()
    } catch (e) {
      /* table may have been torn down (e.g. re-render); ignore */
    }
  }

  apply()

  let raf = null
  window.addEventListener('resize', () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(apply)
  })
}
