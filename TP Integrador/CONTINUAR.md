# Cómo seguir — TP Ahorcado (ATDD)

Este archivo es el prompt/resumen para arrancar la próxima sesión. Pegá su
contenido (o decí "leé CONTINUAR.md") al asistente para retomar exactamente
donde quedó, sin tener que re-explicar nada.

> Para el detalle paso a paso con fechas y horas de TODO lo realizado, ver
> `BITACORA.md` (en esta misma carpeta). Este archivo es el resumen + la guía
> de lo que falta; la bitácora es el registro cronológico.

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

## 1.bis. Estado de la rotación de autor (LEER — punto débil a corregir)

La regla 7 de la guía (rotación de autor) es **no negociable** y hoy es lo más
flojo del trabajo. Estado real al cierre del AT 4:

- **AT 1 y AT 2:** todos los tests los hizo **Cosentino** (`lucio`).
- **AT 3 y AT 4:** todos los tests los hizo **Malizani** (`JuanPabloMalizani`).
- **Pastorino todavía NO participó del TP del Ahorcado.** (Tiene commits en
  otras partes del repo, con autor `unknown`, pero no en esta carpeta.)

Es decir: hay rotación por *bloque de ATs*, no *por test*, y falta un
integrante. **Qué hacer en las próximas sesiones (sin deshacer nada de lo
hecho):**

1. Que el **próximo AT (el 5, Perder) lo arranque Pastorino** con su propia
   identidad, y de ahí en más roten **test por test**.
2. Que cada integrante fije **una sola** identidad de git consistente
   (`git config user.name` y `git config user.email`) antes de commitear.
   Hoy hay 5 firmas para 3 personas y eso ensucia `git shortlog -sne`:
   - Malizani: `JuanPabloMalizani <jmalizani@frro.utn.edu.ar>` y
     `Juan Pablo Malizani <…ImJuampiM@…>`.
   - Cosentino: `lucio <luciocosen@gmail.com>` y
     `Lucio Cosentino <…Luciocos@…>`.
   - Pastorino: `unknown <juanjosepastorino@gmail.com>` (sin nombre).
   La historia vieja NO se reescribe (rebase es riesgoso); se ordena de acá
   en adelante.

## 2. Stack instalado y cómo correrlo

TypeScript + Vite (dev server) + Vitest (UT) + Playwright + playwright-bdd
(AT en Gherkin contra el navegador real, vía Chromium headless).

```bash
cd "TP Integrador"
npm install   # primera vez en una máquina nueva (ver Troubleshooting §8)
npm run dev    # levanta la app en http://localhost:5173/?word=GATO
npm run test   # corre los unit tests de Ahorcado (Vitest)
npm run at     # genera y corre los acceptance tests (bddgen && playwright test)
```

## 3. Estructura completa del proyecto en este momento

```
TP Integrador/
  GUIA-ATDD-IA-Ahorcado.md   ← consigna completa del TP, leer primero
  CONTINUAR.md               ← este archivo (resumen + qué falta)
  BITACORA.md                ← registro cronológico paso a paso con fecha/hora
  NOTES.md                   ← lista de UTs por AT (entregable pedido por la guía)
  README.md                  ← vacío, sin uso por ahora
  package.json / package-lock.json
  tsconfig.json
  vitest.config.ts           ← unit tests, environment "node"
  playwright.config.ts       ← AT, defineBddConfig + webServer en :5173
  .gitignore
  index.html                 ← <div id="app"></div> + script al arranque
  src/
    domain/
      Ahorcado.ts             ← TODA la lógica de negocio, sin DOM (código abajo)
    ui/
      main.ts                 ← mountApp(root, juego): pinta word/lives/input/mensaje
      index.ts                ← arranque: lee ?word= de la URL (default "GATO")
  tests/
    Ahorcado.test.ts          ← 7 unit tests, todos en verde (ver abajo)
  features/
    iniciar-partida.feature
    acertar-letra.feature
    fallar-letra.feature
    ganar.feature
    steps/
      ahorcado.steps.ts       ← 5 steps reutilizables (Given/When/Then)
```

