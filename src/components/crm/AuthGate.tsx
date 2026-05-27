'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { useTheme } from '@/hooks/useTheme'
import { getCrmInputStyles } from '@/styles/componentStyles'

export function AuthGate({ children }: { children: (user: User) => React.ReactNode }) {
  const { t, mode } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: t.colors.textMuted }}>Cargando...</div>

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.colors.bg }}>
      <div style={{ background: t.colors.bgCard, border: `1px solid ${t.colors.border}`, borderRadius: 12, padding: 32, width: 320 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 600, color: t.colors.text }}>ROCA CRM</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={getCrmInputStyles(t)}
          type="email"
        />
        <input
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={getCrmInputStyles(t)}
          type="password"
        />
        {error && <p style={{ color: t.colors.danger, fontSize: 13, margin: '0 0 10px' }}>{error}</p>}
        <button onClick={handleLogin} style={{
          width: '100%', padding: '10px 0', background: t.crm.blue,
          color: '#fff', border: 'none', borderRadius: 6,
          fontSize: 14, cursor: 'pointer', fontWeight: 500,
        }}>Ingresar</button>
      </div>
    </div>
  )

  return <>{children(user)}</>
}
