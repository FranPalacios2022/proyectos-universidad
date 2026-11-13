import { useEffect, useState } from 'react';
import { listarActivos } from '../services/catalogos.service';
import { mensajeError } from '../services/api';
import { Cargando, ErrorVisible, Estado } from '../components/Compartidos';
export default function ActivosPage() {
  const [activos, setActivos] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    let vigente = true;
    listarActivos().then(r => vigente && setActivos(r)).catch(e => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, []);
  return <><div className="page-heading"><div><p className="eyebrow">INVENTARIO OPERATIVO</p><h1>Activos<span className="heading-dot">.</span></h1><p>El estado de cada equipo se actualiza con sus intervenciones.</p></div></div><ErrorVisible mensaje={error} />{!activos && !error && <Cargando />}<div className="row g-3">{activos?.map(a => <div className="col-md-6 col-xl-4" key={a.id}><article className="panel asset-card"><div className="d-flex justify-content-between mb-3"><span className="asset-code">{a.codigo}</span><Estado valor={a.estado} /></div><h2>{a.nombre}</h2><p className="text-secondary">{a.ubicacion}</p><div className="asset-meta"><span>{a.tipo}</span><span>Criticidad <strong>{a.criticidad}</strong></span></div></article></div>)}</div>{activos?.length === 0 && <p>No hay activos registrados.</p>}</>;
}
