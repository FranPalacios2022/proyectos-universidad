import { estados, prioridades, etiqueta } from './Compartidos';
export default function FiltrosOrdenes({
  filtros,
  cambiar,
  activos,
  tecnicos
}) {
  return <section className="panel filter-panel" aria-label="Filtros de órdenes"><div className="row g-3">
    <div className="col-sm-6 col-xl-3"><label className="form-label" htmlFor="f-activo">Activo</label><select id="f-activo" className="form-select" value={filtros.activoId} onChange={e => cambiar('activoId', e.target.value)}><option value="">Todos los activos</option>{activos.map(a => <option key={a.id} value={a.id}>{a.codigo} · {a.nombre}</option>)}</select></div>
    <div className="col-sm-6 col-xl-3"><label className="form-label" htmlFor="f-estado">Estado</label><select id="f-estado" className="form-select" value={filtros.estado} onChange={e => cambiar('estado', e.target.value)}><option value="">Todos los estados</option>{estados.map(e => <option key={e} value={e}>{etiqueta(e)}</option>)}</select></div>
    <div className="col-sm-6 col-xl-3"><label className="form-label" htmlFor="f-prioridad">Prioridad</label><select id="f-prioridad" className="form-select" value={filtros.prioridad} onChange={e => cambiar('prioridad', e.target.value)}><option value="">Todas las prioridades</option>{prioridades.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
    <div className="col-sm-6 col-xl-3"><label className="form-label" htmlFor="f-tecnico">Técnico</label><select id="f-tecnico" className="form-select" value={filtros.tecnicoId} onChange={e => cambiar('tecnicoId', e.target.value)}><option value="">Todos los técnicos</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></div>
  </div></section>;
}
