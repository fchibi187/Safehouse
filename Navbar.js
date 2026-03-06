import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { count } = useCart()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)

  // scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close mobile on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [router.pathname])

  // close on outside click
  useEffect(() => {
    if (!mobileOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} ref={menuRef}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="LinaRoos – Home">
            <span className={styles.logoScript}>Lina</span>
            <span className={styles.logoRose}>🌸</span>
            <span className={styles.logoScript}>oos</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.navLink} ${isActive(l.href) ? styles.active : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link href="/cart" className={styles.cartBtn} aria-label={`Cart – ${count} items`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {count > 0 && <span className={styles.cartBadge}>{count}</span>}
            </Link>

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ''}`} aria-hidden={!mobileOpen}>
          <nav className={styles.mobileNav}>
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.mobileLink} ${isActive(l.href) ? styles.activeMobile : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/cart" className={`${styles.mobileLink} ${styles.mobileCart}`} style={{ animationDelay: '240ms' }}>
              Cart {count > 0 && <span className={styles.mobileBadge}>{count}</span>}
            </Link>
          </nav>

          <div className={styles.mobileFooter}>
            <p className={styles.mobileTagline}>Luxury Floral Studio</p>
            <div className={styles.mobileSocials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">FB</a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} aria-hidden />
      )}
    </>
  )
}
