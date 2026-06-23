# language: es
Característica: Letra repetida

  Escenario: El jugador repite una letra ya intentada
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "E"
    Y el jugador adivina la letra "E"
    Entonces se ven 5 vidas
    Y se ve el mensaje "Ya intentaste la letra E"
