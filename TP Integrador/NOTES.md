# Notas: ATs y UTs

Lista de Acceptance Tests y los Unit Tests del dominio (`Ahorcado`) que los respaldan.

## AT 1 — Iniciar partida

UTs:

- una partida nueva muestra la palabra enmascarada con guiones (`palabraEnmascarada()`)
- una partida nueva empieza con 6 vidas (`vidasRestantes()`)

## AT 2 — Acertar letra

UTs:

- adivinar una letra presente revela todas sus ocurrencias
- adivinar es case-insensitive
- acertar una letra no descuenta vidas (ya verde antes de tocar produccion, no hay logica de descuento aun)

## AT 3 — Fallar letra

UTs:

- fallar una letra descuenta una vida (`vidasRestantes()` baja de 6 a 5 al adivinar una letra ausente)

> **Por qué un solo UT nuevo acá:** el comportamiento de "al fallar, la palabra
> sigue enmascarada / no se revela ninguna letra" ya quedó cubierto por los UT
> del AT 2 (`adivinar una letra presente revela todas sus ocurrencias`,
> `adivinar es case-insensitive`). Escribir otro UT sobre eso sería testear
> código ya verde. Por la regla "no test, no code / no duplicar cobertura", el
> único comportamiento **nuevo** que el AT 3 fuerza es el descuento de vida, y
> ese es el UT que se agregó. La acumulación de fallos (2 fallos → 2 vidas menos)
> es la misma lógica de resta ya ejercitada, no código nuevo.

## AT 4 — Ganar

UTs:

- la partida esta ganada cuando se adivinan todas las letras (`estaGanada()` devuelve true)

> **Por qué un solo UT nuevo acá:** `estaGanada()` es el único comportamiento de
> dominio nuevo que el AT 4 exige. El caso "una partida recién empezada no está
> ganada" es el estado inicial (`estaGanada()` arranca en `false` porque no hay
> letras adivinadas) y no requiere código propio; queda implícito en que los AT
> 1–3 corren sin mostrar "GANASTE". El caso "letras repetidas en la palabra"
> (p. ej. OSO) usa el mismo `Set` de adivinadas ya cubierto por el AT 2. Por eso
> el AT 4 agrega un único UT: el mínimo que fuerza la lógica nueva.

## AT 5 — Perder

UTs:

- la partida esta perdida cuando se agotan las vidas (`estaPerdida()` devuelve true tras 6 fallos)
- palabraRevelada muestra la palabra completa con espacios (`palabraRevelada()` devuelve "G A T O")

## AT 6 — Letra repetida

UTs:

- adivinar una letra ya intentada no descuenta vidas adicionales
- adivinar una letra ya intentada devuelve "repetida" para que la UI pueda informar

## AT 7 — Entrada inválida

UTs:

- adivinar un caracter que no es una letra no descuenta vidas (`adivinar()` devuelve "invalida" sin penalizar)
- adivinar con la partida ya perdida no se procesa (`adivinar()` devuelve "terminada"; la partida no puede pasar a ganada después de perdida)

## Aprobación Directa — Feature 1: Palabra al azar

> Seam del azar: el dominio no conoce `Math.random`. `elegirPalabra(lista, rng)`
> recibe el `rng` por parámetro para poder testear determinista con un rng falso.

UTs (`elegirPalabra(lista: string[], rng: () => number)`):

- elegirPalabra con un rng que devuelve 0 elige la primera palabra de la lista
- elegirPalabra con un rng cercano a 1 elige la última palabra de la lista

## Aprobación Directa — Feature 2: Dibujo progresivo del muñeco

> El dominio expone `partesVisibles(): string[]` que devuelve las partes del
> muñeco visibles según la cantidad de errores (0→6). La UI solo renderiza.

UTs (`Ahorcado.partesVisibles()`):

- partesVisibles devuelve un array vacío con 0 errores
- partesVisibles devuelve "cabeza" con 1 error
- partesVisibles devuelve las 6 partes con 6 errores

## Aprobación Directa — Feature 3: Teclado en pantalla

