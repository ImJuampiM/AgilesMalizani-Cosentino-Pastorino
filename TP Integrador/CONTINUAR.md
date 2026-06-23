# Cómo seguir — TP Ahorcado (ATDD)

Este archivo es el prompt/resumen para arrancar la próxima sesión. Pegá su
contenido (o decí "leé CONTINUAR.md") al asistente para retomar exactamente
donde quedó, sin tener que re-explicar nada.

---

## 1. Qué es este TP

TP Integrador de la materia Ágiles: construir el juego del Ahorcado aplicando
**ATDD (Acceptance Test Driven Development) de doble loop**. La consigna
completa, con todas las reglas, está en `GUIA-ATDD-IA-Ahorcado.md` (en esta
misma carpeta) — **leerla siempre antes de tocar código**, porque es lo que
se evalúa (el proceso, no el resultado final).

Resumen del modelo mental:

- **Loop externo (Acceptance Test):** un `.feature` en Gherkin que describe
  lo que el usuario VE/HACE, automatizado con Playwright contra la **app
  real en el navegador** (no un mock, no jsdom). Mientras la app no funcione
  de punta a punta, este test da rojo.
- **Loop interno (Unit Test):** tests rápidos con Vitest sobre el objeto de
  dominio `Ahorcado`, que no conoce el DOM ni el navegador. Cada AT se apoya
  en una lista de UTs que hay que enumerar **antes** de escribir el código de
  `Ahorcado`.
- **Separación estricta lógica/UI:** toda decisión de negocio (¿gané?, ¿la
  letra está?, ¿cuántas vidas quedan?) vive en `Ahorcado`. La UI (`src/ui/`)
  solo lee/escribe DOM y le pregunta a `Ahorcado`.
- **Commits en pares `RED:` / `GREEN:`:** por cada test (UT o AT) hay un
  commit con el test fallando (rojo) seguido de un commit con el código
  mínimo que lo hace pasar (verde). El rojo se commitea **antes** de escribir
  una sola línea de producción — es la evidencia de "test primero". Se hace
  **push solo cuando el tope de la rama está en verde** (nunca se rompe el
  build compartido / CI).
- **Rotación de autor:** la guía pide que cada test nuevo lo arranque un
  integrante distinto del grupo, commiteando con su propia identidad de git.
  **Nota para esta sesión:** hasta ahora se trabajó con una sola identidad
  (`lucio <luciocosen@gmail.com>`) porque el usuario decidió avanzar solo en
  esta etapa. Si el grupo se suma a partir de ahora, hay que empezar a rotar
  de verdad desde el próximo test — no hace falta deshacer nada de lo ya
  pusheado.

## 2. Stack instalado y cómo correrlo

TypeScript + Vite (dev server) + Vitest (UT) + Playwright + playwright-bdd
(AT en Gherkin contra el navegador real, vía Chromium headless).

```bash
cd "TP Integrador"
npm run dev    # levanta la app en http://localhost:5173/?word=GATO
npm run test   # corre los unit tests de Ahorcado (Vitest)
npm run at     # genera y corre los acceptance tests (bddgen && playwright test)
```

Dependencias relevantes en `package.json` (`devDependencies`): `vitest`,
`@playwright/test`, `playwright-bdd`, `typescript`, `vite`. Chromium ya está
instalado localmente (`npx playwright install chromium`, ~94 MB, puede no
estar instalado en otra máquina — correrlo si `npm run at` tira error de
browser no encontrado).

## 3. Estructura completa del proyecto en este momento

```
TP Integrador/
  GUIA-ATDD-IA-Ahorcado.md   ← consigna completa del TP, leer primero
  CONTINUAR.md               ← este archivo
  NOTES.md                   ← lista de UTs por AT (entregable pedido por la guía)
  README.md                  ← vacío, sin uso por ahora
  package.json / package-lock.json
  tsconfig.json
  vitest.config.ts           ← unit tests, environment "node", include tests/**/*.test.ts
  playwright.config.ts       ← AT, defineBddConfig (features/**/*.feature + steps),
                                webServer levanta "npm run dev" en :5173
  .gitignore                 ← node_modules/, .features-gen/, test-results/,
                                playwright-report/, coverage/, dist/
  index.html                 ← <div id="app"></div> + <script type="module" src="/src/ui/index.ts">
  src/
    domain/
      Ahorcado.ts             ← TODA la lógica de negocio, sin DOM (ver código abajo)
    ui/
      main.ts                 ← mountApp(root, juego): pinta word/lives/input, sin lógica propia
      index.ts                ← arranque: lee ?word= de la URL (default "GATO") y monta
  tests/
    Ahorcado.test.ts          ← 5 unit tests, todos en verde (ver abajo)
  features/
    iniciar-partida.feature
    acertar-letra.feature
    steps/
      ahorcado.steps.ts       ← steps reutilizables: Given/When/Then ya definidos
```

