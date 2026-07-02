# language: es
Característica: Temporizador por partida

  Escenario: El jugador ve el tiempo restante al empezar
    Dado una partida con la palabra "GATO" y un límite de 30 segundos
    Entonces se ve el tiempo restante "30"

  Escenario: Se acaba el tiempo y el jugador pierde
    Dado una partida con la palabra "GATO" y un límite de 1 segundos
    Entonces se ve el mensaje "Se acabó el tiempo"
