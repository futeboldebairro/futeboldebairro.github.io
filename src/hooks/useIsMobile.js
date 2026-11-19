import { useSyncExternalStore } from 'react'

/*
 * Whether the site is shown in its phone layout: a narrow screen, or a
 * short touch screen (a phone held sideways). There the desktop turns into
 * a "simple task" OS: every window opens maximized, nothing is dragged or
 * resized, and the sidebar's links move onto the desktop.
 *
 * App.jsx also mirrors this as the `is-mobile` class on <html>, so the
 * stylesheets can follow the same rule without repeating the query.
 */
const MOBILE_QUERY = '(max-width: 768px), (max-height: 500px) and (pointer: coarse)'

function subscribe(onChange) {
  const media = window.matchMedia(MOBILE_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function isMobileNow() {
  return window.matchMedia(MOBILE_QUERY).matches
}

function useIsMobile() {
  return useSyncExternalStore(subscribe, isMobileNow, () => false)
}

export default useIsMobile
