import { Link } from 'react-router-dom';
import { Estado, fecha } from './Compartidos';
export default function TablaOrdenes({
  ordenes
}) {
  if (!ordenes.length) return <div className="empty-state"><span>◎</span><h3>No hay órdenes para mostrar</h3><p>Probá con otros filtros o registrá una nueva intervención.</p></div>;
  return <div className="table-responsive"><table className="table order-table align-middle"><thead><tr><th>ORDEN / ACTIVO</th><th>PRIORIDAD</th><th>ESTADO</th><th>TÉCNICO</th><th>CREADA</th><th><span className="visually-hidden">Acciones</span></th></tr></thead><tbody>{ordenes.map(o => <tr key={o.id}><td><Link className="order-title" to={`/ordenes/${o.id}`}><span className="order-id">#{String(o.id).padStart(4, '0')}</span>{o.titulo}</Link><small>{o.activo.codigo} · {o.activo.nombre}</small></td><td><span className={`priority priority-${o.prioridad}`}><i />{o.prioridad}</span></td><td><Estado valor={o.estado} /></td><td>{o.tecnico?.nombre || <span className="text-secondary">Sin asignar</span>}</td><td className="date-cell">{fecha(o.fechaCreacion)}</td><td><Link className="arrow-link" to={`/ordenes/${o.id}`} aria-label={`Ver orden ${o.id}`}>↗</Link></td></tr>)}</tbody></table></div>;
}
