# language: es
Característica: Niveles de dificultad

  Escenario: En nivel difícil el jugador empieza con menos vidas
    Dado una partida en nivel "dificil" con la palabra "SOL"
    Entonces se ven 4 vidas

  Escenario: En nivel fácil el jugador empieza con más vidas
    Dado una partida en nivel "facil" con la palabra "SOL"
    Entonces se ven 8 vidas
