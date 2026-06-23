import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  root.innerHTML = `
    <div data-testid="word">${juego.palabraEnmascarada()}</div>
    <div data-testid="lives">${juego.vidasRestantes()}</div>
  `;
}
