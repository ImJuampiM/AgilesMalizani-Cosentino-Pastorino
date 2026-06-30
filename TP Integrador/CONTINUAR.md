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
- **AT 7:** lo hizo **Cosentino** (`lucio`).
- **Aprobación Directa — Feature 1 (Palabra al azar):** la hizo **Malizani**
  (`JuanPabloMalizani`).
- **Aprobación Directa — Feature 2 (Dibujo progresivo del muñeco):** la hizo
  **Pastorino** (`Juan Jose Pastorino`).
- **Aprobación Directa — Feature 3 (Teclado en pantalla):** la hizo
  **Cosentino** (`lucio`).

Los tres integrantes tienen participación en el TP. La escalera de 7 ATs de
la guía está **completa** y avanza el desafío de Aprobación Directa (§10) con
3 features completadas (F1 Palabra al azar — Malizani, F2 Dibujo progresivo —
Pastorino, F3 Teclado en pantalla — Cosentino). La rotación quedó equilibrada:
Cosentino AT 1, 2, 7 y F3; Malizani AT 3, 4 y F1; Pastorino AT 5, 6 y F2. Para
la **próxima** feature nueva (F4) conviene que arranque **Malizani** o
**Pastorino** para mantener el balance.

Que cada integrante fije **una sola** identidad de git consistente antes de
commitear para no ensuciar `git shortlog -sne`.

## 2. Stack instalado y cómo correrlo

TypeScript + Vite (dev server) + Vitest (UT) + Playwright + playwright-bdd
(AT en Gherkin contra el navegador real, vía Chromium headless).

> **Requiere Node 22 LTS o superior** (la toolchain de rolldown rompe con Node
> 21 o inferior — ver Troubleshooting §8).

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
      elegirPalabra.ts        ← elige palabra de una lista con un rng inyectable (Aprobación Directa F1)
    ui/
      main.ts                 ← mountApp(root, juego): pinta hangman/word/lives/used-keys/input/mensaje
      index.ts                ← arranque: ?word= o, si no, palabra al azar de la lista (?seed= determinista)
  tests/
    Ahorcado.test.ts          ← 19 unit tests, todos en verde (ver abajo)
    elegirPalabra.test.ts     ← 2 unit tests del selector de palabra al azar
  features/
    iniciar-partida.feature
    acertar-letra.feature
    fallar-letra.feature
    ganar.feature
    perder-partida.feature
    letra-repetida.feature
    entrada-invalida.feature  ← 2 escenarios (no-letra / partida terminada)
    palabra-al-azar.feature   ← Aprobación Directa F1: sin ?word= toma una de la lista
    dibujo-progresivo.feature ← Aprobación Directa F2: muñeco progresivo 0→6 errores
    teclado-en-pantalla.feature ← Aprobación Directa F3: muestra las letras ya usadas
    steps/
      ahorcado.steps.ts       ← 9 steps reutilizables (Given/When/Then)
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
    if (this.estaGanada() || this.estaPerdida()) {
      return "terminada";
    }
    const normalizada = letra.toUpperCase();
    if (!/^[A-Z]$/.test(normalizada)) {
      return "invalida";
    }
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

  // ... PARTES (F2) y partesVisibles(): slice(0, fallos) ...

  letrasUsadas(): string[] {
    return [...this.adivinadas];
  }
}
```

Módulo de dominio de Aprobación Directa F1 (`src/domain/elegirPalabra.ts`):

```ts
export function elegirPalabra(lista: string[], rng: () => number): string {
  return lista[Math.floor(rng() * lista.length)];
}
```

El `rng` se inyecta por parámetro (no se usa `Math.random` dentro del dominio)
para poder testear determinista con un rng falso. La lista de palabras y la
fuente real de azar viven en el composition root (`index.ts`), no en el dominio.

**Notas sobre el estado del dominio:**

- `adivinar()` retorna un `string` que la UI usa para decidir qué mensaje
  mostrar. Posibles retornos, en orden de chequeo:
  - `"terminada"`: la partida ya está ganada o perdida → no procesa la jugada.
  - `"invalida"`: la entrada no es exactamente una letra A-Z (número,
    símbolo, vacío, más de un carácter) → no procesa ni penaliza.
  - `"repetida"`: la letra ya fue intentada → no penaliza.
  - `""`: jugada normal (acierto o fallo nuevo).
- `estaPerdida()` devuelve `true` cuando `vidasRestantes() <= 0`.
- `palabraRevelada()` devuelve la palabra completa con espacios entre letras.
- **La escalera de 7 ATs de la guía está completa.** El dominio cubre:
  enmascarar, revelar, contar fallos, ganar, perder, letra repetida,
  validación de entrada y bloqueo de jugadas con la partida terminada.
- Lo que sigue (si encaran Aprobación Directa) son **features nuevas** a
  elección — ver §10.

## 5. Código de UI completo, tal como quedó

`src/ui/main.ts`:

```ts
import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  let mensajeAviso = "";

  function render(): void {
    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeAviso) {
      mensaje = `<div data-testid="message">${mensajeAviso}</div>`;
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
        if (resultado === "repetida") {
          mensajeAviso = `Ya intentaste la letra ${valor}`;
        } else if (resultado === "invalida") {
          mensajeAviso = "Entrada no válida";
        } else {
          mensajeAviso = "";
        }
        render();
      }
    });
  }

  render();
}
```

`src/ui/index.ts` (arranque / composition root — actualizado en F1 para la
palabra al azar):

```ts
import { Ahorcado } from "../domain/Ahorcado";
import { elegirPalabra } from "../domain/elegirPalabra";
import { mountApp } from "./main";

