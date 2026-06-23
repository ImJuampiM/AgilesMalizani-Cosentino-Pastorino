export class Ahorcado {
  private readonly adivinadas = new Set<string>();

  constructor(private readonly palabra: string) {}

  palabraEnmascarada(): string {
    return this.palabra
      .split("")
      .map((letra) => (this.adivinadas.has(letra.toUpperCase()) ? letra : "_"))
      .join(" ");
  }

  vidasRestantes(): number {
    return 6;
  }

  adivinar(letra: string): void {
    this.adivinadas.add(letra.toUpperCase());
  }
}
