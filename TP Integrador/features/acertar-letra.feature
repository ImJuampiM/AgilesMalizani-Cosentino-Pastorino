# language: es
Característica: Acertar letra

  Escenario: El jugador acierta una letra
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "A"
    Entonces se ve la palabra "_ A _ _"
    Y se ven 6 vidas
