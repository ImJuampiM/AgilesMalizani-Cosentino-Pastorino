const SOLO_LETRAS = /^[A-Za-zÑñÁÉÍÓÚáéíóú]+$/;

// Una palabra es válida si, una vez recortada, tiene al menos una letra y
// está formada exclusivamente por letras (incluye acentos y la ñ). Sirve para
// validar la palabra que ingresa el jugador 1 en el modo dos jugadores.
export function esPalabraValida(texto: string): boolean {
  return SOLO_LETRAS.test(texto.trim());
}
