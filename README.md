# Ache Hoje 🏠

A Brazilian real estate portal (a Zillow-style listings site) for the pt-BR
market. Browse properties for sale and rent, view them on a map, and find
licensed agents (corretores).

- **Frontend:** React 18 + Vite, React Router, Leaflet maps — all custom CSS, no UI library.
- **Backend:** Node/Express REST API backed by MongoDB (Mongoose).
- **Language:** Portuguese (pt-BR) throughout.

---

## Architecture

```
achehoje-client/
├── src/                  # React frontend
│   ├── api/index.js      # API layer — hits the backend when VITE_API_URL is set,
│   │                     #   otherwise falls back to in-memory placeholder data
│   ├── data/properties.js# Placeholder data (original seed source)
│   ├── components/        # Navbar, cards, map, search/filter bars, carousel
│   ├── pages/             # Home, Buy (/comprar), Rent (/alugar), FindAgent, PropertyDetail
│   └── utils/format.js    # BRL currency, m², "days listed", fuzzy city match
│
├── server/               # Express + MongoDB backend
│   ├── src/
│   │   ├── index.js       # Entry point — connects DB + starts listening
│   │   ├── app.js         # Builds the Express app (routes, middleware)
│   │   ├── db.js          # Mongoose connection
│   │   ├── models/        # Property, Agent schemas
│   │   ├── routes/        # /api/properties, /api/agents
│   │   ├── data/seedData.js         # Base seed data (generated from src/data)
│   │   ├── data/londrinaSeedData.js  # Londrina, PR listings (merged into the seed)
│   │   └── seed.js        # Wipe + repopulate the database (base + Londrina)
│   ├── test/              # node:test + supertest + in-memory MongoDB
│   └── Dockerfile
│
├── Dockerfile            # Frontend (Vite build → nginx)
└── docker-compose.yml    # mongo + seed + api + web
```

The frontend's `src/api/index.js` is the single integration point. When the
`VITE_API_URL` environment variable is set it makes real HTTP calls; when it's
empty it serves the bundled placeholder data — so the UI runs standalone with
no backend, and switches to live data by setting one env var.

---

## Quick start with Docker (recommended)

Runs the whole stack — database, seeded data, API, and frontend — with one command:

```bash
docker compose up --build
```

- Frontend → http://localhost:8080
- API → http://localhost:3000
- MongoDB → localhost:27017

The `seed` service wipes and loads the database on startup, then the API and
frontend come up. Stop and remove everything (including the data volume) with:

```bash
docker compose down -v
```

---

## Deploying to AWS

A cost-efficient single-instance deployment (one Graviton `t4g.micro` running the
whole stack behind one URL, ~$0–6/mo) is prepared in **[`deploy/`](./deploy/)** —
a production compose file (with **Caddy for automatic HTTPS**), a bootstrap
script, and a CloudFormation template. See **[deploy/DEPLOY.md](./deploy/DEPLOY.md)**
for the step-by-step guide.

---

## Running locally without Docker

### Frontend only (placeholder data, no backend)

```bash
npm install
npm run dev            # http://localhost:5173
```

With no `VITE_API_URL` set, the app uses in-memory placeholder data.

### Full stack

You'll need a MongoDB instance running (locally or via
`docker run -d -p 27017:27017 mongo:7`).

**1. Start the backend:**

```bash
cd server
npm install
cp .env.example .env    # adjust MONGO_URI / PORT if needed
npm run seed            # load the database (run once)
npm run dev             # API on http://localhost:3000
```

**2. Point the frontend at it** — create a `.env` in the project root:

```bash
echo "VITE_API_URL=http://localhost:3000" > .env
```

**3. Start the frontend:**

```bash
npm run dev
```

---

## API reference

Base URL: `http://localhost:3000`

| Method | Endpoint | Query params | Description |
|--------|----------|--------------|-------------|
| GET | `/health` | — | Service health check |
| GET | `/api/properties/sale` | `city`, `minPrice`, `maxPrice`, `bedrooms`, `type` | Properties for sale |
| GET | `/api/properties/rent` | `city`, `minPrice`, `maxPrice`, `bedrooms`, `type` | Properties for rent |
| GET | `/api/properties/:id` | `type` (`sale` \| `rent`) | Single property by numeric id |
| GET | `/api/agents` | `city`, `state` | Agents (corretores) |
| GET | `/api/agents/:id` | — | Single agent by numeric id |

**Filter behavior** (matches the original client-side placeholder logic):
- `city` — accent- and case-insensitive fuzzy match (every token in the query
  must appear in the property's city/state/neighborhood).
- `minPrice` / `maxPrice` — inclusive price range.
- `bedrooms` — minimum number of bedrooms (`>=`).
- `type` — exact, case-insensitive (e.g. `Casa`, `Apartamento`, `Terreno`).

Example:

```bash
curl "http://localhost:3000/api/properties/sale?city=sao%20paulo&bedrooms=3&maxPrice=1000000"
```

---

## Environment variables

**Backend** (`server/.env`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | API port |
| `MONGO_URI` | `mongodb://localhost:27017/achehoje` | MongoDB connection string |

**Frontend** (`.env` in project root, read at build/dev time by Vite):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | *(empty)* | Backend base URL. Empty → use placeholder data. |

---

## Scripts

**Frontend** (project root):

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

**Backend** (`server/`):

| Command | Description |
|---------|-------------|
| `npm start` | Start the API |
| `npm run dev` | Start the API with file watching |
| `npm run seed` | Wipe and repopulate the database |
| `npm test` | Run the test suite |

---

## Testing

Backend tests use Node's built-in test runner (`node:test`) — no test framework
to install. They run with **minimal mocking**: routes are exercised over real
HTTP (`supertest`) against a real MongoDB, spun up in-memory per run
(`mongodb-memory-server`). Nothing about Mongoose or the query layer is stubbed.

```bash
cd server
npm test
```

The in-memory MongoDB downloads a small binary on first run. In environments
that can't download it, point the tests at any MongoDB instead:

```bash
MONGO_TEST_URI=mongodb://localhost:27017/achehoje_test npm test
```

Coverage: pure-unit tests for the normalization utilities, plus route tests for
every endpoint (filters, sorting, JSON shape, and 404 paths).

---

## Brand

- Primary green `#009c3b`, accent yellow `#ffdf00` (Brazilian flag colors)
- Font: Inter
