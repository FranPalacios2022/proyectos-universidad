import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarOrdenes } from '../services/ordenes.service';
import { listarActivos, listarTecnicos } from '../services/catalogos.service';
import { mensajeError } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Cargando, ErrorVisible } from '../components/Compartidos';
import FiltrosOrdenes from '../components/FiltrosOrdenes';
import TablaOrdenes from '../components/TablaOrdenes';
const iniciales = {
  activoId: '',
  estado: '',
  prioridad: '',
  tecnicoId: '',
  page: 1,
  limit: 10,
  sortBy: 'fechaCreacion',
  order: 'DESC'
};
export default function OrdenesPage() {
  const {
    admin,
    usuario
  } = useAuth();
  const [filtros, setFiltros] = useState(iniciales);
  const [datos, setDatos] = useState({
    items: [],
    total: 0,
    totalPages: 0
  });
  const [activos, setActivos] = useState([]),
    [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState(''),
    [errorCatalogos, setErrorCatalogos] = useState('');
  const [cargando, setCargando] = useState(true),
    [intento, setIntento] = useState(0);
  useEffect(() => {
    let vigente = true;
    Promise.all([listarActivos(), listarTecnicos()]).then(([a, t]) => {
      if (vigente) {
        setActivos(a);
        setTecnicos(t);
        setErrorCatalogos('');
      }
    }).catch(e => vigente && setErrorCatalogos(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [intento]);
  useEffect(() => {
    let vigente = true;
    setCargando(true);
    setError('');
    listarOrdenes(filtros).then(r => vigente && setDatos(r)).catch(e => vigente && setError(mensajeError(e))).finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    }; // Evita que una respuesta vieja reemplace los últimos filtros.
  }, [filtros, intento]);
  function cambiar(campo, valor) {
    setFiltros(f => ({
      ...f,
      [campo]: valor,
      page: campo === 'page' ? valor : 1
    }));
  }
  return <><div className="page-heading"><div><p className="eyebrow">SEGUIMIENTO OPERATIVO</p><h1>Órdenes de mantenimiento<span className="heading-dot">.</span></h1><p>{admin ? 'Una vista de todas las intervenciones, de principio a fin.' : usuario.rol === 'tecnico' ? 'Tus intervenciones asignadas y su seguimiento.' : 'Seguí el avance de tus solicitudes de mantenimiento.'}</p></div>{(admin || usuario.rol === 'solicitante') && <Link className="btn btn-primary" to="/ordenes/nueva">＋ Nueva orden</Link>}</div>
    <FiltrosOrdenes filtros={filtros} cambiar={cambiar} activos={activos} tecnicos={tecnicos} /><ErrorVisible mensaje={errorCatalogos || error} />
    {(error || errorCatalogos) && <button className="btn btn-outline-secondary mb-3" onClick={() => setIntento(i => i + 1)}>Reintentar</button>}
    <section className="panel"><div className="list-toolbar"><div><strong>Registro de intervenciones</strong><span className="count-pill">{datos.total}</span></div><div className="sort-controls"><label htmlFor="sort">Ordenar por</label><select id="sort" className="form-select form-select-sm" value={filtros.sortBy} onChange={e => cambiar('sortBy', e.target.value)}><option value="fechaCreacion">Fecha de creación</option><option value="id">Número</option><option value="titulo">Título</option><option value="estado">Estado (A–Z)</option><option value="prioridad">Prioridad (A–Z)</option></select><button className="btn btn-sm btn-outline-secondary" onClick={() => cambiar('order', filtros.order === 'DESC' ? 'ASC' : 'DESC')}>{filtros.order === 'DESC' ? '↓ Desc.' : '↑ Asc.'}</button><button className="btn btn-sm btn-link" onClick={() => setFiltros(iniciales)}>Limpiar</button></div></div>
    {cargando ? <Cargando /> : !error && <TablaOrdenes ordenes={datos.items} />}
    <div className="pagination-bar"><div className="d-flex align-items-center gap-2"><label htmlFor="limit">Por página</label><select id="limit" className="form-select form-select-sm" value={filtros.limit} onChange={e => cambiar('limit', Number(e.target.value))}>{[5, 10, 20].map(n => <option key={n}>{n}</option>)}</select></div><span>Página {filtros.page} de {Math.max(1, datos.totalPages)}</span><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-secondary" disabled={cargando || filtros.page <= 1} onClick={() => cambiar('page', filtros.page - 1)}>← Anterior</button><button className="btn btn-sm btn-outline-secondary" disabled={cargando || filtros.page >= datos.totalPages} onClick={() => cambiar('page', filtros.page + 1)}>Siguiente →</button></div></div></section>
  </>;
}
