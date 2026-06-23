import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  let mensajeRepetida = "";

  function render(): void {
    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeRepetida) {
      mensaje = `<div data-testid="message">${mensajeRepetida}</div>`;
    }

    root.innerHTML = `
      <div data-testid="word">${juego.estaGanada() || juego.estaPerdida() ? juego.palabraRevelada() : juego.palabraEnmascarada()}</div>
      <div data-testid="lives">${juego.vidasRestantes()}</div>
      <input type="text" />
      ${mensaje}
    `;
    const input = root.querySelector("input")!;
    input.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        const valor = input.value.toUpperCase();
        const resultado = juego.adivinar(input.value);
        mensajeRepetida = resultado === "repetida" ? `Ya intentaste la letra ${valor}` : "";
        render();
      }
    });
  }

  render();
}
