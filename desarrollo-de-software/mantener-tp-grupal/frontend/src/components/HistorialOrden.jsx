import { etiqueta, fecha } from './Compartidos';
const nombres = {
  creacion: 'Orden creada',
  asignacion: 'Técnico asignado',
  cambio_prioridad: 'Prioridad actualizada',
  cambio_estado: 'Estado actualizado',
  resolucion: 'Orden resuelta',
  cancelacion: 'Orden cancelada',
  edicion: 'Datos editados'
};
function valor(v) {
  if (v === null || v === undefined) return 'Sin valor';
  if (typeof v === 'object') return JSON.stringify(v);
  return etiqueta(String(v));
}
export default function HistorialOrden({
  items
}) {
  return <section className="panel p-4"><h2>Historial de la orden <span className="count-pill">{items.length}</span></h2><p className="text-secondary">Cada cambio, con su responsable.</p>{!items.length ? <p>No hay movimientos registrados.</p> : <ol className="timeline">{items.map(h => <li key={h.id}><div className="timeline-heading"><strong>{nombres[h.accion] || etiqueta(h.accion)}</strong><time>{fecha(h.fechaHora)}</time></div><p className="timeline-user">{h.usuario?.nombre}</p>{Object.entries(h.valorNuevo || {}).map(([key, v]) => <div key={key} className="history-change"><span>{etiqueta(key)}:</span> {h.valorAnterior && Object.hasOwn(h.valorAnterior, key) && <><del>{valor(h.valorAnterior[key])}</del> → </>}<span>{valor(v)}</span></div>)}</li>)}</ol>}</section>;
}
