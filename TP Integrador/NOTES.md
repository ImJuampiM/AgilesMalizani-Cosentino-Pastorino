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
