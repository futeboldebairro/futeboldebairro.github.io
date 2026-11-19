import { useState } from 'react'
import { pickBanner, pickRails } from './ads'
import './retro-ads.css'

/*
 * Showing the old ads listed in ads.js: one at a time, or a column of them
 * down each side of a page. They don't lead anywhere. Which ads show is
 * drawn at random when the page mounts, so every visit (and every reload,
 * since the browser remounts the page) shows a different mix.
 */

/** One ad, with the small "publicidade" label sites put over them */
export function RetroAd({ ad, className = '' }) {
  return (
    <div className={`retro-ad ${widthClass(ad)} ${className}`} style={{ width: ad.width }}>
      <span className="retro-ad-label">publicidade</span>
      <img src={ad.src} alt="" width={ad.width} height={ad.height} draggable={false} />
    </div>
  )
}

// Ads wider than a skyscraper only fit in a wide margin (retro-ads.css)
function widthClass(ad) {
  if (ad.width > 180) return 'retro-ad-250'
  if (ad.width > 160) return 'retro-ad-180'
  return ''
}

/** A random full-size (468x60) banner, drawn once per page load */
export function RandomBanner({ className = '' }) {
  const [ad] = useState(pickBanner)
  return <RetroAd ad={ad} className={className} />
}

/*
 * A page with a column of ads down each side, in the empty space left and
 * right of a fixed-width page. When the window is too narrow for them,
 * they simply don't show. `contentWidth` is the middle column's CSS width
 * (by default, whatever the page itself takes).
 */
export function WithSideAds({ contentWidth = 'auto', children }) {
  const [rails] = useState(pickRails)
  return (
    <div className="retro-ads-page" style={{ gridTemplateColumns: `minmax(0, 1fr) ${contentWidth} minmax(0, 1fr)` }}>
      <SideRail ads={rails.left} />
      <div className="retro-ads-content">{children}</div>
      <SideRail ads={rails.right} />
    </div>
  )
}

function SideRail({ ads }) {
  return (
    <aside className="retro-ads-rail">
      {ads.map((ad) => (
        <RetroAd key={ad.name} ad={ad} />
      ))}
    </aside>
  )
}
