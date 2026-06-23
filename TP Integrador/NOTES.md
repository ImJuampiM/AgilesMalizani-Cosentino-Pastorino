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
