# language: es
Característica: Perder

  Escenario: El jugador agota las vidas
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "B"
    Y el jugador adivina la letra "C"
    Y el jugador adivina la letra "D"
    Y el jugador adivina la letra "F"
    Y el jugador adivina la letra "H"
    Y el jugador adivina la letra "J"
    Entonces se ve el mensaje "PERDISTE"
    Y se ve la palabra "G A T O"
