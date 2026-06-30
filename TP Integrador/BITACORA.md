# Bitácora del TP — Ahorcado con ATDD

Registro paso a paso de lo realizado, en orden cronológico, con fecha y hora.
Cada paso corresponde a un commit real del repositorio. No se incluyen
consultas, explicaciones ni discusiones: solo el trabajo efectivamente hecho.

Formato de cada línea: `hora — [ESTADO] descripción (hash del commit)`.
Estados: **RED** (test escrito que falla), **GREEN** (código mínimo que lo
hace pasar), **SETUP/DOCS** (preparación o documentación).

---

## Sesión 1 — 22/06/2026 (autor: lucio)

### Preparación

- **20:20 — [DOCS]** Inicialización del README del proyecto. (`36cd595`)
- **21:26 — [SETUP]** Armado del proyecto: TypeScript + Vitest (unit tests) +
  Playwright + playwright-bdd (acceptance tests en Gherkin). Configs, scripts
  (`dev`, `test`, `at`), `.gitignore` y `index.html` mínimo. (`c7baf96`)

### AT 1 — Iniciar partida

> El usuario empieza con la palabra "GATO" y ve `_ _ _ _` y 6 vidas.

- **21:26 — [RED]** Acceptance Test "iniciar partida": la app debe mostrar la
  palabra enmascarada y 6 vidas. Falla porque la app aún no funciona. (`0278fc7`)
- **21:27 — [RED]** Unit Test: una partida nueva muestra la palabra enmascarada
  con guiones. (`f938da3`)
- **21:28 — [GREEN]** La palabra enmascarada devuelve guiones separados por
  espacio. (`998e774`)
- **21:28 — [RED]** Unit Test: una partida nueva empieza con 6 vidas. (`d1cf664`)
- **21:28 — [GREEN]** Las vidas restantes devuelven 6 al iniciar. (`29e12c2`)
- **21:29 — [GREEN]** Acceptance Test en verde: la interfaz queda cableada al
  objeto Ahorcado y el AT 1 pasa de punta a punta. (`ca08434`)
- **21:31 — [DOCS]** Se completa la lista de Unit Tests del AT 1 en NOTES.md.
  (`c2487d0`)

### AT 2 — Acertar letra

> El usuario tipea "A" y ve `_ A _ _`; las vidas siguen en 6.

- **21:32 — [RED]** Acceptance Test "acertar letra": ve la letra revelada sin
  perder vidas. (`5bd7aee`)
- **21:32 — [RED]** Unit Test: adivinar una letra presente revela todas sus
  ocurrencias. (`bb64467`)
- **21:33 — [GREEN]** Adivinar revela todas las ocurrencias de la letra.
  (`a36ebb5`)
- **21:33 — [RED]** Unit Test: adivinar es indistinto a mayúsculas/minúsculas.
  (`0fdae9b`)
- **21:33 — [GREEN]** Adivinar y palabra enmascarada funcionan sin importar
  mayúsculas/minúsculas. (`905d04b`)
- **21:34 — [TEST/DOCS]** Se documenta que acertar una letra no descuenta vidas.
  Nota honesta: este test ya estaba verde al escribirlo (las vidas están fijas
  en 6, no hay aún lógica de descuento), por eso no tuvo ciclo rojo real.
  (`6cf9d30`)
- **21:36 — [GREEN]** Acceptance Test en verde: el input queda cableado para que
  el jugador adivine, y el AT 2 pasa de punta a punta. (`58be86c`)
- **21:36 — [DOCS]** Se completa la lista de Unit Tests del AT 2 en NOTES.md.
  (`bedc633`)

### Documentación de cierre de sesión

- **21:37 — [DOCS]** Se agrega CONTINUAR.md con el resumen para la próxima
  sesión. (`2f2a793`)
- **21:39 — [DOCS]** Se amplía CONTINUAR.md con código, historial y
  troubleshooting. (`359cf58`)

**Estado al cierre de la sesión 1:** AT 1 y AT 2 completos y en verde. El cerebro
del juego sabe enmascarar la palabra y revelar letras acertadas (indistinto a
mayúsculas). Todavía no distingue acierto de fallo ni descuenta vidas.

---

## Sesión 2 — 23/06/2026 (autor: JuanPabloMalizani)

### AT 3 — Fallar letra

> El usuario tipea una letra ausente: la palabra no cambia y las vidas bajan de
> 6 a 5.

- **Preparación de entorno (primera ejecución en esta máquina):** instalación
  de dependencias del proyecto, del binario nativo de Windows que faltaba en el
  lockfile y del navegador Chromium para Playwright. No modifica código ni
  archivos versionados.
- **15:00 aprox — [RED]** Acceptance Test "fallar letra": al adivinar "E"
  (ausente) en "GATO", se ve "_ _ _ _" y 5 vidas. Falla en el paso de las vidas:
  esperaba 5, recibió 6, porque el juego aún no descuenta vidas. AT 1 y AT 2
  siguen en verde. Rojo honesto confirmado antes de tocar el código de
  producción.
- **19:00 — [RED]** Unit Test: fallar una letra descuenta una vida (adivinar una
  letra ausente baja las vidas de 6 a 5). Falla: esperaba 5, recibió 6, porque
  las vidas están fijas en 6. Los otros 5 unit tests siguen en verde.
