import { useRef, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
// How strongly one wheel notch (~100 deltaY) zooms
const ZOOM_PER_WHEEL_UNIT = 0.0015

/**
 * Photo-viewer style navigation: the wheel zooms in and out around the
 * cursor, and dragging moves the picture around. On a touch screen two
 * fingers pinch to zoom, around the point between them.
 *
 * Returns the CSS `transform` to apply to the content and the handlers for
 * the element that should catch the wheel and drags.
 */
function usePanZoom() {
  // Zoom and position change together, so they live in one state (trackpads send many wheel events at once)
  const [view, setView] = useState({ zoom: MIN_ZOOM, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)
  // Every finger (or the mouse) currently pressed on the view, by pointer id
  const pointers = useRef(new Map())
  // How far apart the two fingers of a pinch were at the last move
  const pinchDistance = useRef(null)

  // Zooms by `zoomFactor`, keeping the point at (x, y) in the view's pixels where it is on screen
  function zoomAround(element, x, y, zoomFactor) {
    const bounds = element.getBoundingClientRect()
    // Measured from the middle of the view (where the content's transform origin is)
    const cursorX = x - (bounds.left + bounds.width / 2)
    const cursorY = y - (bounds.top + bounds.height / 2)

    setView((current) => {
      const zoom = clamp(current.zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM)
      // Back to normal size: recenter, so the picture never ends up lost off to one side
      if (zoom === MIN_ZOOM) return { zoom, x: 0, y: 0 }
      // Keep the point under the cursor in place while zooming
      const ratio = zoom / current.zoom
      return {
        zoom,
        x: cursorX - (cursorX - current.x) * ratio,
        y: cursorY - (cursorY - current.y) * ratio,
      }
    })
  }

  function handleWheel(event) {
    zoomAround(event.currentTarget, event.clientX, event.clientY, Math.exp(-event.deltaY * ZOOM_PER_WHEEL_UNIT))
  }

  // Starts moving the picture with the pointer at (x, y)
  function startDrag(x, y) {
    drag.current = { x: x - view.x, y: y - view.y }
    setDragging(true)
  }

  function handlePointerDown(event) {
    // Buttons on top of the view keep working normally
    if (event.target.closest('button')) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointers.current.size === 2) {
      // A second finger: stop moving, start pinching
      drag.current = null
      pinchDistance.current = distanceBetween(...pointers.current.values())
    } else if (pointers.current.size === 1) {
      startDrag(event.clientX, event.clientY)
    }
  }

  function handlePointerMove(event) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.current.size === 2 && pinchDistance.current) {
      const [a, b] = pointers.current.values()
      const distance = distanceBetween(a, b)
      zoomAround(event.currentTarget, (a.x + b.x) / 2, (a.y + b.y) / 2, distance / pinchDistance.current)
      pinchDistance.current = distance
      return
    }
    if (!drag.current) return
    const { x, y } = drag.current
    setView((current) => ({ ...current, x: event.clientX - x, y: event.clientY - y }))
  }

  function handlePointerUp(event) {
    pointers.current.delete(event.pointerId)
    pinchDistance.current = null
    // Lifting one finger of a pinch carries on moving with the other one
    const [remaining] = pointers.current.values()
    if (remaining) {
      startDrag(remaining.x, remaining.y)
    } else {
      drag.current = null
      setDragging(false)
    }
  }

  return {
    dragging,
    transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
  }
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default usePanZoom
