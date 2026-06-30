import { Ahorcado } from "./Ahorcado";
import { elegirPalabra } from "./elegirPalabra";

export class Sesion {
  private partida: Ahorcado;
  private partidasGanadas = 0;
  private partidasPerdidas = 0;

  constructor(
    private readonly palabras: string[],
    private readonly rng: () => number,
  ) {
    this.partida = new Ahorcado(elegirPalabra(palabras, rng));
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
    this.partida = new Ahorcado(elegirPalabra(this.palabras, this.rng));
  }

  ganadas(): number {
    return this.partidasGanadas;
  }

  perdidas(): number {
    return this.partidasPerdidas;
  }
}