- **19:01 — [GREEN]** El cerebro del juego ahora cuenta los fallos: al adivinar,
  si la letra no está en la palabra registra un fallo, y las vidas restantes son
  6 menos los fallos. Los 6 unit tests quedan en verde (acertar sigue sin
  descontar vidas).
- **19:02 — [GREEN]** Acceptance Test "fallar letra" en verde: los 3 ATs pasan
  de punta a punta. No hizo falta tocar la interfaz, porque ya mostraba las
  vidas leyéndolas del cerebro del juego (separación lógica/UI). AT 3 completo.

### AT 4 — Ganar

> El usuario completa todas las letras de la palabra y aparece el mensaje
> "GANASTE".

- **19:15 — [RED]** Acceptance Test "ganar": con "GATO", adivinar G, A, T y O
  debe mostrar el mensaje "GANASTE". Se agrega un step nuevo reutilizable
  ("se ve el mensaje ..."). Falla porque la app no muestra ningún mensaje de
  victoria todavía. Los otros 3 ATs siguen en verde.
- **19:11 — [RED]** Unit Test: la partida está ganada cuando se adivinan todas
  las letras. Falla porque el cerebro del juego aún no sabe decir si ganó
  (no existe esa consulta). Los otros 6 unit tests siguen en verde.
- **19:13 — [GREEN]** El cerebro del juego ahora sabe decir si la partida está
  ganada: lo está cuando todas las letras de la palabra fueron adivinadas. Los
  7 unit tests quedan en verde.
- **19:14 — [GREEN]** Acceptance Test "ganar" en verde: la interfaz ahora
  muestra "GANASTE" cuando le pregunta al cerebro del juego si la partida está
  ganada (la decisión sigue en el dominio, no en la pantalla). Los 4 ATs pasan
  de punta a punta. AT 4 completo.

---

## Sesión 3 — 23/06/2026 (autor: Juan Jose Pastorino)

### AT 5 — Perder

> El usuario falla 6 letras, agota las vidas y ve "PERDISTE" con la palabra
> revelada.

- **19:35 — [RED]** Acceptance Test "perder partida": con "GATO", adivinar 6
  letras ausentes (B, C, D, F, H, J) debe mostrar el mensaje "PERDISTE" y la
  palabra revelada "G A T O". Falla en el step del mensaje: esperaba
  "PERDISTE", pero el elemento `data-testid="message"` no existe porque la app
  no tiene concepto de partida perdida. Los 4 ATs anteriores siguen en verde.
  Rojo honesto confirmado antes de tocar código de producción. (`23e1034`)
- **19:38 — [RED]** Unit Test: la partida está perdida cuando se agotan las
  vidas (`estaPerdida()` tras 6 fallos). Falla: `juego.estaPerdida is not a
  function`, porque el método no existe todavía. Los 7 unit tests anteriores
  siguen en verde. (`b4fc580`)
- **19:38 — [GREEN]** El cerebro del juego ahora sabe decir si la partida está
  perdida: `estaPerdida()` devuelve `true` cuando `vidasRestantes() <= 0`. Los
  8 unit tests quedan en verde. (`02fc482`)
- **19:40 — [RED]** Unit Test: `palabraRevelada` muestra la palabra completa
  con espacios (sin enmascarar). Falla: `juego.palabraRevelada is not a
  function`. Los 8 unit tests anteriores siguen en verde. (`5ce26be`)
- **19:40 — [GREEN]** `palabraRevelada()` devuelve la palabra completa
  formateada con espacios entre letras. Los 9 unit tests quedan en verde.
  (`a4ed333`)
- **19:41 — [GREEN]** Acceptance Test "perder partida" en verde: la interfaz
  ahora muestra "PERDISTE" cuando `estaPerdida()` y revela la palabra completa
  con `palabraRevelada()`. También al ganar se muestra la palabra revelada. Los
  5 ATs pasan de punta a punta. AT 5 completo. (`3c4bf0a`)

### AT 6 — Letra repetida (autor: Juan Jose Pastorino)

> El usuario re-tipea una letra ya intentada: no pierde vida y la app informa.

- **19:44 — [RED]** Acceptance Test "letra repetida": con "GATO", adivinar "E"
  dos veces debe mantener las vidas en 5 y mostrar "Ya intentaste la letra E".
  Falla en el step de vidas: esperaba 5, recibió 4, porque la letra repetida
  penaliza doble (bug real). Los 5 ATs anteriores siguen en verde. Rojo honesto
  confirmado antes de tocar código de producción. (`8fad261`)
- **19:45 — [RED]** Unit Test: adivinar una letra ya intentada no descuenta
  vidas adicionales. Falla: esperaba 5, recibió 4 (doble penalización). Los 9
  unit tests anteriores siguen en verde. (`f482958`)
- **19:46 — [GREEN]** `adivinar()` ahora detecta si la letra ya está en el
  conjunto de adivinadas y hace early return sin penalizar. Los 10 unit tests
  quedan en verde. (`90825cf`)
