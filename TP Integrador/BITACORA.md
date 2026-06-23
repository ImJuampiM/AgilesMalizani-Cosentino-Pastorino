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