Carpetas generadas, **no** versionadas (`.gitignore`): `node_modules/`,
`.features-gen/`, `test-results/`, `playwright-report/`.

## 4. Código de dominio completo, tal como quedó (`src/domain/Ahorcado.ts`)

```ts
export class Ahorcado {
  private readonly adivinadas = new Set<string>();
  private fallos = 0;

  constructor(private readonly palabra: string) {}

  palabraEnmascarada(): string {
    return this.palabra
      .split("")
      .map((letra) => (this.adivinadas.has(letra.toUpperCase()) ? letra : "_"))
      .join(" ");
  }

  vidasRestantes(): number {
    return 6 - this.fallos;
  }

  adivinar(letra: string): void {
    const normalizada = letra.toUpperCase();
    this.adivinadas.add(normalizada);
    if (!this.palabra.toUpperCase().includes(normalizada)) {
      this.fallos++;
    }
  }

  estaGanada(): boolean {
    return this.palabra
      .toUpperCase()
      .split("")
      .every((letra) => this.adivinadas.has(letra));
  }
}
```

**Notas para la próxima sesión:**

- `vidasRestantes()` ya descuenta: es `6 - fallos`. Todavía **no hay tope en 0
  ni concepto de "partida perdida"** — eso lo va a forzar el **AT 5 (Perder)**.
- `adivinar` guarda en `adivinadas` **tanto aciertos como fallos**. Hoy es
  inofensivo (una letra ausente nunca se revela), pero cuando llegue el
  **AT 6 (letra repetida)** probablemente convenga distinguir mejor aciertos
  de fallos para no penalizar dos veces la misma letra.
- `estaGanada()` es true cuando todas las letras de la palabra fueron
  adivinadas. No existe todavía `estaPerdida()` ni un estado de "terminada".

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
      ${juego.estaGanada() ? `<div data-testid="message">GANASTE</div>` : ""}
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

`src/ui/index.ts` (arranque / composition root, sin cambios):

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

El `data-testid="message"` solo aparece cuando `juego.estaGanada()` es true.
La decisión sigue en el dominio: la UI solo *pregunta*. Sin estilos todavía.

## 6. Tests existentes (todos en verde)

`tests/Ahorcado.test.ts` (Vitest, **7 tests**):

1. una partida nueva muestra la palabra enmascarada con guiones
2. una partida nueva empieza con 6 vidas
3. adivinar una letra presente revela todas sus ocurrencias
4. adivinar es case-insensitive
5. acertar una letra no descuenta vidas *(ya estaba verde al escribirlo; sin
   ciclo rojo real, documentado honestamente — importante para la defensa)*
6. fallar una letra descuenta una vida *(vidasRestantes 6→5)*
7. la partida está ganada cuando se adivinan todas las letras *(estaGanada)*

AT en `features/` (**4 features**, todos pasan con `npm run at`):

- `iniciar-partida.feature`: "GATO" → ve `_ _ _ _` y 6 vidas.
- `acertar-letra.feature`: adivina "A" → ve `_ A _ _` y sigue en 6 vidas.
- `fallar-letra.feature`: adivina "E" (ausente) → sigue `_ _ _ _` y baja a 5 vidas.
- `ganar.feature`: adivina G-A-T-O → ve el mensaje "GANASTE".

`features/steps/ahorcado.steps.ts` define y reutiliza **5 steps**:

- `Dado una partida con la palabra {string}` → `page.goto(/?word=...)`
- `Cuando el jugador adivina la letra {string}` → `fill` + `press('Enter')`
- `Entonces se ve la palabra {string}` → `getByTestId('word')`
- `Entonces se ven {int} vidas` → `getByTestId('lives')`
- `Entonces se ve el mensaje {string}` → `getByTestId('message')`

## 7. Historial de commits del TP (de más viejo a más nuevo)

