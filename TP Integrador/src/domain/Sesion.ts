import { Ahorcado } from "./Ahorcado";
import { elegirPalabra } from "./elegirPalabra";

export class Sesion {
  private partida: Ahorcado;
  private partidasGanadas = 0;
  private partidasPerdidas = 0;

  constructor(
    private readonly palabras: string[],
    private readonly rng: () => number,
    private readonly vidas: number = 6,
    private readonly pista: string = "",
  ) {
    this.partida = new Ahorcado(elegirPalabra(palabras, rng), vidas, pista);
  }

  partidaActual(): Ahorcado {
    return this.partida;
  }

  nuevaPartida(): void {
    if (this.partida.estaGanada()) {
      this.partidasGanadas++;
    } else if (this.partida.estaPerdida()) {
      this.partidasPerdidas++;
    }
    this.partida = new Ahorcado(
      elegirPalabra(this.palabras, this.rng),
      this.vidas,
      this.pista,
    );
  }

  ganadas(): number {
    return this.partidasGanadas;
  }

  perdidas(): number {
    return this.partidasPerdidas;
  }

  rachaActual(): number {
    return 0;
  }
}
