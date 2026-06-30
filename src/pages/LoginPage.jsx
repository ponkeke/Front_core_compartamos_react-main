import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { extractError } from '../utils/format.js'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/inicio', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!codigo.trim() || !password) {
      setError('Ingresa tu código de empleado y contraseña.')
      return
    }
    setLoading(true)
    try {
      await login(codigo.trim(), password)
      navigate('/inicio', { replace: true })
    } catch (err) {
      setError(extractError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cm-login">
      <span className="cm-login-bg-decor d1" />
      <span className="cm-login-bg-decor d2" />

      <div className="cm-login-card">
        <div className="cm-login-card-top">
          <h1>Compartamos Banco</h1>
          <p>Core Mobile / Fuerza de Ventas</p>
        </div>

        <div className="cm-login-card-body">
          {error && (
            <div className="cm-login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit}>
            <div className="cm-login-field">
              <label htmlFor="codigo">Código de empleado</label>
              <div className="cm-login-input-wrap">
                <User size={18} />
                <input
                  id="codigo"
                  placeholder="Ingresa tu código"
                  autoComplete="username"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="cm-login-field">
              <label htmlFor="password">Contraseña</label>
              <div className="cm-login-input-wrap">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="cm-login-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="cm-login-hint">
            Demo · código <strong>EMP01</strong> · clave <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
