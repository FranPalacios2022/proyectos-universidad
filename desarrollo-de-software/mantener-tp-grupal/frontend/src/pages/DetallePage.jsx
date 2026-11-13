import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { obtenerOrden, obtenerHistorial } from '../services/ordenes.service';
import { listarTecnicos } from '../services/catalogos.service';
import { mensajeError } from '../services/api';
import { Estado, Cargando, ErrorVisible, fecha } from '../components/Compartidos';
import AccionesOrden from '../components/AccionesOrden';
import HistorialOrden from '../components/HistorialOrden';
export default function DetallePage() {
  const {
    id
  } = useParams();
  const location = useLocation();
  const [datos, setDatos] = useState(null),
    [error, setError] = useState(''),
    [exito, setExito] = useState(location.state?.mensaje || '');
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let vigente = true;
    setError('');
    setDatos(null);
    Promise.all([obtenerOrden(id), obtenerHistorial(id), listarTecnicos()]).then(([orden, historial, tecnicos]) => vigente && setDatos({
      orden,
      historial,
      tecnicos
    })).catch(e => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, [id, version]);
  if (error) return <><Link to="/ordenes">← Volver al listado</Link><ErrorVisible mensaje={error} /></>;
  if (!datos) return <Cargando />;
  const {
    orden,
    historial,
    tecnicos
  } = datos;
  return <><Link className="back-link" to="/ordenes">← Todas las órdenes</Link><div className="page-heading"><div><p className="eyebrow">ORDEN #{String(orden.id).padStart(4, '0')}</p><h1>{orden.titulo}</h1><p>Creada el {fecha(orden.fechaCreacion)} por {orden.solicitante.nombre}</p></div><Estado valor={orden.estado} /></div>{exito && <div className="alert alert-success" role="status">{exito}</div>}<div className="row g-4"><div className="col-xl-7"><section className="panel p-4 mb-4"><h2>Detalle de la intervención</h2><p className="description-text">{orden.descripcion}</p><dl className="detail-grid"><div><dt>Activo</dt><dd>{orden.activo.codigo} · {orden.activo.nombre}</dd></div><div><dt>Ubicación</dt><dd>{orden.activo.ubicacion}</dd></div><div><dt>Prioridad</dt><dd><span className={`priority priority-${orden.prioridad}`}><i />{orden.prioridad}</span></dd></div><div><dt>Técnico</dt><dd>{orden.tecnico?.nombre || 'Sin asignar'}</dd></div><div><dt>Estado del activo</dt><dd><Estado valor={orden.activo.estado} /></dd></div><div><dt>Resolución</dt><dd>{fecha(orden.fechaResolucion)}</dd></div></dl></section><AccionesOrden key={version} orden={orden} tecnicos={tecnicos} onCambio={() => {
          setExito('Operación realizada. El historial y el activo fueron actualizados.');
          setVersion(v => v + 1);
        }} /></div><div className="col-xl-5"><HistorialOrden items={historial} /></div></div></>;
}
