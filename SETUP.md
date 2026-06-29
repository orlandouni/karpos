# KARPOS — guía de montaje

Sitio en **Next.js** con el **Studio de Sanity** embebido. Tu mamá edita el menú
en `/studio` (cajitas con etiquetas), publica, y la página se actualiza sola.

---

## 1. Crear el proyecto base

```bash
npx create-next-app@latest karpos
```

Responde:
- TypeScript → **Yes**
- ESLint → Yes
- Tailwind CSS → **Yes**
- `src/` directory → **Yes**
- App Router → **Yes**
- Import alias `@/*` → **Yes**

```bash
cd karpos
npm install sanity next-sanity @sanity/vision styled-components
```

## 2. Pegar los archivos de este paquete

Copia el contenido de esta carpeta encima de tu proyecto, respetando las rutas:

```
karpos/
├─ sanity.config.ts
├─ sanity/
│  ├─ structure.ts
│  └─ schemaTypes/{index,menuSemanal,contacto}.ts
└─ src/
   ├─ sanity/{client,queries}.ts
   └─ app/
      ├─ layout.tsx
      ├─ globals.css        ← reemplaza el que ya viene
      ├─ page.tsx           ← reemplaza el que ya viene
      ├─ studio/[[...tool]]/page.tsx
      └─ api/revalidate/route.ts
```

Pon también el **logo** en `public/logo.jpeg`.

## 3. Crear el proyecto en Sanity

```bash
npx sanity login        # entra con Google o GitHub
```

Ve a https://www.sanity.io/manage → **Create new project**.
Copia el **Project ID** y crea el archivo `.env.local` (usa `.env.local.example`
como plantilla):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_REVALIDATE_SECRET=inventa-una-cadena-larga
```

En el panel de Sanity → **API → CORS origins** agrega `http://localhost:3000`
(con credenciales) para poder usar el Studio en local.

## 4. Probar en local

```bash
npm run dev
```

- Sitio: http://localhost:3000
- Panel de tu mamá: http://localhost:3000/studio

Entra al Studio, llena **Menú de la semana** y **Datos de contacto**, dale
**Publish**, y recarga el sitio. Ya debe verse.

## 5. Publicar (Vercel)

1. Sube el repo a GitHub e impórtalo en https://vercel.com
2. En Vercel → Project → **Settings → Environment Variables**, agrega las mismas
   tres variables del `.env.local`.
3. Deploy. Tu dominio quedará en algo como `karpos.vercel.app` (luego le conectas
   tu dominio propio).
4. Vuelve a Sanity → **API → CORS origins** y agrega tu URL de producción.

## 6. Que el menú se actualice solo (webhook)

En https://www.sanity.io/manage → tu proyecto → **API → Webhooks → Create webhook**:

- **URL:** `https://TU-DOMINIO/api/revalidate`
- **Dataset:** production
- **Trigger on:** Create, Update, Delete
- **Filter:** `_type == "menuSemanal" || _type == "contacto"`
- **Secret:** el mismo valor de `SANITY_REVALIDATE_SECRET`
- **HTTP method:** POST
- **API version:** v2021-03-25 (o la más reciente)

Listo. Cuando tu mamá publique un cambio, la página se regenera en segundos.

---

## Para tu mamá (resumen)

1. Entra a `TU-DOMINIO/studio`.
2. Clic en **Menú de la semana**.
3. Escribe los platillos de cada día.
4. Clic en **Publish** (arriba a la derecha).

Eso es todo. No puede romper el diseño: solo escribe en las cajitas.
