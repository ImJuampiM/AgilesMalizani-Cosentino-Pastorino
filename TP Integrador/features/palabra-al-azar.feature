# language: es
Característica: Palabra al azar

  Escenario: El jugador empieza una partida sin elegir palabra
    Dado una partida al azar con la semilla 0
    Entonces se ve la palabra "_ _ _ _ _"
    Y se ven 6 vidas