const PALABRAS = ["PERRO", "CABALLO", "ELEFANTE", "TIGRE", "LEON"];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");

let palabra: string;
if (wordParam !== null) {
  palabra = wordParam;
} else {
  const rng =
    seedParam !== null ? () => Number(seedParam) / PALABRAS.length : Math.random;
  palabra = elegirPalabra(PALABRAS, rng);
}

const root = document.getElementById("app");
if (root) {
  mountApp(root, new Ahorcado(palabra));
}
```

Seams de la URL: `?word=GATO` fuerza la palabra (back-compat, lo usan los 8 AT
de la escalera base); sin `?word=` el juego elige al azar de `PALABRAS`;
`?seed=N` arma un rng determinista (`N / longitud`) para que el AT pueda
asertar una palabra concreta (seed 0 → primera de la lista, "PERRO"). Sin seed
y sin word, usa `Math.random`.

La UI maneja los mensajes posibles: "GANASTE", "PERDISTE", "Ya intentaste la
letra X" y "Entrada no válida". Al ganar o perder muestra la palabra
revelada. Toda decisión de negocio sigue en el dominio: la UI solo traduce
el `string` que devuelve `adivinar()` en un mensaje en pantalla.

## 6. Tests existentes (todos en verde)

`tests/Ahorcado.test.ts` + `tests/elegirPalabra.test.ts` (Vitest, **21 tests**):

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
12. adivinar un caracter que no es una letra no descuenta vidas
13. adivinar con la partida ya perdida no se procesa (no puede ganarse después)
14. elegirPalabra con un rng que devuelve 0 elige la primera palabra de la lista
15. elegirPalabra con un rng cercano a 1 elige la última palabra de la lista
16. partesVisibles devuelve un array vacío con 0 errores
17. partesVisibles devuelve "cabeza" con 1 error
18. partesVisibles devuelve las 6 partes con 6 errores
19. una partida nueva no tiene letras usadas (array vacío)
20. adivinar una letra la agrega a las letras usadas
21. las letras usadas incluyen aciertos y fallos en orden de intento

AT en `features/` (**10 features**, todos pasan con `npm run at` — 11 escenarios
en total, porque `entrada-invalida` tiene 2):

- `iniciar-partida.feature`: "GATO" → ve `_ _ _ _` y 6 vidas.
- `acertar-letra.feature`: adivina "A" → ve `_ A _ _` y sigue en 6 vidas.
- `fallar-letra.feature`: adivina "E" → sigue `_ _ _ _` y baja a 5 vidas.
- `ganar.feature`: adivina G-A-T-O → ve el mensaje "GANASTE".
- `perder-partida.feature`: 6 fallos (B-C-D-F-H-J) → ve "PERDISTE" y "G A T O".
- `letra-repetida.feature`: adivina "E" dos veces → vidas en 5 y "Ya intentaste la letra E".
- `entrada-invalida.feature`: (1) adivina "3" → sigue en 6 vidas y "Entrada no
  válida"; (2) tras perder, completar las letras restantes sigue mostrando
  "PERDISTE" (no "GANASTE").
- `palabra-al-azar.feature`: con `?seed=0` y sin `?word=` → ve `_ _ _ _ _`
  (PERRO, primera de la lista) y 6 vidas.
- `dibujo-progresivo.feature`: al iniciar no hay partes; tras 1 fallo muestra
  "cabeza"; tras 6 fallos muestra las 6 partes del muñeco.
- `teclado-en-pantalla.feature`: con "GATO", tras adivinar "A" y "E" se ven las
  letras usadas "A, E".

`features/steps/ahorcado.steps.ts` define y reutiliza **9 steps**:

- `Dado una partida con la palabra {string}` → `page.goto(/?word=...)`
- `Dado una partida al azar con la semilla {int}` → `page.goto(/?seed=...)`
- `Cuando el jugador adivina la letra {string}` → `fill` + `press('Enter')`
- `Entonces se ve la palabra {string}` → `getByTestId('word')`
- `Entonces se ven {int} vidas` → `getByTestId('lives')`
- `Entonces se ve el mensaje {string}` → `getByTestId('message')`
- `Entonces el muñeco no tiene partes` → `getByTestId('hangman')` vacío
- `Entonces el muñeco muestra {string}` → `getByTestId('hangman')` texto
- `Entonces las letras usadas son {string}` → `getByTestId('used-keys')` texto

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
Realizado: AT 5 - 6
─────────────────────  AT 7 — autor: Cosentino (lucio)  ────────────────────
RED:   AT entrada invalida - tipear un caracter que no es letra no debe procesarse
RED:   UT adivinar caracter no letra no descuenta vidas
GREEN: adivinar rechaza caracteres que no son una letra
GREEN: AT entrada invalida - UI muestra Entrada no valida
RED:   AT entrada invalida - jugar con la partida ya terminada no debe procesarse
RED:   UT adivinar con partida perdida no debe ganarse despues
GREEN: adivinar no procesa jugadas cuando la partida ya termino
docs:  bitacora y lista de UTs del AT 7 entrada invalida
```

