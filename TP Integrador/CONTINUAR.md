# Cómo seguir — TP Ahorcado (ATDD)

Este archivo es el prompt/resumen para arrancar la próxima sesión. Pegá su
contenido (o decí "leé CONTINUAR.md") al asistente para retomar exactamente
donde quedó.

## Qué es esto

TP Integrador de Ágiles: juego del Ahorcado construido con **ATDD de doble
loop** (ver `GUIA-ATDD-IA-Ahorcado.md` en esta misma carpeta — es la consigna
completa y las reglas no negociables del proceso). Resumen del proceso:

- **Loop externo**: Acceptance Tests en Cucumber/Gherkin (`features/*.feature`)
  que corren contra la app real en el navegador vía Playwright.
- **Loop interno**: Unit Tests (`tests/Ahorcado.test.ts`, Vitest) sobre el
  objeto de dominio `Ahorcado` (sin DOM).
- Cada test se commitea en dos pasos: **`RED:`** (test que falla) y luego
  **`GREEN:`** (mínimo código que lo pasa). Se pushea **solo en verde**.
- La guía pide rotación de autor por test; en esta sesión se hizo todo bajo
  una sola identidad de git porque el usuario decidió avanzar solo — server
  está en main, no hace falta deshacer nada, pero la rotación real (si suman
  más integrantes) queda pendiente para los próximos ATs.

## Stack instalado

TypeScript + Vite + Vitest + Playwright + playwright-bdd. Comandos:

```bash
cd "TP Integrador"
npm run dev    # levanta la app en http://localhost:5173/?word=GATO
npm run test   # unit tests (Vitest) sobre Ahorcado
npm run at     # acceptance tests (Cucumber/Gherkin vía Playwright)
```

## Qué está hecho (AT 1 y AT 2, ambos en VERDE y pusheados)

**AT 1 — Iniciar partida**: al entrar con `?word=GATO` se ve `_ _ _ _` y `6`
vidas.
- UTs: `palabraEnmascarada()` devuelve guiones; `vidasRestantes()` devuelve 6
  al iniciar.

**AT 2 — Acertar letra**: tipear una letra y Enter revela sus ocurrencias.
- UTs: revela todas las ocurrencias (`"ALA"` + `"A"` → `"A _ A"`);
  `adivinar`/`palabraEnmascarada` son case-insensitive; acertar no descuenta
  vidas (este último ya estaba verde al escribirlo, porque todavía no existe
  lógica de descuento — se documentó así en el commit, sin ciclo RED real).

### Estado del código de dominio (`src/domain/Ahorcado.ts`)

```ts
class Ahorcado {
  constructor(palabra: string)
  palabraEnmascarada(): string   // case-insensitive, usa Set de adivinadas
  vidasRestantes(): number       // SIEMPRE devuelve 6 (hardcodeado, falta lógica)
  adivinar(letra: string): void  // agrega a Set en mayúsculas
}
```

**Importante:** `vidasRestantes()` todavía no resta nada. El próximo AT
(Fallar letra) es justo el que va a forzar esa lógica.

### Estado de la UI (`src/ui/main.ts` + `src/ui/index.ts`)

`mountApp` renderiza `word`/`lives`/un `<input>`, escucha `Enter` y llama
`juego.adivinar(input.value)`, vuelve a renderizar. `index.ts` lee `?word=`
de la URL (default `"GATO"`) y monta. Sin estilos (no es necesario para los
ATs, pero está bueno mirarlo en el navegador en cada paso).

## Qué falta (escalera de ATs, en orden sugerido por la guía)

| # | AT | Qué ver |
|---|---|---|
| 3 | **Fallar letra** | Tipear una letra ausente → palabra igual, vidas baja a 5 |
| 4 | Ganar | Completar todas las letras → mensaje "GANASTE" |
| 5 | Perder | 6 fallos → "PERDISTE" + palabra revelada |
| 6 | Letra repetida | Re-tipear letra ya intentada → no penaliza, informa |
| 7 | Entrada inválida | Tipear algo que no es letra, o jugar con partida terminada |

No es un orden obligatorio (la guía lo aclara), pero es razonable seguir así
porque cada uno depende un poco del anterior (fallar letra necesita que
`adivinar` distinga acierto/fallo, ganar/perder dependen de fallar, etc.)

## Cómo seguir (AT 3 — Fallar letra)

1. Escribir `features/fallar-letra.feature`:
   ```gherkin
   Dado una partida con la palabra "GATO"
   Cuando el jugador adivina la letra "E"
   Entonces se ve la palabra "_ _ _ _"
   Y se ven 5 vidas
   ```
   (el step "el jugador adivina la letra" ya existe y se reutiliza)
2. Correrlo → debería estar **rojo** porque `vidasRestantes()` sigue fijo en 6.
3. Enumerar los UTs que hacen falta para `Ahorcado` (pensarlo antes de
   escribir código), por ejemplo:
   - adivinar una letra ausente descuenta una vida
   - adivinar una letra presente NO descuenta vidas (ya existe, ver arriba)
4. Loop interno UT por UT: rojo → mínimo código → verde → refactor → commit
   `RED:`/`GREEN:` cada uno.
5. Cablear la UI si hace falta (probablemente no haga falta tocarla: ya
   muestra `lives`, solo cambia el valor que devuelve `vidasRestantes()`).
6. Correr `npm run at`, confirmar verde, mirar la app en el navegador,
   commitear el `GREEN:` del AT, actualizar `NOTES.md`, **push**.
7. Pasar al AT 4.

## Reglas a no romper (de la guía, no negociables)

- No code sin test que lo justifique. Un paso a la vez. Mínimo código.
- Predecir rojo/verde antes de correr.
- Commit `RED:` apenas se ve el rojo, **antes** de escribir producción.
- Push solo cuando el tope está en verde.
- (Si el grupo se suma) rotar quién arranca cada test, con su propia cuenta
  de git.
