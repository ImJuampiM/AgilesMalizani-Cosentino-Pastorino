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
  crearCronometro?: () => Cronometro,
): void {
  let mensajeAviso = "";
  let pistaRevelada = false;
  let tickId: ReturnType<typeof setInterval> | undefined;
  // El cronómetro se crea por factory para poder renovarlo en cada partida.
  let cronometro = crearCronometro?.();

  function pararTick(): void {
    if (tickId !== undefined) {
      clearInterval(tickId);
      tickId = undefined;
    }
  }

  function iniciarTick(): void {
    pararTick();
    const c = cronometro;
    if (!c) return;
    tickId = setInterval(() => {
      const juego = sesion.partidaActual();
      // Al agotarse el tiempo, la derrota pasa al dominio (cuenta y resetea racha).
      if (c.expirado() && !juego.estaGanada() && !juego.estaPerdida()) {
        juego.perderPorTiempo();
      }
      render();
      if (juego.estaGanada() || juego.estaPerdida()) {
        pararTick(); // frenar el reloj cuando la partida terminó
      }
    }, 500);
  }

  function reiniciar(): void {
    sesion.nuevaPartida();
    cronometro = crearCronometro?.(); // partida nueva → cronómetro nuevo
    mensajeAviso = "";
    pistaRevelada = false;
    render();
    iniciarTick();
  }

  function render(): void {
    const juego = sesion.partidaActual();
    const tiempoAgotado = cronometro !== undefined && cronometro.expirado();
    const terminada = juego.estaGanada() || juego.estaPerdida() || tiempoAgotado;

    let mensaje = "";
    if (juego.estaGanada()) {
      mensaje = `<div data-testid="message">GANASTE</div>`;
    } else if (tiempoAgotado) {
      mensaje = `<div data-testid="message">Se acabó el tiempo</div>`;
    } else if (juego.estaPerdida()) {
      mensaje = `<div data-testid="message">PERDISTE</div>`;
    } else if (mensajeAviso) {
      mensaje = `<div data-testid="message">${mensajeAviso}</div>`;
    }

    const botonJugarDeNuevo = terminada
      ? `<button data-testid="play-again">Jugar de nuevo</button>`
      : "";

    let pistaHtml = "";
    if (juego.pista()) {
      if (pistaRevelada) {
        pistaHtml = `<div class="pista" data-testid="hint">Pista: ${juego.pista()}</div>`;
      } else {
        pistaHtml = `<button class="ver-pista" data-accion="ver-pista">Ver pista</button>`;
      }
    }

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
            ${pistaHtml}
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
      if (juego.estaGanada() || juego.estaPerdida()) {
        pararTick(); // al terminar por jugada, el reloj se detiene
      }
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
      .addEventListener("click", reiniciar);

    root
      .querySelector<HTMLButtonElement>('[data-accion="duo"]')!
      .addEventListener("click", () => acciones.modoDosJugadores());

    const botonReinicio = root.querySelector<HTMLButtonElement>('[data-testid="play-again"]');
    botonReinicio?.addEventListener("click", reiniciar);

    const botonPista = root.querySelector<HTMLButtonElement>('[data-accion="ver-pista"]');
    botonPista?.addEventListener("click", () => {
      pistaRevelada = true;
      render();
    });
  }

  render();
  // Si hay cronómetro, tictaquea cada 500ms para refrescar el tiempo y detectar
  // la expiración; se detiene solo cuando la partida termina (por jugada o tiempo).
  iniciarTick();
}
