import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { obtenerResumen } from '../services/ordenes.service';
import { mensajeError } from '../services/api';
import { Cargando, ErrorVisible, etiqueta } from '../components/Compartidos';
export default function ResumenPage() {
  const [datos, setDatos] = useState(null),
    [error, setError] = useState('');
  useEffect(() => {
    let vigente = true;
    obtenerResumen().then(r => vigente && setDatos(r)).catch(e => vigente && setError(mensajeError(e)));
    return () => {
      vigente = false;
    };
  }, []);
  return <><div className="page-heading"><div><p className="eyebrow">VISTA DE ADMINISTRACIÓN</p><h1>El estado de la operación<span className="heading-dot">.</span></h1><p>Detectá prioridades y distribuí el trabajo del equipo.</p></div><Link className="btn btn-outline-primary" to="/ordenes">Ver órdenes ↗</Link></div><ErrorVisible mensaje={error} />{!datos && !error && <Cargando />}{datos && <><div className="row g-3 mb-4">{[['Órdenes registradas', datos.total, 'Todas las intervenciones'], ['Urgentes pendientes', datos.urgentes, 'Requieren atención prioritaria'], ['Sin técnico', datos.sinTecnico, 'Órdenes pendientes de asignación']].map(([label, n, detail], i) => <div className="col-md-4" key={label}><section className={`metric-card metric-${i}`}><p>{label}</p><strong>{n.toString().padStart(2, '0')}</strong><small>{detail}</small></section></div>)}</div><div className="row g-4"><div className="col-lg-6"><section className="panel p-4 h-100"><h2>Órdenes por estado</h2><p className="text-secondary">Distribución del total registrado</p>{Object.entries(datos.porEstado).map(([estado, n]) => <div className="state-chart" key={estado}><div><span>{etiqueta(estado)}</span><strong>{n}</strong></div><div className="chart-track"><span style={{
                  width: `${datos.total ? n / datos.total * 100 : 0}%`
                }} /></div></div>)}</section></div><div className="col-lg-6"><section className="panel p-4 h-100"><h2>Activos con más fallas</h2><p className="text-secondary">Órdenes registradas, excluyendo canceladas</p>{datos.activosConMasFallas.length ? datos.activosConMasFallas.map((a, i) => <div key={a.id} className="asset-rank"><span className="rank-number">0{i + 1}</span><div><strong>{a.nombre}</strong><small>{a.codigo}</small></div><span className="count-pill">{a.cantidad}</span></div>) : <p>No hay fallas registradas.</p>}</section></div></div></>}</>;
}