- **19:46 — [RED]** Unit Test: adivinar una letra ya intentada devuelve
  "repetida". Falla: esperaba "repetida", recibió undefined (retorno void).
  Los 10 unit tests anteriores siguen en verde. (`3c15b09`)
- **19:47 — [GREEN]** `adivinar()` ahora retorna `string`: "repetida" cuando
  la letra ya fue intentada. Los 11 unit tests quedan en verde. (`b4f1ef6`)
- **19:47 — [GREEN]** Acceptance Test "letra repetida" en verde: la interfaz
  usa el retorno de `adivinar()` para mostrar "Ya intentaste la letra X". Los
  6 ATs pasan de punta a punta. AT 6 completo. (`3f17416`)

---

## Sesión 4 — 23/06/2026 (autor: lucio / Cosentino)

### AT 7 — Entrada inválida

> El usuario tipea algo que no es una sola letra, o intenta jugar con la
> partida ya terminada: en ambos casos la jugada no se procesa.

- **20:00 — [RED]** Acceptance Test "entrada inválida" (escenario 1): al
  adivinar "3" en "GATO", las vidas deben quedar en 6 y verse el mensaje
  "Entrada no válida". Falla en el step de vidas: esperaba 6, recibió 5,
  porque el "3" se trata como una letra ausente y penaliza. Los 6 ATs
  anteriores siguen en verde. Rojo honesto confirmado antes de tocar código.
  (`3a8a68b`)
- **20:00 — [RED]** Unit Test: adivinar un caracter que no es una letra no
  descuenta vidas. Falla: esperaba 6, recibió 5. Los 11 unit tests anteriores
  siguen en verde. (`9fc9658`)
- **20:00 — [GREEN]** `adivinar()` ahora valida con una expresión regular que
  la entrada sea exactamente una letra A-Z; si no, devuelve "invalida" sin
  penalizar. Los 12 unit tests quedan en verde. (`6d8ac0a`)
- **20:01 — [GREEN]** Acceptance Test "entrada inválida" (escenario 1) en
  verde: la interfaz muestra "Entrada no válida" cuando `adivinar()` devuelve
  "invalida". Los 7 ATs pasan de punta a punta. (`eb45ac1`)
- **20:02 — [RED]** Acceptance Test "entrada inválida" (escenario 2): tras
  perder con 6 fallos, seguir adivinando las letras restantes (G, A, T, O) no
  debe cambiar el resultado; debe seguir viéndose "PERDISTE". Falla: el
  mensaje pasaba a "GANASTE" porque `estaGanada()` se calculaba sin tener en
  cuenta que la partida ya estaba perdida (bug real). Los 7 ATs anteriores
  siguen en verde. (`6f21709`)
- **20:02 — [RED]** Unit Test: adivinar con la partida ya perdida no se
  procesa (no puede pasar a ganada después). Falla: `estaGanada()` devolvía
  true. Los 12 unit tests anteriores siguen en verde. (`c4c9179`)
- **20:02 — [GREEN]** `adivinar()` ahora hace early return con "terminada"
  cuando la partida ya está ganada o perdida, sin procesar la jugada. Los 13
  unit tests quedan en verde. (`c0b7f1c`)
- **20:03 — [GREEN]** Acceptance Test "entrada inválida" (escenario 2) en
  verde: no hizo falta tocar la interfaz (ya usa el retorno de `adivinar()`).
  Los 8 ATs pasan de punta a punta. Verificado a mano en el navegador. AT 7
  completo.

**Estado al cierre de la sesión 4:** los 7 ATs de la escalera de la guía
completos y en verde (13 unit tests, 8 acceptance tests). El juego del
Ahorcado está funcionalmente completo según la consigna base.

---

## Sesión 5 — 29/06/2026 (autor: JuanPabloMalizani / Malizani)

> Arranca el desafío de Aprobación Directa (§10). Antes de codear se destrabó
> un blocker de entorno de la máquina: Node 21.7.1 (no-LTS, EOL) rompía la
> toolchain de rolldown (`util.styleText` con arrays no soportado). Se instaló
> Node 24.18.0 LTS (`winget install OpenJS.NodeJS.LTS`); con eso `npm run test`
> (13) y `npm run at` (8) volvieron a verde. No es trabajo del TP, no tiene
> commit.

### Aprobación Directa — Feature 1: Palabra al azar

> El usuario empieza una partida sin elegir palabra y el juego toma una de una
> lista. Seam del azar: el dominio no conoce `Math.random`; `elegirPalabra`
> recibe el `rng` por parámetro y la UI lo inyecta (con `?seed=` determinista
> para el AT).

- **20:50 — [RED]** Acceptance Test "palabra al azar": al iniciar con
  `?seed=0` (sin `?word=`), debe verse la palabra enmascarada de la primera
  palabra de la lista, "_ _ _ _ _" (PERRO, 5 letras), y 6 vidas. Falla en el
  step de la palabra: la app cae al default "GATO" y muestra "_ _ _ _" (4
  guiones). Los 8 ATs anteriores siguen en verde. Rojo honesto confirmado
  antes de tocar producción. (`5b5f9fc`)
- **20:56 — [RED]** Unit Test: `elegirPalabra` con un rng que devuelve 0 elige
  la primera palabra de la lista. Falla al importar: el módulo
  `src/domain/elegirPalabra` no existe. Los 13 unit tests anteriores siguen en
  verde. (`6c71c2b`)
