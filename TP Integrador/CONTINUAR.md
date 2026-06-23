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

## 1.bis. Estado de la rotación de autor

- **AT 1 y AT 2:** todos los tests los hizo **Cosentino** (`lucio`).
- **AT 3 y AT 4:** todos los tests los hizo **Malizani** (`JuanPabloMalizani`).
- **AT 5 y AT 6:** los hizo **Pastorino** (`Juan Jose Pastorino`).

Los tres integrantes tienen participación en el TP. De aquí en adelante
conviene seguir rotando **test por test**. **El próximo AT (el 7) debería
arrancarlo Cosentino o Malizani** para mantener la rotación.

Que cada integrante fije **una sola** identidad de git consistente antes de
commitear para no ensuciar `git shortlog -sne`.

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
    Ahorcado.test.ts          ← 11 unit tests, todos en verde (ver abajo)
  features/
    iniciar-partida.feature
    acertar-letra.feature
    fallar-letra.feature
    ganar.feature
    perder-partida.feature
    letra-repetida.feature
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

  palabraRevelada(): string {
    return this.palabra.split("").join(" ");
  }

  vidasRestantes(): number {
    return 6 - this.fallos;
  }

  adivinar(letra: string): string {
    const normalizada = letra.toUpperCase();
    if (this.adivinadas.has(normalizada)) {
      return "repetida";
    }
    this.adivinadas.add(normalizada);
    if (!this.palabra.toUpperCase().includes(normalizada)) {
      this.fallos++;
    }
    return "";
  }

  estaGanada(): boolean {
    return this.palabra
      .toUpperCase()
      .split("")
      .every((letra) => this.adivinadas.has(letra));
  }

  estaPerdida(): boolean {
    return this.vidasRestantes() <= 0;
  }
}
```

**Notas para la próxima sesión:**

- `adivinar()` ahora retorna `string`: `"repetida"` si la letra ya fue
  intentada (early return, sin penalizar), `""` en caso normal.
- `estaPerdida()` devuelve `true` cuando `vidasRestantes() <= 0`.
- `palabraRevelada()` devuelve la palabra completa con espacios entre letras.
- Todavía **no hay validación de entrada** (no se verifica que la letra sea
  una sola letra, ni que no sea un número o símbolo) — eso lo va a forzar el
  **AT 7 (Entrada inválida)**.
- Todavía **no se impide jugar con la partida terminada** — eso también entra
  en el AT 7.

## 5. Código de UI completo, tal como quedó

`src/ui/main.ts`:

```ts
import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  let mensajeRepetida = "";

  function render(): void {
    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeRepetida) {
      mensaje = `<div data-testid="message">${mensajeRepetida}</div>`;
    }

    root.innerHTML = `
      <div data-testid="word">${juego.estaGanada() || juego.estaPerdida() ? juego.palabraRevelada() : juego.palabraEnmascarada()}</div>
      <div data-testid="lives">${juego.vidasRestantes()}</div>
      <input type="text" />
      ${mensaje}
    `;
    const input = root.querySelector("input")!;
    input.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        const valor = input.value.toUpperCase();
        const resultado = juego.adivinar(input.value);
        mensajeRepetida = resultado === "repetida" ? `Ya intentaste la letra ${valor}` : "";
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

La UI ahora maneja tres mensajes posibles: "GANASTE", "PERDISTE" y "Ya
intentaste la letra X". Al ganar o perder muestra la palabra revelada. La
lógica de negocio sigue en el dominio.

## 6. Tests existentes (todos en verde)

`tests/Ahorcado.test.ts` (Vitest, **11 tests**):

1. una partida nueva muestra la palabra enmascarada con guiones
2. una partida nueva empieza con 6 vidas
3. adivinar una letra presente revela todas sus ocurrencias
4. adivinar es case-insensitive
5. acertar una letra no descuenta vidas *(ya verde al escribirlo)*
6. fallar una letra descuenta una vida
7. la partida esta ganada cuando se adivinan todas las letras
8. la partida esta perdida cuando se agotan las vidas
9. palabraRevelada muestra la palabra completa con espacios
10. adivinar una letra ya intentada no descuenta vidas adicionales
11. adivinar una letra ya intentada devuelve "repetida"

AT en `features/` (**6 features**, todos pasan con `npm run at`):