Para verificar en cualquier momento:

```bash
git log --oneline                                # alternancia RED:/GREEN:
git log --format='%h  %an  %ad  %s' --date=iso   # autor + fecha + mensaje
git shortlog -sne                                # commits por autor (rotación)
```

## 8. Troubleshooting que ya pisamos

- **Node 21 o inferior rompe la toolchain (`util.styleText`):** con Node 21.7.1
  (no-LTS, EOL) tanto `npm run test` como `npm run at` crashean al cargar
  rolldown con `TypeError [ERR_INVALID_ARG_VALUE]: ... styleText` sobre
  `["underline","gray"]`. El soporte de arrays de formato en `styleText` recién
  llegó en **Node 22+**. **Fix:** instalar Node 22 LTS o superior (en la sesión
  5 se instaló Node 24.18.0 con `winget install OpenJS.NodeJS.LTS`; abrir una
  terminal nueva y verificar `node --version`). Es un problema de la máquina, no
  del código del TP — el lock compartido corre bien en Node 22+.
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

## 9. Estado de la escalera de ATs (la guía base está COMPLETA)

| # | AT | Qué ve/hace el usuario | Estado |
|---|---|---|---|
| 1 | Iniciar partida | "GATO" → `_ _ _ _` y 6 vidas | ✅ verde |
| 2 | Acertar letra | "A" → `_ A _ _`, vidas 6 | ✅ verde |
| 3 | Fallar letra | "E" → `_ _ _ _`, vidas 6→5 | ✅ verde |
| 4 | Ganar | completa la palabra → "GANASTE" | ✅ verde |
| 5 | Perder | 6 fallos → "PERDISTE" + palabra revelada | ✅ verde |
| 6 | Letra repetida | re-tipear letra ya intentada → no penaliza, informa | ✅ verde |
| 7 | Entrada inválida | tipea no-letra → "Entrada no válida"; jugar con partida terminada no procesa | ✅ verde |

