import { Sesion } from "../domain/Sesion";
import "./styles.css";

const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Partes del muñeco en el mismo orden que `Ahorcado.partesVisibles()`.
const PARTES_SVG = [
  '<circle cx="90" cy="40" r="10" />',
  '<line x1="90" y1="50" x2="90" y2="92" />',
  '<line x1="90" y1="60" x2="68" y2="80" />',
  '<line x1="90" y1="60" x2="112" y2="80" />',
  '<line x1="90" y1="92" x2="72" y2="118" />',
  '<line x1="90" y1="92" x2="108" y2="118" />',
];

function dibujarMuneco(partesVisibles: number): string {
  const cuerpo = PARTES_SVG.slice(0, partesVisibles).join("");
  return `
    <svg class="muneco" viewBox="0 0 130 160" aria-hidden="true">
      <line x1="10" y1="150" x2="80" y2="150" />
      <line x1="30" y1="150" x2="30" y2="10" />
      <line x1="30" y1="10" x2="90" y2="10" />
      <line x1="90" y1="10" x2="90" y2="30" />
      ${cuerpo}
    </svg>`;
}

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

    const pista = juego.pista()
      ? `<div class="pista" data-testid="hint">Pista: ${juego.pista()}</div>`
      : "";

    const teclado = LETRAS.map((letra) => {
      const deshabilitada = juego.letrasUsadas().includes(letra) || terminada;
      return `<button class="tecla" data-tecla="${letra}"${deshabilitada ? " disabled" : ""}>${letra}</button>`;
    }).join("");

    root.innerHTML = `
      <div class="ahorcado">
        <header class="barra">
          <h1>Ahorcado</h1>
          <div class="marcador" data-testid="scoreboard">Ganadas: ${sesion.ganadas()} - Perdidas: ${sesion.perdidas()}</div>
        </header>
        <div class="tablero">
          ${dibujarMuneco(juego.partesVisibles().length)}
          <div class="panel">
            <div class="vidas">❤️ <span data-testid="lives">${juego.vidasRestantes()}</span> vidas</div>
            <div class="palabra" data-testid="word">${terminada ? juego.palabraRevelada() : juego.palabraEnmascarada()}</div>
            ${pista}
            <span class="sr-only" data-testid="hangman">${juego.partesVisibles().join(", ")}</span>
            <span class="sr-only" data-testid="used-keys">${juego.letrasUsadas().join(", ")}</span>
            <input type="text" maxlength="1" placeholder="Escribí una letra y Enter" />
            <div class="teclado">${teclado}</div>
            ${botonJugarDeNuevo}
            ${mensaje}
          </div>
        </div>
      </div>
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
