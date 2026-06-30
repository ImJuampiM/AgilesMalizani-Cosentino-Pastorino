# TP Integrador — Ahorcado (ATDD)

[![CI](https://github.com/ImJuampiM/AgilesMalizani-Cosentino-Pastorino/actions/workflows/ci.yml/badge.svg)](https://github.com/ImJuampiM/AgilesMalizani-Cosentino-Pastorino/actions/workflows/ci.yml)

Juego del Ahorcado construido con **ATDD de doble loop**:

- **Loop externo (Acceptance Tests):** Gherkin + Playwright (playwright-bdd)
  contra la app real en el navegador (`features/`).
- **Loop interno (Unit Tests):** Vitest sobre el dominio `Ahorcado`, sin DOM
  (`tests/`).

Stack: TypeScript + Vite + Vitest + Playwright.

## Comandos

```bash
npm install      # primera vez (requiere Node 22+)
npm run dev      # app en http://localhost:5173/?word=GATO
npm run test     # unit tests (Vitest)
npm run at       # acceptance tests (bddgen && playwright test)
npm run build    # build de producción (GitHub Pages)
```

## Integración continua

El workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) corre en
cada **push y PR a `main`**: instala dependencias en Node 22, instala el
navegador de Playwright, y ejecuta los **unit tests** (`vitest run`) y los
**acceptance tests** (`npm run at`). El estado se ve en el badge de arriba y en
la pestaña **Actions** del repositorio.

## Documentación del proceso

- [`GUIA-ATDD-IA-Ahorcado.md`](./GUIA-ATDD-IA-Ahorcado.md) — consigna y reglas.
- [`CONTINUAR.md`](./CONTINUAR.md) — estado actual, código, CI/CD y qué sigue.
- [`BITACORA.md`](./BITACORA.md) — registro cronológico paso a paso.
- [`NOTES.md`](./NOTES.md) — lista de unit tests por feature.
