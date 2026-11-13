# Ejercitación — Formulario de Registro (React Hook Form + Axios + SQLite)

**Cátedra:** Desarrollo de Software · UTN FRC
**Tiempo estimado de resolución:** 1 h 30 min
**Modalidad:** individual o en parejas · **Corrección:** entre pares (sección final)
**Temas:** Apunte *React - Formularios* (React Hook Form: `useForm`, `register`,
`handleSubmit`, **los validadores más usados**, `formState.errors`, `reset`) +
Apunte *Axios y React* (`axios.get` en `useEffect`, `axios.post`, manejo de los 3
errores) + integración con un backend que **persiste en SQLite**.

> ⚠️ Vos trabajás SOLO en el **frontend**. El backend (Express + Sequelize + SQLite)
> ya está hecho y NO se toca. No usamos JWT ni interceptors: peticiones HTTP planas.

---

## ¿Qué vas a construir?

Un **formulario de registro de usuario** validado con React Hook Form y estilizado
con Bootstrap, que **trae la lista de países** del backend con `axios.get` y **envía
el registro** con `axios.post` para que se **guarde en una base SQLite**.

```
RegistroForm   ──axios.get──►  /api/countries   (llena el <select>)
 (React + RHF)  ──axios.post─►  /api/users       (guarda en SQLite vía Sequelize)
                                Express + Sequelize + SQLite (puerto 3001)
```

El proyecto ya tiene **todo el andamiaje** y un **campo modelo resuelto** (Nombre
completo). Vos completás los `// TODO` numerados (**T1 a T13**).

### Los validadores que vas a practicar (los más frecuentes de RHF)

| Validador | Dónde lo usás |
|-----------|---------------|
| `required` | casi todos los campos |
| `minLength` / `maxLength` | nombre, contraseña, bio |
| `pattern` (regex) | email, contraseña |
| `min` / `max` | edad |
| `validate` (función custom) | repetir contraseña |

## Cómo arrancar (dos terminales)

> ⚠️ **Orden importa.** El backend tiene que estar corriendo ANTES de enviar.

```bash
# Terminal 1 — backend (NO se toca)
cd backend
npm install        # express, cors, sequelize, sqlite3 (solo la primera vez)
npm start          # → SQLite conectada... Servidor en http://localhost:3001

# Terminal 2 — frontend (acá trabajás)
cd frontend
npm install        # solo la primera vez
npm run dev        # → abre http://localhost:5176
```

> 💾 La base se crea sola: la primera vez aparece el archivo `backend/database.sqlite`.
> Para verificar que se guardó, abrí `http://localhost:3001/api/users` en el navegador.

## Mapa de archivos

| Archivo | Qué tiene que hacer | TODOs |
|---------|---------------------|-------|
| `backend/` | ✅ Express + Sequelize + SQLite (NO tocar) | — |
| `frontend/src/main.jsx` · `App.jsx` | ✅ montan la app e importan Bootstrap | — |
| `frontend/src/components/RegistroForm.jsx` | el formulario completo | **T1 – T13** |

> ✅ DADO = ya está hecho y te sirve de modelo. **El campo "Nombre completo" está
> resuelto a propósito:** es EL PATRÓN (register + `is-invalid` + `invalid-feedback`)
> que repetís en los demás campos. Copiá la idea, cambiá la regla.

---

# Parte 1 — `useForm` y cablear el envío · ~10 min

- **T1 · `useForm`:** a la desestructuración sumale `reset`, `watch` y, dentro de
  `formState`, `isSubmitting`.
  - `watch` lo vas a necesitar en T5 para leer la contraseña y compararla.
- **T2 · `handleSubmit`:** en el `<form>`, reemplazá el `onSubmit` placeholder por
  `handleSubmit(onSubmit)`.
  - Pensá: ¿por qué `handleSubmit` y no llamar a `onSubmit` directo? ¿Cuándo NO se
    ejecuta tu `onSubmit`?

✔️ **Listo cuando:** enviar no recarga la página y el campo modelo valida.

---

# Parte 2 — Los validadores más usados · ~35 min

Replicá el patrón del campo modelo en cada campo. Mismo `register`, distinta regla.

- **T3 · Email:** `required` + `pattern` (regex de email).
- **T4 · Contraseña:** `required` + `minLength` 8 + `pattern` (al menos una letra y
  un número).