**Los 7 ATs de la guía están completos y en verde.** El juego del Ahorcado
está funcionalmente terminado según la consigna base. Lo que sigue (§10) es
**opcional**: el desafío de Aprobación Directa, **ya iniciado** (Feature 1 —
Palabra al azar — completa y en verde).

## 10. Cómo seguir — Desafío de Aprobación Directa (opcional)

La §9 de `GUIA-ATDD-IA-Ahorcado.md` propone, para Aprobación Directa, elegir
**al menos 4 features nuevas** y construirlas con el mismo proceso (AT en
rojo honesto → UTs sobre el dominio → verde → mirar la app), apuntando a
~100% de cobertura en `src/domain/`.

> **Avance:** Feature 1 (**Palabra al azar**) ✅ completa (Malizani). Feature 2
> (**Dibujo progresivo**) ✅ completa (Pastorino). Feature 3 (**Teclado en
> pantalla**) ✅ completa (Cosentino). Falta **al menos 1 feature más** para
> cerrar el desafío.

Ideas de la guía (con dónde vive la lógica testeable):

| Feature | Lógica de dominio a cubrir con UTs |
|---|---|
| ~~Palabra al azar de una lista~~ ✅ hecha | elegir palabra; **seam** para inyectar el azar y testear determinista |
| ~~Dibujo progresivo del ahorcado~~ ✅ hecha | `partesVisibles()`: las partes del muñeco según los errores (0→6) |
| ~~Teclado en pantalla~~ ✅ hecha | `letrasUsadas()`: letras ya intentadas (acertadas/falladas) en orden |
| Soporte de acentos y ñ | normalizar: `á` == `a`, tratar la `ñ` (caso borde de "100% ≠ 0 bugs") |
| Niveles de dificultad | cantidad de vidas y/o longitud de palabra según el nivel |
| Pista / categoría | asociar una categoría o pista a cada palabra |
| Marcador de la sesión | contar partidas ganadas/perdidas en memoria |
| Jugar de nuevo | reiniciar el estado sin recargar la página |
| Dos jugadores | un jugador ingresa la palabra en una pantalla previa |

La guía recomienda especialmente **Palabra al azar** (te obliga a diseñar un
seam para el azar, la lección de testabilidad más transferible) y
**Acentos/ñ** (materializa que 100% de cobertura no es 0 bugs).

### El ciclo es idéntico al de los ATs ya hechos:

1. **Decidir la feature y quién la arranca** (rotar: la próxima (F4) debería
   arrancarla **Malizani** o **Pastorino** — ver §1.bis). Fijar su identidad de
   git.
2. **Escribir el AT** (`features/<nombre>.feature`) → `npm run at` → ver el
   **rojo honesto** → commit `RED:` antes de tocar producción.
3. **Enumerar los UTs** del dominio en `NOTES.md` antes de codear.
4. **Loop interno**, un UT a la vez: rojo → mínimo código → verde →
   ¿refactor? → commits `RED:`/`GREEN:` separados.
5. **Cablear la UI** lo mínimo. Recordar: la lógica nueva va en `Ahorcado`
   (o un nuevo módulo de dominio), **nunca** en `main.ts`.
6. `npm run at` verde → **mirar la app** (`npm run dev`) → commit `GREEN:`
   del AT → actualizar `NOTES.md` y `BITACORA.md` → **push** (solo en verde).

