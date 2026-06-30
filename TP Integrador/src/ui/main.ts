import { Sesion } from "../domain/Sesion";

export function mountApp(root: HTMLElement, sesion: Sesion): void {
  let mensajeAviso = "";

  function render(): void {
    const juego = sesion.partidaActual();
    const terminada = juego.estaGanada() || juego.estaPerdida();

    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeAviso) {
      mensaje = `<div data-testid="message">${mensajeAviso}</div>`;
    }

    const botonJugarDeNuevo = terminada
      ? `<button data-testid="play-again">Jugar de nuevo</button>`
      : "";

    root.innerHTML = `
      <div data-testid="scoreboard">Ganadas: ${sesion.ganadas()} - Perdidas: ${sesion.perdidas()}</div>
      <div data-testid="hangman">${juego.partesVisibles().join(", ")}</div>
      <div data-testid="word">${terminada ? juego.palabraRevelada() : juego.palabraEnmascarada()}</div>
      <div data-testid="lives">${juego.vidasRestantes()}</div>
      <div data-testid="used-keys">${juego.letrasUsadas().join(", ")}</div>
      <input type="text" />
      ${botonJugarDeNuevo}
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
    const botonReinicio = root.querySelector<HTMLButtonElement>('[data-testid="play-again"]');
    botonReinicio?.addEventListener("click", () => {
      sesion.nuevaPartida();
      mensajeAviso = "";
      render();
    });
  }

  render();
}
