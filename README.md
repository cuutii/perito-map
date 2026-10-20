# 🧊 Perito Map — Glaciares del Calafate

**Perito Map** es una mini app web para recorrer, desde el mapa, los glaciares de la **región de Los Glaciares** (El Calafate, Santa Cruz, Argentina). A medida que tocás cada glaciar en el mapa, la app agrega una **miniatura** con su información a la sección **"Mi recorrido"**, que queda guardada en el navegador aunque cierres la página.

Pensada para principiantes: todo el código está en un solo HTML + un solo CSS, sin dependencias raras ni compilaciones.

## 🌍 Demo

🔗 **https://cuutii.github.io/perito-map/**

_(La demo se publicará en GitHub Pages. Por ahora podés usarla en forma local, ver más abajo.)_

## ✨ Características

- 🗺️ **Mapa interactivo** con Leaflet y OpenStreetMap, centrado en El Calafate (zoom 9).
- 📍 **7 glaciares** de la región marcados en el mapa: Perito Moreno, Upsala, Spegazzini, Frías, Moreno (Lengua), Viedma y el Hielo Continental / Campo de Hielo Sur.
- 💬 **Popups con información** de cada glaciar: tipo (de valle, de montaña o de hielo continental), superficie aproximada y un dato curioso.
- 🖼️ **Miniaturas del recorrido**: al hacer clic en un marcador se suma una tarjeta con la imagen representativa (🧊), el nombre y los datos básicos.
- 📍 **Botón "Mi ubicación"**: usa `navigator.geolocation` para centrar el mapa en tu posición actual, marcada con un ícono distinto al de los glaciares.
- ⚠️ **Manejo de errores de geolocalización**: si denegás el permiso o no hay señal, la app lo avisa con un mensaje claro.
- 💾 **Persistencia**: "Mi recorrido" se guarda en `localStorage` y se recupera al recargar.
- 📱 **Responsive**: se adapta bien a celular y a escritorio (diseño oscuro, azulado, con tarjetas redondeadas).
- 🧹 **Recorrido administrable**: podés quitar tarjetas de a una o vaciar todo con "Borrar recorrido".

## 🛠️ Tecnologías

| Tecnología | Para qué |
| --- | --- |
| **HTML5** | Estructura de la página |
| **CSS3** | Estilos (diseño oscuro, grid, flexbox, responsive) |
| **JavaScript (ES6)** | Lógica de la app, eventos y persistencia |
| **Leaflet 1.9.4** | Librería de mapas (cargada desde CDN) |
| **OpenStreetMap** | Imágenes del mapa base (tiles) |
| **localStorage** | Guardar el recorrido en el navegador |

No hay frameworks, ni Node, ni build: abrís el archivo y anda.

## 🚀 Cómo usarla

1. Descargá o cloná el repositorio.
2. Abrí el archivo **`index.html`** con doble clic (se abre en el navegador).
3. **Hacé falta internet**: los mapas de OpenStreetMap y la librería Leaflet vienen de servidores externos.
4. Hacé clic en los marcadores de los glaciares para sumarlos a **Mi recorrido**.
5. Tocá **📍 Mi ubicación** (con internet y GPS activo) para centrar el mapa donde estás.

> Nota de geolocalización: algunas versiones de Chrome bloquean la geolocalización en páginas abiertas directamente desde el disco (`file://`). Si eso te pasa, probá con Firefox o publicá la app en GitHub Pages (que es como se usa con `https://`).

## 📁 Estructura del proyecto

```
08-perito-map/
├── index.html              ← la app (abrí este archivo)
├── style.css               ← los estilos
├── index.comentado.html    ← copia del HTML con comentarios para ESTUDIAR
├── style.comentado.css     ← copia del CSS con comentarios para ESTUDIAR
├── README.md               ← este archivo
└── INSTRUCCIONES.md        ← apuntes del dueño del proyecto
```

Los archivos **`.comentado`** no son otra versión de la app: son el mismo código explicado línea por línea, ideales para quien está aprendiendo. Se pueden ignorar al usar o publicar el proyecto.

## ✏️ Personalización

Los datos de los glaciares viven en el array `glaciares` dentro de `index.html`. Cada objeto tiene:

```js
{
  id: "perito-moreno",          // identificador corto y único
  nombre: "Glaciar Perito Moreno",
  lat: -50.4967,                // latitud
  lng: -73.1377,                // longitud
  tipo: "Glaciar de valle",
  superficie: "250 km² (aprox.)",
  dato: "Es el más famoso del parque..."
}
```

Agregá o quitá objetos de ese array y los marcadores se actualizan solos.

## ⚠️ Aclaraciones

- Las **coordenadas y superficies son aproximadas** y tienen fines educativos / turísticos, no cartográficos ni científicos.
- Para datos oficiales, visitá el sitio del [Parque Nacional Los Glaciares](https://www.argentina.gob.ar/ambiente/parquesnacionales/losglaciares).

## 📄 Licencia

MIT — libre para usar, modificar y compartir.