> El dominio expone `letrasUsadas(): string[]` con las letras ya intentadas (en
> mayúsculas, en orden de intento), para que la UI marque cuáles no están
> disponibles. La UI solo renderiza.

UTs (`Ahorcado.letrasUsadas()`):

- una partida nueva no tiene letras usadas (devuelve un array vacío)
- adivinar una letra la agrega a las letras usadas
- las letras usadas incluyen aciertos y fallos en orden de intento

## Aprobación Directa — Feature 4: Acentos y Ñ

> Normalizar acentos al comparar (á==a) y aceptar la Ñ como letra válida.

UTs (`Ahorcado`):

- adivinar ñ es una jugada válida (no devuelve invalida)
- adivinar una vocal sin acento revela la vocal acentuada en la palabra
- la partida se gana al adivinar todas las letras incluyendo acentuadas
- la ñ no se normaliza a n (son letras distintas)

## Aprobación Directa — Feature 5: Jugar de nuevo

> Reiniciar la partida sin recargar la página. Se introduce el objeto de
> dominio `Sesion`, que sostiene la partida en curso y sabe arrancar una nueva
> (mismo seam de azar inyectable que `elegirPalabra`). La UI sólo agrega el
> botón "Jugar de nuevo" y le pide a `Sesion` la partida actual.

UTs (`Sesion(palabras: string[], rng: () => number)`):

- una sesion nueva tiene una partida en curso con la palabra enmascarada y 6 vidas
- nuevaPartida reemplaza la partida en curso por una en limpio

## Aprobación Directa — Feature 6: Marcador de la sesión

> `Sesion` lleva la cuenta de partidas ganadas/perdidas en memoria. Al empezar
> una nueva partida (`nuevaPartida()`) archiva el resultado de la saliente. La
> UI sólo muestra el marcador.

UTs (`Sesion.ganadas()` / `Sesion.perdidas()`):

- una sesion nueva tiene el marcador en cero
- ganar una partida y empezar otra suma una ganada al marcador
- perder una partida y empezar otra suma una perdida al marcador

## Aprobación Directa — Feature 7: Niveles de dificultad

> El nivel define la cantidad de vidas iniciales (fácil 8 / normal 6 / difícil
> 4). `Ahorcado` acepta las vidas por constructor, `vidasDeNivel(nivel)` mapea
> el nombre del nivel a su cantidad de vidas, y `Sesion` propaga esas vidas a
> cada partida. Seam de UI: `?nivel=` en la URL.

UTs (`Ahorcado`, `vidasDeNivel(nivel)`, `Sesion`):

- un ahorcado puede arrancar con una cantidad de vidas configurable
- el nivel dificil arranca con 4 vidas
- el nivel facil arranca con 8 vidas
- un nivel desconocido cae en las 6 vidas del nivel normal
- una sesion creada con una cantidad de vidas arranca la partida con esas vidas

## Mejora de UI — Teclado clickeable

> Comportamiento nuevo de UI cubierto sólo por AT (no agrega lógica de dominio:
> reutiliza `Ahorcado.adivinar()` y `letrasUsadas()`). El muñeco dibujado en SVG
> y los estilos son presentación pura, sin tests propios.

AT (sin UTs nuevos): hacer click en una tecla del teclado en pantalla adivina
esa letra, igual que tipearla y presionar Enter.

## Aprobación Directa — Feature 8: Pista de la palabra

> La palabra puede llevar una pista/categoría asociada. `Ahorcado` la recibe por
> constructor y la expone con `pista()`; `Sesion` la propaga a cada partida. Seam
> de UI: `?pista=` en la URL. La UI muestra "Pista: ...".

UTs (`Ahorcado.pista()` / `Sesion`):

- un ahorcado expone la pista asociada a la palabra
- un ahorcado sin pista devuelve una pista vacia
- una sesion creada con una pista se la pasa a la partida en curso

## Aprobación Directa — Feature 9: Dos jugadores