```
chore: setup proyecto (vitest + playwright-bdd)
RED:   AT iniciar partida - ve palabra enmascarada y 6 vidas
RED:   UT palabraEnmascarada con guiones para palabra nueva
GREEN: palabraEnmascarada devuelve guiones separados por espacio
RED:   UT partida nueva empieza con 6 vidas
GREEN: vidasRestantes devuelve 6 al iniciar
GREEN: AT iniciar partida - UI cableada a Ahorcado
docs:  completar lista de UTs del AT iniciar partida
RED:   AT acertar letra - ve la letra revelada sin perder vidas
RED:   UT adivinar letra presente revela todas sus ocurrencias
GREEN: adivinar revela todas las ocurrencias de la letra
RED:   UT adivinar es case-insensitive
GREEN: adivinar y palabraEnmascarada case-insensitive
test:  documentar que acertar letra no descuenta vidas (ya verde)
GREEN: AT acertar letra - input cableado a Ahorcado.adivinar
docs:  completar lista de UTs del AT acertar letra
docs:  CONTINUAR.md (resumen para la próxima sesión, + ampliación)
─────────────────────  AT 3 (Fallar letra) — autor: Malizani  ──────────────
RED:   AT fallar letra - al fallar una letra bajan las vidas a 5
docs:  agregar bitacora del TP con el avance paso a paso
RED:   UT fallar una letra descuenta una vida
GREEN: vidasRestantes descuenta los fallos al adivinar letra ausente
GREEN: AT fallar letra - las vidas bajan a 5 sin tocar la UI
─────────────────────  AT 4 (Ganar) — autor: Malizani  ─────────────────────
RED:   AT ganar - completar la palabra muestra el mensaje GANASTE
docs:  bitacora - RED del AT 4 ganar
RED:   UT la partida esta ganada cuando se adivinan todas las letras
GREEN: estaGanada devuelve true cuando se adivinaron todas las letras
GREEN: AT ganar - la UI muestra GANASTE al completar la palabra
```

Para verificar en cualquier momento:

```bash
git log --oneline                                # alternancia RED:/GREEN:
git log --format='%h  %an  %ad  %s' --date=iso   # autor + fecha + mensaje
git shortlog -sne                                # commits por autor (rotación)
```

## 8. Troubleshooting que ya pisamos (para no perder tiempo de nuevo)

- **Máquina nueva con Windows — `npm run at` no arranca el dev server:** al
  correr por primera vez en una máquina Windows, Vite/rolldown crashea con
  `Cannot find native binding ... @rolldown/binding-win32-x64-msvc`. Es el bug
  conocido de npm con dependencias opcionales: el `package-lock.json`
  versionado fue generado en macOS y no lista el binario nativo de Windows.
  **Fix usado:** `npm install --no-save @rolldown/binding-win32-x64-msvc@<misma
  versión que rolldown>` (el binario queda en `node_modules`, que está
  ignorado; restaurar el `package-lock.json` después si npm lo tocó, para no
  versionar algo específico de Windows). Ver la versión de rolldown con
  `node -e "console.log(require('./node_modules/rolldown/package.json').version)"`.
- **Máquina nueva — falta el navegador de Playwright:** si `npm run at` falla
  con `browserType.launch: Executable doesn't exist`, correr
  `npx playwright install chromium` (~114 MB).
- **Aviso de versión de Node:** Vite 8 pide Node ≥20.19; con Node 20.13 sale un
  warning pero funcionó igual. Si da problemas, actualizar Node.
- **Flake con 2+ workers en arranque en frío:** la primera corrida de `npm run
  at` puede pegar timeout en `getByRole('textbox')` por el arranque en frío del
  webServer compartido. Re-correr suele bastar; si persiste, aislar con
  `npx playwright test --workers=1`.

## 9. Qué falta (escalera de ATs, orden sugerido — no obligatorio)

| # | AT | Qué ve/hace el usuario | Estado |
|---|---|---|---|
| 1 | Iniciar partida | "GATO" → `_ _ _ _` y 6 vidas | ✅ verde |
| 2 | Acertar letra | "A" → `_ A _ _`, vidas 6 | ✅ verde |
| 3 | Fallar letra | "E" → `_ _ _ _`, vidas 6→5 | ✅ verde |
| 4 | Ganar | completa la palabra → "GANASTE" | ✅ verde |
| 5 | **Perder** (siguiente) | 6 fallos → "PERDISTE" + palabra revelada | ⬜ pendiente |
| 6 | Letra repetida | re-tipear letra ya intentada → no penaliza, informa | ⬜ pendiente |
| 7 | Entrada inválida | tipea no-letra, o juega con partida terminada | ⬜ pendiente |

