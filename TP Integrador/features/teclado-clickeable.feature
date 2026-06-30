# language: es
Característica: Teclado clickeable

  Escenario: El jugador adivina haciendo click en una tecla en pantalla
    Dado una partida con la palabra "GATO"
    Cuando el jugador hace click en la tecla "A"
    Entonces se ve la palabra "_ A _ _"
    Entonces las letras usadas son "A"