- **T5 · Repetir contraseña:** `required` + `validate` (custom). 🔧 **Sin código de
  ejemplo, lo desarrollás vos:** una función que compare con el valor de la
  contraseña (usá `watch`).
- **T6 · Edad:** `required` + `min` 18 + `max` 120. Usá `valueAsNumber: true` para
  que viaje como número.
- **T8 · Bio:** `maxLength` 200 (opcional, sin `required`).
- **T9 · Términos:** `checkbox` con `required`.

> 🎨 Bootstrap en cada campo: `form-control` / `form-select` / `form-check-input`,
> la clase `is-invalid` **condicional** si hay error, y un `<div className="invalid-feedback">`
> con `errors.campo.message`.

✔️ **Listo cuando:** al enviar vacío, cada campo muestra su mensaje; las contraseñas
distintas avisan; una edad menor a 18 da error.

---

# Parte 3 — Traer países con `axios.get` y armar el select · ~15 min

- **T10 · `useEffect` + `axios.get`:** al montar, traé los países de
  `http://localhost:3001/api/countries` y guardalos con `setPaises`
  (llegan en `response.data`). 🔧 Pensá vos el array de dependencias y el `try/catch`.
- **T7 · `select` País:** `required`, primera opción `<option value="">Seleccioná...</option>`
  y el resto con `paises.map(...)`.

✔️ **Listo cuando:** el `<select>` se llena solo con los países del backend.

---

# Parte 4 — Enviar y guardar en SQLite con `axios.post` · ~20 min

- **T11 · `axios.post`:** enviá `data` por POST a `http://localhost:3001/api/users`
  (`async/await` + `try/catch`). Si sale bien: `alert` con `response.data.message` y
  `reset()`.
- **T12 · Los 3 errores de Axios:** 🔧 **Sin código de ejemplo — el núcleo.** En el
  `catch`, distinguí `error.response` (4xx/5xx, ej. email duplicado),
  `error.request` (sin respuesta) y `else` (`error.message`).

✔️ **Listo cuando:**
- Enviás un registro válido → `alert` de éxito, el form se limpia, y al abrir
  `http://localhost:3001/api/users` **ves el registro guardado**.
- Enviás dos veces el mismo email → el backend responde 400 y cae en `error.response`.
- Apagás el backend y enviás → cae en `error.request`.

---

# Parte 5 — Pulido de UX · ~10 min

- **T13 · `isSubmitting`:** deshabilitá el botón mientras envía
  (`disabled={isSubmitting}`) y mostrá "Enviando...".

✔️ **Listo cuando:** el botón se bloquea un instante al enviar.

---

## Checklist final (antes de la corrección)

- [ ] `useForm` aporta `register`, `handleSubmit`, `errors`, `reset`, `watch`, `isSubmitting`.
- [ ] El `<form>` usa `handleSubmit(onSubmit)`.
- [ ] Email valida con `pattern`; contraseña con `minLength` + `pattern`.
- [ ] "Repetir contraseña" usa `validate` y detecta cuando no coinciden.
- [ ] Edad usa `min`/`max` y viaja como número (`valueAsNumber`).
- [ ] El `<select>` se llena con `axios.get` en un `useEffect` con `[]`.
- [ ] El envío usa `axios.post`, guarda en SQLite y hace `reset()`.
- [ ] El `catch` distingue `error.response`, `error.request` y `error.message`.
- [ ] El botón se deshabilita con `isSubmitting`.

---
---

# 🤝 CORRECCIÓN ENTRE PARES

**Cómo funciona:** intercambien el proyecto con otra pareja. Lo corren (backend +
`npm run dev`), prueban en el navegador con la pestaña **Network** abierta y revisan
el código. **No corrijan solo si "anda": miren el CÓDIGO** y pregunten *por qué*.

**Pareja que resuelve:** ________________________  
**Pareja que corrige:** ________________________

Cada ítem vale lo indicado. Total: **100 puntos**.

> 🔎 Antes de corregir: ¿levantaron el **backend** (`npm start` en `backend/`)?
> Sin él, `axios.get` y `axios.post` fallan y no es culpa de quien resolvió.

## 1. `useForm` y cableado (14 pts)

