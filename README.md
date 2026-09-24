# Bandeja de reseñas

Herramienta para que un grupo gastronómico conteste sus reseñas de Google: importa el archivo exportado, muestra lo que falta responder por sede, genera un borrador con IA y guarda la respuesta.

**Demo:** [completar con la URL de Vercel]

## Stack

- **Next.js 16** (App Router, TypeScript) con Tailwind CSS escrito a mano
- **Supabase** (Postgres, plan gratuito)
- **[completar proveedor de IA]** para los borradores
- **Vitest** para los tests
- **Vercel** para el deploy

## Levantarlo desde cero

Requisitos: Node 22 o superior y un proyecto en Supabase.

1. Correr `supabase/schema.sql` en el **SQL Editor** de Supabase para crear las tablas.
2. Después, en la terminal:

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local, y completar los valores
npm run import
npm run dev
```

La app queda en http://localhost:3000.

## Variables de entorno

| Variable | Para qué sirve | Dónde se consigue |
| --- | --- | --- |
| `SUPABASE_URL` | URL del proyecto de Supabase | Supabase → Project Settings → Data API |
| `SUPABASE_SECRET_KEY` | Llave secreta (equivale a `service_role`). Solo se usa en el servidor | Supabase → Project Settings → API Keys |
| [completar] | Llave del modelo de IA | [completar] |

Ninguna lleva el prefijo `NEXT_PUBLIC_`, así que Next nunca las incluye en el código que llega al navegador. En Vercel, la llave secreta está marcada como *Sensitive*.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Levanta la app en modo desarrollo |
| `npm run import` | Importa `data/reviews.json` a Supabase. Se puede correr las veces que sea |
| `npm test` | Corre los tests |
| `npm run build` | Compila para producción |

## Estructura

```
app/
  page.tsx            la única pantalla
components/
  filter-bar.tsx      filtros (único componente de cliente)
  review-list.tsx     lista de reseñas
lib/
  import-data.ts      limpieza del JSON antes de importar (pura)
  summary.ts          resumen por sede (pura, con tests)
  filters.ts          lectura de filtros desde la URL (pura)
  reviews.ts          consultas a Supabase
  supabase.ts         cliente de Supabase del lado del servidor
  format.ts           formato de fechas
scripts/
  import.ts           comando de importación
supabase/
  schema.sql          tablas, RLS y permisos
data/
  reviews.json        archivo original
```

La lógica de negocio (`import-data`, `summary`, `filters`) no conoce ni la base ni la UI. `reviews.ts` es el único archivo de la app que habla con Supabase.

## Decisiones sobre los datos

Cada caso sucio del archivo tiene una regla explícita. Hay tres tipos: resolver, aceptar y representar, o rechazar e informar.

| Caso | Qué hace la app | Por qué |
| --- | --- | --- |
| **rv-205 duplicada** | Queda la versión con `updated_at` más nuevo (3 estrellas). La importación informa el duplicado | Es la edición posterior del mismo cliente. Las fechas se comparan como fechas, no como texto |
| **rv-108 sin calificación** | Se guarda con `rating` nulo. Cuenta en el total de la sede pero no en el promedio. En la lista dice "Sin calificación" y se puede filtrar | Es una reseña real que hay que responder, pero no tiene un número para promediar |
| **rv-105 sin texto** | Se guarda con texto vacío. En la lista dice "Sin comentario" | Una calificación sola también merece respuesta |
| **rv-301, sede `loc-99` inexistente** | No se importa. La importación la lista como salteada con el motivo. Nunca crea la sede | Crear una sede inventada ensuciaría el resumen. Además, la clave foránea en la base la rechazaría igual |
| **Belgrano sin reseñas** | Aparece en el resumen con "Sin reseñas todavía", sin promedio ni porcentaje | Un promedio de 0 o un 0% respondido serían falsos |
| **Reseñas ya respondidas en el archivo** | Se importan como respondidas, con su texto y su fecha | Son respuestas reales |
| **Reimportar después de responder desde la app** | La respuesta del archivo solo se escribe si la reseña no tiene una | Así una reimportación nunca pisa lo que alguien contestó en la pantalla |

Con estos datos, Palermo tiene 9 reseñas y promedio 3,63 sobre 8 calificadas, y Centro tiene 6 reseñas y promedio 3,67.

## Otras decisiones

- **El navegador nunca habla con Supabase.** Todas las lecturas y escrituras pasan por el servidor de Next con la llave secreta. RLS está activado en todas las tablas y sin políticas, así que la llave pública no puede leer ni escribir nada. Los permisos se dan a mano en `schema.sql`, porque desactivé la exposición automática de tablas nuevas.
- **La respuesta vive en la tabla `reviews`** (`reply_text` y `replied_at`), no en una tabla aparte. Cada reseña tiene como mucho una respuesta. Una restricción impide que quede texto sin fecha o fecha sin texto.
- **La importación es idempotente** porque usa los ids del archivo como clave primaria y hace upsert. Correrla dos veces deja la base igual.
- **Por defecto se muestran las reseñas sin responder.** La rutina es entrar y contestar lo pendiente. "Todas" está a un clic.
- **Los filtros viven en la URL** y se combinan. Un valor inválido (`?rating=9`) se ignora en vez de romper la página.
- **Las fechas se muestran en hora de Buenos Aires** ("16 de septiembre"), porque Vercel corre en UTC y una reseña de la noche aparecería con fecha del día siguiente.
- **El resumen devuelve números sin redondear.** Redondear es trabajo de la pantalla, así los tests prueban la regla y no el formato.
- **Solo modo claro.** Saqué el modo oscuro automático de la plantilla para tener un único esquema de color consistente.
- **`@types/node` en 22**, para coincidir con la versión de Node del proyecto (y porque Vitest 5 lo pide).

## Tests

```bash
npm test
```

Cubren la función del resumen (`lib/summary.ts`): el caso normal, la sede sin reseñas, la reseña sin calificación, la sede donde ninguna reseña tiene calificación y que cada sede cuente solo lo suyo.

Usan datos chicos e inventados a propósito. Prueban la regla ("una sede vacía no tiene promedio"), no la salida actual del JSON, que cambiaría con cada reseña nueva.

## Qué no llegué a hacer y cómo lo haría

- **Validar la forma del JSON al importar.** Hoy se confía en que el archivo tiene la estructura esperada. Lo haría con un esquema de Zod antes de `prepareImport`.
- **Comparar versiones contra la base.** Si un archivo viejo trae una reseña con `updated_at` anterior al que ya está guardado, hoy la pisa. Lo resolvería actualizando solo cuando la fecha del archivo es más nueva.
- **Tipos generados de Supabase.** Hoy los tipos de las filas están escritos a mano. Con `supabase gen types` se sincronizarían con el esquema, y se podrían usar consultas anidadas tipadas.
- **Tests de `prepareImport` y `parseFilters`.** Son funciones puras, así que se testean igual que el resumen.
- **Paginación del listado**, necesaria si el volumen de reseñas crece.
- **Autenticación.** El ejercicio no la pide; hoy cualquiera con la URL puede responder.
- [completar si quedó algo más afuera]

## Capturas

[completar con 2 o 3 capturas de la pantalla]