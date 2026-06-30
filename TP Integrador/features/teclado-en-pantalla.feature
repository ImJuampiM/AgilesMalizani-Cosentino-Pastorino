# language: es
Característica: Teclado en pantalla

  Escenario: El jugador ve las letras que ya intentó
    Dado una partida con la palabra "GATO"
    Cuando el jugador adivina la letra "A"
    Cuando el jugador adivina la letra "E"
    Entonces las letras usadas son "A, E"