- **20:57 — [GREEN]** `elegirPalabra(lista, rng)` devuelve `lista[0]` (mínimo
  código). Los 14 unit tests quedan en verde. (`288b8e3`)
- **20:58 — [RED]** Unit Test: `elegirPalabra` con un rng cercano a 1 (0.99)
  elige la última palabra de la lista. Falla: devolvía "PERRO", esperaba
  "ELEFANTE". Fuerza generalizar la fórmula. Los 14 unit tests anteriores
  siguen en verde. (`69312bc`)
- **20:59 — [GREEN]** `elegirPalabra` ahora indexa con
  `lista[Math.floor(rng() * lista.length)]`. Los 15 unit tests quedan en
  verde. (`310f2be`)
- **21:00 — [GREEN]** Acceptance Test "palabra al azar" en verde: el
  composition root (`index.ts`) usa `?word=` si viene (back-compat de los 8 AT
  previos) y si no elige de la lista `PALABRAS` con `elegirPalabra`; `?seed=`
  arma un rng determinista para el AT, sin seed usa `Math.random`. Los 9 ATs
  pasan de punta a punta. Verificado: dev server sirve 200 y Vite transpila el
  módulo nuevo. AT palabra al azar completo. (`da4a30a`)

**Estado al cierre de la sesión 5:** 15 unit tests y 9 acceptance tests en
verde. Primera de las features de Aprobación Directa (Palabra al azar)
completa. Faltan al menos 3 features más para el desafío (§10).

---

## Sesión 6 — 29/06/2026 (autor: Juan Jose Pastorino)

### Aprobación Directa — Feature 2: Dibujo progresivo del muñeco

> El muñeco se dibuja parte por parte (cabeza, cuerpo, brazo izquierdo, brazo
> derecho, pierna izquierda, pierna derecha) a medida que el jugador acumula
> errores. El dominio expone `partesVisibles(): string[]` (un slice de un
> array constante de 6 partes, indexado por la cantidad de fallos). La UI solo
> renderiza en un `data-testid="hangman"`.

- **21:18 — [RED]** Acceptance Test "dibujo progresivo": al iniciar no hay
  partes; tras fallar "B" el muñeco muestra "cabeza"; tras 6 fallos muestra
  las 6 partes. Falla en el primer Then: `getByTestId('hangman')` no existe
  en el DOM. Los 9 ATs anteriores siguen en verde. Rojo honesto confirmado
  antes de tocar producción. (`0c68c26`)
- **21:20 — [RED]** Unit Test: `partesVisibles` devuelve un array vacío con
  0 errores. Falla: `juego.partesVisibles is not a function`. Los 15 unit
  tests anteriores siguen en verde. (`8a53d78`)
- **21:20 — [GREEN]** `partesVisibles()` devuelve `[]` (mínimo código). Los
  16 unit tests quedan en verde. (`3eebd43`)
- **21:21 — [RED]** Unit Test: `partesVisibles` devuelve `["cabeza"]` con 1
  error. Falla: esperaba `["cabeza"]`, recibió `[]`. Los 16 unit tests
  anteriores siguen en verde. (`fdfb007`)
- **21:21 — [GREEN]** `partesVisibles()` generalizado: un array constante
  `PARTES` con las 6 partes del muñeco, y `slice(0, this.fallos)`. Los 17
  unit tests quedan en verde. (`d116670`)
- **21:22 — [TEST/DOCS]** Se documenta que `partesVisibles` devuelve las 6
  partes con 6 errores. Nota: este test ya estaba verde al escribirlo (la
  generalización con `slice` ya cubre todos los casos). (`66b6d1e`)
- **21:23 — [GREEN]** Acceptance Test "dibujo progresivo" en verde: la
  interfaz muestra un `<div data-testid="hangman">` con las partes del muñeco
  unidas por ", " (dato de `juego.partesVisibles()`). Los 10 ATs pasan de
  punta a punta. Verificado en el navegador. AT dibujo progresivo completo.
  (`92a5c5f`)

**Estado al cierre de la sesión 6:** 18 unit tests y 10 acceptance tests en
verde. Segunda feature de Aprobación Directa (Dibujo progresivo) completa.
Faltan al menos 2 features más para el desafío (§10).

---

## Sesión 7 — 29/06/2026 (autor: lucio / Cosentino)

> Tercera feature de Aprobación Directa. Arranca Cosentino para reequilibrar la
> rotación (Cosentino pasa a AT 1, 2, 7 y F3). Entorno verificado al inicio:
> `git pull` al día, Node v25.9.0 (≥22, sin el bug de rolldown), `npm run test`
> (18) y `npm run at` (10) en verde antes de tocar nada.

### Aprobación Directa — Feature 3: Teclado en pantalla

> El jugador ve qué letras ya intentó (acertadas y falladas) para no repetirlas.
> El dominio expone `letrasUsadas(): string[]` con las letras intentadas en
> mayúsculas y en orden de intento (lee del `Set` `adivinadas`). La UI solo
> renderiza un `<div data-testid="used-keys">` con esas letras unidas por ", ".