| # | Qué verificar | ¿Cómo? | Pts | ✔ |
|---|---------------|--------|-----|---|
| T1 | `useForm` desestructura `register`, `handleSubmit`, `errors`, `reset`, `watch`, `isSubmitting` | Leer código | 6 | ☐ |
| T2 | El `<form>` usa `handleSubmit(onSubmit)` | Leer código + enviar no recarga | 6 | ☐ |
| — | Cada campo se registra con `{...register("nombre", {reglas})}` | Leer código | 2 | ☐ |

**Pregunta:** ¿Qué hace `handleSubmit` ANTES de ejecutar tu `onSubmit`? ¿Cuándo no corre?
_______________________________________________

## 2. Validadores de RHF más usados (32 pts)

| # | Qué verificar | ¿Cómo? | Pts | ✔ |
|---|---------------|--------|-----|---|
| T3 | Email: `required` + `pattern` | Probar "abc" → error; "a@b.com" → ok | 5 | ☐ |
| T4 | Contraseña: `required` + `minLength` 8 + `pattern` (letra y número) | Probar "1234" y "password" → error | 6 | ☐ |
| T5 | Repetir contraseña: `validate` que compara con la contraseña | Poner dos distintas → error | 8 | ☐ |
| T6 | Edad: `min` 18 + `max` 120 + `valueAsNumber` | Probar 15 → error; ver que viaja como número | 7 | ☐ |
| T8 | Bio: `maxLength` 200 (sin `required`) | Pegar +200 → error; vacío → pasa | 3 | ☐ |
| T9 | Términos: `checkbox` con `required` | Enviar sin tildar → error | 3 | ☐ |

**Pregunta:** En T5, ¿cómo funciona `validate`? ¿Qué devuelve la función si está bien y si está mal?
_______________________________________________

## 3. Feedback visual con Bootstrap (12 pts)

| # | Qué verificar | ¿Cómo? | Pts | ✔ |
|---|---------------|--------|-----|---|
| — | `is-invalid` se aplica **condicional** solo si ese campo tiene error | Leer: `${errors.x ? 'is-invalid' : ''}` | 6 | ☐ |
| — | El mensaje sale de `errors.campo.message` en `invalid-feedback` | Provocar errores y leer textos | 6 | ☐ |

**Pregunta:** ¿De dónde sale el TEXTO de cada error: del JSX o de las reglas del `register`?
_______________________________________________

## 4. `axios.get` + `useEffect` (14 pts)

| # | Qué verificar | ¿Cómo? | Pts | ✔ |
|---|---------------|--------|-----|---|
| T10 | `useEffect` con `[]` trae los países al montar | Leer código + `<select>` lleno | 7 | ☐ |
| T7 | El `select` se arma con `paises.map(...)` y tiene `required` | Network: ver el GET a `/api/countries` | 7 | ☐ |

**Pregunta:** ¿Qué pasaría si al `useEffect` le sacás el `[]`?
_______________________________________________

## 5. `axios.post`, persistencia y errores (28 pts)

| # | Qué verificar | ¿Cómo? | Pts | ✔ |
|---|---------------|--------|-----|---|
| T11 | El envío usa `axios.post` async a `/api/users` y hace `reset()` al éxito | Network: ver el POST + form se limpia | 8 | ☐ |
| — | **El registro se guardó en SQLite** | Abrir `http://localhost:3001/api/users` y verlo | 4 | ☐ |
| T12 | El `catch` distingue `error.response`, `error.request` y `error.message` | Leer código (los 3 casos) | 12 | ☐ |
| T13 | El botón se deshabilita con `isSubmitting` | Enviar y mirar el botón | 4 | ☐ |

**Prueba clave (háganla):** registren el mismo email dos veces → el backend devuelve
400 → ¿qué rama de error cae y qué mensaje muestra? Después apaguen el backend y
envíen → ¿qué rama cae ahora?

**Pregunta:** ¿Cuál es la diferencia entre `error.response` y `error.request`? Dé un ejemplo de cada uno.
_______________________________________________

---

## Cierre de la corrección

**Puntaje total:** ______ / 100

**Lo mejor resuelto:** _______________________________________________

**Lo que les costó / a repasar:** _______________________________________________

> La nota es lo de menos: lo importante es que ambas parejas entiendan los *por qué*
> —sobre todo el validador custom (`validate`) y los 3 errores de Axios.