- `iniciar-partida.feature`: "GATO" → ve `_ _ _ _` y 6 vidas.
- `acertar-letra.feature`: adivina "A" → ve `_ A _ _` y sigue en 6 vidas.
- `fallar-letra.feature`: adivina "E" → sigue `_ _ _ _` y baja a 5 vidas.
- `ganar.feature`: adivina G-A-T-O → ve el mensaje "GANASTE".
- `perder-partida.feature`: 6 fallos (B-C-D-F-H-J) → ve "PERDISTE" y "G A T O".
- `letra-repetida.feature`: adivina "E" dos veces → vidas en 5 y "Ya intentaste la letra E".

`features/steps/ahorcado.steps.ts` define y reutiliza **5 steps**:

- `Dado una partida con la palabra {string}` → `page.goto(/?word=...)`
- `Cuando el jugador adivina la letra {string}` → `fill` + `press('Enter')`
- `Entonces se ve la palabra {string}` → `getByTestId('word')`
- `Entonces se ven {int} vidas` → `getByTestId('lives')`
- `Entonces se ve el mensaje {string}` → `getByTestId('message')`

## 7. Historial de commits del TP (de más viejo a más nuevo)

```
chore: setup proyecto (vitest + playwright-bdd)
─────────────────────  AT 1-2 — autor: Cosentino (lucio)  ──────────────────
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
docs:  CONTINUAR.md
─────────────────────  AT 3-4 — autor: Malizani  ───────────────────────────
RED:   AT fallar letra - al fallar una letra bajan las vidas a 5
RED:   UT fallar una letra descuenta una vida
GREEN: vidasRestantes descuenta los fallos al adivinar letra ausente
GREEN: AT fallar letra - las vidas bajan a 5 sin tocar la UI
RED:   AT ganar - completar la palabra muestra el mensaje GANASTE
RED:   UT la partida esta ganada cuando se adivinan todas las letras
GREEN: estaGanada devuelve true cuando se adivinaron todas las letras
GREEN: AT ganar - la UI muestra GANASTE al completar la palabra
─────────────────────  AT 5-6 — autor: Pastorino  ──────────────────────────
RED:   AT perder partida - 6 fallos muestra PERDISTE y la palabra revelada
RED:   UT la partida esta perdida cuando se agotan las vidas
GREEN: estaPerdida devuelve true cuando se agotan las 6 vidas
RED:   UT palabraRevelada muestra la palabra completa con espacios
GREEN: palabraRevelada devuelve la palabra completa con espacios
GREEN: AT perder partida - la UI muestra PERDISTE y la palabra revelada
docs:  bitacora y lista de UTs del AT 5
RED:   AT letra repetida - no penaliza e informa al repetir letra
RED:   UT adivinar letra ya intentada no descuenta vidas adicionales
GREEN: adivinar ignora letra ya intentada sin penalizar
RED:   UT adivinar letra ya intentada devuelve repetida
GREEN: adivinar devuelve repetida cuando la letra ya fue intentada
GREEN: AT letra repetida - la UI informa Ya intentaste la letra X
docs:  bitacora y lista de UTs del AT 6
```

Para verificar en cualquier momento:

```bash
git log --oneline                                # alternancia RED:/GREEN:
git log --format='%h  %an  %ad  %s' --date=iso   # autor + fecha + mensaje
git shortlog -sne                                # commits por autor (rotación)
```

## 8. Troubleshooting que ya pisamos

- **Máquina nueva con Windows — `npm run at` no arranca el dev server:** al
  correr por primera vez en una máquina Windows, Vite/rolldown puede crashear
  con `Cannot find native binding ... @rolldown/binding-win32-x64-msvc`. Es
  el bug conocido de npm con dependencias opcionales: el `package-lock.json`
  versionado fue generado en macOS y no lista el binario nativo de Windows.
  **Fix:** `npm install --no-save @rolldown/binding-win32-x64-msvc@<misma
  versión que rolldown>`. Verificar versión con
  `node -e "console.log(require('./node_modules/rolldown/package.json').version)"`.
  En la sesión 3 el binding ya vino incluido en `npm install`.
- **Máquina nueva — falta el navegador de Playwright:** si `npm run at` falla
  con `browserType.launch: Executable doesn't exist`, correr
  `npx playwright install chromium` (~114 MB).
- **`npm run at` falla con "bddgen no se reconoce":** en Windows/PowerShell
  el script `bddgen && playwright test` puede fallar. Usar directamente:
  `npx bddgen; npx playwright test`.
- **Política de ejecución de PowerShell:** si `npm` falla con
  `UnauthorizedAccess`, usar:
  `powershell -ExecutionPolicy Bypass -Command "npm run ..."`.
- **Aviso de versión de Node:** Vite 8 pide Node ≥20.19; con Node 20.13 sale
  un warning pero funcionó igual.