Carpetas generadas, **no** versionadas (están en `.gitignore`):
`node_modules/`, `.features-gen/` (specs que genera `bddgen` a partir de los
`.feature`), `test-results/`, `playwright-report/`.

> Nota suelta: hay varios `.DS_Store` sueltos en el árbol (macOS). No están
> trackeados por git gracias al `.gitignore` de la raíz del repo
> (`TPAgiles/.gitignore`), no hace falta limpiarlos a mano.

## 4. Código de dominio completo, tal como quedó (`src/domain/Ahorcado.ts`)

```ts
export class Ahorcado {
  private readonly adivinadas = new Set<string>();

  constructor(private readonly palabra: string) {}

  palabraEnmascarada(): string {
    return this.palabra
      .split("")
      .map((letra) => (this.adivinadas.has(letra.toUpperCase()) ? letra : "_"))
      .join(" ");
  }

  vidasRestantes(): number {
    return 6;
  }

  adivinar(letra: string): void {
    this.adivinadas.add(letra.toUpperCase());
  }
}
```

**Punto crítico para la próxima sesión:** `vidasRestantes()` está
**hardcodeado en 6**, no hay ninguna lógica de descuento todavía. `adivinar`
tampoco distingue si la letra está o no en la palabra — solo la agrega al
set de "adivinadas". El AT 3 (Fallar letra) es el que va a forzar a que
`adivinar` sepa diferenciar acierto de fallo y a que `vidasRestantes()` reste.

## 5. Código de UI completo, tal como quedó

`src/ui/main.ts`:

```ts
import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  function render(): void {
    root.innerHTML = `
      <div data-testid="word">${juego.palabraEnmascarada()}</div>
      <div data-testid="lives">${juego.vidasRestantes()}</div>
      <input type="text" />
    `;
    const input = root.querySelector("input")!;
    input.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        juego.adivinar(input.value);
        render();
      }
    });
  }

  render();
}
```

`src/ui/index.ts` (arranque / composition root):

```ts
import { Ahorcado } from "../domain/Ahorcado";
import { mountApp } from "./main";

const params = new URLSearchParams(window.location.search);
const palabra = params.get("word") ?? "GATO";

const root = document.getElementById("app");
if (root) {
  mountApp(root, new Ahorcado(palabra));
}
```

Sin estilos (no hace falta para que los ATs pasen, pero la guía pide mirar
la app en el navegador en cada paso — vale la pena sumar CSS más adelante,
no es parte de ningún AT todavía).

## 6. Tests existentes (todos en verde)

`tests/Ahorcado.test.ts` (Vitest, 5 tests):

```ts
import { describe, it, expect } from "vitest";
import { Ahorcado } from "../src/domain/Ahorcado";

it("una partida nueva muestra la palabra enmascarada con guiones", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.palabraEnmascarada()).toBe("_ _ _ _");
});

it("una partida nueva empieza con 6 vidas", () => {
  const juego = new Ahorcado("GATO");
  expect(juego.vidasRestantes()).toBe(6);
});

it("adivinar una letra presente revela todas sus ocurrencias", () => {
  const juego = new Ahorcado("ALA");
  juego.adivinar("A");
  expect(juego.palabraEnmascarada()).toBe("A _ A");
});

it("adivinar es case-insensitive", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("a");
  expect(juego.palabraEnmascarada()).toBe("_ A _ _");
});

it("acertar una letra no descuenta vidas", () => {
  const juego = new Ahorcado("GATO");
  juego.adivinar("A");
  expect(juego.vidasRestantes()).toBe(6);
});
```

