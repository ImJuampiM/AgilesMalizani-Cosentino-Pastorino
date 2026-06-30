const VIDAS_POR_NIVEL: Record<string, number> = {
  facil: 8,
  normal: 6,
  dificil: 4,
};

const VIDAS_NORMAL = 6;

export function vidasDeNivel(nivel: string): number {
  return VIDAS_POR_NIVEL[nivel] ?? VIDAS_NORMAL;
}
