
const seedrandom = require('seedrandom');

// Configuración
const cantidad = 1000000;
const semilla = 1763519;
const random = seedrandom(semilla);

// Variables y contadores
let positivos = 0;
let negativos = 0;
let multiplosRestos = 0;

let decenas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let menor = Infinity;
let posicionMenor = 0;

let signosIguales = 0;

let sumaSeisDigitos = 0;
let cantidadSeisDigitos = 0;

let anterior = null;

// Generación y procesamiento de números
for (let i = 0; i < cantidad; i++) {

    const numero = random.int32();

    // 1. Cantidad de positivos y negativos
    if (numero > 0) {
        positivos++;
    } else if (numero < 0) {
        negativos++;
    }

    // 2. Restos al dividir por 7
    const resto = ((numero % 7) + 7) % 7;

    if ([0, 3, 5, 6].includes(resto)) {
        multiplosRestos++;
    }

    // 3. Contadores según el dígito de las decenas
    const decena = Math.floor(Math.abs(numero) / 10) % 10;
    decenas[decena]++;

    // 4. Menor número y su posición
    if (numero < menor) {
        menor = numero;
        posicionMenor = i + 1;
    }

    // 5. Cantidad de signos iguales consecutivos
    if (anterior !== null && Math.sign(numero) === Math.sign(anterior)) {
        signosIguales++;
    }

    anterior = numero;

    // 6. Promedio de números con exactamente 6 dígitos
    if (Math.abs(numero) >= 100000 && Math.abs(numero) <= 999999) {
        sumaSeisDigitos += numero;
        cantidadSeisDigitos++;
    }
}

// Resultados
console.log("===== RESULTADOS =====");

console.log("1. Positivos:", positivos);
console.log("   Negativos:", negativos);

console.log("2. Cantidad con resto 0, 3, 5 o 6:", multiplosRestos);

console.log("3. Contadores por decenas:", decenas);

console.log("4. Menor número:", menor);
console.log("   Posición:", posicionMenor);

console.log("5. Signos iguales consecutivos:", signosIguales);

console.log("6. Cantidad de números de 6 dígitos:", cantidadSeisDigitos);
console.log("   Promedio:", Math.round(sumaSeisDigitos / cantidadSeisDigitos));
