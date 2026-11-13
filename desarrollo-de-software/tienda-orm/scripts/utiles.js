// scripts/utiles.js · ayudas para mostrar resultados en consola
export const titulo = (t) => console.log(`\n\x1b[36m━━ ${t} ━━\x1b[0m`);
export const pesos = (n) => '$' + Number(n).toLocaleString('es-AR');
