import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import initialProducts from '../../data/products.json'
import styles from '../../styles/Admin.module.css'

const CATEGORIES = ['Bouquets', 'Arrangements', 'Gift Boxes', 'Subscriptions']
const BADGES = ['', 'Bestseller', 'New', 'Premium', 'Sale', 'Popular', 'Monthly']
const EMPTY_PRODUCT = {
  id: '', slug: '', name: '', category: 'Bouquets', price: '', originalPrice: '',
  image: '', images: [], description: '', shortDescription: '', badge: '',
  rating: 4.9, reviews: 0, inStock: true,
  tags: [], details: { stemCount: '', size: '', vaseLife: '', occasions: [] },
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminDashboard() {
  const { authed, checking, logout } = useAdminAuth()

  // State
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('products') // 'products' | 'add' | 'settings'
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [toast, setToast] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  // Load from localStorage (persists between sessions)
  useEffect(() => {
    const saved = localStorage.getItem('lr-products')
    setProducts(saved ? JSON.parse(saved) : initialProducts)
  }, [])

  const save = (updated) => {
    setProducts(updated)
    localStorage.setItem('lr-products', JSON.stringify(updated))
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Form helpers
  const setF = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => {
      const updated = { ...f, [key]: val }
      if (key === 'name' && !editingId) updated.slug = slugify(val)
      return updated
    })
  }
  const setDetail = (key) => (e) =>
    setForm(f => ({ ...f, details: { ...f.details, [key]: e.target.value } }))
  const setTags = (e) =>
    setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))
  const setOccasions = (e) =>
    setForm(f => ({ ...f, details: { ...f.details, occasions: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } }))

  // CRUD
  const startAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_PRODUCT, id: String(Date.now()) })
    setTab('add')
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      ...product,
      originalPrice: product.originalPrice || '',
      tags: product.tags || [],
      images: product.images || [product.image],
    })
    setTab('add')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      rating: parseFloat(form.rating),
      reviews: parseInt(form.reviews, 10),
      image: form.image || (form.images[0] || ''),
      images: form.image ? [form.image, ...(form.images || []).slice(1)] : form.images,
    }
    if (editingId) {
      save(products.map(p => p.id === editingId ? cleaned : p))
      showToast('✓ Product updated')
    } else {
      save([...products, cleaned])
      showToast('✓ Product added')
    }
    setTab('products')
    setEditingId(null)
    setForm(EMPTY_PRODUCT)
  }

  const handleDelete = (id) => {
    save(products.filter(p => p.id !== id))
    setConfirmDelete(null)
    showToast('Product deleted')
  }

  const toggleStock = (id) => {
    save(products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p))
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'products.json'
    a.click()
    showToast('✓ products.json downloaded')
  }

  const resetToDefaults = () => {
    if (confirm('Reset all products to defaults? This cannot be undone.')) {
      save(initialProducts)
      showToast('Products reset to defaults')
    }
  }

  // Filtered list
  const filtered = products.filter(p => {
    const matchCat = filterCat === 'All' || p.category === filterCat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Stats
  const totalRevenue = products.reduce((s, p) => s + p.price, 0)
  const inStock = products.filter(p => p.inStock).length

  if (checking) return <div className={styles.loading}><span>🌸</span></div>
  if (!authed) return null

  return (
    <>
      <Head>
        <title>Admin Dashboard – LinaRoos</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.shell}>
        {/* ── SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <span className={styles.logoScript}>Lina</span>
            <span>🌸</span>
            <span className={styles.logoScript}>oos</span>
          </div>
          <p className={styles.sidebarLabel}>Studio Admin</p>

          <nav className={styles.sidebarNav}>
            <button className={`${styles.navBtn} ${tab === 'products' ? styles.navActive : ''}`} onClick={() => setTab('products')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Products
              <span className={styles.navBadge}>{products.length}</span>
            </button>
            <button className={`${styles.navBtn} ${tab === 'add' ? styles.navActive : ''}`} onClick={startAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              {editingId ? 'Edit Product' : 'Add Product'}
            </button>
            <button className={`${styles.navBtn} ${tab === 'settings' ? styles.navActive : ''}`} onClick={() => setTab('settings')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              Settings
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <Link href="/" target="_blank" className={styles.viewSite}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Site
            </Link>
            <button onClick={logout} className={styles.logoutBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className={styles.main}>

          {/* ── PRODUCTS TAB ── */}
          {tab === 'products' && (
            <div className={styles.tabContent}>
              <div className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Products</h1>
                  <p className={styles.pageSub}>{products.length} arrangements in your collection</p>
                </div>
                <div className={styles.topActions}>
                  <button onClick={exportJSON} className={`btn btn-ghost ${styles.exportBtn}`}>
                    ↓ Export JSON
                  </button>
                  <button onClick={startAdd} className="btn btn-primary">
                    + Add Product
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{products.length}</span>
                  <span className={styles.statLabel}>Total Products</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{inStock}</span>
                  <span className={styles.statLabel}>In Stock</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{products.length - inStock}</span>
                  <span className={styles.statLabel}>Out of Stock</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal}>€{(totalRevenue / products.length || 0).toFixed(0)}</span>
                  <span className={styles.statLabel}>Avg. Price</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statVal}>{products.reduce((s, p) => s + p.reviews, 0)}</span>
                  <span className={styles.statLabel}>Total Reviews</span>
                </div>
              </div>

              {/* Controls */}
              <div className={styles.listControls}>
                <input
                  type="search"
                  placeholder="Search products…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className={styles.listSearch}
                />
                <div className={styles.listFilters}>
                  {['All', ...CATEGORIES].map(c => (
                    <button key={c} className={`${styles.filterBtn} ${filterCat === c ? styles.filterActive : ''}`}
                      onClick={() => setFilterCat(c)}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Badge</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => (
                      <tr key={p.id} className={styles.tableRow}>
                        <td>
                          <div className={styles.productCell}>
                            {p.image && (
                              <div className={styles.productThumb}>
                                <Image src={p.image} alt={p.name} fill className={styles.productThumbImg} sizes="48px" />
                              </div>
                            )}
                            <div>
                              <p className={styles.productName}>{p.name}</p>
                              <p className={styles.productSlug}>/{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className={styles.catPill}>{p.category}</span></td>
                        <td>
                          <span className={styles.price}>€{p.price.toFixed(2)}</span>
                          {p.originalPrice && <span className={styles.origPrice}> €{p.originalPrice.toFixed(2)}</span>}
                        </td>
                        <td>
                          {p.badge && <span className={`badge badge-gold ${styles.badgePill}`}>{p.badge}</span>}
                        </td>
                        <td>
                          <button
                            className={`${styles.stockBtn} ${p.inStock ? styles.stockIn : styles.stockOut}`}
                            onClick={() => toggleStock(p.id)}
                            title="Click to toggle stock"
                          >
                            {p.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                          </button>
                        </td>
                        <td>
                          <span className={styles.rating}>★ {p.rating} <small>({p.reviews})</small></span>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button className={styles.editBtn} onClick={() => startEdit(p)} title="Edit">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <Link href={`/shop/${p.slug}`} target="_blank" className={styles.viewBtn} title="View">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Link>
                            <button className={styles.deleteBtn} onClick={() => setConfirmDelete(p.id)} title="Delete">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className={styles.emptyTable}>
                    <span>🌸</span>
                    <p>No products found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ADD / EDIT TAB ── */}
          {tab === 'add' && (
            <div className={styles.tabContent}>
              <div className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>{editingId ? 'Edit Product' : 'Add New Product'}</h1>
                  <p className={styles.pageSub}>{editingId ? `Editing: ${form.name}` : 'Fill in the details below to add a new arrangement.'}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => { setTab('products'); setEditingId(null); }}>
                  ← Back to Products
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.productForm}>
                <div className={styles.formGrid}>

                  {/* Left column */}
                  <div className={styles.formCol}>
                    <div className={styles.formSection}>
                      <h3 className={styles.formSectionTitle}>Basic Information</h3>

                      <FormField label="Product Name *">
                        <input type="text" value={form.name} onChange={setF('name')} required placeholder="e.g. Eternal Blush Bouquet" />
                      </FormField>

                      <FormField label="URL Slug *">
                        <input type="text" value={form.slug} onChange={setF('slug')} required placeholder="eternal-blush-bouquet" />
                      </FormField>

                      <FormField label="Short Description *">
                        <input type="text" value={form.shortDescription} onChange={setF('shortDescription')} required placeholder="Brief description for cards (max 80 chars)" maxLength={100} />
                      </FormField>

                      <FormField label="Full Description *">
                        <textarea value={form.description} onChange={setF('description')} required rows={5} placeholder="Detailed product description…" />
                      </FormField>

                      <FormField label="Tags (comma-separated)">
                        <input type="text" value={form.tags.join(', ')} onChange={setTags} placeholder="roses, blush, wedding, premium" />
                      </FormField>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.formSectionTitle}>Product Details</h3>
                      <div className={styles.detailsGrid}>
                        <FormField label="Stem Count">
                          <input type="text" value={form.details.stemCount} onChange={setDetail('stemCount')} placeholder="25–30 stems" />
                        </FormField>
                        <FormField label="Size">
                          <input type="text" value={form.details.size} onChange={setDetail('size')} placeholder="40–50 cm" />
                        </FormField>
                        <FormField label="Vase Life">
                          <input type="text" value={form.details.vaseLife} onChange={setDetail('vaseLife')} placeholder="7–10 days" />
                        </FormField>
                        <FormField label="Occasions (comma-separated)">
                          <input type="text" value={Array.isArray(form.details.occasions) ? form.details.occasions.join(', ') : ''} onChange={setOccasions} placeholder="Wedding, Anniversary" />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  {/* Right column */}
                  <div className={styles.formCol}>
                    <div className={styles.formSection}>
                      <h3 className={styles.formSectionTitle}>Pricing & Category</h3>

                      <div className={styles.priceRow}>
                        <FormField label="Price (€) *">
                          <input type="number" step="0.01" min="0" value={form.price} onChange={setF('price')} required placeholder="89.00" />
                        </FormField>
                        <FormField label="Original Price (€)">
                          <input type="number" step="0.01" min="0" value={form.originalPrice || ''} onChange={setF('originalPrice')} placeholder="Leave blank if no sale" />
                        </FormField>
                      </div>

                      <FormField label="Category *">
                        <select value={form.category} onChange={setF('category')} required>
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </FormField>

                      <FormField label="Badge">
                        <select value={form.badge} onChange={setF('badge')}>
                          {BADGES.map(b => <option key={b} value={b}>{b || '— No badge —'}</option>)}
                        </select>
                      </FormField>

                      <div className={styles.checkboxRow}>
                        <input type="checkbox" id="inStock" checked={form.inStock} onChange={setF('inStock')} />
                        <label htmlFor="inStock" className={styles.checkboxLabel}>In Stock</label>
                      </div>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.formSectionTitle}>Images</h3>

                      <FormField label="Main Image URL *">
                        <input type="url" value={form.image} onChange={setF('image')} required placeholder="https://images.unsplash.com/…" />
                      </FormField>

                      {form.image && (
                        <div className={styles.imgPreview}>
                          <img src={form.image} alt="Preview" className={styles.imgPreviewEl} onError={e => e.target.style.display = 'none'} />
                        </div>
                      )}

                      <p className={styles.formHint}>For additional images, add them to the <code>images</code> array in the exported JSON.</p>
                    </div>

                    <div className={styles.formSection}>
                      <h3 className={styles.formSectionTitle}>Ratings</h3>
                      <div className={styles.priceRow}>
                        <FormField label="Rating (0–5)">
                          <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={setF('rating')} />
                        </FormField>
                        <FormField label="Review Count">
                          <input type="number" min="0" value={form.reviews} onChange={setF('reviews')} />
                        </FormField>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className="btn btn-ghost" onClick={() => { setTab('products'); setEditingId(null); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? '✓ Save Changes' : '+ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {tab === 'settings' && (
            <div className={styles.tabContent}>
              <h1 className={styles.pageTitle}>Settings</h1>
              <p className={styles.pageSub}>Manage your store data and configuration.</p>

              <div className={styles.settingsGrid}>
                <div className={styles.settingsCard}>
                  <h3 className={styles.settingsTitle}>Export Data</h3>
                  <p className={styles.settingsDesc}>Download all products as a <code>products.json</code> file. Copy this to your project's <code>/data</code> folder to make changes permanent.</p>
                  <button onClick={exportJSON} className="btn btn-primary">↓ Download products.json</button>
                </div>

                <div className={styles.settingsCard}>
                  <h3 className={styles.settingsTitle}>Reset Products</h3>
                  <p className={styles.settingsDesc}>Reset all products to the original defaults from the source file. This will overwrite any changes made in the admin panel.</p>
                  <button onClick={resetToDefaults} className="btn btn-outline" style={{ borderColor: 'var(--rose)', color: 'var(--rose)' }}>Reset to Defaults</button>
                </div>

                <div className={styles.settingsCard}>
                  <h3 className={styles.settingsTitle}>Admin Password</h3>
                  <p className={styles.settingsDesc}>Set the <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> environment variable in your <code>.env.local</code> to change the admin password. Current: <code>linaroos-admin-2024</code></p>
                  <Link href="/admin/login" className="btn btn-ghost">Back to Login</Link>
                </div>

                <div className={styles.settingsCard}>
                  <h3 className={styles.settingsTitle}>Stripe Integration</h3>
                  <p className={styles.settingsDesc}>Add your Stripe keys to <code>.env.local</code>:</p>
                  <pre className={styles.pre}>{`STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`}</pre>
                  <a href="https://stripe.com/docs" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: '12px', display: 'inline-flex' }}>Stripe Docs ↗</a>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── CONFIRM DELETE MODAL ── */}
      {confirmDelete && (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Delete Product?</h3>
            <p>This action cannot be undone. The product will be permanently removed.</p>
            <div className={styles.modalActions}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ background: 'var(--rose)' }} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">{toast}</div>
      )}
    </>
  )
}

function FormField({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  )
}
