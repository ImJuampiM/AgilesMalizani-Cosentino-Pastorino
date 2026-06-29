export function elegirPalabra(lista: string[], rng: () => number): string {
  return lista[Math.floor(rng() * lista.length)];
}
