export class Cronometro {
  constructor(
    private readonly limiteSegundos: number,
    private readonly reloj: () => number,
  ) {}

  tiempoRestante(): number {
    return this.limiteSegundos;
  }
}