> El jugador 1 ingresa la palabra en una pantalla previa; recién se empieza si
> la palabra es válida (sólo letras, con acentos y ñ). Lógica de dominio:
> `esPalabraValida(texto)`. UI: pantalla de setup (`?modo=duo`) que valida antes
> de montar el juego con esa palabra (enmascarada para el jugador 2).

UTs (`esPalabraValida(texto: string)`):

- una palabra de solo letras es valida
- una palabra vacia es invalida
- una palabra con numeros o simbolos es invalida
- una palabra con acentos o enie es valida

## Mejora de UI — Controles en pantalla

> Las features que antes sólo se activaban por la URL ahora son botones
> visibles. Los seams de URL se conservan (los usan los ATs). No agrega lógica
> de dominio: reutiliza `vidasDeNivel`, `Sesion.nuevaPartida()` y `mountSetup`.

ATs (sin UTs nuevos):

- el jugador elige el nivel difícil desde la UI (botones Fácil/Normal/Difícil)
- el jugador entra al modo dos jugadores desde la UI (botón "2 jugadores")
- el jugador pide una palabra nueva desde la UI (botón "Nueva palabra")

## Aprobación Directa — Feature 10: Temporizador por partida

> Seam del reloj: el dominio no conoce `Date.now`. `Cronometro(limiteSegundos,
> reloj)` recibe el `reloj: () => number` por parámetro (mismo patrón que el
> `rng` de `elegirPalabra`) para testear determinista con un reloj falso. En
> producción se inyecta `Date.now`; en los UT, una función que devuelve valores
> controlados. Seam de UI: `?tiempo=` en la URL. La UI muestra el tiempo restante.

UTs (`Cronometro(limiteSegundos: number, reloj: () => number)`):

- un cronómetro nuevo tiene todo el tiempo restante disponible
- el tiempo restante baja según los segundos transcurridos
- el tiempo restante no baja de cero cuando se pasa del límite

## Aprobación Directa — Feature 10 (2º ciclo): Temporizador expira

> Cuando se acaba el tiempo, el jugador pierde. `Cronometro` expone
> `expirado(): boolean` que devuelve `true` cuando `tiempoRestante()` llega a
> 0. La UI arranca un `setInterval` que re-renderiza y, si `expirado()`,
> muestra "Se acabó el tiempo" y bloquea el input/teclado (misma traducción
> que ya hace para `estaGanada()`/`estaPerdida()`).

UTs (`Cronometro.expirado()`):

- el cronómetro no expiró mientras queda tiempo
- el cronómetro expira cuando se agota el tiempo

## Aprobación Directa — Feature 11: Racha de victorias

> `Sesion` trackea la racha consecutiva de victorias. `rachaActual()` devuelve
> cuántas partidas seguidas se ganaron desde la última derrota. Ganar y empezar
> otra incrementa la racha; perder y empezar otra la resetea a 0. La UI muestra
> "Racha: N" junto al marcador.

UTs (`Sesion.rachaActual()`):

- una sesion nueva tiene racha en cero
- ganar una partida y empezar otra sube la racha a 1
- ganar dos partidas seguidas y empezar otra sube la racha a 2
- perder una partida despues de ganar resetea la racha a cero

## Aprobación Directa — Feature 12: Historial persistente

> El marcador (ganadas/perdidas) se persiste en almacenamiento local. Se usa un
> seam inyectable `Almacen` (interfaz con `guardar`/`cargar`) para no depender
> de `localStorage` en los tests. `Sesion` recibe el almacén por constructor,
> carga al arrancar y guarda en `nuevaPartida()`.

UTs (`Sesion` con `Almacen`):

- una sesion nueva carga el marcador del almacen
- nuevaPartida guarda el marcador actualizado en el almacen

## Aprobación Directa — Feature 13: Pista revelable con botón

> La pista no se muestra al iniciar, se revela al presionar "Ver pista". Es
> comportamiento de UI (el dominio ya expone `pista()`). El AT cubre que la
> pista esté oculta inicialmente y que aparezca al hacer click.

AT (sin UTs de dominio nuevos — reutiliza `Ahorcado.pista()`):

- la pista no se muestra al iniciar, se revela al presionar "Ver pista"
