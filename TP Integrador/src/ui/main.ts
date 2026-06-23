import { Ahorcado } from "../domain/Ahorcado";

export function mountApp(root: HTMLElement, juego: Ahorcado): void {
  let mensajeAviso = "";

  function render(): void {
    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeAviso) {
      mensaje = `<div data-testid="message">${mensajeAviso}</div>`;
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
        if (resultado === "repetida") {
          mensajeAviso = `Ya intentaste la letra ${valor}`;
        } else if (resultado === "invalida") {
          mensajeAviso = "Entrada no válida";
        } else {
          mensajeAviso = "";
        }
        render();
      }
    });
  }

  render();
}
