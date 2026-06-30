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
- **[DEPLOY — pendiente]** El deploy falla en `Configure Pages` porque **Pages
  no está habilitado** en el repo y el token no puede auto-habilitarlo. El
  build pasa. **Falta el paso manual del dueño:** Settings → Pages → Source
  "GitHub Actions" (ver CONTINUAR.md §12). URL destino:
  https://imjuampim.github.io/AgilesMalizani-Cosentino-Pastorino/

**Estado al cierre de la sesión 7:** 21 unit tests y 11 acceptance tests en
verde. Tercera feature de Aprobación Directa (Teclado en pantalla) completa.
CI del TP funcionando. Deploy a Pages montado y a la espera de habilitar Pages
(paso manual). Falta al menos 1 feature más para el desafío (§10).

