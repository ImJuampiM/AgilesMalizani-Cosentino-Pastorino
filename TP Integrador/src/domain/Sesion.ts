import { Ahorcado } from "./Ahorcado";
import { elegirPalabra } from "./elegirPalabra";
import { Almacen } from "./Almacen";

export class Sesion {
  private partida: Ahorcado;
  private partidasGanadas = 0;
  private partidasPerdidas = 0;
  private rachaVictorias = 0;

  constructor(
    private readonly palabras: string[],
    private readonly rng: () => number,
    private readonly vidas: number = 6,
    private readonly pista: string = "",
    private readonly almacen?: Almacen,
  ) {
    this.partida = new Ahorcado(elegirPalabra(palabras, rng), vidas, pista);
    if (this.almacen) {
      const datos = this.almacen.cargar();
      if (datos) {
        this.partidasGanadas = datos.ganadas;
        this.partidasPerdidas = datos.perdidas;
        this.rachaVictorias = datos.racha;
      }
    }
  }

  partidaActual(): Ahorcado {
    return this.partida;
  }

  nuevaPartida(): void {
    if (this.partida.estaGanada()) {
      this.partidasGanadas++;
      this.rachaVictorias++;
    } else if (this.partida.estaPerdida()) {
      this.partidasPerdidas++;
      this.rachaVictorias = 0;
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
    return this.rachaVictorias;
  }
}
