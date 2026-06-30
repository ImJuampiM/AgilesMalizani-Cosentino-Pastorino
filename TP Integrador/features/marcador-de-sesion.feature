# language: es
Característica: Marcador de la sesión

  Escenario: El marcador suma una partida ganada al empezar una nueva
    Dado una partida con la palabra "SOL"
    Cuando el jugador adivina la letra "S"
    Cuando el jugador adivina la letra "O"
    Cuando el jugador adivina la letra "L"
    Entonces se ve el mensaje "GANASTE"
    Cuando el jugador presiona "Jugar de nuevo"
    Entonces se ve el marcador "Ganadas: 1 - Perdidas: 0"

  Escenario: El marcador suma una partida perdida al empezar una nueva
    Dado una partida con la palabra "SOL"
    Cuando el jugador adivina la letra "B"
    Cuando el jugador adivina la letra "C"
    Cuando el jugador adivina la letra "D"
    Cuando el jugador adivina la letra "F"
    Cuando el jugador adivina la letra "G"
    Cuando el jugador adivina la letra "H"
    Entonces se ve el mensaje "PERDISTE"
    Cuando el jugador presiona "Jugar de nuevo"
    Entonces se ve el marcador "Ganadas: 0 - Perdidas: 1"
