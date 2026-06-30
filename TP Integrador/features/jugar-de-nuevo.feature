# language: es
Característica: Jugar de nuevo

  Escenario: El jugador reinicia la partida sin recargar tras ganar
    Dado una partida con la palabra "SOL"
    Cuando el jugador adivina la letra "S"
    Cuando el jugador adivina la letra "O"
    Cuando el jugador adivina la letra "L"
    Entonces se ve el mensaje "GANASTE"
    Cuando el jugador presiona "Jugar de nuevo"
    Entonces se ve la palabra "_ _ _"
    Entonces se ven 6 vidas