### "Palabra al azar" (F1) — YA IMPLEMENTADA, como referencia de patrón:

Quedó resuelta con el seam de azar inyectable: `elegirPalabra(lista, rng)` en
el dominio (sin `Math.random` adentro) y la fuente real de azar en el
composition root (`index.ts`). Para el AT determinista se expuso `?seed=` en la
URL (mismo espíritu que `?word=`). **Usar este patrón como molde** para las
features nuevas que necesiten azar/efectos: la lógica testeable en un módulo de
dominio con sus dependencias inyectadas, y la UI/composition root solo cablea.

### Estado de verificación actual / antes de la defensa:

`npm run test` (**21 verdes**), `npm run at` (**11 escenarios verdes**),
`git log --oneline` (alternancia RED:/GREEN:) y `git shortlog -sne`
(rotación entre los 3 integrantes). Recordar: **Node 22+** (ver §8).

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

## 12. CI/CD y Deploy (sesión 7 — Cosentino)

### Integración continua (CI) — ✅ funcionando

- Workflow: `.github/workflows/ci.yml`. Corre en cada **push y PR a `main`**.
- Un solo job: **`TP Integrador - Ahorcado (UT + AT)`** (Node 22, ubuntu):
  `npm install` → `npx playwright install --with-deps chromium` →
  `npx vitest run` (21 UT) → `npm run at` (11 AT).
- Se usa `npm install` (no `npm ci`) a propósito: el lockfile fue generado en
  macOS y, por el bug cross-platform de las deps opcionales nativas de rolldown
  (ver §8), `npm ci` puede no traer el binding de Linux y romper Vite en CI.
- El job viejo del `string-calculator` (Python + SonarCloud) **se quitó** de
  este workflow; ahora el CI testea **solo el TP**.
- **Cómo ver si anda:** pestaña **Actions** del repo
  (https://github.com/ImJuampiM/AgilesMalizani-Cosentino-Pastorino/actions);
  cada run muestra ✅/❌/🟡. También aparece el ✅/❌ al lado de cada commit/PR.

### Deploy a GitHub Pages — ⚠️ falta UN paso manual del dueño del repo

- Workflow: `.github/workflows/deploy.yml`. Corre en cada push a `main`
  (y a mano con "Run workflow"). Hace: `npm install` → `npm run build` →
  sube el `dist/` como artifact → `actions/deploy-pages`.
- Build de producción: `npm run build` (script nuevo) usa `vite.config.ts`,
  que pone `base` al subpath del repo **solo en build**
  (`/AgilesMalizani-Cosentino-Pastorino/`); en `dev` queda en `/` para no
  romper los AT de Playwright. `dist/` está en `.gitignore` (no se versiona).
- **Estado:** el step `Build` pasa; el deploy **falla en `Configure Pages`**
  porque **GitHub Pages no está habilitado** en el repo, y el `GITHUB_TOKEN`
  no puede auto-habilitarlo (ni con `enablement: true`).
- **ACCIÓN PENDIENTE (la hace el dueño del repo, ImJuampiM, o un admin):**
  Settings → Pages → **Source: "GitHub Actions"**. Con eso habilitado, el
  próximo push a `main` (o "Run workflow" en Actions → Deploy a GitHub Pages)
  deja la app publicada en:
  **https://imjuampim.github.io/AgilesMalizani-Cosentino-Pastorino/**
  (probar con `?word=GATO` o `?seed=0`). No hay que tocar más código.

## 13. Qué sigue (próxima sesión)

1. **Habilitar Pages** (paso manual de arriba) y verificar el deploy en verde.
2. **Feature 4 de Aprobación Directa** (falta ≥1 para cerrar el desafío):
   la arranca **Malizani** o **Pastorino** (rotación, §1.bis). Candidata
   estrella de la guía: **Acentos/ñ** (normalizar `á`==`a`, tratar `ñ`;
   materializa que 100% de cobertura ≠ 0 bugs). Mismo ciclo de siempre (§10).
