# Escaneo de vulnerabilidades con Nuclei sobre una app desplegada en Vercel

En los laboratorios del curso trabajamos con gosec (análisis estático en Go) y OWASP Dependency-Check (auditoría de dependencias). Este artículo muestra otra categoría: escaneo dinámico de la aplicación desplegada con Nuclei, de ProjectDiscovery, una herramienta distinta a las de los labs.

Repositorio: https://github.com/dejameingresar/api-testing-app
App escaneada: https://api-testing-nicole.vercel.app

## 1. Por qué Nuclei

- gosec analiza código fuente; Dependency-Check analiza librerías. Ninguno prueba la app corriendo.
- Nuclei ataca la URL pública con miles de plantillas (templates) comunitarias: misconfigurations, exposures, XSS, SQLi, CVEs conocidos.
- Referencia: OWASP reconoce el escaneo DAST como complemento del SAST (ver OWASP Vulnerability Scanning Tools).

## 2. Instalación y ejecución

```bash
nuclei -u https://api-testing-nicole.vercel.app \
  -severity low,medium,high,critical \
  -tags misconfig,exposure -o nuclei-report.txt
```

El primer run descarga ~2900 plantillas firmadas de `nuclei-templates` (v10.5.2) y las ejecuta contra el objetivo.

## 3. Resultado real

Escaneo con 1524 plantillas (tags misconfig + exposure): **0 hallazgos**. La app expone solo los endpoints previstos, sin paneles, ni archivos sensibles, ni cabeceras que delaten versiones vulnerables.

## 4. Lectura del resultado

Cero hallazgos no significa "invulnerable": significa que esa superficie y esas plantillas no detectaron nada. El valor está en repetirlo en cada deploy (Nuclei corre en CI igual que Newman) y ampliar tags (xss, sqli, cve) a medida que la app crezca.

## 5. Conclusión

SAST (gosec) + SCA (Dependency-Check) + DAST (Nuclei) cubren tres ángulos distintos. El escaneo dinámico es el único que valida lo que realmente está expuesto en producción.

## 6. Efecto colateral real: el escaneo activo el bot-protection de Vercel

Tras lanzar ~1500 plantillas contra la app, Vercel activo temporalmente su Security Checkpoint ("We're verifying your browser") para todo el host, incluidos curl y Newman. El bloqueo expiro solo al cesar el trafico y se verifico con Newman (4 requests, 5 assertions, 0 fallos). Leccion: los escaneos DAST agresivos pueden degradar el servicio; en produccion se programan en ventanas de mantenimiento.
