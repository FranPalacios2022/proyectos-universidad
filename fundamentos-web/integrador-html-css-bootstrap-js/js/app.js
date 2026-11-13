// ============================================
// app.js — se carga en las tres páginas
// ============================================

// --- 1. Año automático en el pie de página ---
const anio = document.querySelector('#anio');
if (anio) {
  anio.textContent = new Date().getFullYear();
}

// --- 2. Marcar en el menú la página en la que estoy ---
const archivo = window.location.pathname.split('/').pop() || 'index.html';
const enlaces = document.querySelectorAll('.navbar-nav .nav-link');

enlaces.forEach(function (enlace) {
  if (enlace.getAttribute('href') === archivo) {
    enlace.classList.add('active');
    enlace.setAttribute('aria-current', 'page');
  }
});

// --- 3. Los datos ---
const servicios = [
  { nombre: 'Diseño web',     descripcion: 'Sitios a medida, adaptables.',   precio: 15000 },
  { nombre: 'Mantenimiento',  descripcion: 'Actualizaciones y respaldos.',   precio: 8500 },
  { nombre: 'Capacitación',   descripcion: 'Cuatro encuentros de 2 horas.',  precio: 22000 },
  { nombre: 'Hosting',        descripcion: 'Alojamiento y dominio propio.',  precio: 4200 }
];

// --- 4. Formatear un precio a la argentina: 15000 -> $15.000 ---
function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-AR');
}

// --- 5. Dibujar una lista de servicios dentro de la tabla ---
function mostrarServicios(lista) {
  const cuerpo = document.querySelector('#tabla-servicios');
  if (!cuerpo) return;

  let filas = '';

  lista.forEach(function (servicio) {
    filas += `
      <tr>
        <td>${servicio.nombre}</td>
        <td>${servicio.descripcion}</td>
        <td class="text-end">${formatearPrecio(servicio.precio)}</td>
      </tr>`;
  });

  cuerpo.innerHTML = filas;

  const contador = document.querySelector('#contador-resultados');
  if (contador) {
    contador.textContent = lista.length + ' servicio(s)';
  }
}

// --- 6. Dibujar todo al abrir la página ---
mostrarServicios(servicios);

// --- 7. Filtrar mientras el usuario escribe ---
const buscador = document.querySelector('#buscador');

if (buscador) {
  buscador.addEventListener('input', function () {
    const texto = buscador.value.toLowerCase();

    const filtrados = servicios.filter(function (servicio) {
      return servicio.nombre.toLowerCase().includes(texto);
    });

    mostrarServicios(filtrados);
  });
}

// --- 8. El formulario de contacto ---
const formulario = document.querySelector('#form-contacto');

if (formulario) {

  const mensaje = document.querySelector('#mensaje');
  const contadorTexto = document.querySelector('#contador');

  // 8.1 contar caracteres mientras se escribe
  mensaje.addEventListener('input', function () {
    contadorTexto.textContent = mensaje.value.length;
  });

  // 8.2 atender el envío
  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const aviso = document.querySelector('#aviso');

    aviso.textContent = 'Gracias ' + nombre + ', recibimos tu consulta.';
    aviso.classList.remove('d-none');

    formulario.reset();
    contadorTexto.textContent = '0';
  });

}