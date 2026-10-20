# 🧊 Perito Map — Glaciares del Calafate

**Perito Map** es una mini app web para recorrer, desde el mapa, los glaciares de la región de **Los Glaciares** (El Calafate, Santa Cruz, Argentina).

Cada vez que tocás un glaciar en el mapa, la app suma a **"Mi recorrido"** una tarjeta con su **foto real**, tipo y un dato curioso. El recorrido queda guardado en el navegador, y la app entera **funciona sin internet** después de la primera visita.

Está pensada para usarse **desde el celular**: botones grandes para el pulgar, medidas que se adaptan al notch, y modo "instalable" como si fuera una app de la tienda.

## 🌍 Demo

🔗 **https://cuutii.github.io/perito-map/**

> **Para que funcione sin internet:** abrila una vez con conexión y dejá que cargue el mapa. Después podés apagar los datos y seguir usándola.

## ✨ Características

### Mapa y recorrido
- 🗺️ **Mapa interactivo** con Leaflet y OpenStreetMap, centrado en El Calafate.
- 📍 **7 glaciares** de la región: Perito Moreno, Upsala, Spegazzini, Viedma, Onelli, Campo de Hielo Sur y Dickson.
- 💬 **Popups con foto e información** de cada glaciar: tipo, superficie aproximada y un dato curioso.
- 🖼️ **Tarjetas con foto real**: al tocar un marcador se suma una miniatura con la fotografía del glaciar.
- 💾 **Persistencia**: "Mi recorrido" se guarda en `localStorage` y se recupera al recargar.
- 🧹 **Recorrido administrable**: podés quitar tarjetas de a una o vaciar todo con "Borrar recorrido".

### Funciones que funcionan sin señal
- 📴 **Modo offline**: un *service worker* guarda la app y las 7 fotos en el navegador. En el campo, sin datos ni WiFi, la app abre igual.
- 🌤️ **Clima en vivo de El Calafate**: temperatura, estado del tiempo y velocidad del viento, con la API pública de [Open-Meteo](https://open-meteo.com/) (sin clave ni registro).
- 🗂️ **Último clima guardado**: si no hay conexión, muestra el último dato que pudo obtener, con un aviso claro.

### Pensada para celular
- 📍 **Botón "Mi ubicación"** que centra el mapa en tu posición con `navigator.geolocation`.
- ⚠️ **Manejo de errores de geolocalización**: permiso denegado, señal débil y tiempo agotado, cada uno con su mensaje.
- 📲 **Instalable**: tiene `manifest.json`, así que desde el celular se puede agregar al inicio de pantalla y se abre a pantalla completa.
- 🖐️ **Botones grandes** (48 px) y sin retardo de doble toque, para usar con una mano.
- 🧭 **Diseño oscuro responsive** que se reacomoda en pantallas chicas.

## 🛠️ Tecnologías

| Tecnología | Para qué |
| --- | --- |
| **HTML5** | Estructura de la página |
| **CSS3** | Estilos (diseño oscuro, grid, flexbox, responsive) |
| **JavaScript (ES6)** | Lógica de la app, eventos y persistencia |
| **Leaflet 1.9.4** | Librería de mapas (copiada en `lib/`, sin depender de internet) |
| **OpenStreetMap** | Imágenes del mapa base (*tiles*) |
| **Open-Meteo** | Clima en vivo de El Calafate |
| **Service Worker + Cache API** | Modo sin internet |
| **localStorage** | Guardar el recorrido y el último clima |
| **Web App Manifest** | Instalar la app en el celular |

No hay frameworks, ni Node, ni compilaciones: es HTML, CSS y JavaScript puro.

## 📁 Estructura del proyecto

```
08-perito-map/
├── index.html              ← la app (abrí este archivo)
├── style.css               ← los estilos
├── sw.js                   ← service worker: guarda la app para usarla sin internet
├── manifest.json           ← permite instalarla en el celular
├── img/                    ← 7 fotos reales de glaciares + iconos de la app
├── lib/                    ← Leaflet copiado localmente (funciona sin conexión)
│   ├── leaflet.css
│   ├── leaflet.js
│   └── images/             ← iconos de los marcadores del mapa
├── servidor-prueba.ps1     ← servidor local para probarla como si estuviera en internet
├── index.comentado.html    ← copia del HTML con comentarios para ESTUDIAR (local)
├── style.comentado.css     ← copia del CSS con comentarios para ESTUDIAR (local)
├── INSTRUCCIONES.md        ← apuntes del dueño del proyecto (local)
└── README.md               ← este archivo
```

Los archivos **`.comentado`** y `INSTRUCCIONES.md` son material de estudio local: no forman parte de la app publicada.

## 🚀 Cómo usarla

### En el celular (lo recomendado)
1. Abrí el enlace de la demo.
2. Aceptá el permiso de ubicación si querés usar el botón 📍.
3. Tocá los marcadores para armar **Mi recorrido**.
4. Opcional: en el menú del navegador, tocá **"Agregar a pantalla de inicio"** para instalarla.

### En tu computadora
1. Descargá o cloná el repositorio.
2. **Abrila con un servidor local** (el modo sin internet no funciona con doble clic):

```powershell
powershell -ExecutionPolicy Bypass -File servidor-prueba.ps1
```

3. Abrí `http://localhost:8123` en el navegador.

> **¿Por qué un servidor local?** El *service worker* (que hace que funcione sin conexión) solo se activa cuando la página se sirve por `http://` o `https://`. Si abrís el archivo con doble clic, se abre igual pero sin modo offline.

> **Nota de geolocalización:** algunas versiones de Chrome bloquean la geolocalización en páginas abiertas desde el disco (`file://`). Con el servidor local o en GitHub Pages funciona bien.

## 📸 Créditos de las fotos

Las fotografías de los glaciares vienen de **[Wikimedia Commons](https://commons.wikimedia.org/)** y están guardadas localmente en `img/`. Cada imagen respeta su licencia original (Creative Commons); los créditos y las licencias específicas de cada foto están en la ficha de su archivo en Commons.

## ✏️ Personalización

Los datos de los glaciares viven en el array `glaciares` dentro de `index.html`. Cada objeto tiene:

```js
{
  id: "perito-moreno",          // identificador corto y único
  nombre: "Glaciar Perito Moreno",
  lat: -50.4932,                // latitud
  lng: -73.1280,                // longitud
  tipo: "Glaciar de valle",
  superficie: "250 km² (aprox.)",
  foto: "img/perito-moreno.jpg",
  dato: "Es el más famoso del parque..."
}
```

Agregá o quitá objetos de ese array y los marcadores y tarjetas se actualizan solos. Si agregás una foto nueva, también sumala a la lista `ARCHIVOS` de `sw.js` para que quede disponible sin internet.

## ⚠️ Aclaraciones

- Las **coordenadas y superficies son aproximadas** y tienen fines educativos / turísticos, no cartográficos ni científicos.
- El **clima** proviene de Open-Meteo y se actualiza cada 15 minutos.
- Para datos oficiales, visitá el sitio del [Parque Nacional Los Glaciares](https://www.argentina.gob.ar/ambiente/parquesnacionales/losglaciares).

## 📄 Licencia

MIT — libre para usar, modificar y compartir.