El último test (`acertar una letra no descuenta vidas`) es un caso especial:
al escribirlo **ya estaba en verde**, porque `vidasRestantes()` siempre
devuelve 6 — no hay todavía ningún camino de código que pueda restarle vidas.
No hubo ciclo RED real ahí; se commiteó igual como documentación del
contrato (ver commit `6cf9d30`), pero **no** se inventó un rojo falso. Esto
es importante para la defensa oral: hay que poder explicar por qué ese test
no tuvo rojo.

AT en `features/` (2 features, ambos pasan con `npm run at`):

- `iniciar-partida.feature`: partida con "GATO" → ve `_ _ _ _` y 6 vidas.
- `acertar-letra.feature`: partida con "GATO", adivina "A" → ve `_ A _ _` y
  sigue en 6 vidas.

`features/steps/ahorcado.steps.ts` define y reutiliza:

- `Given una partida con la palabra {string}` → `page.goto(/?word=...)`
- `When el jugador adivina la letra {string}` → busca el único
  `getByRole('textbox')`, hace `fill` + `press('Enter')`
- `Then se ve la palabra {string}` → `expect(getByTestId('word')).toHaveText(...)`
- `Then se ven {int} vidas` → `expect(getByTestId('lives')).toHaveText(...)`

Estos steps están escritos para reutilizarse: el próximo `.feature` (Fallar
letra) puede usar los mismos cuatro steps sin tocar `ahorcado.steps.ts`,
salvo que necesite un step nuevo (p. ej. para "GANASTE"/"PERDISTE" en AT 4/5).

## 7. Historial de commits (orden real, de más viejo a más nuevo)

```
c7baf96 chore: setup proyecto (vitest + playwright-bdd)
0278fc7 RED: AT iniciar partida - ve palabra enmascarada y 6 vidas
f938da3 RED: UT palabraEnmascarada con guiones para palabra nueva
998e774 GREEN: palabraEnmascarada devuelve guiones separados por espacio
d1cf664 RED: UT partida nueva empieza con 6 vidas
29e12c2 GREEN: vidasRestantes devuelve 6 al iniciar
ca08434 GREEN: AT iniciar partida - UI cableada a Ahorcado
c2487d0 docs: completar lista de UTs del AT iniciar partida
5bd7aee RED: AT acertar letra - ve la letra revelada sin perder vidas
bb64467 RED: UT adivinar letra presente revela todas sus ocurrencias
a36ebb5 GREEN: adivinar revela todas las ocurrencias de la letra
0fdae9b RED: UT adivinar es case-insensitive
905d04b GREEN: adivinar y palabraEnmascarada case-insensitive
6cf9d30 test: documentar que acertar letra no descuenta vidas (ya verde, sin logica de descuento aun)
58be86c GREEN: AT acertar letra - input cableado a Ahorcado.adivinar
bedc633 docs: completar lista de UTs del AT acertar letra
2f2a793 docs: agregar CONTINUAR.md con resumen y guia para la proxima sesion
```

Todo pusheado a `origin/main` del repo
`https://github.com/ImJuampiM/AgilesMalizani-Cosentino-Pastorino`, dentro de
la carpeta `TP Integrador/`. Para verificar en cualquier momento:

```bash
git log --oneline -20                          # ver alternancia RED:/GREEN:
git log --format='%h  %an  %ad  %s' --date=iso # autor + fecha + mensaje
git shortlog -sne                              # commits por autor (para chequear rotación)
```

## 8. Troubleshooting que ya pisamos (para no perder tiempo de nuevo)

- **Flake al correr `npm run at` con 2 workers en paralelo:** la primera vez
  que se corrió el AT 2 junto con el AT 1, Playwright lanza 2 workers que
  comparten el mismo `webServer` de Vite. En el arranque en frío del server,
  uno de los workers pegó timeout en `getByRole('textbox')` aunque el código
  estaba bien. Se confirmó con un script de debug manual
  (`@playwright/test` + `chromium.launch()`) que la interacción funcionaba
  perfecto, y al re-correr `npm run at` ya con el server "tibio" pasó limpio
  con 2 workers. **Si vuelve a pasar:** no es necesariamente un bug de
  código — probar `npx playwright test --workers=1` para aislar si es timing
  de arranque o un bug real.
- **Primer `npm run at` antes de que exista `index.html`:** la guía avisa que
  sin `index.html` el primer AT no falla con un assert sino con timeout del
  `webServer` (~60s). Por eso se creó el `index.html` mínimo en el commit de
  setup, **antes** de correr el primer AT — así el rojo es un assert limpio
  y rápido en vez de un timeout largo.

