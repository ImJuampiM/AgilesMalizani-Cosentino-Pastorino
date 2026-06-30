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

## AT 4 — Ganar

UTs:

- la partida esta ganada cuando se adivinan todas las letras (`estaGanada()` devuelve true)

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

