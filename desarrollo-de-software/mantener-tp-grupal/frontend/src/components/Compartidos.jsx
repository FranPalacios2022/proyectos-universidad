export const estados = ['abierta', 'asignada', 'en_proceso', 'resuelta', 'cancelada'];
export const prioridades = ['baja', 'media', 'alta', 'urgente'];
export const etiqueta = valor => valor?.replaceAll('_', ' ') || '—';
export const fecha = valor => valor ? new Date(valor).toLocaleString('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short'
}) : '—';
export function Estado({
  valor
}) {
  return <span className={`estado estado-${valor}`}>{etiqueta(valor)}</span>;
}
export function ErrorVisible({
  mensaje
}) {
  return mensaje ? <div role="alert" className="alert alert-danger">{mensaje}</div> : null;
}
export function Cargando() {
  return <div className="py-5 text-center" role="status"><span className="spinner-border spinner-border-sm me-2" />Cargando información…</div>;
}