## 9. Qué falta (escalera de ATs, orden sugerido — no obligatorio)

| # | AT | Qué ve/hace el usuario | Depende de |
|---|---|---|---|
| 3 | **Fallar letra** (siguiente) | Tipea letra ausente → palabra igual, vidas 6→5 | `adivinar` distinga acierto/fallo |
| 4 | Ganar | Completa todas las letras → "GANASTE" | AT 2 |
| 5 | Perder | 6 fallos → "PERDISTE" + palabra revelada | AT 3 |
| 6 | Letra repetida | Re-tipear letra ya intentada → no penaliza, informa | AT 2 y 3 |
| 7 | Entrada inválida | Tipea no-letra, o juega con partida terminada | AT 4 y 5 |

La guía aclara que el grupo puede seguir su propio Story Map en vez de este
orden — lo único no negociable es la disciplina del proceso (un AT a la
vez, rojo honesto, lógica en `Ahorcado`).

## 10. Cómo seguir paso a paso — AT 3 (Fallar letra)

1. **Escribir el feature** `features/fallar-letra.feature`:
   ```gherkin
   # language: es
   Característica: Fallar letra

     Escenario: El jugador falla una letra
       Dado una partida con la palabra "GATO"
       Cuando el jugador adivina la letra "E"
       Entonces se ve la palabra "_ _ _ _"
       Y se ven 5 vidas
   ```
   No hace falta tocar `ahorcado.steps.ts`: los 4 steps que usa ya existen y
   se reutilizan tal cual.
2. **Correr `npm run at`** → predicción: rojo, porque `vidasRestantes()`
   sigue devolviendo 6 fijo (no hay forma de que baje a 5 todavía). Confirmar
   y commitear el rojo (`RED: AT fallar letra ...`) **antes** de tocar
   `Ahorcado.ts`.
3. **Enumerar los UTs que hacen falta** (pensarlo en grupo antes de
   escribir código; va a `NOTES.md`). Mínimo:
   - adivinar una letra ausente descuenta una vida (`vidasRestantes()` 6→5)
   - adivinar una letra ausente no la revela en `palabraEnmascarada()`
   - (ya cubierto, no repetir) adivinar una letra presente NO descuenta vidas
4. **Loop interno**, un UT a la vez: escribir test → predecir rojo → correr →
   confirmar → commit `RED:` → mínimo código en `Ahorcado.ts` → correr →
   verde → commit `GREEN:` → ¿refactor? (por ejemplo, distinguir adentro de
   `Ahorcado` qué letras fueron "fallos" vs "aciertos" puede pedir una
   segunda colección interna, o derivarlo comparando contra `this.palabra`).
5. **Cablear UI si hace falta:** probablemente no haga falta tocar
   `main.ts` — ya muestra `lives` desde `vidasRestantes()`, así que en
   cuanto ese método refleje el descuento, el AT debería cerrar solo. Si no
   cierra, revisar si `main.ts` necesita algo más.
6. **Correr `npm run at`**, confirmar verde, **abrir `npm run dev`** y jugar
   un poco a mano (`?word=GATO`, fallar una letra, ver que la vida baje).
7. **Commit `GREEN:` del AT**, actualizar `NOTES.md` con la lista real de
   UTs usados (no la planeada, la que terminó quedando), **push**.
8. Pasar al AT 4 (Ganar), repitiendo el mismo ciclo.

## 11. Reglas a no romper (de la guía, no negociables)

- **No test, no code.** Nunca escribir producción sin un test fallando que
  lo exija.
- **Un paso a la vez.** No adelantarse a resolver dos ATs o dos UTs juntos.
- **Predecir antes de correr.** Decir en voz alta/por escrito si va a ser
  rojo o verde y por qué, después correr y confirmar.
- **Mínimo código.** Solo lo que el test actual exige, nada que "podría
  hacer falta después".
- **El nombre del test lo decide el grupo**, no la IA, aunque la IA tipee.
- **Commit `RED:` apenas se ve el rojo**, antes de escribir una sola línea
  de producción — si te demorás y vas directo al verde, perdés la evidencia.
- **Push solo con el tope en verde.**
- **Rotación de autor real** si el grupo retoma el trabajo en conjunto: cada
  test nuevo lo arranca alguien distinto, con su propia cuenta de git.
