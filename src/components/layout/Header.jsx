import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, FileText, ShieldCheck, HandCoins,
  BarChart3, Clock, ChevronDown, LogOut, User,
} from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { iniciales, humanizar } from '../../utils/format.js'

export const TABS = [
  { to: '/inicio', label: 'Inicio', icon: LayoutDashboard },
  { to: '/cartera', label: 'Cartera', icon: Briefcase },
  { to: '/solicitudes', label: 'Solicitudes', icon: FileText },
  { to: '/evaluacion', label: 'Evaluación', icon: ShieldCheck },
  { to: '/cobranza', label: 'Cobranza', icon: HandCoins },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
]

function Reloj() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return <span className="cm-clock"><Clock size={14} /> {hh}:{mm}:{ss}</span>
}

export function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="cm-topbar">
      <div className="cm-topbar-inner">
        <div />

        <div className="cm-topbar-right">
          <Reloj />
          <div className="cm-user-wrap" ref={wrapRef}>
            <button className="cm-user" onClick={() => setMenuOpen((o) => !o)}>
              <span className="cm-avatar">{iniciales(user?.nombre)}</span>
              <span className="cm-user-text">
                <strong>{user?.nombre || 'Asesor'}</strong>
                <small>{humanizar(user?.perfil)}</small>
              </span>
              <ChevronDown size={14} />
            </button>
            {menuOpen && (
              <div className="cm-user-menu">
                <div className="cm-user-menu-head">
                  <strong>{user?.nombre}</strong>
                  <small>Código {user?.codigo_empleado} · {humanizar(user?.perfil)}</small>
                </div>
                <button onClick={() => { setMenuOpen(false); navigate('/inicio') }}>
                  <User size={16} /> Mi panel
                </button>
                <button onClick={onLogout}>
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  return (
    <aside className="cm-sidebar">
      <div className="cm-sidebar-logo">
        <Logo size={34} subtitle="CORE MOBILE" />
      </div>

      <nav className="cm-sidebar-nav">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = location.pathname === t.to || location.pathname.startsWith(t.to + '/')
          return (
            <button
              key={t.to}
              className={`cm-sidebar-link ${active ? 'active' : ''}`}
              onClick={() => navigate(t.to)}
            >
              <span className="cm-sidebar-icon"><Icon size={18} /></span>
              <span>{t.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="cm-sidebar-footer">
        <div className="cm-sidebar-user">
          <span className="cm-sidebar-avatar">{iniciales(user?.nombre)}</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.nombre || 'Asesor'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--cm-muted)' }}>{humanizar(user?.perfil)}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default function Header() {
  return <Sidebar />
}
