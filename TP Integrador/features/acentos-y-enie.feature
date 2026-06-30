# language: es
Característica: Soporte de acentos y ñ

  Escenario: Una vocal acentuada se revela al adivinar la vocal sin acento
    Dado una partida con la palabra "LEÓN"
    Cuando el jugador adivina la letra "O"
    Entonces se ve la palabra "_ _ Ó _"
    Y se ven 6 vidas

  Escenario: La ñ es una letra válida y se revela al adivinarla
    Dado una partida con la palabra "CAÑA"
    Cuando el jugador adivina la letra "Ñ"
    Entonces se ve la palabra "_ _ Ñ _"
    Y se ven 6 vidas
