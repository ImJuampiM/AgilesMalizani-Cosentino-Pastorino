# language: es
Característica: Entrada inválida

  Escenario: El jugador tipea algo que no es una letra
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "3"
    Entonces se ven 6 vidas
    Y se ve el mensaje "Entrada no válida"
