import { Sesion } from "../domain/Sesion";
import { Cronometro } from "../domain/Cronometro";
import "./styles.css";

const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const NIVELES: { id: string; etiqueta: string }[] = [
  { id: "facil", etiqueta: "Fácil" },
  { id: "normal", etiqueta: "Normal" },
  { id: "dificil", etiqueta: "Difícil" },
];

// Partes del muñeco en el mismo orden que `Ahorcado.partesVisibles()`.
const PARTES_SVG = [
  '<circle cx="90" cy="40" r="10" />',
  '<line x1="90" y1="50" x2="90" y2="92" />',
  '<line x1="90" y1="60" x2="68" y2="80" />',
  '<line x1="90" y1="60" x2="112" y2="80" />',
  '<line x1="90" y1="92" x2="72" y2="118" />',
  '<line x1="90" y1="92" x2="108" y2="118" />',
];

// Acciones de reconfiguración que el composition root (index.ts) le presta a la
// UI para los controles en pantalla que arrancan una partida distinta.
export interface AccionesJuego {
  nuevoNivel: (nivel: string) => void;
  modoDosJugadores: () => void;
}

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

export function mountApp(
  root: HTMLElement,
  sesion: Sesion,
  acciones: AccionesJuego,
  nivel = "normal",
  cronometro?: Cronometro,
): void {
  let mensajeAviso = "";
  let tickId: ReturnType<typeof setInterval> | undefined;

  function render(): void {
    const juego = sesion.partidaActual();
    const tiempoAgotado = cronometro !== undefined && cronometro.expirado();
    const terminada = juego.estaGanada() || juego.estaPerdida() || tiempoAgotado;

    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (tiempoAgotado) {
      mensaje = `<div data-testid="message">Se acabó el tiempo</div>`;
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

    const niveles = NIVELES.map(
      (n) =>
        `<button class="nivel${n.id === nivel ? " activo" : ""}" data-nivel="${n.id}">${n.etiqueta}</button>`,
    ).join("");

    root.innerHTML = `
      <div class="ahorcado">
        <header class="barra">
          <h1>Ahorcado</h1>
          <div class="marcador" data-testid="scoreboard">Ganadas: ${sesion.ganadas()} - Perdidas: ${sesion.perdidas()} | <span data-testid="streak">Racha: ${sesion.rachaActual()}</span></div>
        </header>
        <div class="controles">
          <div class="niveles" role="group" aria-label="Dificultad">${niveles}</div>
          <div class="acciones">
            <button class="accion" data-accion="nueva">Nueva palabra</button>
            <button class="accion" data-accion="duo">2 jugadores</button>
          </div>
        </div>
        <div class="tablero">
          ${dibujarMuneco(juego.partesVisibles().length)}
          <div class="panel">
            <div class="vidas">❤️ <span data-testid="lives">${juego.vidasRestantes()}</span> vidas</div>
            ${cronometro ? `<div class="tiempo">⏱️ <span data-testid="timer">${cronometro.tiempoRestante()}</span> s</div>` : ""}
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

    root.querySelectorAll<HTMLButtonElement>("[data-nivel]").forEach((boton) => {
      boton.addEventListener("click", () => acciones.nuevoNivel(boton.dataset.nivel!));
    });

    root
      .querySelector<HTMLButtonElement>('[data-accion="nueva"]')!
      .addEventListener("click", () => {
        sesion.nuevaPartida();
        mensajeAviso = "";
        render();
      });

    root
      .querySelector<HTMLButtonElement>('[data-accion="duo"]')!
      .addEventListener("click", () => acciones.modoDosJugadores());

    const botonReinicio = root.querySelector<HTMLButtonElement>('[data-testid="play-again"]');
    botonReinicio?.addEventListener("click", () => {
      sesion.nuevaPartida();
      mensajeAviso = "";
      render();
    });
  }

  // Limpiar interval previo (por si mountApp se re-llama al reiniciar).
  if (tickId !== undefined) clearInterval(tickId);

  render();

  // Si hay cronómetro, tictaquear cada 500ms para actualizar el tiempo y
  // detectar la expiración. Se detiene solo cuando el cronómetro expira
  // (la partida queda bloqueada en ese render).
  if (cronometro) {
    tickId = setInterval(() => {
      render();
      if (cronometro.expirado()) {
        clearInterval(tickId);
        tickId = undefined;
      }
    }, 500);
  }
}
