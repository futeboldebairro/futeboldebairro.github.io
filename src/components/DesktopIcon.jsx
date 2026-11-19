import useIsMobile from '../hooks/useIsMobile'

/*
 * A desktop shortcut: single click selects it, double click opens the app.
 * On a phone a single tap opens it, like a home screen.
 * `badge` is a small icon over the bottom-right corner (web shortcuts show IE's there).
 * `icon` is an image URL; `iconElement` can be drawn instead (an SVG logo).
 * With `href` it's a link to a real page, opened in a new tab of the visitor's browser.
 */
function DesktopIcon({ icon, iconElement, badge, label, href, selected, onSelect, onOpen }) {
  const isMobile = useIsMobile()

  const picture = (
    <span
      className={`relative size-12 ${selected ? 'opacity-70 [filter:sepia(1)_hue-rotate(180deg)_saturate(4)]' : ''}`}
    >
      {iconElement ?? <img src={icon} alt="" className="size-12" draggable={false} />}
      {badge && <img src={badge} alt="" className="absolute -right-1 -bottom-1 size-5" draggable={false} />}
    </span>
  )
  const caption = (
    <span
      // XP breaks a name that is one long word, rather than letting it spill out
      className={`px-0.5 text-center leading-tight text-white [overflow-wrap:anywhere] ${
        selected ? 'bg-[#316ac5]' : '[text-shadow:1px_1px_1px_black]'
      }`}
    >
      {label}
    </span>
  )

  const shared = {
    className: 'desktop-icon flex w-[84px] flex-col items-center gap-1 p-1 outline-none',
    onPointerDown: (event) => {
      // Keep the desktop's own click handler from clearing the selection we're about to make
      event.stopPropagation()
      onSelect()
    },
  }

  if (href) {
    // A link only follows a click; on the computer it waits for the double click like any other icon
    return (
      <a
        {...shared}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        draggable={false}
        onClick={(event) => !isMobile && event.preventDefault()}
        onDoubleClick={() => !isMobile && window.open(href, '_blank', 'noopener,noreferrer')}
      >
        {picture}
        {caption}
      </a>
    )
  }

  return (
    <button type="button" {...shared} onClick={isMobile ? onOpen : undefined} onDoubleClick={isMobile ? undefined : onOpen}>
      {picture}
      {caption}
    </button>
  )
}

export default DesktopIcon
