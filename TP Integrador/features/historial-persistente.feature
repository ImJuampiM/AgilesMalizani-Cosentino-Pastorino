# language: es
Característica: Historial persistente

  Escenario: El marcador sobrevive al recargar la pagina
    Dado una partida con la palabra "SOL"
    Cuando el jugador adivina la letra "S"
    Y el jugador adivina la letra "O"
    Y el jugador adivina la letra "L"
    Y el jugador presiona "Jugar de nuevo"
    Y el jugador recarga la pagina
    Entonces el marcador es "Ganadas: 1 - Perdidas: 0"
