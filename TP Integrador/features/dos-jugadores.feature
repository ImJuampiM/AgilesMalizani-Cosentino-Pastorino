# language: es
Característica: Dos jugadores

  Escenario: El jugador 1 ingresa la palabra y el jugador 2 la juega enmascarada
    Dado el modo de dos jugadores
    Cuando el jugador 1 ingresa la palabra "SOL"
    Entonces se ve la palabra "_ _ _"
    Entonces se ven 6 vidas

  Escenario: No se puede empezar con una palabra invalida
    Dado el modo de dos jugadores
    Cuando el jugador 1 ingresa la palabra "SOL1"
    Entonces se ve el mensaje "Palabra invalida"