- **21:40 — [RED]** Acceptance Test "teclado en pantalla": con "GATO", tras
  adivinar "A" y "E" se ven las letras usadas "A, E". Se agrega un step nuevo
  reutilizable ("las letras usadas son ..."). Falla porque
  `getByTestId('used-keys')` no existe en el DOM (la UI no lo renderiza). Los
  10 ATs anteriores siguen en verde. Rojo honesto confirmado antes de tocar
  producción. (`bb6a7ae`)
- **21:41 — [RED]** Unit Test: una partida nueva no tiene letras usadas
  (`letrasUsadas()` devuelve `[]`). Falla: `juego.letrasUsadas is not a
  function`. Los 18 unit tests anteriores siguen en verde. (`dbb8e44`)
- **21:42 — [GREEN]** `letrasUsadas()` devuelve `[]` (mínimo código). Los 19
  unit tests quedan en verde. (`8ed79bf`)
- **21:43 — [RED]** Unit Test: adivinar una letra la agrega a las letras
  usadas. Falla: esperaba `["A"]`, recibió `[]`. Fuerza generalizar. Los 19
  unit tests anteriores siguen en verde. (`a101343`)
- **21:43 — [GREEN]** `letrasUsadas()` devuelve `[...this.adivinadas]` (orden
  de inserción). Los 20 unit tests quedan en verde. (`462b083`)
- **21:43 — [TEST/DOCS]** Se documenta que las letras usadas incluyen aciertos
  y fallos en orden de intento (adivinar "A" y "E" → `["A", "E"]`). Nota: este
  test ya estaba verde al escribirlo (el `Set` se llena tanto en aciertos como
  en fallos). (`193c4dc`)
- **21:44 — [GREEN]** Acceptance Test "teclado en pantalla" en verde: la
  interfaz renderiza `<div data-testid="used-keys">` con
  `juego.letrasUsadas().join(", ")`. Los 11 ATs pasan de punta a punta.
  Verificado en navegador real (Chromium): vacío al iniciar, "A, E" tras
  adivinar A y E. AT teclado en pantalla completo. (`e322426`)

### CI/CD y Deploy (sesión 7 — Cosentino)

> Se revisó el CI y se montó el deploy. Detalle y estado en CONTINUAR.md §12.

- **[CI]** Se detectó que `.github/workflows/ci.yml` solo corría el
  `string-calculator` (Python): el CI **no testeaba el TP**. Se agregó un job
  `tp-integrador` (Node 22: `npm install` → Playwright chromium → `vitest run`
  → `npm run at`). Verificado en GitHub Actions: run en verde (21 UT + 11 AT).
  (`919dc2b`)
- **[CI]** Se quitó el job del `string-calculator`; el workflow quedó con un
  solo job (el del TP). Verificado en verde. (`7dbbeb3`)
- **[CI]** Pipeline completo del TP (atiende la corrección del profe: build +
  test + cobertura + análisis): se agregaron los steps **build**
  (`npm run build`), **typecheck** (`tsc --noEmit`, análisis estático) y
  **coverage** (`vitest run --coverage`, 100% en `src/`), además de los AT.
  Sin SonarCloud (análisis con `tsc` + coverage de Vitest, sin cuentas
  externas). Verificado en GitHub Actions: run en verde con todos los steps.
  (`9d39333`)
- **[DEPLOY]** `vite.config.ts` con `base` al subpath del repo solo en build
  (en dev queda en `/` para no romper los AT), script `build`, y workflow
  `.github/workflows/deploy.yml` (build → artifact → GitHub Pages). Build
  local y AT verificados en verde. (`8471850`)
- **[DEPLOY]** Intento de auto-habilitar Pages con `enablement: true`.
  (`868ca49`)
