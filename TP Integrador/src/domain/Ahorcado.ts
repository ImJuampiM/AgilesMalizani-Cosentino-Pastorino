export class Ahorcado {
  constructor(private readonly palabra: string) {}

  palabraEnmascarada(): string {
    return this.palabra.split("").map(() => "_").join(" ");
  }
}
