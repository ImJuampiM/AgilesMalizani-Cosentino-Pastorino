# language: es
Característica: Pista revelable con botón

  Escenario: La pista se muestra solo despues de presionar el boton
    Dado una partida con la palabra "GATO" y la pista "Animal"
    Entonces no se ve la pista
    Cuando el jugador presiona "Ver pista"
    Entonces se ve la pista "Pista: Animal"
