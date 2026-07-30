import { Sesion } from "../domain/Sesion";
import { Cronometro } from "../domain/Cronometro";
import { vidasDeNivel } from "../domain/niveles";
import { mountApp, AccionesJuego } from "./main";
import { mountSetup } from "./setup";

import { AlmacenLocalStorage } from "../infrastructure/AlmacenLocalStorage";

// PERRO queda primera a propósito: el AT "palabra al azar" usa ?seed=0 y
// espera la palabra del índice 0 (5 letras).
const PALABRAS = [
  "PERRO",
  "CABALLO",
  "ELEFANTE",
  "TIGRE",
  "LEON",
  "JIRAFA",
  "COCODRILO",
  "MARIPOSA",
  "TORTUGA",
  "PINGUINO",
  "CANGURO",
  "MURCIELAGO",
  "MONTAÑA",
  "GUITARRA",
  "COMPUTADORA",
  "BICICLETA",
  "BIBLIOTECA",
  "CHOCOLATE",
  "MANZANA",
  "NARANJA",
  "ZANAHORIA",
  "ARAÑA",
  "PAJARO",
  "VENTANA",
];

const params = new URLSearchParams(window.location.search);
const wordParam = params.get("word");
const seedParam = params.get("seed");
const nivelParam = params.get("nivel");
const pistaParam = params.get("pista");
const modoParam = params.get("modo");
const tiempoParam = params.get("tiempo");

const pista = pistaParam ?? "";
const root = document.getElementById("app");

let nivelActual = nivelParam ?? "normal";

// Fuente de palabras según los seams de URL (?word fija, ?seed determinista o azar).
function fuente(): { palabras: string[]; rng: () => number } {
  if (wordParam !== null) {
    return { palabras: [wordParam], rng: () => 0 };
  }
  const rng =
    seedParam !== null ? () => Number(seedParam) / PALABRAS.length : Math.random;
  return { palabras: PALABRAS, rng };
}

const acciones: AccionesJuego = {
  nuevoNivel(nivel) {
    nivelActual = nivel;
    montarJuego();
  },
  modoDosJugadores() {
    montarSetup();
  },
};

function montarJuego(palabras?: string[], rng?: () => number, pistaOverride?: string): void {
  if (!root) return;
  const origen = palabras && rng ? { palabras, rng } : fuente();
  const sesion = new Sesion(
    origen.palabras,
    origen.rng,
    vidasDeNivel(nivelActual),
    pistaOverride !== undefined ? pistaOverride : pista,
    new AlmacenLocalStorage()
  );
  // Seam del reloj: en producción se inyecta Date.now; los UT usan un reloj falso.
  // Se pasa una factory para poder crear un cronómetro nuevo en cada partida.
  const crearCronometro =
    tiempoParam !== null ? () => new Cronometro(Number(tiempoParam), Date.now) : undefined;
  mountApp(root, sesion, acciones, nivelActual, crearCronometro);
}

function montarSetup(): void {
  if (!root) return;
  mountSetup(root, (palabra, pistaSetup) => montarJuego([palabra], () => 0, pistaSetup));
}

if (modoParam === "duo" && wordParam === null) {
  montarSetup();
} else {
  montarJuego();
}
