/*
 * The animated GIF ads that filled the margins of 2000s sites: real ones,
 * rescued from GeoCities pages by the Internet Archive (GifCities), kept in
 * src/assets/gifcities. Most are Brazilian, as a Brazilian surfer would
 * have seen them.
 *
 * Neither the folder nor the file names mention "ads" or banner sizes
 * ("_160x600"): ad blockers block image URLs that look like that, and these
 * would vanish for anyone running one. The sizes live here instead.
 */
const files = import.meta.glob('../../assets/gifcities/*.gif', { eager: true, import: 'default' })

function ad(name, width, height) {
  return { name, src: files[`../../assets/gifcities/${name}.gif`], width, height }
}

export const ADS = [
  // Skyscrapers
  ad('webshots-desktop-boring', 160, 600),
  ad('napster-gazillion-tracks', 160, 600),
  ad('vanilla-coke', 160, 600),
  ad('msn-messenger-install', 160, 600),
  ad('msn-8-switch', 160, 600),
  ad('free-emoticons', 120, 600),
  ad('men-in-black-2', 120, 600),
  ad('coca-ou-pepsi', 120, 600),
  ad('anime-network-gear', 120, 600),
  ad('torres-gemeas-dvd', 160, 300),
  // Half skyscrapers
  ad('intel-pentium-4', 120, 240),
  ad('amazon-points', 120, 240),
  ad('directv-nfl', 120, 240),
  ad('classmates', 120, 240),
  ad('motorola-stay-connected', 120, 240),
  ad('dvd-squeeze', 120, 240),
  // Squares and buttons
  ad('urgent-alert-ie-not-optimized', 250, 250),
  ad('msn-messenger-6', 180, 150),
  ad('livraria-cultura', 125, 125),
  ad('icq-people-find-people', 125, 125),
  ad('buscape-cds', 125, 125),
  ad('buscape-compare-precos', 125, 125),
  ad('phantasy-star-online', 125, 125),
  ad('provedor-que-te-paga', 150, 60),
  ad('acesso-gratis-0800', 140, 60),
  ad('terra-em-tempo-real', 120, 60),
  ad('banco-real', 120, 60),
  ad('cultura-livros', 120, 60),
  ad('berlitz-ingles', 120, 60),
  ad('climatempo', 120, 60),
  ad('globo-fm', 120, 60),
  ad('windows-2000', 120, 60),
  ad('freebr-eletronica', 120, 60),
  // Banners
  ad('cade-voce', 234, 60),
  ad('msn-celine-dion-chat', 468, 60),
  ad('buscape-celulares', 468, 60),
  ad('ibazar-esperando', 468, 60),
  ad('embratel-grandes-empresas', 468, 60),
  ad('trabalhando-em-casa', 468, 60),
  ad('doenca-detectada', 468, 60),
  ad('mensagem-urgente', 468, 60),
  ad('speedy-o-unico', 468, 60),
  ad('speedy-conexao', 468, 60),
  ad('gratis-com-br', 468, 60),
  ad('ibest-acesso-gratuito', 468, 60),
  ad('yahoo-shopping-computador', 468, 60),
  ad('yahoo-shopping-bola-nike', 468, 60),
  ad('tribo-telefonia', 468, 60),
  ad('livraria-cultura-site', 468, 60),
  ad('dvd-49-reais', 468, 60),
]

// Anything up to 250px wide can go down the side of a page (the widest
// only show when the margin has room, see retro-ads.css); the rest are
// full banners for the strip beside a site's logo.
const RAIL_ADS = ADS.filter((item) => item.width <= 250)
const BANNER_ADS = ADS.filter((item) => item.width === 468)

// How tall a column of ads may get: about one skyscraper and a couple of
// buttons, so the margins don't run far past a short page
const RAIL_HEIGHT = 900
// Each ad's "publicidade" label and the gap between ads (retro-ads.css)
const AD_CHROME = 12 + 14

function shuffled(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// Fills a column from the shuffled ads, taking each one that still fits
// and removing it from `pool` so the other column can't repeat it
function fillRail(pool) {
  const rail = []
  let height = 0
  for (const item of [...pool]) {
    if (height + item.height + AD_CHROME > RAIL_HEIGHT) continue
    rail.push(item)
    height += item.height + AD_CHROME
    pool.splice(pool.indexOf(item), 1)
  }
  return rail
}

/** A random mix of ads for the two margins of a page, none repeated */
export function pickRails() {
  const pool = shuffled(RAIL_ADS)
  return { left: fillRail(pool), right: fillRail(pool) }
}

/** A random full-size banner */
export function pickBanner() {
  return BANNER_ADS[Math.floor(Math.random() * BANNER_ADS.length)]
}
