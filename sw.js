/* ============================================================
   SERVICE WORKER de Perito Map  (sw.js)
   ------------------------------------------------------------
   ¿Qué es un service worker?
   Es un archivo que el navegador guarda y ejecuta en segundo
   plano. Su trabajo es GUARDAR los archivos de la app para que
   después pueda abrirse SIN INTERNET (por ejemplo, en el campo,
   donde no hay señal).

   ¿Cómo funciona por dentro?
   1) Al instalarse, baja y guarda una lista de archivos (CACHE_V1).
   2) Cuando la app pide un archivo, este worker intercepta el
      pedido y decide: ¿lo tengo guardado? → lo doy de la caché.
                          ¿no lo tengo?   → voy a buscarlo a internet
                                            (y si lo encuentro, lo guardo).
   ============================================================ */

// Nombre de la caché. Si cambiamos la versión (V2, V3...), el navegador
// descarga todo de nuevo y borra lo viejo.
const CACHE_V1 = "perito-map-v4";

// Archivos que queremos que funcionen sin internet.
// Ojo: los paths son relativos a sw.js (que vive en la raíz del proyecto).
const ARCHIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./lib/leaflet.css",
  "./lib/leaflet.js",
  // Iconos de los marcadores del mapa (sin ellos, los pines no se ven)
  "./lib/images/marker-icon.png",
  "./lib/images/marker-icon-2x.png",
  "./lib/images/marker-shadow.png",
  // Íconos de la app (el manifest los pide; si no están, la app instalada
  // se abriría sin ícono cuando no hay internet)
  "./img/icono.svg",
  "./img/icono-192.png",
  // Fotos de los glaciares (descargadas de Wikimedia Commons)
  "./img/perito-moreno.jpg",
  "./img/upsala.jpg",
  "./img/spegazzini.jpg",
  "./img/viedma.jpg",
  "./img/onelli.jpg",
  "./img/hielo-continental.jpg",
  "./img/dickson.jpg"
];

/* ------------------------------------------------------------
   1) INSTALACIÓN: guardamos todos los archivos listados arriba.
   ------------------------------------------------------------ */
self.addEventListener("install", evento => {
  // skipWaiting le dice al navegador: "no esperes a cerrar las pestañas
  // viejas, tomá el control ahora". Sin esto, el modo sin internet recién
  // funciona a partir de la SEGUNDA visita.
  self.skipWaiting();

  // waitUntil hace que el navegador espere a que termine de guardar todo
  evento.waitUntil(
    caches.open(CACHE_V1)
      .then(cache => cache.addAll(ARCHIVOS))
      // Si algo falla (por ejemplo, una foto), la instalación no se rompe:
      // seguimos igual y ese archivo simplemente no quedará disponible offline.
      .catch(error => console.warn("No se pudo precachear todo:", error))
  );
});

/* ------------------------------------------------------------
   2) ACTIVACIÓN: limpiamos cachés viejas de versiones anteriores.
   ------------------------------------------------------------ */
self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys().then(nombres =>
      Promise.all(
        nombres
          .filter(nombre => nombre !== CACHE_V1)   // solo borramos las que no son la actual
          .map(nombre => caches.delete(nombre))     // borramos la vieja
      )
    ).then(() => self.clients.claim()) // tomamos control de las pestañas abiertas
  );
});

/* ------------------------------------------------------------
   3) PETICIONES: aquí decidimos de dónde sale cada archivo.
   ------------------------------------------------------------ */
self.addEventListener("fetch", evento => {
  const url = new URL(evento.request.url);

  // Ignoramos los pedidos que no son GET (por ejemplo, enviar un formulario).
  if (evento.request.method !== "GET") return;

  // --- CASO A: las "baldosas" del mapa de OpenStreetMap ---
  // Son muchas imágenes chiquitas. Usamos "caché primero": si ya la vimos
  // alguna vez, la damos de la caché sin gastar datos; si no, vamos a internet.
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    evento.respondWith(
      caches.open("perito-map-tiles").then(cache =>
        cache.match(evento.request).then(guardada => {
          const irARed = fetch(evento.request).then(respuesta => {
            // Guardamos solo las respuestas correctas (status 200)
            if (respuesta && respuesta.status === 200) {
              cache.put(evento.request, respuesta.clone());
            }
            return respuesta;
          }).catch(() => {
            // Sin internet y sin esa baldosa guardada: devolvemos una imagen
            // TRANSPARENTE en vez de una promesa rechazada. Así el mapa se ve
            // con huecos (donde antes iba la baldosa) y la consola no se llena
            // de errores por cada baldosa que falte.
            // Ojo: atob() pasa de base64 a texto, así que hay que convertir cada
            // carácter a su byte; si devolviéramos el base64 tal cual, el
            // navegador no sabría leerlo como GIF.
            const binario = atob("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"); // GIF 1x1 transparente
            const bytes = Uint8Array.from(binario, caracter => caracter.charCodeAt(0));
            return new Response(bytes, {
              status: 200,
              headers: { "Content-Type": "image/gif", "Cache-Control": "no-store" }
            });
          });
          // Si no la teníamos guardada, usamos la red.
          return guardada || irARed;
        })
      )
    );
    return;
  }

  // --- CASO B: el clima (Open-Meteo) ---
  // Estrategia "red primero, caché de respaldo": siempre intentamos tener
  // datos frescos; si no hay internet, mostramos el último clima guardado.
  if (url.hostname.endsWith("open-meteo.com")) {
    evento.respondWith(
      fetch(evento.request)
        .then(respuesta => {
          // Solo guardamos respuestas correctas: si la API falla (4xx/5xx)
          // no queremos pisar el último clima bueno con ese error.
          if (respuesta && respuesta.status === 200) {
            const copia = respuesta.clone();
            caches.open("perito-map-clima").then(cache => cache.put(evento.request, copia));
          }
          return respuesta;
        })
        .catch(() =>
          // Sin internet: devolvemos el último clima guardado. Si tampoco
          // hay copia, devolvemos una respuesta JSON de error VÁLIDA,
          // porque respondWith(undefined) haría fallar la petición entera.
          caches.open("perito-map-clima").then(cache =>
            cache.match(evento.request).then(guardada =>
              guardada || new Response(
                JSON.stringify({ error: "sin-conexion" }),
                {
                  status: 503,
                  statusText: "Sin conexion",
                  headers: { "Content-Type": "application/json" }
                }
              )
            )
          )
        )
    );
    return;
  }

  // --- CASO C: todo lo demás (nuestros archivos, Leaflet, fotos) ---
  // Estrategia "caché primero, red de respaldo".
  evento.respondWith(
    caches.match(evento.request).then(guardada => {
      if (guardada) return guardada; // ya lo tenemos: no hace falta internet

      return fetch(evento.request).then(respuesta => {
        // Guardamos copia para la próxima vez, pero solo si es válida.
        if (respuesta && respuesta.status === 200 && respuesta.type === "basic") {
          const copia = respuesta.clone();
          caches.open(CACHE_V1).then(cache => cache.put(evento.request, copia));
        }
        return respuesta;
      });
    })
  );
});
