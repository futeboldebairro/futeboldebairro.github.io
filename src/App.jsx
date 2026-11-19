import { useCallback, useEffect, useMemo, useState } from 'react'
import PlayerProvider from './apps/media-player/PlayerProvider'
import BootScreen from './components/BootScreen'
import Desktop from './components/Desktop'
import WelcomeBox from './components/WelcomeBox'
import { DisplayScaleContext, SCALE_OPTIONS } from './hooks/displayScale'
import useIsMobile from './hooks/useIsMobile'
import useStoredState from './hooks/useStoredState'
import { playSound } from './sounds/sounds'

/*
 * The computer's life: the boot screen, then just the wallpaper with the
 * welcome message, and only after OK the desktop itself starts, with XP's
 * startup tune (MSN signs in and everything else begins from that moment).
 * `stage` is 'boot', 'welcome' or 'running'.
 */
function App() {
  const [stage, setStage] = useState('boot')
  // Bumped when the computer "restarts" (after the virus's blue screen): a fresh desktop, a new MSN session
  const [bootCount, setBootCount] = useState(0)

  const showWelcome = useCallback(() => setStage('welcome'), [])

  // After OK the desktop appears still blurred like the welcome screen, then comes into focus.
  // The startup tune plays here: OK is a click, so the browser lets it play right away
  const [unblurring, setUnblurring] = useState(false)
  const startDesktop = useCallback(() => {
    setStage('running')
    setUnblurring(true)
    playSound('xpStartup')
  }, [])

  const reboot = useCallback(() => {
    setBootCount((count) => count + 1)
    setStage('boot')
  }, [])

  // How big the desktop is drawn, picked from the taskbar and remembered (see hooks/displayScale.js)
  // On a phone the screen is already small, so it's always drawn at 100%
  const isMobile = useIsMobile()
  const [storedScale, setScale] = useStoredState('display:scale', 1)
  const scale = !isMobile && SCALE_OPTIONS.includes(storedScale) ? storedScale : 1
  const displayScale = useMemo(() => ({ scale, setScale }), [scale, setScale])

  // Lets the stylesheets switch to the phone layout (see hooks/useIsMobile.js)
  useEffect(() => {
    document.documentElement.classList.toggle('is-mobile', isMobile)
  }, [isMobile])

  return (
    <PlayerProvider>
      <DisplayScaleContext.Provider value={displayScale}>
        {stage === 'running' && (
          // Zoomed as a whole. Percentage sizes aren't zoomed, so at 100% × 100% it still fills the screen exactly
          <div style={{ zoom: scale, width: '100%', height: '100%' }}>
            <Desktop key={bootCount} onReboot={reboot} />
          </div>
        )}
        {stage === 'running' && unblurring && (
          <div className="desktop-unblur" onAnimationEnd={() => setUnblurring(false)} />
        )}
        {stage === 'welcome' && <WelcomeBox onOk={startDesktop} />}
        {stage === 'boot' && <BootScreen onDone={showWelcome} />}
      </DisplayScaleContext.Provider>
    </PlayerProvider>
  )
}

export default App
