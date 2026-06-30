import api from './api.js'

/** Historial / tablero de solicitudes del asesor. GET /solicitudes */
export async function listarSolicitudes() {
  const { data } = await api.get('/solicitudes')
  return data
}

/** Crea una solicitud de crédito. POST /solicitudes */
export async function crearSolicitud(payload) {
  const { data } = await api.post('/solicitudes', payload)
  return data
}

/** Notas internas de una solicitud. GET /solicitudes/{id}/notas */
export async function listarNotas(solicitudId) {
  const { data } = await api.get(`/solicitudes/${solicitudId}/notas`)
  return data
}

/** Agrega una nota interna. POST /solicitudes/{id}/notas */
export async function agregarNota(solicitudId, contenido) {
  const { data } = await api.post(`/solicitudes/${solicitudId}/notas`, { contenido })
  return data
}

/** Obtiene detalle de una solicitud. GET /solicitudes/{id} */
export async function obtenerSolicitud(id) {
  const { data } = await api.get(`/solicitudes/${id}`)
  return data
}

/** Evalúa (aprueba/rechaza) una solicitud. PUT /solicitudes/{id}/evaluar */
export async function evaluarSolicitud(id, payload) {
  const { data } = await api.put(`/solicitudes/${id}/evaluar`, payload)
  return data
}

/** Desembolsa una solicitud aprobada. PUT /solicitudes/{id}/desembolsar */
export async function desembolsarSolicitud(id) {
  const { data } = await api.put(`/solicitudes/${id}/desembolsar`)
  return data
}
