# language: es
Característica: Controles en pantalla

  Escenario: El jugador elige el nivel difícil desde la UI
    Dado una partida con la palabra "GATO"
    Cuando el jugador presiona "Difícil"
    Entonces se ven 4 vidas

  Escenario: El jugador entra al modo dos jugadores desde la UI
    Dado una partida con la palabra "GATO"
    Cuando el jugador presiona "2 jugadores"
    Entonces se ve la pantalla del jugador 1

  Escenario: El jugador pide una palabra nueva desde la UI
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "G"
    Cuando el jugador presiona "Nueva palabra"
    Entonces se ve la palabra "_ _ _ _"
    Entonces se ven 6 vidas
