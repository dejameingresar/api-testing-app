# api-testing-app

Sample API for the API Testing group activity.

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items` `{ "name": "..." }`
- `DELETE /api/items/:id`

## Run locally

```bash
npm install
npm start
```

## API tests

Newman (Postman CLI):

```bash
npx newman run tests/newman/collection.json -e tests/newman/environment.json
```

k6 load test (requires k6):

```bash
k6 run --env BASE_URL=http://localhost:3000 tests/k6/load.js
```

## Deploy

Push to `main` deploys automatically to Vercel via the GitHub integration.