- **[DEPLOY]** El dueño habilitó Pages (Settings → Pages → Source "GitHub
  Actions"). El deploy pasó a verde y la app quedó publicada y verificada en
  navegador real: https://imjuampim.github.io/AgilesMalizani-Cosentino-Pastorino/
- **[CI]** Se **unificó todo en un solo workflow** `ci.yml` (se eliminó
  `deploy.yml`): job `build-test` (build, typecheck, coverage, AT, sube el
  artifact de Pages) + job `deploy` (`needs: build-test`, solo desde `main`).
  Run verificado en GitHub Actions: ambos jobs en verde y sitio HTTP 200.
  (`8d4c66c`)

**Estado al cierre de la sesión 7:** 21 unit tests y 11 acceptance tests en
verde. Tercera feature de Aprobación Directa (Teclado en pantalla) completa.
CI del TP funcionando. Deploy a Pages montado y a la espera de habilitar Pages
(paso manual). Falta al menos 1 feature más para el desafío (§10).

---

## Sesión 8 — 30/06/2026 (autor: Juan Jose Pastorino)

### Aprobación Directa — Feature 4: Acentos y Ñ

> Se normalizan los acentos al comparar (`á`==`a`) y se acepta la `Ñ` como letra válida. La UI no cambia porque sigue consumiendo el dominio transparente.

- **00:30 — [RED]** Acceptance Test "Soporte de acentos y ñ": al iniciar con "LEÓN" y tipear "O" se debe ver "_ _ Ó _". Al iniciar con "CAÑA" y tipear "Ñ" se debe ver "_ _ Ñ _". Fallan ambos escenarios porque la regex rechaza la Ñ y la "O" no matchea la "Ó". Los 11 ATs anteriores siguen en verde. Rojo honesto confirmado antes de tocar producción.
- **00:31 — [RED]** Unit Test: adivinar ñ es una jugada válida (no devuelve invalida). Falla porque devuelve "invalida". Los 21 unit tests anteriores siguen en verde.
- **00:32 — [GREEN]** Se modifica la regex en `adivinar` a `/^[A-ZÑ]$/`. Los 22 unit tests quedan en verde.
- **00:32 — [RED]** Unit Test: adivinar una vocal sin acento revela la vocal acentuada en la palabra. Falla devolviendo guiones. Los 22 unit tests anteriores siguen en verde.
- **00:33 — [GREEN]** Se agrega el método privado `quitarAcentos` y se aplica a las comparaciones del dominio. Los 23 unit tests quedan en verde.
- **00:33 — [TEST]** Se documentan dos UTs adicionales: "la partida se gana al adivinar todas las letras incluyendo acentuadas" y "la ñ no se normaliza a n". Ya están en verde porque la refactorización fue general y `quitarAcentos` preserva la Ñ. Total 25 unit tests en verde.
- **00:34 — [GREEN]** Acceptance Test "Soporte de acentos y ñ" en verde: los escenarios de la vocal acentuada y la ñ pasan correctamente de punta a punta.

**Estado al cierre de la sesión 8:** 25 unit tests y 13 acceptance tests en verde. Cuarta feature de Aprobación Directa (Acentos y Ñ) completa. **¡El desafío mínimo de 4 features para Aprobación Directa de la guía está completado!**

---

## Sesión 9 — 30/06/2026 (autor: Lucio Cosentino)

> Llegó la **1ª corrección del profe**: el TP no aprueba todavía por **una sola
> etapa** — falta **análisis estático con quality gate** (el `tsc` valida tipos
> pero no es análisis de calidad; integrar SonarQube/CodeQL o al menos ESLint
> con gate que corte el build). Todo lo demás (escalera de AT, CI con pipeline
> completo, deploy a Pages y app online) quedó aprobado. También se observó
> rotación despareja (Lucio concentra ~2/3 de los commits). En esta sesión se
> sigue sumando features de Aprobación Directa y se integrará ESLint.

### Aprobación Directa — Feature 5: Jugar de nuevo

> Reiniciar la partida sin recargar. Se introduce el objeto de dominio `Sesion`
> (sostiene la partida en curso y arranca una nueva con el mismo seam de azar
> inyectable que `elegirPalabra`). La UI agrega el botón "Jugar de nuevo".

- **[RED]** Acceptance Test "Jugar de nuevo": con la palabra "SOL", tras ganar y presionar "Jugar de nuevo" se debe volver a ver "_ _ _" y 6 vidas. Falla porque el botón no existe (timeout del click). Los 13 ATs anteriores siguen en verde. Rojo honesto confirmado antes de tocar producción. (`0266b29`)
- **[RED]** Unit Test: una sesion nueva tiene una partida en curso con la palabra enmascarada y 6 vidas. Falla porque el módulo `Sesion` no existe. Los 25 unit tests anteriores siguen en verde. (`77c5453`)
- **[GREEN]** Se crea `src/domain/Sesion.ts` con `partidaActual()`, que arma la partida con `elegirPalabra(palabras, rng)`. 26 unit tests en verde. (`9bf1fcb`)
- **[RED]** Unit Test: nuevaPartida reemplaza la partida en curso por una en limpio. Falla porque el método no existe. (`07fa55d`)
- **[GREEN]** Se agrega `nuevaPartida()`, que reemplaza la partida en curso por una nueva. 27 unit tests en verde. (`d6f0b09`)
- **[GREEN]** Acceptance Test "Jugar de nuevo" en verde: se refactoriza `mountApp` para recibir una `Sesion` y renderizar `partidaActual()`, y se agrega el botón "Jugar de nuevo" (visible al terminar) que llama a `nuevaPartida()`. El composition root (`index.ts`) ahora construye una `Sesion`. 14 acceptance tests en verde, cobertura 100% en `src/`. (`80380e1`)

**Estado al cierre de la F5:** 27 unit tests y 14 acceptance tests en verde. Quinta feature de Aprobación Directa (Jugar de nuevo) completa.

### Análisis estático con quality gate (lo que bloqueaba la corrección)

> La corrección del profe pedía un análisis estático **de calidad** con un gate
> que corte el build (el `tsc` valida tipos, no calidad). Se integra **ESLint**
> (flat config + `typescript-eslint`) como esa etapa.

- **[CI]** Se agregan `eslint`, `@eslint/js` y `typescript-eslint` como devDependencies y `eslint.config.js` con `js.configs.recommended` + `tseslint.configs.recommended` (ignora `dist/`, `coverage/`, `.features-gen/`, etc.). Script nuevo: `npm run lint` = `eslint . --max-warnings 0` (devuelve != 0 ante cualquier error o warning → corta el pipeline).
- **[STYLE]** Al correr el lint por primera vez detectó un problema real: `import { describe }` sin uso en `tests/Ahorcado.test.ts`. Se quitó el import. El gate quedó en verde (exit 0). Demuestra que el análisis es efectivo, no decorativo. (`9324f23`)
- **[CI]** Se agrega el step **"Analisis estatico - ESLint (quality gate)"** en `ci.yml`, antes de los tests y el deploy. Como `deploy` tiene `needs: build-test`, si el lint falla el sitio no se publica. El `typecheck` (`tsc`) queda como validación de tipos complementaria, no se elimina. (`2e957ab`)

**Estado tras integrar ESLint:** pipeline = build → typecheck → **ESLint (gate)** → unit+coverage (100%) → AT (14) → deploy. Con esto se cubre la única etapa que faltaba para aprobar según la corrección.

### Aprobación Directa — Feature 6: Marcador de la sesión

> `Sesion` cuenta partidas ganadas/perdidas en memoria; al empezar una nueva
> partida archiva el resultado de la saliente. La UI muestra el marcador.

- **[RED]** Acceptance Test "Marcador de la sesión" (2 escenarios): tras ganar/perder y presionar "Jugar de nuevo" se debe ver "Ganadas: 1 - Perdidas: 0" / "Ganadas: 0 - Perdidas: 1". Fallan porque no existe el marcador (`scoreboard`). Los 14 ATs anteriores siguen en verde. (`73146c2`)
- **[RED]** Unit Test: una sesion nueva tiene el marcador en cero. Falla porque `ganadas()`/`perdidas()` no existen. (`452cd03`)
- **[GREEN]** `Sesion` expone `ganadas()` y `perdidas()` arrancando en cero. 28 unit tests en verde. (`92aa29b`)
- **[RED]** Unit Test: ganar una partida y empezar otra suma una ganada al marcador. Falla (sigue en 0). (`d5126a2`)
- **[GREEN]** `nuevaPartida()` archiva el resultado de la partida saliente (suma a ganadas/perdidas según corresponda). 29 unit tests en verde. (`bf6dd8c`)
- **[TEST]** Se documenta el caso simétrico "perder y empezar otra suma una perdida": ya queda en verde porque el archivado cubre ambas ramas. 30 unit tests en verde. (`40c6b77`)
- **[GREEN]** Acceptance Test "Marcador de la sesión" en verde: la UI agrega `<div data-testid="scoreboard">`. 16 acceptance tests en verde, cobertura 100% en `src/`. (`d73bef7`)

**Estado al cierre de la F6:** 30 unit tests y 16 acceptance tests en verde. Sexta feature de Aprobación Directa (Marcador de la sesión) completa.

### Aprobación Directa — Feature 7: Niveles de dificultad

> El nivel define las vidas iniciales (fácil 8 / normal 6 / difícil 4). Seam de
> UI `?nivel=`. Lógica: `Ahorcado` toma las vidas por constructor,
> `vidasDeNivel()` mapea nivel→vidas, `Sesion` las propaga a cada partida.

- **[RED]** Acceptance Test "Niveles de dificultad" (2 escenarios): con `?nivel=dificil` se ven 4 vidas y con `?nivel=facil` 8. Fallan porque la app ignora el nivel (siempre 6). Los 16 ATs anteriores siguen en verde. (`91d6276`)
- **[RED]** Unit Test: un ahorcado puede arrancar con una cantidad de vidas configurable (`new Ahorcado("GATO", 4)`). Falla (devuelve 6). (`dd356cb`)
- **[GREEN]** `Ahorcado` toma `vidas` por constructor (default 6) y `vidasRestantes()` usa ese valor. 31 unit tests en verde. (`8dc68f6`)
- **[RED]** Unit Test: el nivel dificil arranca con 4 vidas. Falla porque el módulo `niveles` no existe. (`c6dadd6`)
- **[GREEN]** Se crea `src/domain/niveles.ts` con `vidasDeNivel(nivel)` y la tabla de niveles. 32 unit tests en verde. (`e3f5b10`)
- **[TEST]** Se documenta el resto de la tabla: facil→8 y nivel desconocido→6 (normal). Ya quedan en verde y cubren la rama por defecto. 34 unit tests en verde. (`84e6331`)
- **[RED]** Unit Test: una sesion creada con N vidas arranca la partida con N vidas. Falla (devuelve 6). (`d9dfc29`)
- **[GREEN]** `Sesion` acepta `vidas` (default 6) y se las pasa a la partida en curso y a las de `nuevaPartida()`. 35 unit tests en verde. (`4a8b3e0`)
- **[GREEN]** Acceptance Test "Niveles de dificultad" en verde: `index.ts` lee `?nivel=` y traduce a vidas con `vidasDeNivel`. 18 acceptance tests en verde, cobertura 100% en `src/`. (`5378052`)

**Estado al cierre de la F7:** 35 unit tests y 18 acceptance tests en verde. Séptima feature de Aprobación Directa (Niveles de dificultad) completa.

### Ciclo de mejora de UI

> Se mejora la presentación. El **teclado clickeable** es comportamiento nuevo,
> así que se hace con doble loop (AT). El **muñeco dibujado** y los **estilos**
> son presentación: van sin tests propios, pero todos los ATs siguen en verde
> (no se toca el dominio ni se cambia ningún `data-testid`).

- **[RED]** Acceptance Test "Teclado clickeable": con "GATO", al hacer click en la tecla "A" se debe ver "_ A _ _" y la letra usada "A". Falla porque no hay teclas en pantalla (el botón no existe). Los 18 ATs anteriores siguen en verde. (`669fbd6`)
- **[GREEN]** `mountApp` renderiza un teclado A–Z + Ñ; cada tecla llama a `adivinar()` (misma lógica que Enter, extraída a `jugar()`), y se deshabilitan las letras ya usadas y todas al terminar. No se agrega lógica al dominio (reutiliza `adivinar()` y `letrasUsadas()`). 19 acceptance tests en verde. (`49f8312`)
- **[UI]** Presentación: muñeco dibujado en **SVG** manejado por `partesVisibles().length` (se conserva el `data-testid="hangman"` de texto, ahora `sr-only`, para los ATs), hoja de estilos `styles.css` (tema oscuro, grilla del teclado, layout responsive) y `vite-env.d.ts` para que `tsc` acepte el import de CSS. Verificado en navegador real con captura. 19 acceptance tests en verde, typecheck/lint/cobertura (100%) OK. (`b15545b`)

**Estado al cierre del ciclo de UI:** 35 unit tests y 19 acceptance tests en verde. Teclado en pantalla clickeable, muñeco dibujado y la app con estilos. **Resumen de la sesión 9:** ESLint (quality gate, lo que pedía la corrección) + F5 Jugar de nuevo + F6 Marcador + F7 Niveles + mejora de UI. **7 features de Aprobación Directa** en total (F1–F7).

### Aprobación Directa — Feature 8: Pista de la palabra

> La palabra puede llevar una pista asociada. `Ahorcado` la toma por constructor
> y la expone con `pista()`; `Sesion` la propaga. Seam de UI `?pista=`.

- **[RED]** Acceptance Test "Pista de la palabra": con la palabra "GATO" y la pista "Animal domestico" se debe ver "Pista: Animal domestico". Falla porque no existe el elemento de pista. Los 19 ATs anteriores siguen en verde. (`61a5525`)
- **[RED]** Unit Test: un ahorcado expone la pista asociada a la palabra. Falla porque `pista()` no existe. (`01241a6`)
- **[GREEN]** `Ahorcado` toma `pistaTexto` por constructor (default "") y expone `pista()`. 36 unit tests en verde. (`22d898a`)
- **[TEST]** Se documenta que un ahorcado sin pista devuelve "" (rama por defecto, ya verde). 37 unit tests. (`5c04f9b`)
- **[RED]** Unit Test: una sesion creada con una pista se la pasa a la partida. Falla (devuelve ""). (`fa0e10b`)
- **[GREEN]** `Sesion` acepta `pista` (default "") y se la pasa a la partida en curso y a las de `nuevaPartida()`. 38 unit tests en verde. (`fe45faf`)
- **[GREEN]** Acceptance Test "Pista de la palabra" en verde: `index.ts` lee `?pista=` y `main.ts` muestra `<div data-testid="hint">Pista: ...</div>` (con estilo). 20 acceptance tests en verde, cobertura 100% en `src/`. (`9a82373`)

**Estado al cierre de la F8:** 38 unit tests y 20 acceptance tests en verde. Octava feature de Aprobación Directa (Pista de la palabra) completa.

### Aprobación Directa — Feature 9: Dos jugadores

> El jugador 1 ingresa la palabra en una pantalla previa; se valida antes de
> empezar. Lógica de dominio: `esPalabraValida()`. UI: pantalla de setup
> (`?modo=duo`).

- **[RED]** Acceptance Test "Dos jugadores" (2 escenarios): en `?modo=duo`, al ingresar "SOL" se ve "_ _ _" y 6 vidas; al ingresar "SOL1" se ve "Palabra invalida". Fallan porque no existe la pantalla de setup. Los 20 ATs anteriores siguen en verde. (`7dd5b23`)
- **[RED]** Unit Test: una palabra de solo letras es valida. Falla porque el módulo `validarPalabra` no existe. (`1b77e1f`)
- **[GREEN]** Se crea `src/domain/validarPalabra.ts` con `esPalabraValida(texto)` (regex de solo letras con acentos y ñ, recorta espacios). 39 unit tests en verde. (`520b316`)
- **[TEST]** Se documenta el resto de las reglas: vacía/con símbolos inválidas (rama false) y acentos/ñ válidos. 42 unit tests en verde. (`fa02c78`)
- **[GREEN]** Acceptance Test "Dos jugadores" en verde: se crea `src/ui/setup.ts` (`mountSetup`) que valida la palabra del jugador 1 y, si es válida, monta el juego con esa palabra; `index.ts` enruta `?modo=duo` a la pantalla de setup. 22 acceptance tests en verde, cobertura 100% en `src/`. (`f8ef533`)

**Estado al cierre de la F9:** 42 unit tests y 22 acceptance tests en verde. Novena feature de Aprobación Directa (Dos jugadores) completa. **Catálogo de features de la guía agotado (F1–F9).**

