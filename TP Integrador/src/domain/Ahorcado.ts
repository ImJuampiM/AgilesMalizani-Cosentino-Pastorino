export class Ahorcado {
  private readonly adivinadas = new Set<string>();
  private fallos = 0;
  private tiempoAgotado = false;

  constructor(
    private readonly palabra: string,
    private readonly vidas: number = 6,
    private readonly pistaTexto: string = "",
  ) {}

  pista(): string {
    return this.pistaTexto;
  }

  private quitarAcentos(texto: string): string {
    return texto
      .replace(/Á/g, "A")
      .replace(/É/g, "E")
      .replace(/Í/g, "I")
      .replace(/Ó/g, "O")
      .replace(/Ú/g, "U");
  }

  palabraEnmascarada(): string {
    return this.palabra
      .split("")
      .map((letra) => (this.adivinadas.has(this.quitarAcentos(letra.toUpperCase())) ? letra : "_"))
      .join(" ");
  }

  palabraRevelada(): string {
    return this.palabra.split("").join(" ");
  }

  vidasRestantes(): number {
    return this.vidas - this.fallos;
  }

  adivinar(letra: string): string {
    if (this.estaGanada() || this.estaPerdida()) {
      return "terminada";
    }
    const normalizada = this.quitarAcentos(letra.toUpperCase());
    if (!/^[A-ZÑ]$/.test(normalizada)) {
      return "invalida";
    }
    if (this.adivinadas.has(normalizada)) {
      return "repetida";
    }
    this.adivinadas.add(normalizada);
    if (!this.quitarAcentos(this.palabra.toUpperCase()).includes(normalizada)) {
      this.fallos++;
    }
    return "";
  }

  estaGanada(): boolean {
    return this.palabra
      .toUpperCase()
      .split("")
      .every((letra) => this.adivinadas.has(this.quitarAcentos(letra)));
  }

  perderPorTiempo(): void {
    this.tiempoAgotado = true;
  }

  estaPerdida(): boolean {
    return this.tiempoAgotado || this.vidasRestantes() <= 0;
  }

  private static readonly PARTES = [
    "cabeza",
    "cuerpo",
    "brazo izquierdo",
    "brazo derecho",
    "pierna izquierda",
    "pierna derecha",
  ];

  partesVisibles(): string[] {
    return Ahorcado.PARTES.slice(0, this.fallos);
  }

  letrasUsadas(): string[] {
    return [...this.adivinadas];
  }
}
