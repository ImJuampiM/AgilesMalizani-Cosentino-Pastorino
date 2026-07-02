# language: es
Característica: Racha de victorias

  Escenario: El marcador muestra la racha de victorias consecutivas
    Dado una partida con la palabra "SOL"
    Cuando el jugador adivina la letra "S"
    Y el jugador adivina la letra "O"
    Y el jugador adivina la letra "L"
    Y el jugador presiona "Jugar de nuevo"
    Entonces se ve la racha "Racha: 1"
