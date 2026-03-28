# Cubanitos Dulces

PWA inmersiva para venta artesanal de cubanitos con una estética Dark Sugar Neon, construida con Next.js App Router, TypeScript y Tailwind CSS.

La experiencia está pensada para mobile first y combina carruseles automáticos de producto, interacción rápida de compra, acceso directo a WhatsApp y un modal de preguntas frecuentes estilo chatbot.

## Concepto

La interfaz evita el look tradicional de tienda pastelera y apuesta por:

- Fondo negro total para máximo contraste.
- Acentos neón sutiles en rosa y cian.
- Tipografía sans serif moderna con titulares en mayúsculas de alto impacto.
- Tarjetas de venta con estética brutalista oscura.
- Sensación de profundidad mediante parallax suave y rotación automática de imágenes.

## Stack

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 3
- Export estático compatible con GitHub Pages

## Funcionalidades

- 7 bloques de venta inmersiva.
- Carruseles automáticos con cambio cada 3 segundos.
- Efecto parallax suave al hacer scroll.
- Botón de suma por producto con feedback visual.
- Contador de carrito en cabecera.
- Botón flotante de WhatsApp con mensaje predefinido.
- Botón flotante para modal CubanitoBot AI.
- Modal con 5 respuestas instantáneas de preguntas frecuentes.
- Manifest PWA y service worker básico para instalación y caché.

## Estructura principal

- [app/page.tsx](app/page.tsx): entrada principal de la landing.
- [app/layout.tsx](app/layout.tsx): metadata, viewport y registro del service worker.
- [app/globals.css](app/globals.css): sistema visual global y utilidades de estilo.
- [components/immersive-store.tsx](components/immersive-store.tsx): interfaz principal, lógica del carrito, WhatsApp y chatbot.
- [components/service-worker-register.tsx](components/service-worker-register.tsx): registro del service worker en cliente.
- [next.config.mjs](next.config.mjs): export estático y configuración de GitHub Pages.
- [public/manifest.json](public/manifest.json): configuración instalable de la PWA.
- [public/sw.js](public/sw.js): caché offline básico.

## Diseño visual

Paleta principal:

- Negro: #000000
- Rosa neón: #FF69B4
- Cian eléctrico: #00FFFF
- Verde WhatsApp: #25D366

Lineamientos:

- Los acentos se concentran en bordes, divisores y sombras.
- El contenido prioriza lectura rápida en móvil.
- Los títulos usan balance de línea para mejorar el corte visual.

## Instalación

Requisitos:

- Node.js 20 o superior recomendado.
- npm.

Pasos:

1. Instalar dependencias:

   npm install

2. Levantar entorno de desarrollo:

   npm run dev

3. Verificar tipos:

   npm run typecheck

4. Generar export estático:

   npm run build

El export queda generado en la carpeta out.

## GitHub Pages

Este proyecto está configurado para publicarse bajo el repositorio:

- /DulcesCubanitos

Por eso, en [next.config.mjs](next.config.mjs) se definieron:

- output: export
- basePath: /DulcesCubanitos
- assetPrefix: /DulcesCubanitos/
- trailingSlash: true

La URL pública esperada es:

- https://braianruaimi.github.io/DulcesCubanitos/

## PWA

La aplicación incluye:

- Manifest con tema negro en [public/manifest.json](public/manifest.json)
- Íconos instalables en [public/icons/icon-192.svg](public/icons/icon-192.svg) y [public/icons/icon-512.svg](public/icons/icon-512.svg)
- Service worker en [public/sw.js](public/sw.js)

## Personalización rápida

### WhatsApp

El número activo está configurado en [components/immersive-store.tsx](components/immersive-store.tsx).

Valor actual:

- 2215047962

También allí se define el mensaje preconfigurado que se envía al abrir WhatsApp.

### Productos y categorías

Los 7 bloques de venta se configuran desde el arreglo de productos en [components/immersive-store.tsx](components/immersive-store.tsx).

Podés cambiar:

- categoría
- nombre
- subtítulo
- precio
- imágenes
- color de acento

### FAQ del chatbot

Las respuestas rápidas de CubanitoBot AI están definidas en el arreglo de preguntas frecuentes dentro de [components/immersive-store.tsx](components/immersive-store.tsx).

### Imágenes

Las imágenes actuales son assets SVG locales diseñados para sostener la estética visual del prototipo:

- [public/images/cubanito-neon-1.svg](public/images/cubanito-neon-1.svg)
- [public/images/cubanito-neon-2.svg](public/images/cubanito-neon-2.svg)
- [public/images/cubanito-neon-3.svg](public/images/cubanito-neon-3.svg)

Se pueden reemplazar por fotos reales manteniendo las rutas o actualizando el arreglo de productos.

## Estado actual del proyecto

Verificado localmente:

- El proyecto compila correctamente.
- El export estático funciona.
- La URL pública todavía no responde con la aplicación.

Diagnóstico actual:

- El repositorio local aún no tiene commits.
- Existe una rama main en el remoto con historial previo.
- El proyecto local todavía no está sincronizado con esa rama remota.
- GitHub Pages no aparece publicado en este momento porque la URL pública devuelve 404.

## Flujo recomendado para sincronizar y publicar

1. Crear el primer commit local:

   git add .
   git commit -m "feat: immersive PWA for Cubanitos Dulces"

2. Unir la historia local con la rama remota existente:

   git pull origin main --allow-unrelated-histories

3. Resolver conflictos si Git los reporta.

4. Subir a main:

   git push -u origin main

5. En GitHub, activar Pages con origen GitHub Actions si todavía no está activo.

## Notas

- El proyecto usa export estático, por lo que no depende de un servidor Node en producción.
- Las imágenes están configuradas con optimización desactivada para compatibilidad con GitHub Pages.
- El archivo tsconfig.tsbuildinfo está excluido del versionado por tratarse de un artefacto local.
