export class Cronometro {
  private readonly inicio: number;

  constructor(
    private readonly limiteSegundos: number,
    private readonly reloj: () => number,
  ) {
    this.inicio = reloj();
  }

  tiempoRestante(): number {
    const transcurridos = Math.floor((this.reloj() - this.inicio) / 1000);
    return Math.max(0, this.limiteSegundos - transcurridos);
  }

  expirado(): boolean {
    return this.tiempoRestante() <= 0;
  }
}
