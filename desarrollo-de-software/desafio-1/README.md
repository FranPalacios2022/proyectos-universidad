# Desafío 1 — Procesamiento de números pseudoaleatorios

Desafío de la cátedra **Desarrollo de Software** (UTN FRC, 2026).

El script genera **1.000.000 de enteros de 32 bits** con una semilla fija (`seedrandom`, así el resultado es reproducible) y en **una sola pasada** calcula:

1. Cantidad de números positivos y negativos.
2. Cuántos dejan resto 0, 3, 5 o 6 al dividirlos por 7 (con módulo corregido para negativos).
3. Contadores según el dígito de las decenas.
4. El menor número generado y su posición.
5. Cuántas veces dos números consecutivos tienen el mismo signo.
6. Cantidad y promedio de los números de exactamente 6 dígitos.

## Cómo correrlo

```bash
npm install
node ejercicio.js
```

**Tecnologías:** JavaScript, Node.js, seedrandom.
