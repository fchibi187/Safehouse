import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className="container">
          <div className={styles.grid}>

            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.logo}>
                <span className={styles.logoScript}>Lina</span>
                <span className={styles.logoRose}>🌸</span>
                <span className={styles.logoScript}>oos</span>
              </div>
              <p className={styles.tagline}>Luxury Floral Studio</p>
              <p className={styles.bio}>
                Hand-crafted bouquets and arrangements for life's most meaningful moments. Each flower chosen with intention, every bouquet tied with love.
              </p>
              <div className={styles.socials}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className={styles.social}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.132-1.867 3.132-4.563 0-2.387-1.716-4.056-4.164-4.056-2.837 0-4.502 2.126-4.502 4.324 0 .856.33 1.773.74 2.274a.3.3 0 01.069.285l-.275 1.125c-.044.181-.146.219-.337.132-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.967-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446C17.523 22 22 17.523 22 12S17.523 2 12 2z"/></svg>
                </a>
              </div>
            </div>

            {/* Shop links */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Shop</h4>
              <nav className={styles.links}>
                <Link href="/shop?category=Bouquets">Bouquets</Link>
                <Link href="/shop?category=Arrangements">Arrangements</Link>
                <Link href="/shop?category=Gift+Boxes">Gift Boxes</Link>
                <Link href="/shop?category=Subscriptions">Subscriptions</Link>
                <Link href="/shop?badge=New">New Arrivals</Link>
              </nav>
            </div>

            {/* Company */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Studio</h4>
              <nav className={styles.links}>
                <Link href="/about">Our Story</Link>
                <Link href="/about#process">Our Process</Link>
                <Link href="/contact">Contact Us</Link>
                <Link href="/contact#bespoke">Bespoke Orders</Link>
                <Link href="/contact#weddings">Weddings</Link>
              </nav>
            </div>

            {/* Contact */}
            <div className={styles.col}>
              <h4 className={styles.colTitle}>Visit Us</h4>
              <address className={styles.address}>
                <p>Bloemenlaan 12</p>
                <p>1012 AB Amsterdam</p>
                <p className={styles.addressItem}>
                  <a href="tel:+31200000000">+31 20 000 0000</a>
                </p>
                <p className={styles.addressItem}>
                  <a href="mailto:hello@linaroos.nl">hello@linaroos.nl</a>
                </p>
              </address>
              <div className={styles.hours}>
                <p><strong>Mon – Fri</strong> 09:00 – 18:00</p>
                <p><strong>Sat</strong> 10:00 – 16:00</p>
                <p><strong>Sun</strong> Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copy}>© {new Date().getFullYear()} LinaRoos. All rights reserved.</p>
            <div className={styles.legal}>
              <Link href="/privacy">Privacy Policy</Link>
              <span>·</span>
              <Link href="/terms">Terms</Link>
              <span>·</span>
              <Link href="/sitemap.xml">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