## 10. Cómo seguir paso a paso — AT 5 (Perder)

> **Idealmente este AT lo arranca Pastorino**, con su identidad de git, para
> empezar la rotación real (ver §1.bis).

1. **Escribir el feature** `features/perder-partida.feature`. Necesita 6 fallos
   para agotar las vidas. Borrador:
   ```gherkin
   # language: es
   Característica: Perder

     Escenario: El jugador agota las vidas
       Dado una partida con la palabra "GATO"
       Cuando el jugador adivina la letra "B"
       Y el jugador adivina la letra "C"
       Y el jugador adivina la letra "D"
       Y el jugador adivina la letra "F"
       Y el jugador adivina la letra "H"
       Y el jugador adivina la letra "J"
       Entonces se ve el mensaje "PERDISTE"
   ```
   (Elegir 6 letras que NO estén en "GATO". El step "se ve el mensaje {string}"
   ya existe y se reutiliza; quizá haga falta un step nuevo para "se revela la
   palabra" si el grupo decide mostrarla.)
2. **Correr `npm run at`** → predicción: rojo, porque la app no muestra
   "PERDISTE". Commitear el rojo (`RED: AT perder ...`) **antes** de tocar
   `Ahorcado.ts`.
3. **Enumerar los UTs** (a `NOTES.md`). Mínimo probable:
   - la partida está perdida cuando se agotan las vidas (`estaPerdida()` true
     tras 6 fallos) → fuerza un método nuevo en `Ahorcado`.
   - (decisión de diseño) ¿las vidas se frenan en 0?, ¿se puede seguir jugando
     con la partida terminada? (esto último puede empujar hacia el AT 7).
4. **Loop interno**, un UT a la vez: test → predecir rojo → correr → confirmar →
   commit `RED:` → mínimo código en `Ahorcado.ts` (ej. `estaPerdida()` =
   `vidasRestantes() <= 0`) → verde → commit `GREEN:` → ¿refactor?
5. **Cablear UI:** en `main.ts`, mostrar `<div data-testid="message">PERDISTE
   </div>` cuando `juego.estaPerdida()`. OJO: hoy el mensaje de "GANASTE" se
   decide con un ternario; con dos mensajes posibles conviene pensar cómo
   quedan (¿un solo lugar que muestre GANASTE o PERDISTE según el estado?).
   La lógica del *qué* mensaje corresponde sigue yendo en `Ahorcado`.
6. **Correr `npm run at`**, confirmar verde, **abrir `npm run dev`** y jugar a
   mano (fallar 6 veces, ver "PERDISTE").
7. **Commit `GREEN:` del AT**, actualizar `NOTES.md` y `BITACORA.md`, **push**
   (solo con el tope en verde).
8. Pasar al AT 6 (Letra repetida), repitiendo el ciclo y **rotando autor**.

## 11. Reglas a no romper (de la guía, no negociables)

- **No test, no code.** Nunca producción sin un test fallando que lo exija.
- **Un paso a la vez.** No adelantarse a dos ATs o dos UTs juntos.
- **Predecir antes de correr.** Decir si va a ser rojo o verde y por qué, después
  correr y confirmar.
- **Mínimo código.** Solo lo que el test actual exige.
- **El nombre del test lo decide el grupo**, no la IA, aunque la IA tipee.
- **Commit `RED:` apenas se ve el rojo**, antes de escribir producción.
- **Push solo con el tope en verde.**
- **Rotación de autor real** (ver §1.bis): cada test nuevo lo arranca alguien
  distinto, con su propia cuenta de git. Es hoy el punto más flojo del trabajo.
- **Registrar cada paso en `BITACORA.md`** a medida que se avanza.
```

