import { Sesion } from "../domain/Sesion";

const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

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

    const teclado = LETRAS.map((letra) => {
      const usada = juego.letrasUsadas().includes(letra);
      const deshabilitada = usada || terminada;
      return `<button class="tecla" data-tecla="${letra}"${deshabilitada ? " disabled" : ""}>${letra}</button>`;
    }).join("");

    root.innerHTML = `
      <div data-testid="scoreboard">Ganadas: ${sesion.ganadas()} - Perdidas: ${sesion.perdidas()}</div>
      <div data-testid="hangman">${juego.partesVisibles().join(", ")}</div>
      <div data-testid="word">${terminada ? juego.palabraRevelada() : juego.palabraEnmascarada()}</div>
      <div data-testid="lives">${juego.vidasRestantes()}</div>
      <div data-testid="used-keys">${juego.letrasUsadas().join(", ")}</div>
      <input type="text" />
      <div class="teclado">${teclado}</div>
      ${botonJugarDeNuevo}
      ${mensaje}
    `;

    function jugar(valor: string): void {
      const letra = valor.toUpperCase();
      const resultado = juego.adivinar(valor);
      if (resultado === "repetida") {
        mensajeAviso = `Ya intentaste la letra ${letra}`;
      } else if (resultado === "invalida") {
        mensajeAviso = "Entrada no válida";
      } else {
        mensajeAviso = "";
      }
      render();
    }

    const input = root.querySelector("input")!;
    input.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        jugar(input.value);
      }
    });

    root.querySelectorAll<HTMLButtonElement>("[data-tecla]").forEach((boton) => {
      boton.addEventListener("click", () => jugar(boton.dataset.tecla!));
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
