# language: es
Característica: Entrada inválida

  Escenario: El jugador tipea algo que no es una letra
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "3"
    Entonces se ven 6 vidas
    Y se ve el mensaje "Entrada no válida"

  Escenario: El jugador intenta jugar con la partida terminada
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "B"
    Y el jugador adivina la letra "C"
    Y el jugador adivina la letra "D"
    Y el jugador adivina la letra "F"
    Y el jugador adivina la letra "H"
    Y el jugador adivina la letra "J"
    Y el jugador adivina la letra "G"
    Y el jugador adivina la letra "A"
    Y el jugador adivina la letra "T"
    Y el jugador adivina la letra "O"
    Entonces se ven 0 vidas
    Y se ve el mensaje "PERDISTE"
