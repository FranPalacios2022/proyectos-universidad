// ✅ DADO: solo monta el formulario y le pone un encabezado.
import RegistroForm from './components/RegistroForm.jsx';

export default function App() {
  return (
    <div className="container py-5" style={{ maxWidth: 640 }}>
      <header className="mb-4 text-center">
        <h1 className="h3 fw-bold">📝 Registro de usuario</h1>
        <p className="text-muted mb-0">React Hook Form + Bootstrap + Axios → SQLite</p>
        <small className="text-muted">Ejercitación · DDS · UTN FRC</small>
      </header>
      <RegistroForm />
    </div>
  );
}
