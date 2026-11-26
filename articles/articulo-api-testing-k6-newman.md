# API Testing con k6 y Newman sobre una API desplegada en Vercel

Probar una API no es solo "pegarle con curl una vez". En este artículo muestro un flujo completo y reproducible: una API Node/Express mínima, despliegue automático a Vercel desde GitHub, pruebas funcionales con Newman (Postman CLI) y pruebas de carga con k6, todo corriendo en CI con GitHub Actions.

Repositorio: https://github.com/dejameingresar/api-testing-app
API en producción: https://api-testing-nicole.vercel.app

## 1. La aplicación

API REST mínima con Express:

- `GET /health` → `{ "status": "ok" }`
- `GET /api/items` → lista
- `GET /api/items/:id` → un item (404 si no existe)
- `POST /api/items` → crea (400 si falta `name`)
- `DELETE /api/items/:id` → elimina (404 si no existe)

## 2. Despliegue a través de automatización

El repo está conectado a Vercel (integración GitHub). Cada `push` a `main` dispara un deploy automático a producción, sin pasos manuales. Además, un workflow de GitHub Actions (`.github/workflows/ci.yml`) levanta la API y corre la colección Newman en cada push y pull request.

## 3. Pruebas funcionales con Newman

La colección `tests/newman/collection.json` cubre 4 casos: health check, listado, creación (201) y el caso negativo de item inexistente (404). Ejecución contra producción:

```bash
npx newman run tests/newman/collection.json \
  --env-var baseUrl=https://api-testing-nicole.vercel.app
```

Resultado real: 4 requests, 5 assertions, 0 fallos. Tiempo medio de respuesta ~374 ms.

## 4. Pruebas de carga con k6

El script `tests/k6/load.js` usa stages (rampa a 10 usuarios virtuales, 1 minuto sostenido) con umbrales: menos de 1% de fallos y p95 bajo 500 ms.

```bash
k6 run --env BASE_URL=https://api-testing-nicole.vercel.app tests/k6/load.js
```

k6 separa dos niveles que Newman no cubre: comportamiento bajo concurrencia y degradación de latencia (p95), no solo respuestas correctas.

## 5. Conclusión

Newman verifica que la API responde lo correcto; k6 verifica que lo hace bajo carga. Combinados con deploy automático y CI, cada cambio queda probado funcional y no-funcionalmente antes de llegar a producción.
