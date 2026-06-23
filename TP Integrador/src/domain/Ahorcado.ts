export class Ahorcado {
  private readonly adivinadas = new Set<string>();
  private fallos = 0;

  constructor(private readonly palabra: string) {}

  palabraEnmascarada(): string {
    return this.palabra
      .split("")
      .map((letra) => (this.adivinadas.has(letra.toUpperCase()) ? letra : "_"))
      .join(" ");
  }

  palabraRevelada(): string {
    return this.palabra.split("").join(" ");
  }

  vidasRestantes(): number {
    return 6 - this.fallos;
  }

  adivinar(letra: string): string {
    const normalizada = letra.toUpperCase();
    if (!/^[A-Z]$/.test(normalizada)) {
      return "invalida";
    }
    if (this.adivinadas.has(normalizada)) {
      return "repetida";
    }
    this.adivinadas.add(normalizada);
    if (!this.palabra.toUpperCase().includes(normalizada)) {
      this.fallos++;
    }
    return "";
  }

  estaGanada(): boolean {
    return this.palabra
      .toUpperCase()
      .split("")
      .every((letra) => this.adivinadas.has(letra));
  }

  estaPerdida(): boolean {
    return this.vidasRestantes() <= 0;
  }
}
