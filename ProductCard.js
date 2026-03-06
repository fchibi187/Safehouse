import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import styles from './ProductCard.module.css'

const BADGE_CLASS = {
  Bestseller: 'badge-gold',
  New: 'badge-green',
  Premium: 'badge-rose',
  Sale: 'badge-blush',
  Popular: 'badge-gold',
  Monthly: 'badge-green',
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()
    addItem(product, 1)
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={styles.card}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.img}
          priority={index < 4}
        />

        {/* Badge */}
        {product.badge && (
          <span className={`${styles.badge} badge ${BADGE_CLASS[product.badge] || 'badge-gold'}`}>
            {product.badge}
          </span>
        )}

        {/* Quick-add overlay */}
        <div className={styles.overlay}>
          <button
            onClick={handleAdd}
            className={`${styles.quickAdd} btn btn-gold`}
            aria-label={`Add ${product.name} to cart`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.desc}>{product.shortDescription}</p>

        <div className={styles.meta}>
          <div className={styles.rating}>
            <span className="stars">{'★'.repeat(Math.round(product.rating))}</span>
            <span className={styles.reviewCount}>({product.reviews})</span>
          </div>
          <div className={styles.price}>
            {product.originalPrice && (
              <span className={styles.originalPrice}>€{product.originalPrice.toFixed(2)}</span>
            )}
            <span className={styles.currentPrice}>€{product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