## 9. Qué falta (escalera de ATs, orden sugerido — no obligatorio)

| # | AT | Qué ve/hace el usuario | Estado |
|---|---|---|---|
| 1 | Iniciar partida | "GATO" → `_ _ _ _` y 6 vidas | ✅ verde |
| 2 | Acertar letra | "A" → `_ A _ _`, vidas 6 | ✅ verde |
| 3 | Fallar letra | "E" → `_ _ _ _`, vidas 6→5 | ✅ verde |
| 4 | Ganar | completa la palabra → "GANASTE" | ✅ verde |
| 5 | Perder | 6 fallos → "PERDISTE" + palabra revelada | ✅ verde |
| 6 | Letra repetida | re-tipear letra ya intentada → no penaliza, informa | ✅ verde |
| 7 | **Entrada inválida** (siguiente) | tipea no-letra, o juega con partida terminada | ⬜ pendiente |

## 10. Cómo seguir paso a paso — AT 7 (Entrada inválida)

> **Rotación:** el AT 7 debería arrancarlo **Cosentino o Malizani** (los AT
> 5-6 los hizo Pastorino).

El AT 7 cubre dos comportamientos:
1. **Entrada no válida:** el jugador tipea algo que no es una sola letra
   (un número, un símbolo, una cadena vacía, o más de un carácter). La app
   no debe procesar la jugada y debe informar al usuario.
2. **Jugar con la partida terminada:** el jugador tipea una letra cuando
   la partida ya está ganada o perdida. La app no debe procesar la jugada.

Se puede dividir en uno o dos features; decisión del grupo.

### Paso a paso sugerido:

1. **Escribir el feature** `features/entrada-invalida.feature`. Borrador:
   ```gherkin
   # language: es
   Característica: Entrada inválida

     Escenario: El jugador tipea algo que no es una letra
       Dado una partida con la palabra "GATO"
       Cuando el jugador adivina la letra "3"
       Entonces se ven 6 vidas
       Y se ve el mensaje "Entrada no válida"

     Escenario: El jugador intenta jugar con la partida terminada
       Dado una partida con la palabra "GATO"
       Cuando el jugador adivina la letra "B"
       Y el jugador adivina la letra "C"
       Y el jugador adivina la letra "D"
       Y el jugador adivina la letra "F"
       Y el jugador adivina la letra "H"
       Y el jugador adivina la letra "J"
       Y el jugador adivina la letra "A"
       Entonces se ven 0 vidas
       Y se ve el mensaje "PERDISTE"
   ```
   (Elegir los escenarios que el grupo considere representativos.)

2. **Correr `npm run at`** → predicción: rojo, porque la app no valida
   entrada. Commitear el rojo (`RED: AT entrada inválida ...`) **antes**
   de tocar `Ahorcado.ts`.

3. **Enumerar los UTs** (a `NOTES.md`). Mínimo probable:
   - adivinar una entrada que no es una letra no la procesa ni penaliza
   - adivinar con la partida terminada no la procesa
   - (decisión de diseño) ¿`adivinar()` devuelve un string como "invalida"
     o "terminada" para que la UI pueda informar?

4. **Loop interno**, un UT a la vez: test → predecir rojo → correr →
   confirmar → commit `RED:` → mínimo código en `Ahorcado.ts` → verde →
   commit `GREEN:` → ¿refactor?

5. **Cablear UI:** en `main.ts`, manejar los nuevos retornos de `adivinar()`
   o impedir el envío cuando la partida terminó.

6. **Correr `npm run at`**, confirmar verde, **abrir `npm run dev`** y jugar
   a mano.

7. **Commit `GREEN:` del AT**, actualizar `NOTES.md` y `BITACORA.md`, **push**
   (solo con el tope en verde).

## 11. Reglas a no romper (de la guía, no negociables)

- **No test, no code.** Nunca producción sin un test fallando que lo exija.
- **Un paso a la vez.** No adelantarse a dos ATs o dos UTs juntos.
- **Predecir antes de correr.** Decir si va a ser rojo o verde y por qué,
  después correr y confirmar.
- **Mínimo código.** Solo lo que el test actual exige.
- **El nombre del test lo decide el grupo**, no la IA, aunque la IA tipee.
- **Commit `RED:` apenas se ve el rojo**, antes de escribir producción.
- **Push solo con el tope en verde.**
- **Rotación de autor real**: cada test nuevo lo arranca alguien distinto,
  con su propia cuenta de git.
- **Registrar cada paso en `BITACORA.md`** a medida que se avanza.
