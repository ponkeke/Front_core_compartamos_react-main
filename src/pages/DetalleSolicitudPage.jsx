import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, FileText, User, IdCard, Coins,
  Building2, CheckCircle2,
  ThumbsUp, ThumbsDown, Send, HandCoins,
} from 'lucide-react'
import PageHead from '../components/layout/PageHead.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Alert from '../components/ui/Alert.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import Modal from '../components/ui/Modal.jsx'
import {
  obtenerSolicitud, evaluarSolicitud, desembolsarSolicitud,
} from '../services/solicitudesService.js'
import { extractError, formatDate, humanizar } from '../utils/format.js'

export default function DetalleSolicitudPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sol, setSol] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(null)

  // Evaluar
  const [showEval, setShowEval] = useState(false)
  const [evalEstado, setEvalEstado] = useState('APROBADO')
  const [evalObs, setEvalObs] = useState('')
  const [evalSaving, setEvalSaving] = useState(false)

  // Desembolsar
  const [showDes, setShowDes] = useState(false)
  const [desSaving, setDesSaving] = useState(false)

  const cargar = () => {
    setLoading(true)
    setError(null)
    obtenerSolicitud(id)
      .then((data) => setSol(data))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [id])

  const abrirEvaluar = () => {
    setEvalEstado('APROBADO')
    setEvalObs('')
    setShowEval(true)
  }

  const ejecutarEvaluar = async () => {
    setEvalSaving(true)
    setError(null)
    try {
      const res = await evaluarSolicitud(id, { estado: evalEstado, observacion: evalObs })
      setSol(res)
      setShowEval(false)
      setOk(`Solicitud ${evalEstado === 'APROBADO' ? 'aprobada' : 'rechazada'} correctamente.`)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setEvalSaving(false)
    }
  }

  const ejecutarDesembolsar = async () => {
    setDesSaving(true)
    setError(null)
    try {
      const res = await desembolsarSolicitud(id)
      setSol(res)
      setShowDes(false)
      setOk('Solicitud desembolsada correctamente. El crédito ha sido activado.')
    } catch (err) {
      setError(extractError(err))
    } finally {
      setDesSaving(false)
    }
  }

  if (loading) return <Loader text="Cargando solicitud…" />
  if (error && !sol) return <><Alert tipo="error">{error}</Alert><button className="cm-back" onClick={() => navigate('/solicitudes')}><ArrowLeft size={16} /> Volver a solicitudes</button></>

  if (!sol) return null

  const estado = String(sol.estado || '').toUpperCase()

  return (
    <>
      <button className="cm-back" onClick={() => navigate('/solicitudes')}><ArrowLeft size={16} /> Volver a solicitudes</button>

      <PageHead
        title={`Solicitud ${sol.numero_expediente || `#${id}`}`}
        subtitle={`Registrada el ${formatDate(sol.created_at)}`}
        icon={FileText}
        actions={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {estado === 'PENDIENTE' && (
              <button className="hb-btn" onClick={abrirEvaluar}>
                <CheckCircle2 size={16} /> Evaluar solicitud
              </button>
            )}
            {estado === 'APROBADO' && (
              <button className="hb-btn" onClick={() => setShowDes(true)}>
                <HandCoins size={16} /> Desembolsar
              </button>
            )}
          </div>
        }
      />

      {error && <Alert tipo="error">{error}</Alert>}
      {ok && <Alert tipo="success">{ok}</Alert>}

      <Card title="Información de la solicitud" icon={FileText}>
        <div className="cm-dl" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <dt>Cliente</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} style={{ color: 'var(--cm-muted)' }} />
              {sol.cliente_nombre || '—'}
            </dd>
          </div>
          <div>
            <dt>DNI</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IdCard size={14} style={{ color: 'var(--cm-muted)' }} />
              {sol.numero_documento || '—'}
            </dd>
          </div>
          <div>
            <dt>Tipo de crédito</dt>
            <dd>{humanizar(sol.tipo_credito) || '—'}</dd>
          </div>
          <div>
            <dt>Monto solicitado</dt>
            <dd style={{ fontWeight: 700, color: 'var(--cm-pink)' }}>
              <Coins size={14} style={{ verticalAlign: -1 }} /> <Money value={sol.monto_solicitado} />
            </dd>
          </div>
          <div>
            <dt>Número de cuotas</dt>
            <dd>{sol.plazo_meses ?? '—'} {sol.plazo_meses === 1 ? 'mes' : 'meses'}</dd>
          </div>
          <div>
            <dt>Motivo / Destino</dt>
            <dd>{sol.destino_credito || sol.motivo || '—'}</dd>
          </div>
          <div>
            <dt>Ingresos mensuales</dt>
            <dd>{sol.ingresos_estimados ? <Money value={sol.ingresos_estimados} /> : '—'}</dd>
          </div>
          <div>
            <dt>Actividad económica</dt>
            <dd style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} style={{ color: 'var(--cm-muted)' }} />
              {humanizar(sol.tipo_negocio) || '—'}
            </dd>
          </div>
          <div>
            <dt>Moneda</dt>
            <dd>{sol.moneda === 'USD' ? 'Dólares (US$)' : 'Soles (S/)'}</dd>
          </div>
          <div>
            <dt>Cuota estimada</dt>
            <dd>{sol.cuota_estimada ? <Money value={sol.cuota_estimada} /> : '—'}</dd>
          </div>
          <div>
            <dt>TEA referencial</dt>
            <dd>{sol.tea_referencial ? `${sol.tea_referencial}%` : '—'}</dd>
          </div>
          <div>
            <dt>Garantía</dt>
            <dd>{humanizar(sol.garantia) || '—'}</dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>{sol.telefono || '—'}</dd>
          </div>
          <div>
            <dt>Nombre del negocio</dt>
            <dd>{sol.nombre_negocio || '—'}</dd>
          </div>
        </div>
      </Card>

      <Card title="Estado de la solicitud" icon={CheckCircle2} style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Badge estado={estado} label={
            estado === 'PENDIENTE' ? 'Pendiente' :
            estado === 'APROBADO' ? 'Aprobado' :
            estado === 'RECHAZADO' ? 'Rechazado' :
            estado === 'DESEMBOLSADO' ? 'Desembolsado' :
            humanizar(estado)
          } />
          {sol.monto_aprobado && (
            <span style={{ color: 'var(--cm-muted)', fontSize: 14 }}>
              Monto aprobado: <strong style={{ color: 'var(--cm-green)' }}><Money value={sol.monto_aprobado} /></strong>
            </span>
          )}
          {sol.fecha_evaluacion && (
            <span style={{ color: 'var(--cm-muted)', fontSize: 14 }}>
              Evaluado el {formatDate(sol.fecha_evaluacion)}
            </span>
          )}
        </div>
        {sol.observacion && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--cm-bg)', borderRadius: 8, fontSize: 14, color: 'var(--cm-muted)' }}>
            <strong>Observación:</strong> {sol.observacion}
          </div>
        )}
      </Card>

      {/* MODAL EVALUAR */}
      {showEval && (
        <Modal
          title="Evaluar solicitud"
          icon={CheckCircle2}
          onClose={() => setShowEval(false)}
          footer={
            <>
              <button className="hb-btn hb-btn-gray" onClick={() => setShowEval(false)}>Cancelar</button>
              <button className="hb-btn" onClick={ejecutarEvaluar} disabled={evalSaving}>
                <Send size={16} /> {evalSaving ? 'Guardando…' : 'Confirmar evaluación'}
              </button>
            </>
          }
        >
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Decisión</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className={`cm-chip ${evalEstado === 'APROBADO' ? 'sel' : ''}`}
                style={evalEstado === 'APROBADO' ? { borderColor: 'var(--cm-green)', background: '#E8F5E9', color: '#16A34A' } : {}}
                onClick={() => setEvalEstado('APROBADO')}
              >
                <ThumbsUp size={16} /> Aprobar
              </button>
              <button
                type="button"
                className={`cm-chip ${evalEstado === 'RECHAZADO' ? 'sel' : ''}`}
                style={evalEstado === 'RECHAZADO' ? { borderColor: '#DC2626', background: '#FEE2E2', color: '#DC2626' } : {}}
                onClick={() => setEvalEstado('RECHAZADO')}
              >
                <ThumbsDown size={16} /> Rechazar
              </button>
            </div>
          </div>
          <div className="hb-field" style={{ marginBottom: 0 }}>
            <label htmlFor="evalObs">Observación</label>
            <textarea
              id="evalObs"
              className="hb-textarea"
              placeholder="Motivo de la decisión (opcional)…"
              value={evalObs}
              onChange={(e) => setEvalObs(e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* MODAL DESEMBOLSAR */}
      {showDes && (
        <Modal
          title="Confirmar desembolso"
          icon={HandCoins}
          onClose={() => setShowDes(false)}
          footer={
            <>
              <button className="hb-btn hb-btn-gray" onClick={() => setShowDes(false)}>Cancelar</button>
              <button className="hb-btn" onClick={ejecutarDesembolsar} disabled={desSaving} style={{ background: 'var(--cm-green)' }}>
                <HandCoins size={16} /> {desSaving ? 'Procesando…' : 'Confirmar desembolso'}
              </button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <HandCoins size={48} style={{ color: 'var(--cm-green)', marginBottom: 12 }} />
            <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600 }}>
              ¿Desembolsar solicitud <strong>{sol.numero_expediente}</strong>?
            </p>
            <p style={{ margin: 0, color: 'var(--cm-muted)', fontSize: 14 }}>
              Monto: <strong style={{ color: 'var(--cm-text)' }}><Money value={sol.monto_solicitado} /></strong>
            </p>
            <p style={{ margin: '8px 0 0', color: 'var(--cm-muted)', fontSize: 13 }}>
              El crédito se activará y el saldo del cliente se actualizará.
            </p>
          </div>
        </Modal>
      )}
    </>
  )
}
