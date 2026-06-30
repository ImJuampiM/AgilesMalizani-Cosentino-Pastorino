# language: es
Característica: Dibujo progresivo del muñeco

  Escenario: El muñeco se dibuja parte por parte con cada error
    Dado una partida con la palabra "GATO"
    Entonces el muñeco no tiene partes
    Cuando el jugador adivina la letra "B"
    Entonces el muñeco muestra "cabeza"
    Cuando el jugador adivina la letra "C"
    Cuando el jugador adivina la letra "D"
    Cuando el jugador adivina la letra "F"
    Cuando el jugador adivina la letra "H"
    Cuando el jugador adivina la letra "J"
    Entonces el muñeco muestra "cabeza, cuerpo, brazo izquierdo, brazo derecho, pierna izquierda, pierna derecha"
