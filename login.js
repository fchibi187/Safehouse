import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { adminLogin } from '../../hooks/useAdminAuth'
import styles from '../../styles/AdminLogin.module.css'

export default function AdminLogin() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    if (adminLogin(pw)) {
      router.push('/admin')
    } else {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login – LinaRoos</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logo}>
            <span className={styles.logoScript}>Lina</span>
            <span>🌸</span>
            <span className={styles.logoScript}>oos</span>
          </div>
          <h1 className={styles.title}>Studio Admin</h1>
          <p className={styles.sub}>Sign in to manage your flower shop.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                required
                placeholder="Enter admin password"
                autoComplete="current-password"
              />
            </div>

            {error && <p className={styles.error} role="alert">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.btn}`} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className={styles.hint}>Default password: <code>linaroos-admin-2024</code><br/>Set <code>NEXT_PUBLIC_ADMIN_PASSWORD</code> in .env to change.</p>
        </div>
      </div>
    </>
  )
}
