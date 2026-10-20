# ============================================================
#  servidor-prueba.ps1 — servidor HTTP mínimo SOLO para probar
# ------------------------------------------------------------
# ¿Para qué sirve? Para abrir Perito Map en el navegador como
# si estuviera en internet (http://localhost:8123). Hace falta
# porque el "modo sin internet" (service worker) NO funciona
# con doble clic en el archivo.
#
# Uso:  powershell -ExecutionPolicy Bypass -File servidor-prueba.ps1
# Luego abrir:  http://localhost:8123
# Para cerrar:  Ctrl+C en la ventana, o matar el proceso.
# ============================================================

$raiz = $PSScriptRoot
$puerto = 8123

# HttpListener es una clase de .NET que escucha peticiones web.
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$puerto/")
$listener.Start()

Write-Host "Servidor de prueba corriendo en http://localhost:$puerto"
Write-Host "Carpeta: $raiz"
Write-Host "Presioná Ctrl+C para detener."
Write-Host ""

# Extensiones que sabemos servir (si no, el navegador no sabe qué son)
$tipos = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".png"  = "image/png"
  ".svg"  = "image/svg+xml"
  ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
  # Esperamos a que alguien pida algo
  $context = $listener.GetContext()
  $peticion = $context.Request
  $respuesta = $context.Response

  try {
    # Quitamos la "/" inicial y decodificamos espacios (%20) y tildes
    $rutaRelativa = [System.Uri]::UnescapeDataString($peticion.Url.AbsolutePath.TrimStart('/'))
    if ($rutaRelativa -eq "") { $rutaRelativa = "index.html" }

    # Seguridad: no permitir salir de la carpeta (evita "../../algo")
    $rutaCompleta = [System.IO.Path]::GetFullPath((Join-Path $raiz $rutaRelativa))
    if (-not $rutaCompleta.StartsWith([System.IO.Path]::GetFullPath($raiz))) {
      $respuesta.StatusCode = 403
      $respuesta.Close()
      continue
    }

    if (Test-Path $rutaCompleta -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($rutaCompleta)
      $ext = [System.IO.Path]::GetExtension($rutaCompleta).ToLower()

      $respuesta.StatusCode = 200
      $respuesta.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { "application/octet-stream" }
      $respuesta.ContentLength64 = $bytes.Length
      $respuesta.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("{0}  {1}" -f $respuesta.StatusCode, $rutaRelativa)
    } else {
      # 404: no existe
      $texto = [System.Text.Encoding]::UTF8.GetBytes("404 - No encontrado: $rutaRelativa")
      $respuesta.StatusCode = 404
      $respuesta.ContentType = "text/plain; charset=utf-8"
      $respuesta.OutputStream.Write($texto, 0, $texto.Length)
      Write-Host ("{0}  {1}" -f 404, $rutaRelativa)
    }
  } catch {
    $respuesta.StatusCode = 500
    Write-Host ("ERROR: {0}" -f $_.Exception.Message)
  } finally {
    $respuesta.OutputStream.Close()
  }
}
